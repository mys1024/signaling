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
