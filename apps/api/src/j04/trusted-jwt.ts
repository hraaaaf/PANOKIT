import { createPublicKey, verify as verifySignature, type JsonWebKey } from "node:crypto";
import type { IdentityVerifier, VerifiedIdentity } from "./request-authorization";

/** Only asymmetric RS256/ES256 keys from trusted server config; no token-selected URLs. */
export type TrustedJwtConfig = Readonly<{
  issuer: string;
  audience: string;
  keys: readonly (JsonWebKey & { kid: string; alg: "RS256" | "ES256" })[];
  nowSeconds?: () => number;
}>;

function record(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function parsePart(x: string): unknown {
  if (!/^[A-Za-z0-9_-]+$/.test(x) || x.length > 16_384) throw new Error("BAD_JWT");
  const bytes = Buffer.from(x, "base64url");
  if (bytes.toString("base64url") !== x) throw new Error("NONCANONICAL_JWT");
  return JSON.parse(bytes.toString("utf8")) as unknown;
}

export function createTrustedJwtVerifier(config: TrustedJwtConfig): IdentityVerifier {
  if (!/^https:\/\/[^/?#]+\/auth\/v1$/.test(config.issuer) ||
      !config.audience || config.keys.length === 0) {
    throw new Error("JWT_TRUST_CONFIGURATION_MISSING");
  }
  const keys = new Map<string, { alg: "RS256" | "ES256"; key: ReturnType<typeof createPublicKey> }>();
  for (const k of config.keys) {
    if (!k.kid || keys.has(k.kid) ||
        (k.alg !== "RS256" && k.alg !== "ES256") ||
        (k.alg === "RS256" && k.kty !== "RSA") ||
        (k.alg === "ES256" && (k.kty !== "EC" || k.crv !== "P-256"))) {
      throw new Error("UNTRUSTED_JWK");
    }
    keys.set(k.kid, { alg: k.alg, key: createPublicKey({ key: k, format: "jwk" }) });
  }
  return {
    async verifyBearerToken(token: string): Promise<VerifiedIdentity | null> {
      try {
        if (token.length > 16_384) return null;
        const parts = token.split(".");
        if (parts.length !== 3 || parts.some((p) => !p)) return null;
        const [headerPart, payloadPart, sigPart] = parts as [string, string, string];
        const header = parsePart(headerPart);
        const payload = parsePart(payloadPart);
        if (!record(header) || !record(payload)) return null;
        if (header.alg !== "RS256" && header.alg !== "ES256") return null;
        if (typeof header.kid !== "string" || 
            (header.typ !== undefined && header.typ !== "JWT")) return null;
        const trusted = keys.get(header.kid);
        if (!trusted || trusted.alg !== header.alg) return null;
        if (!/^[A-Za-z0-9_-]+$/.test(sigPart)) return null;
        const signature = Buffer.from(sigPart, "base64url");
        if (signature.length === 0 || signature.toString("base64url") !== sigPart) return null;
        if (!verifySignature("sha256", Buffer.from(headerPart + "." + payloadPart),
          { key: trusted.key, dsaEncoding: "ieee-p1363" }, signature)) return null;
        const now = config.nowSeconds?.() ?? Math.floor(Date.now() / 1000);
        if (payload.iss !== config.issuer ||
            !(payload.aud === config.audience || (Array.isArray(payload.aud) && payload.aud.includes(config.audience))) ||
            typeof payload.sub !== "string" || !payload.sub ||
            typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= now ||
            (payload.nbf !== undefined && (typeof payload.nbf !== "number" || payload.nbf > now)) ||
            (payload.iat !== undefined && (typeof payload.iat !== "number" || payload.iat > now))) return null;
        return { userId: payload.sub, issuer: config.issuer };
      } catch {
        return null;
      }
    },
  };
}
