import {
  PeerSignal,
  PeerSignalType,
  SignalDataReceiptStatus,
} from "./types/signal.ts";
import { LocalizedPeer } from "./types/peer.ts";
import { BSON } from "./deps.ts";
import { deregisterPeer, getPeer } from "./dao/peer.ts";
import {
  bsonConfSignal,
  bsonDataReceiptSignal,
  bsonDataRecvSignal,
} from "./dao/signal.ts";
import { syncIgnoreError } from "./utils/plain.ts";
import { signJwt } from "./utils/auth.ts";

export function setupPeerWs(peer: LocalizedPeer, token: string, exp: Date) {
  const ws = peer.ws;
  if (!ws) {
    throw new Error(`Peer's property 'ws' is not set.`);
  }

  ws.addEventListener("open", () => {
    ws.send(bsonConfSignal(peer.sigSeq++, peer.pid, token, exp));
  });

  ws.addEventListener("close", () => {
    if (Date.now() >= peer.exp.valueOf()) {
      deregisterPeer(peer.pid);
    } else {
      peer.ws = undefined;
    }
  });

  ws.addEventListener("message", async (e) => {
    // deserialize peer signal
    const sig = syncIgnoreError(() => BSON.deserialize(e.data) as PeerSignal);
    if (!sig) {
      return;
    }
    // handle peer signal
    switch (sig.typ) {
      case PeerSignalType.DATA_SEND: {
        // get receiver
        const receiver = getPeer(sig.to);
        if (!receiver) {
          ws.send(
            bsonDataReceiptSignal(
              peer.sigSeq++,
              sig.seq,
              SignalDataReceiptStatus.RECEIVER_NOTFOUND,
            ),
          );
          break;
        }
        // forward data to receiver
        if (!receiver.ws) {
          ws.send(
            bsonDataReceiptSignal(
              peer.sigSeq++,
              sig.seq,
              SignalDataReceiptStatus.RECEIVER_OFFLINE,
            ),
          );
          break;
        }
        receiver.ws.send(
          bsonDataRecvSignal(receiver.sigSeq++, peer.pid, sig.data),
        );
        ws.send(
          bsonDataReceiptSignal(
            peer.sigSeq++,
            sig.seq,
            SignalDataReceiptStatus.SENDED,
          ),
        );
        break;
      }
      case PeerSignalType.RENEWAL: {
        const exp = new Date(Date.now() + 60 * 60 * 1000); // 1h
        peer.exp = exp;
        const token = await signJwt(exp, { pid: peer.pid });
        ws.send(
          bsonConfSignal(peer.sigSeq++, peer.pid, token, exp),
        );
        break;
      }
    }
  });
}
