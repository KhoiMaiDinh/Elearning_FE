// src/store/socketSlice.ts
import { getSocket } from "@/lib/socket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "./store";

interface SocketState {
  connected: boolean;
}

const initialState: SocketState = {
  connected: false,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket: (
      state,
      action: PayloadAction<{ token: string; user_id: string }>
    ) => {
      const { token, user_id } = action.payload;
      const socket = getSocket(token);
      socket.emit("register", {
        user_id: action.payload.user_id,
      });

      socket.on("disconnect", () => {
        state.connected = false;
        console.log("Socket disconnected");
      });

      socket.on("error", (error) => {
        console.error("Socket registration error:", error);
      });
    },

    disconnectSocket: (state) => {
      disconnectSocket(); // <-- đoạn này bạn cũng cần kiểm tra lại
      state.connected = false;
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
