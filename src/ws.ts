import { LocalizedPeer, PeerSignal, SignalResp, SignalType } from "./types.ts";
import { BSON } from "./deps.ts";
import { getPeer } from "./dao/peer.ts";
import {
  newDataRecvSignal,
  newInitSignal,
  newRespSignal,
} from "./dao/signal.ts";
import { syncIgnoreError } from "./utils/plain.ts";

export function setupPeerWs(localizedPeer: LocalizedPeer) {
  const ws = localizedPeer.ws;

  ws.onopen = () => {
    // send init signal
    ws.send(BSON.serialize(newInitSignal(
      localizedPeer.signalSeq++,
      localizedPeer.pid,
      "token",
    )));
  };

  ws.onmessage = (e) => {
    // deserialize peer signal
    const signal = syncIgnoreError(() =>
      BSON.deserialize(e.data) as PeerSignal
    );
    if (!signal) {
      ws.send(BSON.serialize(newRespSignal(
        localizedPeer.signalSeq++,
        -1,
        SignalResp.INVALID_SIGNAL,
      )));
      return;
    }
    // handle peer signal
    switch (signal.type) {
      case SignalType.DATA_SEND: {
        // get receiver
        const receiver = getPeer(signal.receiver);
        if (!receiver) {
          ws.send(BSON.serialize(newRespSignal(
            localizedPeer.signalSeq++,
            signal.seq,
            SignalResp.NOT_FOUND,
          )));
          break;
        }
        // forward data to receiver
        receiver.ws.send(BSON.serialize(newDataRecvSignal(
          receiver.signalSeq++,
          localizedPeer.pid,
          signal.data,
        )));
        ws.send(BSON.serialize(newRespSignal(
          localizedPeer.signalSeq++,
          signal.seq,
          SignalResp.SENDED,
        )));
        break;
      }
      default: {
        ws.send(BSON.serialize(newRespSignal(
          localizedPeer.signalSeq++,
          signal.seq,
          SignalResp.INVALID_SIGNAL_TYPE,
        )));
        break;
      }
    }
  };
}
