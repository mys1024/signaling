import {
  DataRecvSignal,
  DataSendSignal,
  InitSignal,
  ResSignal,
  SignalData,
  SignalRes,
  SignalType,
} from "../types.ts";

export function newInitSignal(
  seq: number,
  pid: number,
  token: string,
  exp: Date,
): InitSignal {
  return {
    typ: SignalType.INIT,
    seq,
    pid,
    token,
    exp,
  };
}

export function newResSignal(
  seq: number,
  ack: number,
  res: SignalRes,
): ResSignal {
  return {
    typ: SignalType.RES,
    seq,
    ack,
    res,
  };
}

export function newDataRecvSignal(
  seq: number,
  from: number,
  data: SignalData,
): DataRecvSignal {
  return {
    typ: SignalType.DATA_RECV,
    seq,
    from,
    data,
  };
}

export function newDataSendSignal(
  seq: number,
  to: number,
  data: SignalData,
): DataSendSignal {
  return {
    typ: SignalType.DATA_SEND,
    seq,
    to,
    data,
  };
}
