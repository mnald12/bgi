import "./css/index.css";
import { Chart, registerables } from "chart.js/auto";
import { createContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Counter from "./pages/Counter";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/config";
import Profile from "./pages/Profile";
import Return from "./pages/Return";
Chart.register(...registerables);

const SideData = createContext(null);

const Keeper = () => {
  const [sideActive, setSideActive] = useState(
    window.sessionStorage.getItem("sideActive")
      ? window.sessionStorage.getItem("sideActive")
      : "dashboard"
  );
  const [drafts, setDrafts] = useState([]);
  const [saleId, setSaleId] = useState(null);
  const [user, setUser] = useState({});

  const Outlet = () => {
    if (sideActive === "dashboard") {
      return <Dashboard />;
    } else if (sideActive === "counter") {
      return <Counter />;
    } else if (sideActive === "products") {
      return <Products />;
    } else if (sideActive === "sales") {
      return <Sales />;
    } else if (sideActive === "return") {
      return <Return />;
    } else if (sideActive === "profile") {
      return <Profile />;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(doc(db, "users", "keeper"));
      const d = docSnap.data();
      setUser(d);
    };
    getUser();
  }, []);

  return (
    <div className="flex-container">
      <SideData.Provider
        value={{
          user,
          setUser,
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
