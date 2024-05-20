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
import moment from "moment";

const Header = () => {
  const { setIsLogin, setRole } = useContext(Datas);
  const { user, setSideActive, setProductId, notifs } = useContext(SideData);
  const [isLogout, setIsLogout] = useState(false);
  const [isHelp, setIsHelp] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const [dateTime, setDateTime] = useState(moment().format("LLL"));
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
    setInterval(() => {
      setDateTime(moment().format("LLL"));
    }, 1000);
  });

  return (
    <>
      <div className="header">
        <button className="menu" onClick={() => hideBar()}>
          <TbMenu2 />
        </button>
        <h4 style={{ paddingLeft: "6px" }}>{dateTime}</h4>
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
