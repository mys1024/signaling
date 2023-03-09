import { BSON } from "../deps.ts";
import {
  DataRecvSignal,
  DataSendSignal,
  InitSignal,
  RenewalSignal,
  ResSignal,
  SignalData,
  SignalRes,
  SignalType,
} from "../types.ts";

export function bsonInitSignal(
  seq: number,
  pid: number,
  token: string,
  exp: Date,
) {
  const signal: InitSignal = {
    typ: SignalType.INIT,
    seq,
    pid,
    token,
    exp,
  };
  return BSON.serialize(signal);
}

export function bsonResSignal(
  seq: number,
  ack: number,
  res: SignalRes,
) {
  const signal: ResSignal = {
    typ: SignalType.RES,
    seq,
    ack,
    res,
  };
  return BSON.serialize(signal);
}

export function bsonDataRecvSignal(
  seq: number,
  from: number,
  data: SignalData,
) {
  const signal: DataRecvSignal = {
    typ: SignalType.DATA_RECV,
    seq,
    from,
    data,
  };
  return BSON.serialize(signal);
}

export function bsonDataSendSignal(
  seq: number,
  to: number,
  data: SignalData,
) {
  const signal: DataSendSignal = {
    typ: SignalType.DATA_SEND,
    seq,
    to,
    data,
  };
  return BSON.serialize(signal);
}

export function bsonRenewalSignal(
  seq: number,
) {
  const signal: RenewalSignal = {
    typ: SignalType.RENEWAL,
    seq,
  };
  return BSON.serialize(signal);
}
