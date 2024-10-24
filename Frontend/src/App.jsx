import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./features/pages/Home";
import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import ProtectedRoutes from "./features/auth/ProtectedRoutes";
import People from "./features/people/People";
import Profile from "./features/profile/Profile";
import Person from "./features/people/Person";
import "./App.css";
import Chat from "./features/chat/Chat";
import { SocketProvider } from "./contexts/SocketContext";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./features/auth/authSlice";
import Chats from "./features/chat/Chats";
import Reactions from "./features/reactions/Reactions";

function App() {
  const user = useSelector(selectCurrentUser);

  return (
    <SocketProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<SignUp />} path="/signUp" />
            <Route element={<SignIn />} path="/signIn" />

            <Route element={<ProtectedRoutes />}>
              <Route path="/people" element={<People />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/people/:id" element={<Person />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/reactions" element={<Reactions />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
