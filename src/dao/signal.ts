import {
  DataRecvSignal,
  DataSendSignal,
  InitSignal,
  RespSignal,
  SignalData,
  SignalResp,
  SignalType,
} from "../types.ts";

export function newInitSignal(sid: number, token: string): InitSignal {
  return {
    type: SignalType.INIT,
    sid,
    token,
  };
}

export function newRespSignal(
  sid: number,
  about: number,
  resp: SignalResp,
): RespSignal {
  return {
    type: SignalType.RESP,
    sid,
    about,
    resp,
  };
}

export function newDataRecvSignal(
  sid: number,
  sender: number,
  data: SignalData,
): DataRecvSignal {
  return {
    type: SignalType.DATA_RECV,
    sid,
    sender,
    data,
  };
}

export function newDataSendSignal(
  sid: number,
  receiver: number,
  data: SignalData,
): DataSendSignal {
  return {
    type: SignalType.DATA_SEND,
    sid,
    receiver,
    data,
  };
}
