import { LocalizedPeer, PeerSignal, SignalResp, SignalType } from "./types.ts";
import { BSON, oak } from "./deps.ts";
import { getPeer, newLocalizedPeer, registerPeer } from "./dao/peer.ts";
import {
  newDataRecvSignal,
  newInitSignal,
  newRespSignal,
} from "./dao/signal.ts";
import { syncIgnoreError } from "./utils/plain.ts";

const router = new oak.Router();

function setupPeerWs(localizedPeer: LocalizedPeer) {
  const ws = localizedPeer.ws;

  ws.onopen = () => {
    // send init signal
    ws.send(BSON.serialize(newInitSignal(
      localizedPeer.signalCounter++,
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
        localizedPeer.signalCounter++,
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
            localizedPeer.signalCounter++,
            signal.sid,
            SignalResp.NOT_FOUND,
          )));
          break;
        }
        // forward data to receiver
        receiver.ws.send(BSON.serialize(newDataRecvSignal(
          receiver.signalCounter++,
          localizedPeer.pid,
          signal.data,
        )));
        ws.send(BSON.serialize(newRespSignal(
          localizedPeer.signalCounter++,
          signal.sid,
          SignalResp.SENDED,
        )));
        break;
      }
      default: {
        ws.send(BSON.serialize(newRespSignal(
          localizedPeer.signalCounter++,
          signal.sid,
          SignalResp.INVALID_SIGNAL_TYPE,
        )));
        break;
      }
    }
  };
}

router.get("/", (ctx) => {
  ctx.response.body = "Hello from Signaling";
});

router.get("/ws", (ctx) => {
  // upgrade to WebSocket
  if (!ctx.isUpgradable) {
    ctx.response.status = 400;
    return;
  }
  const ws = ctx.upgrade();
  // new and register a peer
  const peer = newLocalizedPeer(new Date(), ws);
  registerPeer(peer);
  // setup ws
  setupPeerWs(peer);
  // no need to set ctx.response
});

export default router;
