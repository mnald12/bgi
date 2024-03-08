import "./signin.css";
import { useContext, useState } from "react";
import { GrUserAdmin } from "react-icons/gr";
import { FaBuildingUser } from "react-icons/fa6";
import { Datas } from "../App";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/config";

const Signin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { setIsLogin, setRole } = useContext(Datas);

  const [adminUname, setAdminUname] = useState("");
  const [adminPwd, setAdminPwd] = useState("");
  const [keeperUname, setKeeperUname] = useState("");
  const [keeperPwd, setKeeperPwd] = useState("");

  const [adminErr, setAdminErr] = useState(false);
  const [keeperErr, setKeeperErr] = useState(false);

  const login = async (mode, uname, pwd) => {
    if (mode === "admin") {
      const docRef = doc(db, "users", "admin");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (uname === data.username && pwd === data.password) {
        setRole("admin");
        setIsLogin(true);
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
            <a href="#admin">Forgot your password?</a>
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
            <a href="#admin">Forgot your password?</a>
            <button>Sign In</button>
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
    </div>
  );
};

export default Signin;
