import { strict as assert } from "node:assert";
import { test } from "node:test";
import { ForbiddenException, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { J04AuthorizationGuard } from "./j04/nest-authorization.guard";
import { createPostgresMembershipStore, createPostgresJobResolver, type ReadOnlyPg } from "./j04/postgres-authorization";
const user="11111111-1111-4111-8111-111111111111";
const fac="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const job="22222222-2222-4222-8222-222222222222";
const other="44444444-4444-4444-8444-444444444444";
function fixture(o:{revoked?:boolean;cross?:boolean;unassigned?:boolean;offline?:boolean}={}) {
  const calls:{sql:string;args:readonly string[]}[]=[];
  let verifyCount=0;
  const verifier={async verifyBearerToken(token:string) {
    verifyCount++;
    return token==="signed"?{userId:user,issuer:"https://fixture.supabase.co/auth/v1"}:null;
  }};
  const db:ReadOnlyPg={async query<T extends object>(sql:string,args:readonly string[]) {
    calls.push({sql,args});
    if(o.offline) throw Error("PG_DOWN");
    let rows:object[]=[];
    if(sql.includes("authz_read_membership")) rows=[{user_id:user,role:"factory_operator",active:!o.revoked,factory_id:fac}];
    else if(sql.includes("authz_confirm_assignment"))
      rows=o.unassigned||o.revoked?[]:[{job_id:job}];
    else if(sql.includes("authz_read_job"))
      rows=o.cross||o.revoked?[]:[{job_id:job,factory_id:fac}];
    return {rows:rows as T[]};
  }};
  return {
    calls, verifierCount:()=>verifyCount,
    guard:new J04AuthorizationGuard(verifier,createPostgresMembershipStore(db),
      "view_production_job",createPostgresJobResolver(db)),
  };
}
function ctx(id:string,body:object={},authorization="Bearer signed"):ExecutionContext {
  return {switchToHttp:()=>({getRequest:()=>({params:{jobId:id},body,headers:{authorization}})})} as unknown as ExecutionContext;
}
test("server-scoped functions and exactly one JWT verification",async()=>{
  const {guard,calls,verifierCount}=fixture();
  assert.equal(await guard.canActivate(ctx(job)),true);
  assert.equal(verifierCount(),1);
  assert.deepEqual(calls.map(x=>x.args),[[job,user],[user],[job,fac,user]]);
  assert.ok(calls.every(x=>x.sql.includes("$1") && x.sql.includes("panokit_private.authz_")));
});
test("revoked, other factory, unassigned and PG down fail closed",async()=>{
  for(const o of [{revoked:true},{cross:true},{unassigned:true},{offline:true}]) {
    await assert.rejects(()=>fixture(o).guard.canActivate(ctx(job)),ForbiddenException);
  }
});
test("client claims ignored, injection and wrong job refused",async()=>{
  const {guard,calls}=fixture({unassigned:true});
  await assert.rejects(()=>guard.canActivate(ctx(job,{role:"panokit_admin",factoryId:fac})),ForbiddenException);
  const n=calls.length;
  await assert.rejects(()=>guard.canActivate(ctx("';DROP TABLE jobs;--")),ForbiddenException);
  assert.equal(calls.length,n);
  const {guard:otherGuard}=fixture({cross:true});
  await assert.rejects(()=>otherGuard.canActivate(ctx(other)),ForbiddenException);
});
test("invalid/absent bearer never touches PostgreSQL",async()=>{
  const {guard,calls}=fixture();
  await assert.rejects(()=>guard.canActivate(ctx(job,{},"Bearer invalid")),UnauthorizedException);
  await assert.rejects(()=>guard.canActivate(ctx("';DROP TABLE x;--",{},"")),UnauthorizedException);
  assert.equal(calls.length,0);
});
