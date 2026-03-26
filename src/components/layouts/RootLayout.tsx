import { Outlet } from "react-router-dom";
import Header from "../UI/header";
import Footer from "../UI/Footer";

/** Layout route for public marketing pages — provides Header + Footer. */
const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
