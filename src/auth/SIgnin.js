/* eslint-disable jsx-a11y/anchor-is-valid */
import "./signin.css";
import { useContext, useEffect, useRef, useState } from "react";
import { GrUserAdmin } from "react-icons/gr";
import { FaBuildingUser } from "react-icons/fa6";
import { Datas } from "../App";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/config";
import { RiCloseLine } from "react-icons/ri";
import emailjs from "@emailjs/browser";

const Signin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { setIsLogin, setRole } = useContext(Datas);
  const [adminInfo, setAdminInfo] = useState({});

  const [adminUname, setAdminUname] = useState("");
  const [adminPwd, setAdminPwd] = useState("");
  const [keeperUname, setKeeperUname] = useState("");
  const [keeperPwd, setKeeperPwd] = useState("");

  const [adminErr, setAdminErr] = useState(false);
  const [keeperErr, setKeeperErr] = useState(false);

  const [isForgotPwdAdmin, setIsForgotPwdAdmin] = useState(false);

  const form = useRef();

  useEffect(() => {
    const getInfo = async () => {
      const docRef = doc(db, "users", "admin");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setAdminInfo(data);
    };
    getInfo();
  }, [setAdminInfo]);

  const sendAdminPwd = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_h155ilu",
        "template_jjsbfwa",
        form.current,
        "JSQfi6h8QjsUi6kMY"
      )
      .then(
        (result) => {
          if (result) {
            document.getElementById("pwdsent").classList.remove("d-none");
            setTimeout(() => {
              document.getElementById("pwdsent").classList.add("d-none");
            }, 3000);
          }
        },
        (error) => {
          console.log(error.text);
          document.getElementById("pwdfail").classList.remove("d-none");
          setTimeout(() => {
            document.getElementById("pwdfail").classList.add("d-none");
          }, 3000);
        }
      );
  };

  const login = async (mode, uname, pwd) => {
    if (mode === "admin") {
      const docRef = doc(db, "users", "admin");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (uname === data.username && pwd === data.password) {
        setRole("admin");
        setIsLogin(true);
        window.sessionStorage.setItem("isLogin", true);
        window.sessionStorage.setItem("role", "admin");
      } else {
        setAdminErr(true);
        setAdminUname("");
        setAdminPwd("");
        setTimeout(() => {
          setAdminErr(false);
        }, 5000);
      }
    } else {
      const docRef = doc(db, "users", "keeper");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (uname === data.username && pwd === data.password) {
        setRole("keeper");
        setIsLogin(true);
        window.sessionStorage.setItem("isLogin", true);
        window.sessionStorage.setItem("role", "keeper");
      } else {
        setKeeperErr(true);
        setKeeperUname("");
        setKeeperPwd("");
        setTimeout(() => {
          setKeeperErr(false);
        }, 5000);
      }
    }
  };

  const adminSubmitLogin = (e) => {
    e.preventDefault();
    login("admin", adminUname, adminPwd);
  };

  const keeperSubmitLogin = (e) => {
    e.preventDefault();
    login("keeper", keeperUname, keeperPwd);
  };

  return (
    <div className="container">
      <form ref={form} onSubmit={sendAdminPwd} hidden>
        <input name="name" type="text" value={adminInfo.fullName} />
        <input name="pwd" type="text" value={adminInfo.password} />
        <input name="to_email" type="email" value={adminInfo.email} />
        <button id="hbtn" type="submit">
          send
        </button>
      </form>
      <div className={isAdmin ? "signin right-panel-active" : "signin"}>
        <div className="form-container admin-container">
          <form onSubmit={adminSubmitLogin}>
            <div className="icn-container">
              <GrUserAdmin />
            </div>
            <h1>Sign in</h1>
            <span>BGI Store Management System</span>
            <br />
            <div className={adminErr ? "inf-err" : "inf-err d-none"}>
              Oops! It seems like the username or password you entered is
              incorrect
            </div>
            <input
              type="text"
              placeholder="Username"
              value={adminUname}
              onChange={(e) => setAdminUname(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPwd}
              onChange={(e) => setAdminPwd(e.target.value)}
            />
            <a
              style={{ cursor: "pointer" }}
              onClick={() => setIsForgotPwdAdmin(true)}
            >
              Forgot your password?
            </a>
            <button>Sign In</button>
          </form>
        </div>
        <div className="form-container keeper-container">
          <form onSubmit={keeperSubmitLogin}>
            <div className="icn-container">
              <FaBuildingUser />
            </div>
            <h1>Sign in</h1>
            <span>BGI Store Management System</span>
            <br />
            <div className={keeperErr ? "inf-err" : "inf-err d-none"}>
              Oops! It seems like the username or password you entered is
              incorrect
            </div>
            <input
              type="text"
              placeholder="Username"
              value={keeperUname}
              onChange={(e) => setKeeperUname(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={keeperPwd}
              onChange={(e) => setKeeperPwd(e.target.value)}
            />
            <button className="mt-12px">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hello, Keeper!</h1>
              <p>Please enter your username and password</p>
              <button className="ghost" onClick={() => setIsAdmin(false)}>
                Admin?
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Admin!</h1>
              <p>Please enter your username and password</p>
              <button className="ghost" onClick={() => setIsAdmin(true)}>
                Keeper?
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={isForgotPwdAdmin ? "modal d-flex" : "modal d-none"}>
        <div className="modal-body-delete">
          <button
            className="modal-close"
            onClick={() => setIsForgotPwdAdmin(false)}
          >
            <RiCloseLine />
          </button>
          <p id="pwdsent" className="color-green d-none">
            Password successfully sent to your email.
          </p>
          <p id="pwdfail" className="color-red d-none">
            There was a problem sending your password to your email. Please try
            again later
          </p>
          <h3>Forgot Password?</h3>
          <p>
            We will send your password to the email address associated with your
            account.
          </p>
          <button
            className="dbtns saves"
            onClick={() => {
              document.getElementById("hbtn").click();
            }}
          >
            Send Password
          </button>
          <button
            className="dbtns cancel"
            onClick={() => setIsForgotPwdAdmin(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
