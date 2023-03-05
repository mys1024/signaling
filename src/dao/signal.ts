import {
  DataRecvSignal,
  DataSendSignal,
  InitSignal,
  RespSignal,
  SignalData,
  SignalResp,
  SignalType,
} from "../types.ts";

export function newInitSignal(
  seq: number,
  pid: number,
  token: string,
): InitSignal {
  return {
    typ: SignalType.INIT,
    seq,
    pid,
    token,
  };
}

export function newRespSignal(
  seq: number,
  ack: number,
  resp: SignalResp,
): RespSignal {
  return {
    typ: SignalType.RESP,
    seq,
    ack,
    resp,
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
