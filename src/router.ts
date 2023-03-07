import { oak } from "./deps.ts";
import { getPeer, newLocalizedPeer, registerPeer } from "./dao/peer.ts";
import { setupPeerWs } from "./ws.ts";
import { jwt } from "./middleware/jwt.ts";
import { signJwt } from "./utils/auth.ts";

const router = new oak.Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello from Signaling";
});

router.get("/ws", async (ctx) => {
  // upgrade to WebSocket
  if (!ctx.isUpgradable) {
    ctx.response.status = 400;
    return;
  }
  const ws = ctx.upgrade();
  // new and register a peer
  const exp = new Date(Date.now() + 60 * 60 * 1000); // 1h
  const peer = newLocalizedPeer(ws, exp);
  const token = await signJwt(exp, { pid: peer.pid });
  registerPeer(peer);
  setupPeerWs(peer, token, exp);
  // ok
  ctx.response.status = 101;
});

router.get("/ws/recover", jwt(), (ctx) => {
  const pid = ctx.state.jwt.payload.pid;
  const token = ctx.state.jwt.token;
  // get peer by pid
  const peer = getPeer(pid);
  if (!peer) {
    ctx.response.status = 404;
    return;
  }
  // check ws
  if (peer.ws) {
    ctx.response.status = 409;
    return;
  }
  // upgrade to WebSocket
  if (!ctx.isUpgradable) {
    ctx.response.status = 400;
    return;
  }
  const ws = ctx.upgrade();
  // recover
  peer.ws = ws;
  setupPeerWs(peer, token, peer.exp);
  // ok
  ctx.response.status = 101;
});

export default router;
