// src/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = (token?: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_SOCKET || '', {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token, // this gets sent in the handshake
      },
    });
  }
  console.log('🚀 ~ getSocket ~ socket:', socket);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined!;
  }
};
