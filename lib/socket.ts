import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { UserEvents, WorkerEvents } from '@/types/socket';
import { BASE_URL } from './config';

type UserType = 'user' | 'worker' | 'store' | 'admin';

interface SocketStore {
  socket: Socket | null;
  connected: boolean;
  userId: string | null;
  userType: UserType | null;
  connect: (token: string, userId: string, type: UserType) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connected: false,
  userId: null,
  userType: null,
  connect: (token: string, userId: string, type: UserType) => {
    const socket = io(BASE_URL || 'http://localhost:3003', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socket.on('connect', () => {
      // انضمام للغرفة الخاصة v
      socket.emit('register', {
        id: userId,
        type,
        room: `${type}_${userId}`,
      });

      // انضمام للغرفة العامة إن كان admin
      if (type === 'admin') {
        socket.emit('joinRoom', 'admin');
      }
      set((state) => ({ ...state, connected: true }));
    });

    socket.on('disconnect', () => {
      set((state) => ({ ...state, connected: false }));
    });

    set({
      socket,
      userId,
      userType: type,
      connected: socket.connected,
    });
  },
  disconnect: () => {
    set((state) => {
      if (state.socket) {
        if (state.userType && state.userId) {
          state.socket.emit('leaveRoom', `${state.userType}_${state.userId}`);
          if (state.userType === 'admin') {
            state.socket.emit('leaveRoom', 'admin');
          }
        }
        state.socket.disconnect();
      }
      return { socket: null, connected: false, userId: null, userType: null };
    });
  },
}));

export const useSocket = () => {
  const { socket, connected, userId, userType, connect, disconnect } = useSocketStore();
  return { socket, connected, userId, userType, connect, disconnect };
};
