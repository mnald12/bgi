import "./css/index.css";
import { Chart, registerables } from "chart.js/auto";
import { createContext, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Counter from "./pages/Counter";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Sale from "./pages/Sale";
Chart.register(...registerables);

const SideData = createContext(null);

const Keeper = () => {
  const [sideActive, setSideActive] = useState("dashboard");
  const [drafts, setDrafts] = useState([]);
  const [saleId, setSaleId] = useState(null);

  const Outlet = () => {
    if (sideActive === "dashboard") {
      return <Dashboard />;
    } else if (sideActive === "counter") {
      return <Counter />;
    } else if (sideActive === "products") {
      return <Products />;
    } else if (sideActive === "sales") {
      return <Sales />;
    } else if (sideActive === "sale") {
      return <Sale />;
    }
  };

  return (
    <div className="flex-container">
      <SideData.Provider
        value={{
          sideActive,
          setSideActive,
          drafts,
          setDrafts,
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

export default Keeper;
export { SideData };
