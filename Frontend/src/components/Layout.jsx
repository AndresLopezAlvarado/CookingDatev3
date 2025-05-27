import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Header />

      <main className="p-1 mt-12 min-h-[calc(100dvh-3rem)]">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;
