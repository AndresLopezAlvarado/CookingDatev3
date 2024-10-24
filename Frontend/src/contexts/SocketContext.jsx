import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  setOnlineUsers,
} from "../features/auth/authSlice";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [socketConnection, setSocketConnection] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        auth: { userId: user._id },
      });

      setSocketConnection(socket);

      return () => {
        socket.disconnect();
        setSocketConnection(null);
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOnlineUsers = (onlineUsers) =>
      dispatch(setOnlineUsers(onlineUsers));

    socketConnection?.on("onlineUsers", handleOnlineUsers);

    return () => socketConnection?.off("onlineUsers", handleOnlineUsers);
  }, [socketConnection, dispatch]);

  return (
    <SocketContext.Provider value={{ socketConnection }}>
      {children}
    </SocketContext.Provider>
  );
};
