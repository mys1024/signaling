import type { BSON } from "../deps.ts";

export enum SignalType {
  // agent signal type
  CONF,
  RES, // response
  DATA_RECV,

  // peer signal type
  DATA_SEND,
  RENEWAL,
  CLOSE,
}

export type SignalData =
  | string
  | number
  | boolean
  | null
  | BSON.Binary
  | BSON.Document
  | BSON.Document[];

export enum SignalRes {
  SENDED,
  OFFLINE,
  NOTFOUND,
}

export interface BasicSignal {
  typ: SignalType;
  seq: number; // signal sequence number
}

export interface ConfSignal extends BasicSignal {
  typ: SignalType.CONF;
  pid: number;
  token: string;
  exp: Date;
}

export interface ResSignal extends BasicSignal {
  typ: SignalType.RES;
  ack: number; // acknowledge a signal with the specific sequence number
  res: SignalRes;
}

export interface DataRecvSignal extends BasicSignal {
  typ: SignalType.DATA_RECV;
  from: number; // sender pid
  data: SignalData;
}

export interface DataSendSignal extends BasicSignal {
  typ: SignalType.DATA_SEND;
  to: number; // receiver pid
  data: SignalData;
}

export interface RenewalSignal extends BasicSignal {
  typ: SignalType.RENEWAL;
}

export interface CloseSignal extends BasicSignal {
  typ: SignalType.CLOSE;
  deregister: boolean;
}

export type AgentSignal =
  | ConfSignal
  | ResSignal
  | DataRecvSignal;

export type PeerSignal =
  | DataSendSignal
  | RenewalSignal
  | CloseSignal;

export type Signal = AgentSignal | PeerSignal;
