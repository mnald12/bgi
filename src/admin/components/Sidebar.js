import "../css/sidebar.css";
import logo from "../images/logo.png";
import { BiSolidDashboard } from "react-icons/bi";
// import { TbAdjustmentsCancel } from "react-icons/tb";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { BsFillBoxFill } from "react-icons/bs";
import { FaPesoSign } from "react-icons/fa6";
import { HiInboxArrowDown } from "react-icons/hi2";
import { IoArchive } from "react-icons/io5";
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
        <button
          className={sideActive === "returns" ? "active" : ""}
          onClick={() => setSideActive("returns")}
        >
          <HiInboxArrowDown className="icn" />
          Return
        </button>
        <button
          className={sideActive === "archived" ? "active" : ""}
          onClick={() => setSideActive("archived")}
        >
          <IoArchive className="icn" />
          Archives
        </button>
        <div className="divider">
          <div className="line"></div>
          <h5>Accounts</h5>
        </div>
        <button
          className={sideActive === "myprofile" ? "active" : ""}
          onClick={() => setSideActive("myprofile")}
        >
          <IoPerson className="icn" />
          My Profile
        </button>
        <button
          className={sideActive === "keeperprofile" ? "active" : ""}
          onClick={() => setSideActive("keeperprofile")}
        >
          <IoPerson className="icn" />
          Keeper
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
