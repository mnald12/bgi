import "./css/index.css";
import { Chart, registerables } from "chart.js/auto";
import { createContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Product from "./pages/Product";
import Sale from "./pages/Sale";
import Profile from "./pages/Profile";
import Profile2 from "./pages/Profile2";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/config";
import Archived from "./pages/Archived";
import Return from "./pages/Return";
Chart.register(...registerables);

const SideData = createContext(null);

const Admin = () => {
  const [sideActive, setSideActive] = useState(
    window.sessionStorage.getItem("sideActive")
      ? window.sessionStorage.getItem("sideActive")
      : "dashboard"
  );
  const [productId, setProductId] = useState(null);
  const [saleId, setSaleId] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(doc(db, "users", "admin"));
      const d = docSnap.data();
      setUser(d);
    };
    getUser();
  }, []);

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
    } else if (sideActive === "myprofile") {
      return <Profile />;
    } else if (sideActive === "keeperprofile") {
      return <Profile2 />;
    } else if (sideActive === "archived") {
      return <Archived />;
    } else if (sideActive === "returns") {
      return <Return />;
    }
  };

  return (
    <div className="flex-container">
      <SideData.Provider
        value={{
          user,
          setUser,
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
