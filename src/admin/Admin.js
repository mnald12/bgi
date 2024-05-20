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
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../db/config";
import Archived from "./pages/Archived";
import Return from "./pages/Return";
Chart.register(...registerables);

const SideData = createContext(null);

const unit = {
  piece: "Piece",
  pack: "Pack",
  box: "Box",
  roll: "Roll",
  set: "Set",
  pair: "Pair",
  bundle: "Bundle",
};

const Admin = () => {
  const [sideActive, setSideActive] = useState(
    window.sessionStorage.getItem("sideActive")
      ? window.sessionStorage.getItem("sideActive")
      : "dashboard"
  );
  const [productId, setProductId] = useState(null);
  const [saleId, setSaleId] = useState(null);
  const [user, setUser] = useState({});

  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(doc(db, "users", "admin"));
      const d = docSnap.data();
      setUser(d);
    };
    getUser();

    const get = async () => {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const title1 = "Product is out of stock";
      const title2 = "Product almost out of stocks";
      const ntfs = [];
      for (let i of prods) {
        if (i.unit === unit.piece) {
          if (i.stocks === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks < 6) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        } else if (i.unit === unit.pair) {
          if (i.stocks === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks < 6) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        } else if (i.unit === unit.pack) {
          if (i.stocks.pack === 0 && i.stocks.pcs === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks.pack === 0 && i.stocks.pcs < 10) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        } else if (i.unit === unit.box) {
          if (i.stocks.box === 0 && i.stocks.pcs === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks.box === 0 && i.stocks.pcs < 10) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        } else if (i.unit === unit.roll) {
          if (i.stocks.roll === 0 && i.stocks.meter === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks.roll === 0 && i.stocks.meter < 10) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        } else if (i.unit === unit.set) {
          if (i.stocks.set === 0 && i.stocks.pcs === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks.set === 0 && i.stocks.pcs < 10) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        } else if (i.unit === unit.bundle) {
          if (i.stocks.bundle === 0 && i.stocks.pcs === 0) {
            ntfs.push({
              id: i.id,
              title: title1,
              productName: i.productName,
            });
          } else if (i.stocks.bundle === 0 && i.stocks.pcs < 10) {
            ntfs.push({
              id: i.id,
              title: title2,
              productName: i.productName,
            });
          }
        }
      }
      setNotifs(ntfs);
    };
    get();
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

  const reloadNotifs = async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const prods = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    const title1 = "Product is out of stock";
    const title2 = "Product almost out of stocks";
    const ntfs = [];
    for (let i of prods) {
      if (i.unit === unit.piece) {
        if (i.stocks === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks < 6) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      } else if (i.unit === unit.pair) {
        if (i.stocks === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks < 6) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      } else if (i.unit === unit.pack) {
        if (i.stocks.pack === 0 && i.stocks.pcs === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks.pack === 0 && i.stocks.pcs < 10) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      } else if (i.unit === unit.box) {
        if (i.stocks.box === 0 && i.stocks.pcs === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks.box === 0 && i.stocks.pcs < 10) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      } else if (i.unit === unit.roll) {
        if (i.stocks.roll === 0 && i.stocks.meter === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks.roll === 0 && i.stocks.meter < 10) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      } else if (i.unit === unit.set) {
        if (i.stocks.set === 0 && i.stocks.pcs === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks.set === 0 && i.stocks.pcs < 10) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      } else if (i.unit === unit.bundle) {
        if (i.stocks.bundle === 0 && i.stocks.pcs === 0) {
          ntfs.push({
            id: i.id,
            title: title1,
            productName: i.productName,
          });
        } else if (i.stocks.bundle === 0 && i.stocks.pcs < 10) {
          ntfs.push({
            id: i.id,
            title: title2,
            productName: i.productName,
          });
        }
      }
    }
    setNotifs(ntfs);
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
          notifs,
          reloadNotifs,
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
