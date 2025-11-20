import { io } from "socket.io-client";

export const socket = io("https://backend.butterfly.hurairaconsultancy.com", {
  withCredentials: true,
});
