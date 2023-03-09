import type { BSON, djwt } from "./deps.ts";

export interface Peer {
  /**
   * Peer's ID. The value should be an integer in the interval [1, 0x7F_FF_FF_FF].
   */
  pid: number;

  /**
   * Expiration time.
   */
  exp: Date;
}

export interface LocalizedPeer extends Peer {
  /**
   * Signal sequence number.
   */
  sigSeq: number;

  /**
   * Peer's Websocket instance.
   */
  ws?: WebSocket;
}

export enum SignalType {
  // agent signal type
  INIT,
  RES, // response
  DATA_RECV,

  // peer signal type
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

export enum SignalRes {
  SENDED,
  OFFLINE,
  NOT_FOUND,
}

export interface BasicSignal {
  typ: SignalType;
  seq: number; // signal sequence number
}

export interface InitSignal extends BasicSignal {
  typ: SignalType.INIT;
  pid: number;
  token: string;
  exp: Date;
}

export interface ResSignal extends BasicSignal {
  typ: SignalType.RES;
  ack: number; // acknowledge a signal sequence number
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

export type AgentSignal =
  | InitSignal
  | ResSignal
  | DataRecvSignal;

export type PeerSignal = DataSendSignal;

export type Signal = AgentSignal | PeerSignal;

export interface JwtPayload extends djwt.Payload {
  pid: number;
}
