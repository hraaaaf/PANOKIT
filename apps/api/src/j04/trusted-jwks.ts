import type { JsonWebKey } from "node:crypto";
import { createTrustedJwtVerifier, type TrustedJwtConfig } from "./trusted-jwt";
import type { IdentityVerifier } from "./request-authorization";

/**
 * Server-only JWKS snapshot loader. Never follow redirects, token-supplied URLs
 * or trust private key material. No background refresh or production wiring.
 * A failed refresh MUST NOT silently replace the trust set.
 */
export type JwksFetcher = (url: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status" | "json">>;
export async function loadTrustedSupabaseJwks(
  issuer: string,
  audience: string,
  fetcher: JwksFetcher = fetch,
  timeoutMs = 3000,
): Promise<IdentityVerifier> {
  if (!/^https:\/\/[^/?#]+\/auth\/v1$/.test(issuer) ||
      !audience || !Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 10000) {
    throw new Error("JWKS_TRUST_CONFIGURATION_INVALID");
  }
  const response = await fetcher(issuer + "/.well-known/jwks.json", {
    method: "GET", redirect: "error", signal: AbortSignal.timeout(timeoutMs),
    headers: { accept: "application/json" },
  });
  if (!response.ok || response.status !== 200) throw new Error("JWKS_FETCH_FAILED");
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      !("keys" in body) || !Array.isArray(body.keys) ||
      body.keys.length === 0 || body.keys.length > 16) throw new Error("JWKS_INVALID");
  const keys: TrustedJwtConfig["keys"][number][] = [];
  for (const item of body.keys) {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("JWKS_INVALID_KEY");
    const k = item as Record<string, unknown>;
    if (typeof k.kid !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(k.kid) ||
        (k.alg !== "RS256" && k.alg !== "ES256") ||
        (k.use !== undefined && k.use !== "sig") ||
        (k.key_ops !== undefined && (!Array.isArray(k.key_ops) || !k.key_ops.includes("verify"))) ||
        k.d !== undefined || k.p !== undefined || k.q !== undefined || k.k !== undefined ||
        (k.alg === "RS256" && k.kty !== "RSA") ||
        (k.alg === "ES256" && (k.kty !== "EC" || k.crv !== "P-256"))) throw new Error("JWKS_UNTRUSTED_KEY");
    keys.push(k as JsonWebKey & { kid: string; alg: "RS256" | "ES256" });
  }
  return createTrustedJwtVerifier({ issuer, audience, keys });
}
