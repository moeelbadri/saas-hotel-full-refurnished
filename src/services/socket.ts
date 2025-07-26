// src/services/socket.ts
import { io, Socket } from "socket.io-client";

// We export a function or a nullable socket, not a live connection at module-eval time:
let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    // we’re on the server: no window available
    return null;
  }
  if (!socket) {
    const host = window.location.hostname;
    socket = io(`http://${host}:4443`, {auth: {token: localStorage.getItem("auth")}});
  }
  return socket;
}
