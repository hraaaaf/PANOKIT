import {strict as assert} from "node:assert";
import {test} from "node:test";
import {ForbiddenException,type ExecutionContext} from "@nestjs/common";
import {J04AuthorizationGuard} from "./j04/nest-authorization.guard";
import {createPostgresMembershipStore,createPostgresJobResolver,type ReadOnlyPg} from "./j04/postgres-authorization";
const user="11111111-1111-4111-8111-111111111111";
const fac="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const other="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const job="22222222-2222-4222-8222-222222222222";
const verifier={async verifyBearerToken(token:string){return token==="signed"?{userId:user,issuer:"https://fixture.supabase.co/auth/v1"}:null;}};
function fixture(o:{revoked?:boolean;cross?:boolean;unassigned?:boolean;offline?:boolean}={}){
  const calls:{sql:string;args:readonly string[]}[]=[];
  const db:ReadOnlyPg={async query<T extends object>(sql:string,args:readonly string[]){
    calls.push({sql,args});
    if(o.offline)throw Error("PG_DOWN");
    let rows:object[]=[];
    if(sql.includes("staff_memberships"))rows=[{user_id:user,role:"factory_operator",active:!o.revoked,factory_id:fac}];
    else if(sql.includes("assigned_operator_user_id"))rows=o.unassigned?[]:[{job_id:job}];
    else if(sql.includes("production_jobs"))rows=[{job_id:job,factory_id:o.cross?other:fac}];
    return {rows:rows as T[]};
  }};
  return {calls,guard:new J04AuthorizationGuard(verifier,createPostgresMembershipStore(db),"view_production_job",createPostgresJobResolver(db))};
}
function ctx(id:string,body:object={}):ExecutionContext{
  return {switchToHttp:()=>({getRequest:()=>({params:{jobId:id},body,headers:{authorization:"Bearer signed"}})})} as unknown as ExecutionContext;
}
test("scoped SQL membership and exact assignment succeed",async()=>{
  const {guard,calls}=fixture();
  assert.equal(await guard.canActivate(ctx(job)),true);
  assert.deepEqual(calls.map(x=>x.args),[[job],[user],[job,fac,user]]);
  assert.ok(calls.every(x=>x.sql.includes("$1")));
});
test("revocation, other factory, missing assignment and database failure fail closed",async()=>{
  for(const o of [{revoked:true},{cross:true},{unassigned:true},{offline:true}]){
    await assert.rejects(()=>fixture(o).guard.canActivate(ctx(job)),ForbiddenException);
  }
});
test("client role/factory ignored; SQL-injection job rejected without DB call",async()=>{
  const {guard,calls}=fixture({unassigned:true});
  await assert.rejects(()=>guard.canActivate(ctx(job,{role:"panokit_admin",factoryId:fac})),ForbiddenException);
  const n=calls.length;
  await assert.rejects(()=>guard.canActivate(ctx("';DROP TABLE jobs;--")),ForbiddenException);
  assert.equal(calls.length,n);
});
