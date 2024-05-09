import "../css/header.css";
import { TbMenu2 } from "react-icons/tb";
import { FaPowerOff } from "react-icons/fa6";
import { useContext, useState } from "react";
import { Datas } from "../../App";
import { SideData } from "../Keeper";
import { RiCloseLine } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { TbHelpHexagonFilled } from "react-icons/tb";

const Header = () => {
  const { setIsLogin, setRole } = useContext(Datas);
  const { user } = useContext(SideData);
  const [isLogout, setIsLogout] = useState(false);
  const [isHelp, setIsHelp] = useState(false);

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

  return (
    <>
      <div className="header">
        <button className="menu" onClick={() => hideBar()}>
          <TbMenu2 />
        </button>
        <div className="user-options">
          <div className="user-texts">
            <h4>{user.fullName}</h4>
            <p>Keeper</p>
          </div>
          <img alt="user" src={user.avatar} />
        </div>
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
    </>
  );
};

export default Header;
