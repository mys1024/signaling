import type { djwt } from "../deps.ts";

export interface JwtPayload extends djwt.Payload {
  pid: number;
}
