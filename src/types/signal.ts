import type { BSON } from "../deps.ts";

export enum SignalType {
  // agent signal type
  CONF,
  DATA_RECV,
  DATA_RECEIPT,

  // peer signal type
  CLOSE,
  RENEWAL,
  DATA_SEND,
}

export type SignalData =
  | string
  | number
  | boolean
  | null
  | BSON.Binary
  | BSON.Document
  | BSON.Document[];

export enum SignalDataReceiptStatus {
  SENDED,
  RECEIVER_OFFLINE,
  RECEIVER_NOTFOUND,
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

export interface DataRecvSignal extends BasicSignal {
  typ: SignalType.DATA_RECV;
  from: number; // sender pid
  data: SignalData;
}

export interface DataReceiptSignal extends BasicSignal {
  typ: SignalType.DATA_RECEIPT;
  ack: number;
  sta: SignalDataReceiptStatus;
}

export interface CloseSignal extends BasicSignal {
  typ: SignalType.CLOSE;
  deregister: boolean;
}

export interface RenewalSignal extends BasicSignal {
  typ: SignalType.RENEWAL;
}

export interface DataSendSignal extends BasicSignal {
  typ: SignalType.DATA_SEND;
  to: number; // receiver pid
  data: SignalData;
}

export type AgentSignal =
  | ConfSignal
  | DataRecvSignal
  | DataReceiptSignal;

export type PeerSignal =
  | CloseSignal
  | RenewalSignal
  | DataSendSignal;

export type Signal = AgentSignal | PeerSignal;
