// store/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationType } from '../types/notificationType';

interface NotificationState {
  list: NotificationType[];
}

const initialState: NotificationState = {
  list: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationType>) {
      state.list.unshift(action.payload); // push lên đầu
    },
    markAsRead(state, action: PayloadAction<string>) {
      const index = state.list.findIndex((n: NotificationType) => n.id === action.payload);
      if (index !== -1) {
        state.list[index].is_read = true;
      }
    },
    clearNotifications(state) {
      state.list = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
