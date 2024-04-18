import { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../db/config";
import Loader from "../components/Loader";
import { RiCloseLine } from "react-icons/ri";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { cryptoRandomStringAsync } from "crypto-random-string";
import { SideData } from "../Keeper";

const Profile = () => {
  const { setUser } = useContext(SideData);
  const [isLoaded, setIsloaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isUpModal, setIsUpModal] = useState(false);
  const [uname, setUname] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    const getProd = async () => {
      const docSnap = await getDoc(doc(db, "users", "keeper"));
      const d = docSnap.data();
      setProfile(d);
      setUname(d.username);
      setName(d.fullName);
      setAddress(d.address);
      setEmail(d.email);
      setNumber(d.number);
    };
    getProd();
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const updateProfle = async () => {
    setIsloaded(false);
    const uimgz = document.getElementById("imgs");

    if (uimgz.files.length > 0) {
      const imageRef = ref(
        storage,
        `images/${img.name + cryptoRandomStringAsync({ length: 10 })}`
      );
      uploadBytes(imageRef, img).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          await updateDoc(doc(db, "users", "keeper"), {
            avatar: url,
            username: uname,
            fullName: name,
            address: address,
            email: email,
            number: number,
          });
        });
      });
    } else {
      await updateDoc(doc(db, "users", "keeper"), {
        username: uname,
        fullName: name,
        address: address,
        email: email,
        number: number,
      });
    }

    setIsUpModal(false);
    const docSnap = await getDoc(doc(db, "users", "keeper"));
    const d = docSnap.data();
    setUser(d);
    setProfile(d);
    setName(d.fullName);
    setAddress(d.address);
    setEmail(d.email);
    setNumber(d.number);
    setIsloaded(true);
  };

  if (isLoaded) {
    return (
      <>
        <div className="profile">
          <div className="page-header">
            <h3 className="page-title">My Profile</h3>
            <div className="search-bars">
              <button
                className="add-bar bg-orange"
                onClick={() => {
                  setIsUpModal(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="profiles">
            <div className="profile-left">
              <img alt="profile" src={profile.avatar} />
            </div>
            <div className="profile-right">
              <table>
                <tbody>
                  <tr>
                    <td width="25%">
                      <b>Name :</b>
                    </td>
                    <td width="80%">{profile.fullName}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Address : </b>
                    </td>
                    <td>{profile.address}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Email : </b>
                    </td>
                    <td>{profile.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Phone Number : </b>
                    </td>
                    <td>{profile.number}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={isUpModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body">
            <button className="modal-close" onClick={() => setIsUpModal(false)}>
              <RiCloseLine />
            </button>
            <h3 className="modal-title">Edit Profile</h3>
            <div className="modal-flex">
              <div className="modal-left">
                <div className="img-preview">
                  <img id="img" alt="logo" src={profile.avatar} />
                </div>
                <p>Product Image</p>
                <input
                  type="file"
                  id="imgs"
                  onChange={(e) => {
                    document.getElementById("img").src =
                      URL.createObjectURL(e.target.files[0]) + "#toolbar=0";
                    setImg(e.target.files[0]);
                  }}
                />
              </div>
              <div className="modal-right">
                {/* <div className="input-group w-100">
                  <label>Username :</label>
                  <input
                    type="text"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                  />
                </div> */}
                <div className="input-group w-100">
                  <label>Full Name :</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group w-100">
                  <label>Address :</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="input-group w-100">
                  <label>Email :</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-group w-100">
                  <label>Contact Number :</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mb-container w-100">
              <button
                id="pbtn"
                className="bg-orange"
                onClick={() => updateProfle()}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
        {/* <div className={isUpPassModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button
              className="modal-close"
              onClick={() => setIsUpPassModal(false)}
            >
              <RiCloseLine />
            </button>
            <h3 className="modal-title">Change Password</h3>
            <div id="rpwdtxt" className="d-none">
              <p className="color-red">Repeat Password is incorrect!</p>
            </div>
            <div className="input-group w-100">
              <label>New Password :</label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
            <div className="input-group w-100 mt-12px">
              <label>Repeat Password :</label>
              <input
                type="password"
                value={rpwd}
                onChange={(e) => setRpwd(e.target.value)}
              />
            </div>
            <div className="w-100 text-right mt-12px">
              <button className="cbtn bg-orange" onClick={() => updatePwd()}>
                Update Password
              </button>
            </div>
          </div>
        </div> */}
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Profile;
