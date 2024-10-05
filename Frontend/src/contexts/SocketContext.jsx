import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { selectIsAuthenticated } from "../features/auth/authSlice";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, user }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        auth: { user },
      });

      setSocketConnection(socket);

      return () => socket.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
};
