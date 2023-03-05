import { LocalizedPeer, PeerSignal, SignalResp, SignalType } from "./types.ts";
import { BSON } from "./deps.ts";
import { getPeer } from "./dao/peer.ts";
import {
  newDataRecvSignal,
  newInitSignal,
  newRespSignal,
} from "./dao/signal.ts";
import { syncIgnoreError } from "./utils/plain.ts";

export function setupPeerWs(peer: LocalizedPeer) {
  const ws = peer.ws;

  ws.onopen = () => {
    // send init signal
    ws.send(BSON.serialize(
      newInitSignal(peer.sigSeq++, peer.pid, "token"),
    ));
  };

  ws.onmessage = (e) => {
    // deserialize peer signal
    const sig = syncIgnoreError(() => BSON.deserialize(e.data) as PeerSignal);
    if (!sig) {
      ws.send(BSON.serialize(
        newRespSignal(peer.sigSeq++, -1, SignalResp.INVALID_SIGNAL),
      ));
      return;
    }
    // handle peer signal
    switch (sig.typ) {
      case SignalType.DATA_SEND: {
        // get receiver
        const receiver = getPeer(sig.to);
        if (!receiver) {
          ws.send(BSON.serialize(
            newRespSignal(peer.sigSeq++, sig.seq, SignalResp.NOT_FOUND),
          ));
          break;
        }
        // forward data to receiver
        receiver.ws.send(BSON.serialize(
          newDataRecvSignal(receiver.sigSeq++, peer.pid, sig.data),
        ));
        ws.send(BSON.serialize(
          newRespSignal(peer.sigSeq++, sig.seq, SignalResp.SENDED),
        ));
        break;
      }
      default: {
        ws.send(BSON.serialize(
          newRespSignal(peer.sigSeq++, sig.seq, SignalResp.INVALID_SIGNAL_TYPE),
        ));
        break;
      }
    }
  };
}
