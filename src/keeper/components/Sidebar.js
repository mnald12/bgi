import "../css/sidebar.css";
import logo from "../images/logo.png";
import { BiSolidDashboard } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { BsCalculatorFill, BsFillBoxFill } from "react-icons/bs";
import { HiInboxArrowDown } from "react-icons/hi2";
import { FaPesoSign } from "react-icons/fa6";
import { useContext } from "react";
import { SideData } from "../Keeper";

const Sidebar = () => {
  const { sideActive, setSideActive } = useContext(SideData);

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="logo" />
        <h3>BGI KEEPER</h3>
      </div>
      <div className="sidebar-body">
        <div className="divider">
          <div className="line"></div>
          <h5>Home</h5>
        </div>
        <button
          className={sideActive === "dashboard" ? "active" : ""}
          onClick={() => {
            setSideActive("dashboard");
            window.sessionStorage.setItem("sideActive", "dashboard");
          }}
        >
          <BiSolidDashboard className="icn" /> Dashboard
        </button>
        <button
          className={sideActive === "counter" ? "active" : ""}
          onClick={() => {
            setSideActive("counter");

            window.sessionStorage.setItem("sideActive", "counter");
          }}
        >
          <BsCalculatorFill className="icn" /> Counter
        </button>
        <div className="divider">
          <div className="line"></div>
          <h5>Manage</h5>
        </div>
        <button
          className={sideActive === "products" ? "active" : ""}
          onClick={() => {
            setSideActive("products");
            window.sessionStorage.setItem("sideActive", "products");
          }}
        >
          <BsFillBoxFill className="icn" /> Products
        </button>
        <button
          className={sideActive === "sales" ? "active" : ""}
          onClick={() => setSideActive("sales")}
        >
          <FaPesoSign className="icn" />
          Sales
        </button>
        <button
          className={sideActive === "return" ? "active" : ""}
          onClick={() => {
            setSideActive("return");
            window.sessionStorage.setItem("sideActive", "return");
          }}
        >
          <HiInboxArrowDown className="icn" />
          Return
        </button>
        <div className="divider">
          <div className="line"></div>
          <h5>Accounts</h5>
        </div>
        <button
          className={sideActive === "profile" ? "active" : ""}
          onClick={() => {
            setSideActive("profile");
            window.sessionStorage.setItem("sideActive", "profile");
          }}
        >
          <IoPerson className="icn" />
          My Profile
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
