"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export function useSocket(
  enabled: boolean,
  onMessage: (data: { booking_id?: number | null; sender: string; body: string; sentAt: string }) => void,
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const socket = io(BASE, {
      withCredentials: true, // sends the cc_access HttpOnly cookie
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("receive_message", (data) => {
      onMessage(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, onMessage]);

  function emit(event: string, data: unknown) {
    socketRef.current?.emit(event, data);
  }

  return { emit };
}
