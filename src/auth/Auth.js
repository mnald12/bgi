import "./auth.css";
import logo from "../images/logo.png";
import { useContext, useEffect, useState } from "react";
import { GrUserAdmin } from "react-icons/gr";
import { FaBuildingUser } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Datas } from "../App";

const Auth = () => {
  const { setIsLogin, setRole } = useContext(Datas);

  const [mode, setMode] = useState(1);

  const Selection = () => {
    return (
      <div className="container">
        <div className="selection">
          <div className="selection-left">
            <img src={logo} alt="logo" />
          </div>
          <div className="selection-right">
            <h3>BGI Electrical</h3>
            <small>Store Management System</small>
            <p>Please Select your Role : </p>
            <button className="admin-btn" onClick={() => setMode(2)}>
              <GrUserAdmin />
              Admin
            </button>
            <div className="hr-centered">
              <h2>Or</h2>
              <div className="hr"></div>
            </div>
            <button className="keeper-btn" onClick={() => setMode(3)}>
              <FaBuildingUser />
              Keeper
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Admin = () => {
    useEffect(() => {
      document.getElementById("uname").addEventListener("change", (e) => {
        if (e.target.value) {
          document.getElementById("luname").classList.add("has-value");
        } else {
          document.getElementById("luname").classList.remove("has-value");
        }
      });

      document.getElementById("pwd").addEventListener("change", (e) => {
        if (e.target.value) {
          document.getElementById("lpwd").classList.add("has-value");
        } else {
          document.getElementById("lpwd").classList.remove("has-value");
        }
      });
    }, []);

    const [pwd, setPwd] = useState("");
    const [user, setUser] = useState("");

    const userUser = "admin";
    const pwdPwd = "admin";

    const [isIncorrect, setIsIncorrect] = useState(false);

    const adminSubmit = (e) => {
      e.preventDefault();
      if (pwd === pwdPwd && user === userUser) {
        setIsLogin(true);
        setRole("admin");
      } else {
        setIsIncorrect(true);
        setTimeout(() => {
          setIsIncorrect(false);
        }, 3000);
      }
    };

    return (
      <div className="container">
        <div className="forms admin">
          <button className="btn-back" onClick={() => setMode(1)}>
            <IoMdClose />
          </button>
          {isIncorrect ? (
            <div className="error-msg" id="err">
              <p>Information is incorrect</p>
            </div>
          ) : (
            ""
          )}
          <div className="headers">
            <h3 className="admins">
              <GrUserAdmin className="icn" />
            </h3>
          </div>
          <h3 className="login-text">Admin - Sign in</h3>
          <form onSubmit={adminSubmit} autoComplete="off">
            <div className="inputs-group">
              <input
                id="uname"
                type="text"
                name="uname"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <label id="luname">Username :</label>
            </div>
            <div className="inputs-group">
              <input
                id="pwd"
                type="password"
                name="pwd"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <label id="lpwd">Password :</label>
            </div>
            <div className="text-right">
              <a className="forgot" href="#pwd">
                forgot password?
              </a>
            </div>
            <div className="btns">
              <button className="admins">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const Keeper = () => {
    useEffect(() => {
      document.getElementById("uname2").addEventListener("change", (e) => {
        if (e.target.value) {
          document.getElementById("luname2").classList.add("has-value");
        } else {
          document.getElementById("luname2").classList.remove("has-value");
        }
      });

      document.getElementById("pwd2").addEventListener("change", (e) => {
        if (e.target.value) {
          document.getElementById("lpwd2").classList.add("has-value");
        } else {
          document.getElementById("lpwd2").classList.remove("has-value");
        }
      });
    }, []);

    const [pwd, setPwd] = useState("");
    const [user, setUser] = useState("");

    const userUser = "keeper";
    const pwdPwd = "keeper";

    const [isIncorrect, setIsIncorrect] = useState(false);

    const adminSubmit = (e) => {
      e.preventDefault();
      if (pwd === pwdPwd && user === userUser) {
        setIsLogin(true);
        setRole("keeper");
      } else {
        setIsIncorrect(true);
        setTimeout(() => {
          setIsIncorrect(false);
        }, 3000);
      }
    };

    return (
      <div className="container">
        <div className="forms keeper">
          <button className="btn-back" onClick={() => setMode(1)}>
            <IoMdClose />
          </button>
          {isIncorrect ? (
            <div className="error-msg" id="err">
              <p>Information is incorrect</p>
            </div>
          ) : (
            ""
          )}
          <div className="headers">
            <h3 className="keepers">
              <GrUserAdmin className="icn" />
            </h3>
          </div>
          <h3 className="login-text">Keeper - Sign in</h3>
          <form onSubmit={adminSubmit} autoComplete="off">
            <div className="inputs-group">
              <input
                id="uname2"
                type="text"
                name="uname2"
                onChange={(e) => setUser(e.target.value)}
              />
              <label id="luname2">Username :</label>
            </div>
            <div className="inputs-group">
              <input
                id="pwd2"
                type="password"
                name="pwd2"
                onChange={(e) => setPwd(e.target.value)}
              />
              <label id="lpwd2">Password :</label>
            </div>
            <div className="text-right">
              <a className="forgot" href="#pwd2">
                forgot password?
              </a>
            </div>
            <div className="btns">
              <button className="keepers">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (mode === 2) {
    return <Admin />;
  } else if (mode === 3) {
    return <Keeper />;
  } else {
    return <Selection />;
  }
};

export default Auth;
