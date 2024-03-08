import { useEffect, useState } from "react";
import "../css/products.css";
import "../css/modal.css";
import logo from "../images/placeholder.png";
import { RiCloseLine } from "react-icons/ri";
import Loader from "../components/Loader";
import { categories } from "../../datas";
import { HiOutlineEye } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import {
  collection,
  doc,
  setDoc,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../db/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../db/config";
import { v4 } from "uuid";

const Products = () => {
  const [isLoaded, setIsloaded] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [productss, setProductss] = useState([]);
  const [img, setImg] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);

    const get = async () => {
      const ps = [];
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const obj = doc.data();
        obj.id = doc.id;
        ps.push(obj);
        setProductss(ps);
      });
    };

    get();
  }, []);

  const units = ["Piece", "Pack", "Box", "Roll", "Set", "Pair", "Bundle"];

  const unit = {
    piece: "Piece",
    pack: "Pack",
    box: "Box",
    roll: "Roll",
    set: "Set",
    pair: "Pair",
    bundle: "Bundle",
  };

  const [activeUnit, setActiveUnit] = useState("Piece");

  const [pname, setPname] = useState("");
  const [category, setCategory] = useState("");

  //pcs
  const [qtyPcs, setQtyPcs] = useState(0);
  const [capitalPcs, setCapitalPcs] = useState(0);
  const [pcsSpPcs, setPcsSpPcs] = useState(0);

  //pack
  const [qtyPack, setQtyPack] = useState(0);
  const [packQtyPcs, setPackQtyPcs] = useState(0);
  const [pcsPerPack, setPcsPerPack] = useState(0);
  const [capitalPack, setCapitalPack] = useState(0);
  const [spPack, setSpPack] = useState(0);
  const [spPackPcs, setSpPackPcs] = useState(0);

  //box
  const [qtyBox, setQtyBox] = useState(0);
  const [boxQtyPcs, setBoxQtyPcs] = useState(0);
  const [pcsPerBox, setPcsPerBox] = useState(0);
  const [capitalBox, setCapitalBox] = useState(0);
  const [spBox, setSpBox] = useState(0);
  const [spBoxPcs, setSpBoxPcs] = useState(0);

  //roll
  const [qtyRoll, setQtyRoll] = useState(0);
  const [qtyMeter, setQtyMeter] = useState(0);
  const [meterPerRoll, setMeterPerRoll] = useState(0);
  const [capitalRoll, setCapitalRoll] = useState(0);
  const [spRoll, setSpRoll] = useState(0);
  const [spMeter, setSpMeter] = useState(0);

  //set
  const [qtySet, setQtySet] = useState(0);
  const [qtySetPcs, setQtySetPcs] = useState(0);
  const [pcsPerSet, setPcsPerSet] = useState(0);
  const [capitalSet, setCapitalSet] = useState(0);
  const [spSet, setSpSet] = useState(0);
  const [spSetPcs, setSpSetPcs] = useState(0);

  //pair
  const [qtyPair, setQtyPair] = useState(0);
  const [capitalPair, setCapitalPair] = useState(0);
  const [spPair, setSpPair] = useState(0);

  //bundle
  const [qtyBundle, setQtyBundle] = useState(0);
  const [qtyBundlePcs, setQtyBundlePcs] = useState(0);
  const [pcsPerBundle, setPcsPerBundle] = useState(0);
  const [capitalBundle, setCapitalBundle] = useState(0);
  const [spBundle, setSpBundle] = useState(0);
  const [spBundlePcs, setSpBundlePcs] = useState(0);

  const uploadImage = () => {
    const imgz = document.getElementById("imgs");
    if (imgz.files.length <= 0) {
      addProduct(
        "https://firebasestorage.googleapis.com/v0/b/bgi-electrical.appspot.com/o/images%2Fplaceholder.png?alt=media&token=8b29243a-cade-49e8-b231-43a1a999cbf9"
      );
    } else {
      const imageRef = ref(storage, `images/${img.name + v4()}`);
      uploadBytes(imageRef, img).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          addProduct(url);
        });
      });
    }
    document.getElementById("pbtn").style.background = "rgba(0, 128, 0, 0.297)";
  };

  const addProduct = async (imgUrl) => {
    const productRef = collection(db, "products");

    if (activeUnit === unit.piece) {
      const tc = capitalPcs * qtyPcs;
      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: qtyPcs,
        stocks: qtyPcs,
        capital: capitalPcs,
        totalCapital: tc,
        price: pcsSpPcs,
        income: 0,
        sold: 0,
      });
      setProductss((prev) => [
        ...prev,
        {
          productImage: imgUrl,
          productName: pname,
          unit: activeUnit,
          category: category,
          totalStocks: qtyPcs,
          stocks: qtyPcs,
          capital: capitalPcs,
          totalCapital: tc,
          price: pcsSpPcs,
          income: 0,
          sold: 0,
        },
      ]);
    } else if (activeUnit === unit.pack) {
      let tc = 0;

      if (packQtyPcs > 0) {
        let cpcs = capitalPack / pcsPerPack;
        let tcpcs = packQtyPcs * cpcs;
        tc = capitalPack * qtyPack + tcpcs;
      } else {
        tc = capitalPack * qtyPack;
      }

      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: {
          pack: qtyPack,
          pcs: packQtyPcs,
        },
        stocks: {
          pack: qtyPack,
          pcs: packQtyPcs,
        },
        pcsPerPack: pcsPerPack,
        capital: capitalPack,
        totalCapital: tc,
        price: {
          pack: spPack,
          pcs: spPackPcs,
        },
        income: 0,
        sold: {
          pack: 0,
          pcs: 0,
        },
      });
      setProductss((prev) => [
        ...prev,
        {
          productImage: imgUrl,
          productName: pname,
          unit: activeUnit,
          category: category,
          totalStocks: {
            pack: qtyPack,
            pcs: packQtyPcs,
          },
          stocks: {
            pack: qtyPack,
            pcs: packQtyPcs,
          },
          pcsPerPack: pcsPerPack,
          capital: capitalPack,
          totalCapital: tc,
          price: {
            pack: spPack,
            pcs: spPackPcs,
          },
          income: 0,
          sold: {
            pack: 0,
            pcs: 0,
          },
        },
      ]);
    } else if (activeUnit === unit.box) {
      let tc = 0;

      if (boxQtyPcs > 0) {
        let cpcs = capitalBox / pcsPerBox;
        let tcpcs = boxQtyPcs * cpcs;
        tc = capitalBox * qtyBox + tcpcs;
      } else {
        tc = capitalBox * qtyBox;
      }

      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: {
          box: qtyBox,
          pcs: pcsPerBox,
        },
        stocks: {
          pack: qtyBox,
          pcs: pcsPerBox,
        },
        pcsPerBox: pcsPerBox,
        capital: capitalPack,
        totalCapital: tc,
        price: {
          pack: spPack,
          pcs: spPackPcs,
        },
        income: 0,
        sold: {
          pack: 0,
          pcs: 0,
        },
      });
      setProductss((prev) => [
        ...prev,
        {
          productImage: imgUrl,
          productName: pname,
          unit: activeUnit,
          category: category,
          totalStocks: {
            box: qtyBox,
            pcs: pcsPerBox,
          },
          stocks: {
            pack: qtyBox,
            pcs: pcsPerBox,
          },
          pcsPerBox: pcsPerBox,
          capital: capitalPack,
          totalCapital: tc,
          price: {
            pack: spPack,
            pcs: spPackPcs,
          },
          income: 0,
          sold: {
            pack: 0,
            pcs: 0,
          },
        },
      ]);
    } else if (activeUnit === unit.roll) {
      let tc = 0;

      if (qtyMeter > 0) {
        let cpcs = capitalRoll / meterPerRoll;
        let tcpcs = qtyMeter * cpcs;
        tc = capitalRoll * qtyRoll + tcpcs;
      } else {
        tc = capitalRoll * qtyRoll;
      }

      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: {
          roll: qtyRoll,
          meter: qtyMeter,
        },
        stocks: {
          roll: qtyRoll,
          meter: qtyMeter,
        },
        meterPerRoll: meterPerRoll,
        capital: capitalRoll,
        totalCapital: tc,
        price: {
          roll: spRoll,
          meter: spMeter,
        },
        income: 0,
        sold: {
          roll: 0,
          meter: 0,
        },
      });
      setProductss((prev) => [
        ...prev,
        {
          productImage: imgUrl,
          productName: pname,
          unit: activeUnit,
          category: category,
          totalStocks: {
            roll: qtyRoll,
            meter: qtyMeter,
          },
          stocks: {
            roll: qtyRoll,
            meter: qtyMeter,
          },
          meterPerRoll: meterPerRoll,
          capital: capitalRoll,
          totalCapital: tc,
          price: {
            roll: spRoll,
            meter: spMeter,
          },
          income: 0,
          sold: {
            roll: 0,
            meter: 0,
          },
        },
      ]);
    } else if (activeUnit === unit.set) {
      let tc = 0;

      if (qtySetPcs > 0) {
        let cpcs = capitalSet / pcsPerSet;
        let tcpcs = qtySetPcs * cpcs;
        tc = capitalSet * qtySet + tcpcs;
      } else {
        tc = capitalSet * qtySet;
      }

      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: {
          set: qtySet,
          pcs: qtySetPcs,
        },
        stocks: {
          set: qtySet,
          pcs: qtySetPcs,
        },
        pcsPerSet: pcsPerSet,
        capital: capitalSet,
        totalCapital: tc,
        price: {
          set: spSet,
          pcs: spSetPcs,
        },
        income: 0,
        sold: {
          set: 0,
          pcs: 0,
        },
      });
      setProductss((prev) => [
        ...prev,
        {
          productImage: imgUrl,
          productName: pname,
          unit: activeUnit,
          category: category,
          totalStocks: {
            set: qtySet,
            pcs: qtySetPcs,
          },
          stocks: {
            set: qtySet,
            pcs: qtySetPcs,
          },
          pcsPerSet: pcsPerSet,
          capital: capitalSet,
          totalCapital: tc,
          price: {
            set: spSet,
            pcs: spSetPcs,
          },
          income: 0,
          sold: {
            set: 0,
            pcs: 0,
          },
        },
      ]);
    } else if (activeUnit === unit.pair) {
      const tc = capitalPair * qtyPair;
      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: qtyPair,
        stocks: qtyPair,
        capital: capitalPair,
        totalCapital: tc,
        price: spPair,
        income: 0,
        sold: 0,
      });
    } else if (activeUnit === unit.bundle) {
      let tc = 0;

      if (qtyBundlePcs > 0) {
        let cpcs = capitalBundle / pcsPerBundle;
        let tcpcs = qtyBundlePcs * cpcs;
        tc = capitalBundle * qtyBundle + tcpcs;
      } else {
        tc = capitalBundle * qtyBundle;
      }

      await setDoc(doc(productRef), {
        productImage: imgUrl,
        productName: pname,
        unit: activeUnit,
        category: category,
        totalStocks: {
          bundle: qtyBundle,
          pcs: qtyBundlePcs,
        },
        stocks: {
          bundle: qtyBundle,
          pcs: qtyBundlePcs,
        },
        pcsPerBundle: pcsPerBundle,
        capital: capitalBundle,
        totalCapital: tc,
        price: {
          bundle: spBundle,
          pcs: spBundlePcs,
        },
        income: 0,
        sold: {
          bundle: 0,
          pcs: 0,
        },
      });
      setProductss((prev) => [
        ...prev,
        {
          productImage: imgUrl,
          productName: pname,
          unit: activeUnit,
          category: category,
          totalStocks: {
            bundle: qtyBundle,
            pcs: qtyBundlePcs,
          },
          stocks: {
            bundle: qtyBundle,
            pcs: qtyBundlePcs,
          },
          pcsPerBundle: pcsPerBundle,
          capital: capitalBundle,
          totalCapital: tc,
          price: {
            bundle: spBundle,
            pcs: spBundlePcs,
          },
          income: 0,
          sold: {
            bundle: 0,
            pcs: 0,
          },
        },
      ]);
    }

    document.getElementById("pbtn").style.background = "forestgreen";
    setIsModal(false);
  };

  const searchTable = (e) => {
    const lists = document.getElementById("tbody").querySelectorAll("tr");
    const textToSearch = e.target.value.toUpperCase();
    for (let i of lists) {
      const text = i.innerText;
      if (text.toUpperCase().indexOf(textToSearch) > -1) i.style.display = "";
      else i.style.display = "none";
    }
  };

  const deleteProd = async (id) => {
    setProductss((l) => l.filter((item) => item.id !== id));
    await deleteDoc(doc(db, "products", id));
  };

  if (isLoaded) {
    return (
      <div className="products">
        <div className="page-header">
          <h3 className="page-title">Products</h3>
          <div className="search-bars">
            <input
              id="search-field"
              type="search"
              placeholder="Search products here..."
              onKeyUp={(e) => searchTable(e)}
            />
            <button className="add-bar" onClick={() => setIsModal(true)}>
              Add product
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>img</th>
              <th>Product Name</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Stocks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {productss.map((prod, id) => (
              <tr key={id}>
                <td>
                  <img src={prod.productImage} alt="prod" />
                </td>
                <td>{prod.productName}</td>
                <td>{prod.unit}</td>
                {prod.unit === unit.piece ? (
                  <td>
                    ₱{" "}
                    {prod.price.toLocaleString("en", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    / Pcs
                  </td>
                ) : prod.unit === unit.pack ? (
                  <td>
                    <span>
                      ₱{" "}
                      {prod.price.pack.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pack,{" "}
                    </span>
                    <span>
                      ₱{" "}
                      {prod.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </span>
                  </td>
                ) : prod.unit === unit.box ? (
                  <td>
                    <span>
                      ₱{" "}
                      {prod.price.box.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Box,{" "}
                    </span>
                    <span>
                      ₱{" "}
                      {prod.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </span>
                  </td>
                ) : prod.unit === unit.roll ? (
                  <td>
                    <span>
                      ₱{" "}
                      {prod.price.roll.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Roll,{" "}
                    </span>
                    <span>
                      ₱{" "}
                      {prod.price.meter.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Meter
                    </span>
                  </td>
                ) : prod.unit === unit.set ? (
                  <td>
                    <span>
                      ₱{" "}
                      {prod.price.set.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Set,{" "}
                    </span>
                    <span>
                      ₱{" "}
                      {prod.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </span>
                  </td>
                ) : prod.unit === unit.bundle ? (
                  <td>
                    <span>
                      ₱{" "}
                      {prod.price.bundle.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Bundle,{" "}
                    </span>
                    <span>
                      ₱{" "}
                      {prod.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </span>
                  </td>
                ) : (
                  <td>
                    ₱{" "}
                    {prod.price.toLocaleString("en", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    / Pcs
                  </td>
                )}
                {prod.unit === unit.pack ? (
                  <td>
                    <span>{prod.stocks.pack} Packs and </span>
                    <span>{prod.stocks.pcs} Pcs</span>
                  </td>
                ) : prod.unit === unit.box ? (
                  <td>
                    <span>{prod.stocks.box} Box's and </span>
                    <span>{prod.stocks.pcs} Pcs</span>
                  </td>
                ) : prod.unit === unit.roll ? (
                  <td>
                    <span>{prod.stocks.roll} Rolls and </span>
                    <span>{prod.stocks.meter} Meters</span>
                  </td>
                ) : prod.unit === unit.set ? (
                  <td>
                    <span>{prod.stocks.set} Sets and </span>
                    <span>{prod.stocks.pcs} Pcs</span>
                  </td>
                ) : prod.unit === unit.bundle ? (
                  <td>
                    <span>{prod.stocks.bundle} Bundles and </span>
                    <span>{prod.stocks.pcs} Pcs</span>
                  </td>
                ) : (
                  <td>{prod.stocks} Pcs</td>
                )}
                <td className="btn-flex">
                  <button className="view" title="view">
                    <HiOutlineEye />
                  </button>
                  <button className="upd" title="edit">
                    <BiSolidEdit />
                  </button>
                  <button
                    className="del"
                    title="delete"
                    onClick={() => deleteProd(prod.id)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={isModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body">
            <button className="modal-close" onClick={() => setIsModal(false)}>
              <RiCloseLine />
            </button>
            <div className="modal-content">
              <h3 className="modal-title">Add New Product</h3>
              <div className="modal-flex">
                <div className="modal-left">
                  <div className="img-preview">
                    <img id="img" alt="logo" src={logo} />
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
                  <div className="input-group w-100">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={pname}
                      onChange={(e) => setPname(e.target.value)}
                    />
                  </div>
                  <div className="input-group w-50">
                    <label>Category</label>
                    <select onChange={(e) => setCategory(e.target.value)}>
                      {categories.map((c, id) => (
                        <option key={id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group w-50">
                    <label>Unit</label>
                    <select onChange={(e) => setActiveUnit(e.target.value)}>
                      {units.map((u, id) => (
                        <option key={id}>{u}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pcs */}

                  <div
                    className={
                      activeUnit === "Piece"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Piece</label>
                      <input
                        type="number"
                        value={qtyPcs}
                        onChange={(e) => setQtyPcs(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalPcs}
                        onChange={(e) => setCapitalPcs(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={pcsSpPcs}
                        onChange={(e) => setPcsSpPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pack */}

                  <div
                    className={
                      activeUnit === "Pack"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Pack</label>
                      <input
                        type="number"
                        value={qtyPack}
                        onChange={(e) => setQtyPack(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs</label>
                      <input
                        type="number"
                        value={packQtyPcs}
                        onChange={(e) => setPackQtyPcs(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs Per Pack</label>
                      <input
                        type="number"
                        value={pcsPerPack}
                        onChange={(e) => setPcsPerPack(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Pack</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalPack}
                        onChange={(e) => setCapitalPack(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Pack</label>
                      <input
                        className="money"
                        type="number"
                        value={spPack}
                        onChange={(e) => setSpPack(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={spPackPcs}
                        onChange={(e) => setSpPackPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Box */}

                  <div
                    className={
                      activeUnit === "Box"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Box</label>
                      <input
                        type="number"
                        value={qtyBox}
                        onChange={(e) => setQtyBox(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs</label>
                      <input
                        type="number"
                        value={boxQtyPcs}
                        onChange={(e) => setBoxQtyPcs(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs Per Box</label>
                      <input
                        type="number"
                        value={pcsPerBox}
                        onChange={(e) => setPcsPerBox(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Box</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalBox}
                        onChange={(e) => setCapitalBox(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Box</label>
                      <input
                        className="money"
                        type="number"
                        value={spBox}
                        onChange={(e) => setSpBox(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={spBoxPcs}
                        onChange={(e) => setSpBoxPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Roll */}

                  <div
                    className={
                      activeUnit === "Roll"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Roll</label>
                      <input
                        type="number"
                        value={qtyRoll}
                        onChange={(e) => setQtyRoll(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Meter</label>
                      <input
                        type="number"
                        value={qtyMeter}
                        onChange={(e) => setQtyMeter(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Meter Per Roll</label>
                      <input
                        type="number"
                        value={meterPerRoll}
                        onChange={(e) => setMeterPerRoll(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Roll</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalRoll}
                        onChange={(e) => setCapitalRoll(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Roll</label>
                      <input
                        className="money"
                        type="number"
                        value={spRoll}
                        onChange={(e) => setSpRoll(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Meter</label>
                      <input
                        className="money"
                        type="number"
                        value={spMeter}
                        onChange={(e) => setSpMeter(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Set */}

                  <div
                    className={
                      activeUnit === "Set"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Set</label>
                      <input
                        type="number"
                        value={qtySet}
                        onChange={(e) => setQtySet(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece</label>
                      <input
                        type="number"
                        value={qtySetPcs}
                        onChange={(e) => setQtySetPcs(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece Per Set</label>
                      <input
                        type="number"
                        value={pcsPerSet}
                        onChange={(e) => setPcsPerSet(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Set</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalSet}
                        onChange={(e) => setCapitalSet(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Set</label>
                      <input
                        className="money"
                        type="number"
                        value={spSet}
                        onChange={(e) => setSpSet(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={spSetPcs}
                        onChange={(e) => setSpSetPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pair */}

                  <div
                    className={
                      activeUnit === "Pair"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Pair</label>
                      <input
                        type="number"
                        value={qtyPair}
                        onChange={(e) => setQtyPair(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Pair</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalPair}
                        onChange={(e) => setCapitalPair(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Pair</label>
                      <input
                        className="money"
                        type="number"
                        value={spPair}
                        onChange={(e) => setSpPair(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bundle */}

                  <div
                    className={
                      activeUnit === "Bundle"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-30">
                      <label>Qty Bundle</label>
                      <input
                        type="number"
                        value={qtyBundle}
                        onChange={(e) => setQtyBundle(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece</label>
                      <input
                        type="number"
                        value={qtyBundlePcs}
                        onChange={(e) => setQtyBundlePcs(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece Per Bundle</label>
                      <input
                        type="number"
                        value={pcsPerBundle}
                        onChange={(e) => setPcsPerBundle(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Bundle</label>
                      <input
                        className="money"
                        type="number"
                        value={capitalBundle}
                        onChange={(e) => setCapitalBundle(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Bundle</label>
                      <input
                        className="money"
                        type="number"
                        value={spBundle}
                        onChange={(e) => setSpBundle(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={spBundlePcs}
                        onChange={(e) => setSpBundlePcs(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-container w-100">
                    <button id="pbtn" onClick={() => uploadImage()}>
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Products;
