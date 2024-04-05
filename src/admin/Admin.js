import "./css/index.css";
import { Chart, registerables } from "chart.js/auto";
import { createContext, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Accounts from "./pages/Accounts";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Product from "./pages/Product";
import Sale from "./pages/Sale";
Chart.register(...registerables);

const SideData = createContext(null);

const Admin = () => {
  const [sideActive, setSideActive] = useState("dashboard");
  const [productId, setProductId] = useState(null);
  const [saleId, setSaleId] = useState(null);

  const Outlet = () => {
    if (sideActive === "dashboard") {
      return <Dashboard />;
    } else if (sideActive === "categories") {
      return <Categories />;
    } else if (sideActive === "products") {
      return <Products />;
    } else if (sideActive === "product") {
      return <Product />;
    } else if (sideActive === "sales") {
      return <Sales />;
    } else if (sideActive === "sale") {
      return <Sale />;
    } else if (sideActive === "accounts") {
      return <Accounts />;
    } else if (sideActive === "settings") {
      return <Settings />;
    } else if (sideActive === "help") {
      return <Help />;
    }
  };

  return (
    <div className="flex-container">
      <SideData.Provider
        value={{
          sideActive,
          setSideActive,
          productId,
          setProductId,
          saleId,
          setSaleId,
        }}
      >
        <Sidebar />
        <div className="contents">
          <Header />
          <Outlet />
        </div>
      </SideData.Provider>
    </div>
  );
};

export default Admin;
export { SideData };
