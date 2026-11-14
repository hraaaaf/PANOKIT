import { strict as assert } from "node:assert";
import { generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { ForbiddenException, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { createTrustedJwtVerifier } from "./j04/trusted-jwt";
import { J04AuthorizationGuard } from "./j04/nest-authorization.guard";
import type { MembershipStore } from "./j04/request-authorization";

const rsa = generateKeyPairSync("rsa", { modulusLength: 2048 });
const ec = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const issuer = "https://fixture.supabase.co/auth/v1";
const audience = "authenticated";
const now = 1_800_000_000;
const keys = [
  { ...rsa.publicKey.export({ format: "jwk" }), kid: "rsa", alg: "RS256" as const },
  { ...ec.publicKey.export({ format: "jwk" }), kid: "ec", alg: "ES256" as const },
];
const verifier = createTrustedJwtVerifier({ issuer, audience, keys, nowSeconds: () => now });

function jwt(input: Partial<{ alg: "RS256" | "ES256" | "none"; kid: string; iss: string; aud: string; sub: string; exp: number; nbf: number }> = {}) {
  const alg = input.alg ?? "RS256";
  const a = Buffer.from(JSON.stringify({ alg, kid: input.kid ?? "rsa", typ: "JWT" })).toString("base64url");
  const b = Buffer.from(JSON.stringify({
    iss: input.iss ?? issuer, aud: input.aud ?? audience,
    sub: input.sub ?? "member", exp: input.exp ?? now + 100,
    ...(input.nbf === undefined ? {} : { nbf: input.nbf }),
  })).toString("base64url");
  const data = a + "." + b;
  const privateKey = alg === "ES256" ? ec.privateKey : rsa.privateKey;
  const signature = sign("sha256", Buffer.from(data),
    { key: privateKey, dsaEncoding: "ieee-p1363" }).toString("base64url");
  return data + "." + signature;
}

test("RS256 and ES256 cryptographic verification succeeds for trusted issuer", async () => {
  assert.equal((await verifier.verifyBearerToken(jwt()))?.userId, "member");
  assert.equal((await verifier.verifyBearerToken(jwt({ alg: "ES256", kid: "ec" })))?.userId, "member");
});
test("wrong issuer, audience, expiry, future nbf, unknown key and none rejected", async () => {
  for (const candidate of [
    jwt({ iss: "https://attacker.supabase.co/auth/v1" }), jwt({ aud: "other" }),
    jwt({ exp: now - 1 }), jwt({ nbf: now + 10 }),
    jwt({ kid: "unknown" }), jwt({ alg: "none" }),
    jwt({ alg: "ES256", kid: "rsa" }), "abc.def.ghi", "",
  ]) assert.equal(await verifier.verifyBearerToken(candidate), null);
});
test("payload tampering and signature tampering rejected", async () => {
  const original = jwt();
  const [header, , signature] = original.split(".");
  const forged = Buffer.from(JSON.stringify({ iss: issuer, aud: audience, sub: "hacker", exp: now + 100 })).toString("base64url");
  assert.equal(await verifier.verifyBearerToken(header + "." + forged + "." + signature), null);
  assert.equal(await verifier.verifyBearerToken(original.slice(0, -6) + "aaaaaa"), null);
});
test("unsafe config and duplicated key ID throw", () => {
  assert.throws(() => createTrustedJwtVerifier({ issuer, audience, keys: [] }));
  assert.throws(() => createTrustedJwtVerifier({ issuer: "http://foo/auth/v1", audience, keys }));
  assert.throws(() => createTrustedJwtVerifier({ issuer, audience, keys: [keys[0], keys[0]] }));
});
const memberships: MembershipStore = {
  async getCurrentMembership(userId) {
    return userId === "member" ? {
      userId, role: "factory_operator", active: true,
      factoryId: "factory-A", assignedProductionJobIds: ["job-A"],
    } : null;
  },
};
const goodResource = { factoryId: "factory-A", productionJobId: "job-A" };
const context = (authorization?: string): ExecutionContext => ({
  switchToHttp: () => ({ getRequest: () => ({ headers: { authorization } }) }),
} as unknown as ExecutionContext);
test("guard accepts valid signature and CURRENT assignment only", async () => {
  const guard = new J04AuthorizationGuard(verifier, memberships, "view_production_job", async () => goodResource);
  assert.equal(await guard.canActivate(context("Bearer " + jwt())), true);
  await assert.rejects(() => guard.canActivate(context()), UnauthorizedException);
  await assert.rejects(() => guard.canActivate(context("Bearer " + jwt({ aud: "wrong" }))), UnauthorizedException);
  await assert.rejects(() => guard.canActivate(context("Bearer " + jwt({ sub: "attacker" }))), ForbiddenException);
});
test("guard denies revocation, cross-factory dossier and DB outage", async () => {
  const revoked: MembershipStore = { async getCurrentMembership(userId) {
    return { userId, role: "factory_operator", active: false,
      factoryId: "factory-A", assignedProductionJobIds: ["job-A"] };
  }};
  const t = "Bearer " + jwt();
  const g1 = new J04AuthorizationGuard(verifier, revoked, "view_production_job", async () => goodResource);
  await assert.rejects(() => g1.canActivate(context(t)), ForbiddenException);
  const g2 = new J04AuthorizationGuard(verifier, memberships, "view_production_job",
    async () => ({ factoryId: "factory-B", productionJobId: "job-A" }));
  await assert.rejects(() => g2.canActivate(context(t)), ForbiddenException);
  const g3 = new J04AuthorizationGuard(verifier, memberships, "view_production_job",
    async () => { throw new Error("offline"); });
  await assert.rejects(() => g3.canActivate(context(t)), ForbiddenException);
});
