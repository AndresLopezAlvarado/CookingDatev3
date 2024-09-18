import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="mt-16 flex-1 overflow-y-auto">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
