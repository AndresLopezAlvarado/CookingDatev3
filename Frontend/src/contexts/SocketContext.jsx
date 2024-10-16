import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../features/auth/authSlice";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        auth: { userId: user?._id },
      });

      setSocketConnection(socket);

      return () => socket.disconnect();
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
};
