import { strict as assert } from "node:assert";
import { generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { loadTrustedSupabaseJwks, type JwksFetcher } from "./j04/trusted-jwks";

const issuer = "https://fixture.supabase.co/auth/v1";
const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const key = { ...publicKey.export({ format: "jwk" }), kid: "test-key", alg: "RS256", use: "sig" };
const mock = (keys: unknown, status = 200): JwksFetcher => async (url, init) => {
  assert.equal(url, issuer + "/.well-known/jwks.json");
  assert.equal(init.redirect, "error");
  return { ok: status === 200, status, json: async () => ({ keys }) };
};
test("trusted server-only JWKS snapshot verifies signed JWT", async () => {
  const verifier = await loadTrustedSupabaseJwks(issuer, "authenticated", mock([key]));
  const a = Buffer.from(JSON.stringify({alg:"RS256",kid:"test-key",typ:"JWT"})).toString("base64url");
  const b = Buffer.from(JSON.stringify({iss:issuer,aud:"authenticated",sub:"user-1",exp:Math.floor(Date.now()/1000)+60})).toString("base64url");
  const signature = sign("sha256",Buffer.from(a+"."+b),privateKey).toString("base64url");
  assert.equal((await verifier.verifyBearerToken(a+"."+b+"."+signature))?.userId,"user-1");
  assert.equal(await verifier.verifyBearerToken(a+"."+b+"."+signature.slice(0,-3)+"abc"),null);
});
test("fail closed: unsafe origin, missing keys, HTTP error, private keys and key confusion", async () => {
  await assert.rejects(() => loadTrustedSupabaseJwks("http://evil/auth/v1","authenticated",mock([key])));
  await assert.rejects(() => loadTrustedSupabaseJwks(issuer,"authenticated",mock([])));
  await assert.rejects(() => loadTrustedSupabaseJwks(issuer,"authenticated",mock([key],503)));
  await assert.rejects(() => loadTrustedSupabaseJwks(issuer,"authenticated",mock([{...key,d:"secret"}])));
  await assert.rejects(() => loadTrustedSupabaseJwks(issuer,"authenticated",mock([{...key,alg:"HS256"}])));
  await assert.rejects(() => loadTrustedSupabaseJwks(issuer,"authenticated",mock([key,key])));
});
