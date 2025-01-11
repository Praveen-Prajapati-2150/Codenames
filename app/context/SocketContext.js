'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

//--------------------------------------

export const SocketProvider = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState(null);

  const URL =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
      : process.env.NEXT_PUBLIC_DEV_SERVER_URL;

  // console.log('URL', URL);

  useEffect(() => {
    const connection = io(URL, {
      // reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000,
      // transports: ['websocket'],
      transports: ['websocket', 'polling'],
      upgrade: true, // Allow transport upgrade
      forceNew: true, // Force a new connection
    });

    connection.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    connection.on('connect', () => {
      console.log('Socket connected successfully');
    });

    connection.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(connection);

    return () => {
      connection.disconnect();
    };
  }, [URL]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
