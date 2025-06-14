import { getSocket } from '@/lib/socket';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addNotification } from './notificationSlice';
import { NotificationType } from '@/types/notificationType';
import { disconnectSocket as closeSocket } from '@/lib/socket'; // Giả sử bạn có hàm này

interface SocketState {
  connected: boolean;
  isNewNotification: boolean;
}

const initialState: SocketState = {
  connected: false,
  isNewNotification: false,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setIsNewNotification: (state, action: PayloadAction<boolean>) => {
      state.isNewNotification = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});
// Thunk để connect socket
export const connectSocket =
  ({ token, user_id }: { token: string; user_id: string }) =>
  (dispatch: any) => {
    const socket = getSocket(token);

    socket.emit('register', { user_id });

    socket.on('notification', (data: NotificationType) => {
      console.log('🚀 ~ socket.on ~ data:', data);
      dispatch(addNotification(data));
      dispatch(setIsNewNotification(true));
    });

    socket.on('connect', () => {
      dispatch(setConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket registration error:', error);
    });
  };
// Thunk để disconnect socket
export const disconnectSocket = (token: string) => (dispatch: any) => {
  const socket = getSocket(token);
  closeSocket(); // Hàm tự viết để disconnect socket thực sự
  dispatch(setConnected(false));
};

export const { setIsNewNotification, setConnected } = socketSlice.actions;
export default socketSlice.reducer;
