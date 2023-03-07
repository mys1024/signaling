import { base64, load } from "./deps.ts";

// load environment variables from .env
await load({ export: true });

// JWT_KEY
const _JWT_KEY = Deno.env.get("JWT_KEY");
if (!_JWT_KEY) {
  throw new Error("Missing environment variable: JWT_KEY");
}
export const JWT_KEY = await crypto.subtle.importKey(
  "raw",
  base64.decode(_JWT_KEY),
  { name: "HMAC", hash: "SHA-256" }, // HS256
  false,
  ["sign", "verify"],
);
