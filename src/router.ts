import { oak } from "./deps.ts";
import { newLocalizedPeer, registerPeer } from "./dao/peer.ts";
import { setupPeerWs } from "./ws.ts";

const router = new oak.Router();

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
  const peer = newLocalizedPeer(ws);
  registerPeer(peer);
  setupPeerWs(peer);
  // response
  ctx.response.status = 101;
});

export default router;
