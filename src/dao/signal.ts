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
    type: SignalType.INIT,
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
    type: SignalType.RESP,
    seq,
    ack,
    resp,
  };
}

export function newDataRecvSignal(
  seq: number,
  sender: number,
  data: SignalData,
): DataRecvSignal {
  return {
    type: SignalType.DATA_RECV,
    seq,
    sender,
    data,
  };
}

export function newDataSendSignal(
  seq: number,
  receiver: number,
  data: SignalData,
): DataSendSignal {
  return {
    type: SignalType.DATA_SEND,
    seq,
    receiver,
    data,
  };
}
