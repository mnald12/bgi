import "../css/header.css";
import { TbMenu2 } from "react-icons/tb";
import { FaPowerOff } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { Datas } from "../../App";
import { SideData } from "../Admin";
import { RiCloseLine } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { TbHelpHexagonFilled } from "react-icons/tb";
import { FaBell } from "react-icons/fa";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../db/config";

const Header = () => {
  const { setIsLogin, setRole } = useContext(Datas);
  const { user, setSideActive, setProductId } = useContext(SideData);
  const [isLogout, setIsLogout] = useState(false);
  const [isHelp, setIsHelp] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);
  let menuToggle = false;

  const hideBar = () => {
    if (menuToggle) {
      document.getElementById("sidebar").style.display = "block";
      menuToggle = false;
    } else {
      menuToggle = true;
      document.getElementById("sidebar").style.display = "none";
    }
  };

  useEffect(() => {
    const unit = {
      piece: "Piece",
      pack: "Pack",
      box: "Box",
      roll: "Roll",
      set: "Set",
      pair: "Pair",
      bundle: "Bundle",
    };

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

  return (
    <>
      <div className="header">
        <button className="menu" onClick={() => hideBar()}>
          <TbMenu2 />
        </button>
        <div className="user-option">
          <div className="user-texts">
            <h4>{user.fullName}</h4>
            <p>Admin</p>
          </div>
          <img alt="user" src={user.avatar} />
        </div>
        <button
          className="notif"
          onClick={() => setIsNotif(true)}
          title="notification"
        >
          {notifs.length ? <h6>{notifs.length}</h6> : ""}

          <FaBell className="lg-icn" color="darkviolet" />
        </button>
        <button className="helps" onClick={() => setIsHelp(true)} title="help">
          <TbHelpHexagonFilled className="lg-icn" color="darkblue" />
        </button>
        <button
          className="logouts"
          onClick={() => setIsLogout(true)}
          title="logout"
        >
          <FaPowerOff className="lg-icn" color="red" />
        </button>
      </div>
      <div className={isLogout ? "modal d-flex" : "modal d-none"}>
        <div className="modal-body-delete">
          <button className="modal-close" onClick={() => setIsLogout(false)}>
            <RiCloseLine />
          </button>
          <div className="text-center">
            <IoWarningOutline className="icn" />
          </div>
          <h3>Are you sure you want to log out?</h3>
          <p>
            Remember, once you log out, you'll need to sign in again to access
            your account.
          </p>
          <button
            className="dbtns delete"
            onClick={() => {
              setIsLogin(false);
              setRole(null);
              window.sessionStorage.setItem("isLogin", false);
              window.sessionStorage.setItem("role", null);
            }}
          >
            Logout
          </button>
          <button className="dbtns cancel" onClick={() => setIsLogout(false)}>
            Cancel
          </button>
        </div>
      </div>
      <div className={isHelp ? "modal d-flex" : "modal d-none"}>
        <div className="modal-body">
          <button className="modal-close" onClick={() => setIsHelp(false)}>
            <RiCloseLine />
          </button>
          <h3 className="modal-title">Help</h3>
        </div>
      </div>
      <div className={isNotif ? "notifs" : "d-none"}>
        <div className="notifs-body">
          <div className="notifs-header">
            <h3 className="modal-title">
              Notifications {`(${notifs.length})`}{" "}
            </h3>
            <button
              className="notifs-close"
              title="close"
              onClick={() => setIsNotif(false)}
            >
              <RiCloseLine />
            </button>
          </div>
          <div>
            {notifs.length ? (
              <>
                {notifs.map((nts, ids) => (
                  <button
                    key={ids}
                    className="notifs-item"
                    onClick={() => {
                      setIsNotif(false);
                      setSideActive("product");
                      setProductId(nts.id);
                    }}
                  >
                    <h4>{nts.title}</h4>
                    <small>{nts.productName}</small>
                  </button>
                ))}
              </>
            ) : (
              "No notifications"
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
