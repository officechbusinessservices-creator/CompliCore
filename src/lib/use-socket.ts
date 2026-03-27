'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * WebSocket connection state
 */
export type SocketState = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Socket event handler types
 */
export type SocketMessageHandler = (data: unknown) => void;
export type SocketEventHandler = () => void;

/**
 * Hook for WebSocket communication
 * Provides connection management and message handling
 */
export function useSocket(
  url: string,
  options: {
    onConnect?: SocketEventHandler;
    onDisconnect?: SocketEventHandler;
    onError?: (error: Error) => void;
  } = {}
) {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, Set<SocketMessageHandler>>>(new Map());

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        options.onConnect?.();
      };

      socket.onclose = () => {
        options.onDisconnect?.();
      };

      socket.onerror = (event) => {
        options.onError?.(new Error('WebSocket error'));
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const eventType = message.type || 'message';
          const handlers = handlersRef.current.get(eventType);

          handlers?.forEach((handler) => {
            handler(message.data);
          });
        } catch (error) {
          options.onError?.(
            error instanceof Error ? error : new Error('Failed to parse message')
          );
        }
      };

      socketRef.current = socket;
    } catch (error) {
      options.onError?.(
        error instanceof Error ? error : new Error('Failed to connect')
      );
    }
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const send = useCallback((data: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  }, []);

  const on = useCallback((event: string, handler: SocketMessageHandler) => {
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
    }
    handlersRef.current.get(event)?.add(handler);

    return () => {
      handlersRef.current.get(event)?.delete(handler);
    };
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    send,
    on,
    connect,
    disconnect,
  };
}
