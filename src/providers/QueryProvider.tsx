"use client"; // ✅ Must be a Client Component

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router instead of react-router-dom
import { toast } from "react-hot-toast";
import { getSocket  } from "../services/socket";
import { getProfile } from "@/services/apiAuth";
import { useSettingsStore } from "@/components/WizardForm/useStore";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const navigate = useRouter();
  const setIsServerLoading = useSettingsStore((state) => state.setIsServerLoading);
  const setServerState = useSettingsStore((state) => state.setServerState);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const engine = socket.io.engine;
    console.log(engine.transport.name); // in most cases, prints "polling"

    engine.once("upgrade", () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      console.log(engine.transport.name); // in most cases, prints "websocket"
    })
    const SOCKET_TOAST_ID = "socket-status";
    const show = (msg: string, type: "loading" | "success" | "error") => {
      return toast.dismiss(SOCKET_TOAST_ID);
      if (type === "loading") toast.loading(msg, { id: SOCKET_TOAST_ID });
      else if (type === "success") toast.success(msg, { id: SOCKET_TOAST_ID, duration: 2000 });
      else toast.error(msg, { id: SOCKET_TOAST_ID, duration: 4000 });
    };

    function getAuthCookie() {
      return document.cookie
        .split(";")
        .find(c => c.trim().startsWith("auth="))
        ?.split("=")?.[1];
    }

    function emitAuthIfReady() {
      const auth = getAuthCookie();
      if (auth && socket && socket.connected) {
        socket.emit("room", auth);
        console.log("sent auth", auth);
        return true;
      }
      return false;
    }

    function onConnect() {
      setIsServerLoading(true);
      setTimeout(() => setIsServerLoading(false), 100);
      setServerState("online");
      show("Realtime connected.", "success");

      // try to emit auth (retry if not yet present)
      if (!emitAuthIfReady()) {
        let tries = 0;
        const max = 10;
        const interval = setInterval(() => {
          if (emitAuthIfReady() || ++tries >= max) clearInterval(interval);
        }, 1000);
      }
    }

    function onDisconnect(reason: string) {
      setIsServerLoading(false);
      setServerState(`Disconnected (${reason}). Reconnecting…`);
      show(`Disconnected (${reason}). Reconnecting…`, "error");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.on("reconnect_attempt", () => {
      setIsServerLoading(true);
      setServerState("Reconnecting…");
      show("Reconnecting…", "loading")
    });
    socket.io.on("reconnect", () => {
      setServerState("online");
      show("Reconnected.", "success");
      emitAuthIfReady();
    });
    socket.io.on("reconnect_error", () => {
      setIsServerLoading(false);
      setServerState("Reconnect failed. Retrying…");
      show("Reconnect failed. Retrying…", "error")
    });

    socket.on("query_invalidation",async (data: string) => {
      setIsServerLoading(true);
      setServerState(`Refreshing ${data}…`);
      // toast(`Refreshing ${data}…`, { id: `invalidate-${data}`, duration: 1500 });
      const res = queryClient.invalidateQueries({ queryKey: [data], exact: false, refetchType: "active" });
      res.then(() => {
        setIsServerLoading(false);
        setServerState(`Refreshed ${data}.`);
        // toast.success(`Refreshed ${data}.`, { id: `invalidate-${data}`, duration: 1500 });
      })
    });
    socket.io.on("ping", () => {
      // setIsServerLoading(true);
      // setTimeout(() => setIsServerLoading(false), 100);
      setServerState("online");
    })
    // If already connected
    if (socket.connected) onConnect();
    else show("Connecting to realtime…", "loading");

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("query_invalidation");
      socket.io.off("reconnect_attempt");
      socket.io.off("reconnect");
      socket.io.off("reconnect_error");
      socket.io.off("ping");
    };
  }, []);

  // ✅ Ensure `QueryClient` is created on the client side
  const [queryClient] = useState(() => new QueryClient({
    mutationCache: new MutationCache({
      onError: (error: any) => {
       if(error?.status === 401){
            toast.error("Login session expired, please login again.");
            queryClient.removeQueries();
            // remove auth from coookies
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate.replace("/login");
       }
      },
    })
    ,
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
