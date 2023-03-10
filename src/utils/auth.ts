import type { JwtPayload } from "../types/jwt.ts";
import { djwt } from "../deps.ts";
import { JWT_KEY } from "../config.ts";

export async function signJwt(
  exp: Date,
  payload: JwtPayload,
) {
  return await djwt.create(
    { alg: "HS256", typ: "JWT" },
    {
      ...payload,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(exp.valueOf() / 1000),
    },
    JWT_KEY,
  );
}

export async function verifyJwt(jwt: string) {
  try {
    return await djwt.verify(jwt, JWT_KEY) as JwtPayload;
  } catch (_) {
    return;
  }
}
