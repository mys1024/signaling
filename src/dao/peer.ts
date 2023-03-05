import type { LocalizedPeer } from "../types.ts";
import { randomInt } from "../utils/plain.ts";

const peerMap = new Map<number, LocalizedPeer>(); // pid -> peer

function randomPid() {
  return randomInt(1, 0x7F_FF_FF_FF);
}

export function getPeer(pid: number) {
  return peerMap.get(pid);
}

export function registerPeer(localizedPeer: LocalizedPeer) {
  // check
  if (getPeer(localizedPeer.pid)) {
    throw new Error(
      `The peer with pid ${localizedPeer.pid} has already registered.`,
    );
  }
  // register
  peerMap.set(localizedPeer.pid, localizedPeer);
}

export function newLocalizedPeer(exp: Date, ws: WebSocket) {
  // allocate a new pid
  let pid: number | undefined;
  for (let i = 0; i < 16; i++) {
    pid = randomPid();
    if (!getPeer(pid)) {
      break;
    }
  }
  if (pid === undefined) {
    throw new Error("Cannot allocate a new pid.");
  }
  // new peer
  const peer: LocalizedPeer = {
    pid,
    exp,
    ws,
    sigSeq: 1,
  };
  // return
  return peer;
}
