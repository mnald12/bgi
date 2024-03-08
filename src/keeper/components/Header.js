import "../css/header.css";
import { TbMenu2 } from "react-icons/tb";
import user from "../images/user.png";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { Datas } from "../../App";

const Header = () => {
  const { setIsLogin, setRole } = useContext(Datas);

  let menuToggle = false;
  let optionToggle = true;

  const hideBar = () => {
    if (menuToggle) {
      document.getElementById("sidebar").style.display = "block";
      menuToggle = false;
    } else {
      menuToggle = true;
      document.getElementById("sidebar").style.display = "none";
    }
  };

  const toglleOption = () => {
    if (optionToggle) {
      document.getElementById("uob").style.display = "block";
      optionToggle = false;
    } else {
      optionToggle = true;
      document.getElementById("uob").style.display = "none";
    }
  };

  return (
    <div className="header">
      <button className="menu" onClick={() => hideBar()}>
        <TbMenu2 />
      </button>
      <button className="user-option" onClick={() => toglleOption()}>
        <div style={{ textAlign: "right" }}>
          <h4>Mariano Garapon</h4>
          <small>Keeper</small>
        </div>
        <img alt="user" src={user} />
      </button>
      <div className="user-option-body" id="uob">
        <button>
          <FaRegUserCircle /> Profile
        </button>
        <button
          onClick={() => {
            setIsLogin(false);
            setRole(null);
          }}
          style={{ marginTop: "12px" }}
        >
          <FaPowerOff color="red" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
