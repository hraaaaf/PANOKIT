import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { AddressInfo } from "node:net";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  J04_AUTHZ_DB, J04_AUTHZ_VERIFIER, J04ProductionJobGuard, J04ProductionJobsController,
} from "./j04/production-job.controller";
import type { ReadOnlyPg } from "./j04/postgres-authorization";
const job="22222222-2222-4222-8222-222222222222";
const cross="44444444-4444-4444-8444-444444444444";
const fac="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const user="11111111-1111-4111-8111-111111111111";

test("isolated NestJS HTTP route: 200 allowed; 401 unauthenticated; 403 cross-factory/revoked",async()=>{
  let revoked=false;
  let dbCount=0;
  let verifyCount=0;
  const db:ReadOnlyPg={async query<T extends object>(sql:string,args:readonly string[]) {
    dbCount++;
    let rows:object[]=[];
    if(sql.includes("authz_read_job")) {
      if(args[0]===job&&!revoked) rows=[{job_id:job,factory_id:fac}];
    } else if(sql.includes("authz_read_membership")) {
      rows=[{user_id:user,role:"factory_operator",active:!revoked,factory_id:fac}];
    } else if(sql.includes("authz_confirm_assignment")) {
      if(!revoked&&args[0]===job) rows=[{job_id:job}];
    }
    return {rows:rows as T[]};
  }};
  const verifier={async verifyBearerToken(token:string) {
    verifyCount++;
    return token==="signed"?{userId:user,issuer:"https://fixture.supabase.co/auth/v1"}:null;
  }};
  @Module({
    controllers:[J04ProductionJobsController],
    providers:[
      J04ProductionJobGuard,
      {provide:J04_AUTHZ_DB,useValue:db},
      {provide:J04_AUTHZ_VERIFIER,useValue:verifier},
    ],
  })
  class IsolatedHttpTestModule {}
  const app=await NestFactory.create(IsolatedHttpTestModule,{logger:false});
  try {
    await app.listen(0,"127.0.0.1");
    const addr=app.getHttpServer().address() as AddressInfo;
    const url=(id:string)=>`http://127.0.0.1:${addr.port}/j04/production-jobs/${id}`;
    const allowed=await fetch(url(job),{headers:{authorization:"Bearer signed"}});
    assert.equal(allowed.status,200);
    assert.deepEqual(await allowed.json(),{id:job});
    assert.equal(verifyCount,1);
    const reads=dbCount;
    const unauth=await fetch(url(job));
    assert.equal(unauth.status,401);
    assert.equal(dbCount,reads);
    const invalid=await fetch(url(job),{headers:{authorization:"Bearer invalid"}});
    assert.equal(invalid.status,401);
    assert.equal(dbCount,reads);
    const crossRes=await fetch(url(cross),{headers:{authorization:"Bearer signed"}});
    assert.equal(crossRes.status,403);
    revoked=true;
    const revokedRes=await fetch(url(job),{headers:{authorization:"Bearer signed"}});
    assert.equal(revokedRes.status,403);
  } finally {
    await app.close();
  }
});
