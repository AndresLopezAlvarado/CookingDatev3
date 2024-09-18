import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./features/pages/Home";
import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import ProtectedRoutes from "./features/auth/ProtectedRoutes";
import People from "./features/people/People";
import Profile from "./features/profile/Profile";
import Person from "./features/person/Person";
import "./App.css";

function App() {
  return (
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
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
