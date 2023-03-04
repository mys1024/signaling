import {
  InitSignal,
  ReceiverDataSignal,
  RespSignal,
  SenderDataSignal,
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

export function newReceiverDataSignal(
  sid: number,
  sender: number,
  data: SignalData,
): ReceiverDataSignal {
  return {
    type: SignalType.RECEIVER_DATA,
    sid,
    sender,
    data,
  };
}

export function newSenderDataSignal(
  sid: number,
  receiver: number,
  data: SignalData,
): SenderDataSignal {
  return {
    type: SignalType.SENDER_DATA,
    sid,
    receiver,
    data,
  };
}
