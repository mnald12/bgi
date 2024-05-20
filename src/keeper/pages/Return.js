import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../db/config";
import { RiCloseLine } from "react-icons/ri";
import Loader from "../../admin/components/Loader";
import Select from "react-select";
import moment from "moment";

const Return = () => {
  const [returns, setReturns] = useState([]);
  const [products, setProducts] = useState([]);

  const [isLoaded, setIsloaded] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const unit = {
    piece: "Piece",
    pack: "Pack",
    box: "Box",
    roll: "Roll",
    set: "Set",
    pair: "Pair",
    bundle: "Bundle",
  };

  const [activeProd, setActiveProd] = useState({});
  const [customer, setCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [action, setAction] = useState("");

  const [qtyPcs, setQtyPcs] = useState(0);
  const [qtyPack, setQtyPack] = useState(0);
  const [qtyPackPcs, setQtyPackPcs] = useState(0);
  const [qtyBox, setQtyBox] = useState(0);
  const [qtyBoxPcs, setQtyBoxPcs] = useState(0);
  const [qtyRoll, setQtyRoll] = useState(0);
  const [qtyMeter, setQtyMeter] = useState(0);
  const [qtySet, setQtySet] = useState(0);
  const [qtySetPcs, setQtySetPcs] = useState(0);
  const [qtyPair, setQtyPair] = useState(0);
  const [qtyBundle, setQtyBundle] = useState(0);
  const [qtyBundlePcs, setQtyBundlePcs] = useState(0);

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const getProds = async () => {
      const q = query(collection(db, "products"), orderBy("productName"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setProducts(prods);
    };

    getProds();

    const get = async () => {
      const q = query(collection(db, "returns"));
      const querySnapshot = await getDocs(q);
      const res = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setReturns(res);
    };
    get();

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const options = () => {
    const opts = [];
    for (let i of products) {
      opts.push({
        value: i.id,
        label: i.productName,
      });
    }
    return opts;
  };

  const problemOptions = () => {
    const opts = [
      {
        value: "Damaged",
        label: "Damaged",
      },
      {
        value: "Defective",
        label: "Defective",
      },
    ];
    return opts;
  };

  const actionOptions = () => {
    const opts = [
      {
        value: "Replace",
        label: "Replace",
      },
      {
        value: "Repair",
        label: "Repair",
      },
    ];
    return opts;
  };

  const getProd = (id) => {
    for (let i of products) {
      if (id === i.id) {
        setActiveProd(i);
        break;
      }
    }
  };

  const saveReturn = async () => {
    if (customer === "") {
      document.getElementById("noname").classList.remove("d-none");
      setTimeout(() => {
        document.getElementById("noname").classList.add("d-none");
      }, 2000);
      return;
    }
    if (activeProd.unit === unit.piece) {
      if (action === "Replace") {
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: activeProd.stocks - +qtyPcs,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: +qtyPcs,
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: +qtyPcs,
          date: moment().format("LLL"),
        },
      ]);
    } else if (activeProd.unit === unit.pack) {
      if (action === "Replace") {
        const newStocks = {
          pack: activeProd.stocks.pack,
          pcs: activeProd.stocks.pcs,
        };
        if (newStocks.pcs >= +qtyPackPcs) {
          newStocks.pack = newStocks.pack - +qtyPack;
          newStocks.pcs = newStocks.pcs - +qtyPackPcs;
        } else {
          newStocks.pack = newStocks.pack - 1;
          newStocks.pcs = newStocks.pcs + activeProd.pcsPerPack;
          newStocks.pack = newStocks.pack - +qtyPack;
          newStocks.pcs = newStocks.pcs - +qtyPackPcs;
        }
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: newStocks,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: {
          pack: +qtyPack,
          pcs: +qtyPackPcs,
        },
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: {
            pack: +qtyPack,
            pcs: +qtyPackPcs,
          },
          date: moment().format("LLL"),
        },
      ]);
    } else if (activeProd.unit === unit.box) {
      if (action === "Replace") {
        const newStocks = {
          box: activeProd.stocks.box,
          pcs: activeProd.stocks.pcs,
        };
        if (newStocks.pcs >= +qtyBoxPcs) {
          newStocks.box = newStocks.box - +qtyBox;
          newStocks.pcs = newStocks.pcs - +qtyBoxPcs;
        } else {
          newStocks.box = newStocks.box - 1;
          newStocks.pcs = newStocks.pcs + activeProd.pcsPerBox;
          newStocks.box = newStocks.box - +qtyBox;
          newStocks.pcs = newStocks.pcs - +qtyBoxPcs;
        }
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: newStocks,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: {
          box: +qtyBox,
          pcs: +qtyBoxPcs,
        },
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: {
            box: +qtyBox,
            pcs: +qtyBoxPcs,
          },
          date: moment().format("LLL"),
        },
      ]);
    } else if (activeProd.unit === unit.roll) {
      if (action === "Replace") {
        const newStocks = {
          roll: activeProd.stocks.roll,
          meter: activeProd.stocks.meter,
        };
        if (newStocks.meter >= +qtyMeter) {
          newStocks.roll = newStocks.roll - +qtyRoll;
          newStocks.meter = newStocks.meter - +qtyMeter;
        } else {
          newStocks.roll = newStocks.roll - 1;
          newStocks.meter = newStocks.meter + activeProd.meterPerRoll;
          newStocks.roll = newStocks.roll - +qtyRoll;
          newStocks.meter = newStocks.meter - +qtyMeter;
        }
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: newStocks,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: {
          roll: +qtyRoll,
          meter: +qtyMeter,
        },
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: {
            roll: +qtyRoll,
            meter: +qtyMeter,
          },
          date: moment().format("LLL"),
        },
      ]);
    } else if (activeProd.unit === unit.set) {
      if (action === "Replace") {
        const newStocks = {
          set: activeProd.stocks.set,
          pcs: activeProd.stocks.pcs,
        };
        if (newStocks.pcs >= +qtySetPcs) {
          newStocks.set = newStocks.set - +qtySet;
          newStocks.pcs = newStocks.pcs - +qtySetPcs;
        } else {
          newStocks.set = newStocks.set - 1;
          newStocks.pcs = newStocks.pcs + activeProd.pcsPerSet;
          newStocks.set = newStocks.set - +qtySet;
          newStocks.pcs = newStocks.pcs - +qtySetPcs;
        }
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: newStocks,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: {
          set: +qtySet,
          pcs: +qtySetPcs,
        },
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: {
            set: +qtySet,
            pcs: +qtySetPcs,
          },
          date: moment().format("LLL"),
        },
      ]);
    } else if (activeProd.unit === unit.pair) {
      if (action === "Replace") {
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: activeProd.stocks - +qtyPair,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: +qtyPair,
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: +qtyPair,
          date: moment().format("LLL"),
        },
      ]);
    } else if (activeProd.unit === unit.bundle) {
      if (action === "Replace") {
        const newStocks = {
          bundle: activeProd.stocks.bundle,
          pcs: activeProd.stocks.pcs,
        };
        if (newStocks.pcs >= +qtyBundlePcs) {
          newStocks.bundle = newStocks.bundle - +qtyBundle;
          newStocks.pcs = newStocks.pcs - +qtyBundlePcs;
        } else {
          newStocks.bundle = newStocks.bundle - 1;
          newStocks.pcs = newStocks.pcs + activeProd.pcsPerBundle;
          newStocks.bundle = newStocks.bundle - +qtyBundle;
          newStocks.pcs = newStocks.pcs - +qtyBundlePcs;
        }
        await updateDoc(doc(db, "products", activeProd.id), {
          stocks: newStocks,
        });
      }
      const retRefs = collection(db, "returns");
      const newRet = await addDoc(retRefs, {
        unit: activeProd.unit,
        customer: customer,
        productName: activeProd.productName,
        problem: problem,
        action: action,
        qty: {
          bundle: +qtyBundle,
          pcs: +qtyBundlePcs,
        },
        date: moment().format("LLL"),
      });
      setReturns((prev) => [
        ...prev,
        {
          id: newRet.id,
          unit: activeProd.unit,
          customer: customer,
          productName: activeProd.productName,
          problem: problem,
          action: action,
          qty: {
            bundle: +qtyBundle,
            pcs: +qtyBundlePcs,
          },
          date: moment().format("LLL"),
        },
      ]);
    }
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

  if (isLoaded) {
    return (
      <div className="returns">
        <div className="page-header">
          <h3 className="page-title">Return product</h3>
          <div className="search-bars">
            <input
              id="searchs"
              type="search"
              placeholder="Search products here..."
              onKeyUp={(e) => searchTable(e)}
              onChange={(e) => searchTable(e)}
            />
            <button className="add-bar" onClick={() => setIsModal(true)}>
              Return product
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Problem</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {returns.map((res, id) => (
              <tr key={id}>
                <td>{res.customer}</td>
                <td>{res.productName}</td>
                {res.unit === unit.pack ? (
                  <td>
                    <span>{res.qty.pack} Packs and </span>
                    <span>{res.qty.pcs} Pcs</span>
                  </td>
                ) : res.unit === unit.box ? (
                  <td>
                    <span>{res.qty.box} Box's and </span>
                    <span>{res.qty.pcs} Pcs</span>
                  </td>
                ) : res.unit === unit.roll ? (
                  <td>
                    <span>{res.qty.roll} Rolls and </span>
                    <span>{res.qty.meter} Meters</span>
                  </td>
                ) : res.unit === unit.set ? (
                  <td>
                    <span>{res.qty.set} Sets and </span>
                    <span>{res.qty.pcs} Pcs</span>
                  </td>
                ) : res.unit === unit.bundle ? (
                  <td>
                    <span>{res.qty.bundle} Bundles and </span>
                    <span>{res.qty.pcs} Pcs</span>
                  </td>
                ) : (
                  <td>{res.qty} Pcs</td>
                )}
                <td>{res.problem}</td>
                <td>{res.action}</td>
                <td>{res.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={isModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button className="modal-close" onClick={() => setIsModal(false)}>
              <RiCloseLine />
            </button>
            <h3 className="modal-title">Return Product</h3>

            <div className="input-group w-100">
              <label>Product</label>
              <Select
                options={options()}
                onChange={(e) => {
                  getProd(e.value);
                  setIsDisabled(false);
                }}
              />
            </div>
            <div
              className="input-group w-100 mt-12px"
              style={{ position: "relative" }}
            >
              <p
                id="noname"
                className="d-none color-red"
                style={{ position: "absolute", left: "5px", top: "33px" }}
              >
                The customer name cannot be left empty
              </p>
              <label>Customer Name</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>

            <div className="input-group w-100 mt-12px">
              <label>Problem</label>
              <Select
                options={problemOptions()}
                onChange={(e) => {
                  setProblem(e.value);
                  setIsDisabled(false);
                }}
              />
            </div>

            <div className="input-group w-100 mt-12px">
              <label>Action</label>
              <Select
                options={actionOptions()}
                onChange={(e) => {
                  setAction(e.value);
                  setIsDisabled(false);
                }}
              />
            </div>

            <div className={activeProd.unit === unit.piece ? "" : "d-none"}>
              <div className="input-group w-100 mt-12px">
                <label>Qty Pcs</label>
                <input
                  type="number"
                  value={qtyPcs}
                  onChange={(e) => setQtyPcs(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                activeProd.unit === unit.pack ? "d-flex gap-10px" : "d-none"
              }
            >
              <div className="input-group w-50 mt-12px">
                <label>Qty Pack</label>
                <input
                  type="number"
                  value={qtyPack}
                  onChange={(e) => setQtyPack(e.target.value)}
                />
              </div>
              <div className="input-group w-50 mt-12px">
                <label>Qty Pcs</label>
                <input
                  type="number"
                  value={qtyPackPcs}
                  onChange={(e) => setQtyPackPcs(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                activeProd.unit === unit.box ? "d-flex gap-10px" : "d-none"
              }
            >
              <div className="input-group w-50 mt-12px">
                <label>Qty Box</label>
                <input
                  type="number"
                  value={qtyBox}
                  onChange={(e) => setQtyBox(e.target.value)}
                />
              </div>
              <div className="input-group w-50 mt-12px">
                <label>Qty Pcs</label>
                <input
                  type="number"
                  value={qtyBoxPcs}
                  onChange={(e) => setQtyBoxPcs(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                activeProd.unit === unit.roll ? "d-flex gap-10px" : "d-none"
              }
            >
              <div className="input-group w-50 mt-12px">
                <label>Qty Roll</label>
                <input
                  type="number"
                  value={qtyRoll}
                  onChange={(e) => setQtyRoll(e.target.value)}
                />
              </div>
              <div className="input-group w-50 mt-12px">
                <label>Qty Meter</label>
                <input
                  type="number"
                  value={qtyMeter}
                  onChange={(e) => setQtyMeter(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                activeProd.unit === unit.set ? "d-flex gap-10px" : "d-none"
              }
            >
              <div className="input-group w-50 mt-12px">
                <label>Qty Set</label>
                <input
                  type="number"
                  value={qtySet}
                  onChange={(e) => setQtySet(e.target.value)}
                />
              </div>
              <div className="input-group w-50 mt-12px">
                <label>Qty Pcs</label>
                <input
                  type="number"
                  value={qtySetPcs}
                  onChange={(e) => setQtySetPcs(e.target.value)}
                />
              </div>
            </div>
            <div className={activeProd.unit === unit.pair ? "" : "d-none"}>
              <div className="input-group w-100 mt-12px">
                <label>Qty Pair</label>
                <input
                  type="number"
                  value={qtyPair}
                  onChange={(e) => setQtyPair(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                activeProd.unit === unit.bundle ? "d-flex gap-10px" : "d-none"
              }
            >
              <div className="input-group w-50 mt-12px">
                <label>Qty Bundle</label>
                <input
                  type="number"
                  value={qtyBundle}
                  onChange={(e) => setQtyBundle(e.target.value)}
                />
              </div>
              <div className="input-group w-50 mt-12px">
                <label>Qty Pcs</label>
                <input
                  type="number"
                  value={qtyBundlePcs}
                  onChange={(e) => setQtyBundlePcs(e.target.value)}
                />
              </div>
            </div>

            <div className="w-100 text-right">
              <button
                className="cbtn"
                onClick={() => saveReturn()}
                disabled={isDisabled ? true : false}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Return;
