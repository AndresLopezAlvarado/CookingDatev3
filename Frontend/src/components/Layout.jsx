import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* <div className="flex flex-col min-h-screen"> */}
      <Header />

      <main className="mt-12">{children}</main>
      {/* <main className="mt-16 flex-1 overflow-y-auto">{children}</main> */}

      <Footer />
    </div>
  );
};

export default Layout;
