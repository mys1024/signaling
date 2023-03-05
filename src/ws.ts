import { LocalizedPeer, PeerSignal, SignalRes, SignalType } from "./types.ts";
import { BSON } from "./deps.ts";
import { getPeer } from "./dao/peer.ts";
import {
  newDataRecvSignal,
  newInitSignal,
  newResSignal,
} from "./dao/signal.ts";
import { syncIgnoreError } from "./utils/plain.ts";

export function setupPeerWs(peer: LocalizedPeer) {
  const ws = peer.ws;
  if (!ws) {
    throw new Error(`Peer's property 'ws' is not set.`);
  }

  ws.onopen = () => {
    // send init signal
    ws.send(BSON.serialize(
      newInitSignal(peer.sigSeq++, peer.pid),
    ));
  };

  ws.onmessage = (e) => {
    // deserialize peer signal
    const sig = syncIgnoreError(() => BSON.deserialize(e.data) as PeerSignal);
    if (!sig) {
      ws.send(BSON.serialize(
        newResSignal(peer.sigSeq++, -1, SignalRes.INVALID_SIGNAL),
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
            newResSignal(peer.sigSeq++, sig.seq, SignalRes.NOT_FOUND),
          ));
          break;
        }
        // forward data to receiver
        if (!receiver.ws) {
          ws.send(BSON.serialize(
            newResSignal(peer.sigSeq++, sig.seq, SignalRes.OFFLINE),
          ));
          break;
        }
        receiver.ws.send(BSON.serialize(
          newDataRecvSignal(receiver.sigSeq++, peer.pid, sig.data),
        ));
        ws.send(BSON.serialize(
          newResSignal(peer.sigSeq++, sig.seq, SignalRes.SENDED),
        ));
        break;
      }
      default: {
        ws.send(BSON.serialize(
          newResSignal(peer.sigSeq++, sig.seq, SignalRes.INVALID_SIGNAL_TYPE),
        ));
        break;
      }
    }
  };
}
