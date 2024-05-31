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

  const [activeSales, setActiveSales] = useState({});
  const [activeProd, setActiveProd] = useState({});
  const [customer, setCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [action, setAction] = useState("");

  const [isOk, setIsOk] = useState(false);
  const [recieptId, setRecieptId] = useState("");
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
  const [ids, setIds] = useState([]);

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
    for (let i of ids) {
      for (let p of products) {
        if (p.id === i) {
          opts.push({
            value: p.id,
            label: p.productName,
          });
          break;
        }
      }
    }
    return opts;
  };

  const countOptions = () => {
    const opts = [[], []];
    for (let i of activeSales.data) {
      if (i.prodId === activeProd.id) {
        if (i.unit === unit.piece) {
          for (let q = 1; q <= i.qty; q++) {
            opts[0].push({
              value: q,
              label: `${q} Pcs`,
            });
          }
        } else if (i.unit === unit.pair) {
          for (let q = 1; q <= i.qty; q++) {
            opts[0].push({
              value: q,
              label: `${q} Pair`,
            });
          }
        } else if (i.unit === unit.pack) {
          for (let q = 1; q <= i.qty.pack; q++) {
            opts[0].push({
              value: q,
              label: `${q} Pack`,
            });
          }
          for (let q = 1; q <= i.qty.pcs; q++) {
            opts[1].push({
              value: q,
              label: `${q} Pcs`,
            });
          }
        } else if (i.unit === unit.box) {
          for (let q = 1; q <= i.qty.box; q++) {
            opts[0].push({
              value: q,
              label: `${q} Box`,
            });
          }
          for (let q = 1; q <= i.qty.pcs; q++) {
            opts[1].push({
              value: q,
              label: `${q} Pcs`,
            });
          }
        } else if (i.unit === unit.roll) {
          for (let q = 1; q <= i.qty.roll; q++) {
            opts[0].push({
              value: q,
              label: `${q} Roll`,
            });
          }
          for (let q = 1; q <= i.qty.meter; q++) {
            opts[1].push({
              value: q,
              label: `${q} Meter`,
            });
          }
        } else if (i.unit === unit.set) {
          for (let q = 1; q <= i.qty.set; q++) {
            opts[0].push({
              value: q,
              label: `${q} Set`,
            });
          }
          for (let q = 1; q <= i.qty.pcs; q++) {
            opts[1].push({
              value: q,
              label: `${q} Pcs`,
            });
          }
        } else if (i.unit === unit.bundle) {
          for (let q = 1; q <= i.qty.bundle; q++) {
            opts[0].push({
              value: q,
              label: `${q} Bundle`,
            });
          }
          for (let q = 1; q <= i.qty.pcs; q++) {
            opts[1].push({
              value: q,
              label: `${q} Pcs`,
            });
          }
        }
        break;
      }
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

  const checkId = async () => {
    const q = query(collection(db, "sales"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const sales = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    let isNotFound = true;

    for (let i of sales) {
      if (i.id === recieptId) {
        setActiveSales(i);
        const newIds = [];
        for (let p of i.data) {
          newIds.push(p.prodId);
        }
        setIds(newIds);
        setCustomer(i.customer);
        isNotFound = false;
        setIsOk(true);
        break;
      }
    }

    if (isNotFound) {
      document.getElementById("recid").classList.remove("d-none");
      setTimeout(() => {
        document.getElementById("recid").classList.add("d-none");
      }, 2000);
    }
  };

  const saveReturn = async () => {
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
    setIsOk(false);
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
          <div className="modal-body-return">
            <button
              className="modal-close"
              onClick={() => {
                setIsModal(false);
                setIsOk(false);
              }}
            >
              <RiCloseLine />
            </button>
            <h3 className="modal-title">Return Product</h3>

            {isOk ? (
              <>
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

                <div className="d-flex mt-12px" style={{ gap: "10px" }}>
                  <div className="input-group w-50">
                    <label>Problem</label>
                    <Select
                      options={problemOptions()}
                      onChange={(e) => {
                        setProblem(e.value);
                        setIsDisabled(false);
                      }}
                    />
                  </div>

                  <div className="input-group w-50">
                    <label>Action</label>
                    <Select
                      options={actionOptions()}
                      onChange={(e) => {
                        setAction(e.value);
                        setIsDisabled(false);
                      }}
                    />
                  </div>
                </div>

                <div className={activeProd.unit === unit.piece ? "" : "d-none"}>
                  <div className="counter-select-field mt-12px">
                    <div className="field-form">
                      <label>Qty Pcs : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtyPcs(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={activeProd.unit === unit.pack ? "" : "d-none"}>
                  <div
                    className={
                      countOptions()[0].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Pack : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtyPack(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      countOptions()[1].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Pcs : </label>
                      <Select
                        className="selects"
                        options={countOptions()[1]}
                        onChange={(e) => {
                          setQtyPackPcs(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={activeProd.unit === unit.box ? "" : "d-none"}>
                  <div
                    className={
                      countOptions()[0].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Box : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtyBox(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      countOptions()[1].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Pcs : </label>
                      <Select
                        className="selects"
                        options={countOptions()[1]}
                        onChange={(e) => {
                          setQtyBoxPcs(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={activeProd.unit === unit.roll ? "" : "d-none"}>
                  <div
                    className={
                      countOptions()[0].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Roll : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtyRoll(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      countOptions()[1].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Meter : </label>
                      <Select
                        className="selects"
                        options={countOptions()[1]}
                        onChange={(e) => {
                          setQtyMeter(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={activeProd.unit === unit.set ? "" : "d-none"}>
                  <div
                    className={
                      countOptions()[0].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Set : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtySet(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      countOptions()[1].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Pcs : </label>
                      <Select
                        className="selects"
                        options={countOptions()[1]}
                        onChange={(e) => {
                          setQtySetPcs(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={activeProd.unit === unit.pair ? "" : "d-none"}>
                  <div className="counter-select-field mt-12px">
                    <div className="field-form">
                      <label>Qty Pair : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtyPair(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={activeProd.unit === unit.bundle ? "" : "d-none"}
                >
                  <div
                    className={
                      countOptions()[0].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Bundle : </label>
                      <Select
                        className="selects"
                        options={countOptions()[0]}
                        onChange={(e) => {
                          setQtyBundle(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      countOptions()[1].length > 0
                        ? "counter-select-field mt-12px"
                        : "d-none"
                    }
                  >
                    <div className="field-form">
                      <label>Qty Pcs : </label>
                      <Select
                        className="selects"
                        options={countOptions()[1]}
                        onChange={(e) => {
                          setQtyBundlePcs(e.value);
                        }}
                      />
                    </div>
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
              </>
            ) : (
              <>
                <div>
                  <p id="recid" className="d-none color-red">
                    Receipt ID does not exist!
                  </p>
                  <div className="input-group w-100 mt-12px">
                    <label>Receipt ID :</label>
                    <input
                      type="text"
                      value={recieptId}
                      onChange={(e) => setRecieptId(e.target.value)}
                      placeholder="Please enter receipt id"
                    />
                  </div>

                  <div className="w-100 text-right">
                    <button className="cbtn" onClick={() => checkId()}>
                      Sumbit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Return;
