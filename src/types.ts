import type { BSON } from "./deps.ts";

export interface Peer {
  /**
   * Peer's ID. The value should be an integer in the interval [1, 0x7F_FF_FF_FF].
   */
  pid: number;

  /**
   * Signaling node's ID.
   * The value should be an integer in the interval [1, 0x7F_FF_FF_FF].
   * This property indicates which Signaling node this peer's websocket is connecting to.
   */
  snid: number;

  /**
   * Expiration time.
   */
  exp: Date;
}

export interface LocalizedPeer extends Peer {
  /**
   * Signal counter.
   */
  signalCounter: number;

  /**
   * Peer's Websocket instance.
   */
  ws: WebSocket;
}

export enum SignalType {
  // node signal type
  INIT,
  RECEIVER_DATA,
  RESP, // response

  // peer signal type
  SENDER_DATA,
}

export type SignalData =
  | string
  | number
  | boolean
  | BSON.Binary
  | BSON.Document;

export enum SignalResp {
  // response for SenderDataSignal
  OK,
  NOT_FOUND,

  // response for others
  INVALID_SIGNAL,
  INVALID_SIGNAL_TYPE,
}

export interface BasicSignal {
  type: SignalType;
  sid: number; // signal's ID
}

export interface InitSignal extends BasicSignal {
  type: SignalType.INIT;
  token: string;
}

export interface RespSignal extends BasicSignal {
  type: SignalType.RESP;
  about: number; // about which signal
  resp: SignalResp;
}

export interface ReceiverDataSignal extends BasicSignal {
  type: SignalType.RECEIVER_DATA;
  sender: number; // sender pid
  data: SignalData;
}

export interface SenderDataSignal extends BasicSignal {
  type: SignalType.SENDER_DATA;
  receiver: number; // receiver pid
  data: SignalData;
}

export type NodeSignal =
  | InitSignal
  | RespSignal
  | ReceiverDataSignal;

export type PeerSignal = SenderDataSignal;

export type Signal = NodeSignal | PeerSignal;
