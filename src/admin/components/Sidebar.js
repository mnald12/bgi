import "../css/sidebar.css";
import logo from "../images/logo.png";
import { BiSolidDashboard } from "react-icons/bi";
import { TbAdjustmentsCancel } from "react-icons/tb";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { BsFillBoxFill } from "react-icons/bs";
import { FaPesoSign } from "react-icons/fa6";
import { TbHelpHexagonFilled } from "react-icons/tb";

import { useContext } from "react";
import { SideData } from "../Admin";

const Sidebar = () => {
  const { sideActive, setSideActive } = useContext(SideData);

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="logo" />
        <h3>BGI ADMIN</h3>
      </div>
      <div className="sidebar-body">
        <div className="divider">
          <div className="line"></div>
          <h5>Home</h5>
        </div>
        <button
          className={sideActive === "dashboard" ? "active" : ""}
          onClick={() => setSideActive("dashboard")}
        >
          <BiSolidDashboard className="icn" /> Dashboard
        </button>
        <div className="divider">
          <div className="line"></div>
          <h5>Manage</h5>
        </div>
        <button
          className={sideActive === "categories" ? "active" : ""}
          onClick={() => setSideActive("categories")}
        >
          <BiSolidCategoryAlt className="icn" /> Categories
        </button>
        <button
          className={sideActive === "products" ? "active" : ""}
          onClick={() => setSideActive("products")}
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
        <div className="divider">
          <div className="line"></div>
          <h5>System</h5>
        </div>
        <button
          className={sideActive === "accounts" ? "active" : ""}
          onClick={() => setSideActive("accounts")}
        >
          <IoPerson className="icn" />
          Accounts
        </button>
        <button
          className={sideActive === "settings" ? "active" : ""}
          onClick={() => setSideActive("settings")}
        >
          <TbAdjustmentsCancel className="icn" /> Settings
        </button>
        <button
          className={sideActive === "help" ? "active" : ""}
          onClick={() => setSideActive("help")}
        >
          <TbHelpHexagonFilled className="icn" /> Help
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
