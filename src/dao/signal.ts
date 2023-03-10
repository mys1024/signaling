import { BSON } from "../deps.ts";
import {
  CloseSignal,
  ConfSignal,
  DataReceiptSignal,
  DataRecvSignal,
  DataSendSignal,
  RenewalSignal,
  SignalData,
  SignalDataReceiptStatus,
  SignalType,
} from "../types/signal.ts";

export function bsonConfSignal(
  seq: number,
  pid: number,
  token: string,
  exp: Date,
) {
  const signal: ConfSignal = {
    typ: SignalType.CONF,
    seq,
    pid,
    token,
    exp,
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

export function bsonDataReceiptSignal(
  seq: number,
  ack: number,
  sta: SignalDataReceiptStatus,
) {
  const signal: DataReceiptSignal = {
    typ: SignalType.DATA_RECEIPT,
    seq,
    ack,
    sta,
  };
  return BSON.serialize(signal);
}

export function bsonCloseSignal(
  seq: number,
  deregister: boolean,
) {
  const signal: CloseSignal = {
    typ: SignalType.CLOSE,
    seq,
    deregister,
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
