import { useEffect, useState } from "react";
import "../css/counter.css";
import "../css/modal.css";
import { RiCloseLine } from "react-icons/ri";
import Loader from "../components/Loader";
import { FaPlus } from "react-icons/fa6";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../db/config";
import Select from "react-select";
import moment from "moment";

const Counter = () => {
  const unit = {
    piece: "Piece",
    pack: "Pack",
    box: "Box",
    roll: "Roll",
    set: "Set",
    pair: "Pair",
    bundle: "Bundle",
  };

  const [isLoaded, setIsloaded] = useState(false);
  const [products, setProducts] = useState([]);

  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);

  const [customer, setCustomer] = useState("");
  const [sales, setSales] = useState([]);

  const [qtyPiece, setQtyPiece] = useState(0);
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

  const options2 = (count, unit) => {
    const opts = [];
    for (let i = 0; i < count; i++) {
      opts.push({
        value: i,
        label: `${i} ${unit}`,
      });
    }
    return opts;
  };

  const options = (count, unit) => {
    const opts = [];
    for (let i = 0; i <= count; i++) {
      opts.push({
        value: i,
        label: `${i} ${unit}`,
      });
    }
    return opts;
  };

  const add = (data) => {
    setData(data);
    setIsModal(true);
  };

  useEffect(() => {
    const get = async () => {
      const q = query(collection(db, "products"), orderBy("productName"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setProducts(prods);
      setData(prods[0]);
    };
    get();
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const [fieldData, setFieldData] = useState([]);

  const saveSale = async () => {
    if (customer === "") {
      document.getElementById("pn").classList.remove("d-none");

      setTimeout(() => {
        document.getElementById("pn").classList.add("d-none");
      }, 2000);

      return;
    }

    setIsloaded(false);

    const newSalesData = [];

    for (let i of sales) {
      if (i.unit === unit.piece) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price - currentDoc.capital;
        const nIncome = i.qty * nc;

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: currentDoc.stocks - i.qty,
          sold: currentDoc.sold + i.qty,
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome,
        });
      } else if (i.unit === unit.pair) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price - currentDoc.capital;
        const nIncome = i.qty * nc;

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: currentDoc.stocks - i.qty,
          sold: currentDoc.sold + i.qty,
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome,
        });
      } else if (i.unit === unit.pack) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price.pack - currentDoc.capital;
        const cap2 = currentDoc.capital / currentDoc.pcsPerPack;
        const nc2 = currentDoc.price.pcs - cap2;
        const nIncome1 = i.qty.pack * nc;
        const nIncome2 = i.qty.pcs * nc2;

        const newSold = {
          pack: 0,
          pcs: 0,
        };

        if (currentDoc.sold.pcs + i.qty.pcs === currentDoc.pcsPerPack) {
          newSold.pack = currentDoc.sold.pack + i.qty.pack + 1;
          newSold.pcs = 0;
        } else if (currentDoc.sold.pcs + i.qty.pcs > currentDoc.pcsPerPack) {
          const diff = currentDoc.sold.pcs + i.qty.pcs - currentDoc.pcsPerPack;
          newSold.pack = currentDoc.sold.pack + i.qty.pack + 1;
          newSold.pcs = diff;
        } else if (currentDoc.sold.pcs + i.qty.pcs < currentDoc.pcsPerPack) {
          newSold.pack = currentDoc.sold.pack + i.qty.pack;
          newSold.pcs = currentDoc.sold.pcs + i.qty.pcs;
        }

        const newStocks = {
          pack: 0,
          pcs: 0,
        };

        if (i.qty.pack > 0 && i.qty.pcs > 0) {
          newStocks.pack = currentDoc.stocks.pack - i.qty.pack;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.pack = newStocks.pack - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerPack - i.qty.pcs;
            newStocks.pcs = diff;
          }
        } else if (i.qty.pack > 0 && i.qty.pcs <= 0) {
          newStocks.pack = currentDoc.stocks.pack - i.qty.pack;
          newStocks.pcs = currentDoc.stocks.pcs;
        } else if (i.qty.pack <= 0 && i.qty.pcs > 0) {
          newStocks.pack = currentDoc.stocks.pack;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.pack = newStocks.pack - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerPack - i.qty.pcs;
            newStocks.pcs = diff;
          }
        }

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: {
            pack: newStocks.pack,
            pcs: newStocks.pcs,
          },
          sold: {
            pack: newSold.pack,
            pcs: newSold.pcs,
          },
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome1 + nIncome2,
        });
      } else if (i.unit === unit.box) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price.box - currentDoc.capital;
        const cap2 = currentDoc.capital / currentDoc.pcsPerBox;
        const nc2 = currentDoc.price.pcs - cap2;
        const nIncome1 = i.qty.box * nc;
        const nIncome2 = i.qty.pcs * nc2;

        const newSold = {
          box: 0,
          pcs: 0,
        };

        if (currentDoc.sold.pcs + i.qty.pcs === currentDoc.pcsPerBox) {
          newSold.box = currentDoc.sold.box + i.qty.box + 1;
          newSold.pcs = 0;
        } else if (currentDoc.sold.pcs + i.qty.pcs > currentDoc.pcsPerBox) {
          const diff = currentDoc.sold.pcs + i.qty.pcs - currentDoc.pcsPerBox;
          newSold.box = currentDoc.sold.box + i.qty.box + 1;
          newSold.pcs = diff;
        } else if (currentDoc.sold.pcs + i.qty.pcs < currentDoc.pcsPerBox) {
          newSold.box = currentDoc.sold.box + i.qty.box;
          newSold.pcs = currentDoc.sold.pcs + i.qty.pcs;
        }

        const newStocks = {
          box: 0,
          pcs: 0,
        };

        if (i.qty.box > 0 && i.qty.pcs > 0) {
          newStocks.box = currentDoc.stocks.box - i.qty.box;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.box = newStocks.box - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerBox - i.qty.pcs;
            newStocks.pcs = diff;
          }
        } else if (i.qty.box > 0 && i.qty.pcs <= 0) {
          newStocks.box = currentDoc.stocks.box - i.qty.box;
          newStocks.pcs = currentDoc.stocks.pcs;
        } else if (i.qty.box <= 0 && i.qty.pcs > 0) {
          newStocks.box = currentDoc.stocks.box;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.box = newStocks.box - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerBox - i.qty.pcs;
            newStocks.pcs = diff;
          }
        }

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: {
            box: newStocks.box,
            pcs: newStocks.pcs,
          },
          sold: {
            box: newSold.box,
            pcs: newSold.pcs,
          },
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome1 + nIncome2,
        });
      } else if (i.unit === unit.roll) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price.roll - currentDoc.capital;
        const cap2 = currentDoc.capital / currentDoc.meterPerRoll;
        const nc2 = currentDoc.price.meter - cap2;
        const nIncome1 = i.qty.roll * nc;
        const nIncome2 = i.qty.meter * nc2;

        const newSold = {
          roll: 0,
          meter: 0,
        };

        if (currentDoc.sold.meter + i.qty.meter === currentDoc.meterPerRoll) {
          newSold.roll = currentDoc.sold.roll + i.qty.roll + 1;
          newSold.meter = 0;
        } else if (
          currentDoc.sold.meter + i.qty.meter >
          currentDoc.meterPerRoll
        ) {
          const diff =
            currentDoc.sold.meter + i.qty.meter - currentDoc.meterPerRoll;
          newSold.roll = currentDoc.sold.roll + i.qty.roll + 1;
          newSold.meter = diff;
        } else if (
          currentDoc.sold.meter + i.qty.meter <
          currentDoc.meterPerRoll
        ) {
          newSold.roll = currentDoc.sold.roll + i.qty.roll;
          newSold.meter = currentDoc.sold.meter + i.qty.meter;
        }

        const newStocks = {
          roll: 0,
          meter: 0,
        };

        if (i.qty.roll > 0 && i.qty.meter > 0) {
          newStocks.roll = currentDoc.stocks.roll - i.qty.roll;
          if (currentDoc.stocks.meter > i.qty.meter) {
            newStocks.meter = currentDoc.stocks.meter - i.qty.meter;
          } else {
            newStocks.roll = newStocks.roll - 1;
            const diff =
              currentDoc.stocks.meter + currentDoc.meterPerRoll - i.qty.meter;
            newStocks.meter = diff;
          }
        } else if (i.qty.roll > 0 && i.qty.meter <= 0) {
          newStocks.roll = currentDoc.stocks.roll - i.qty.roll;
          newStocks.meter = currentDoc.stocks.meter;
        } else if (i.qty.roll <= 0 && i.qty.meter > 0) {
          newStocks.roll = currentDoc.stocks.roll;
          if (currentDoc.stocks.meter > i.qty.meter) {
            newStocks.meter = currentDoc.stocks.meter - i.qty.meter;
          } else {
            newStocks.roll = newStocks.roll - 1;
            const diff =
              currentDoc.stocks.meter + currentDoc.meterPerRoll - i.qty.meter;
            newStocks.meter = diff;
          }
        }

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: {
            roll: newStocks.roll,
            meter: newStocks.meter,
          },
          sold: {
            roll: newSold.roll,
            meter: newSold.meter,
          },
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome1 + nIncome2,
        });
      } else if (i.unit === unit.set) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price.set - currentDoc.capital;
        const cap2 = currentDoc.capital / currentDoc.pcsPerSet;
        const nc2 = currentDoc.price.pcs - cap2;
        const nIncome1 = i.qty.set * nc;
        const nIncome2 = i.qty.pcs * nc2;

        const newSold = {
          set: 0,
          pcs: 0,
        };

        if (currentDoc.sold.pcs + i.qty.pcs === currentDoc.pcsPerSet) {
          newSold.set = currentDoc.sold.set + i.qty.set + 1;
          newSold.pcs = 0;
        } else if (currentDoc.sold.pcs + i.qty.pcs > currentDoc.pcsPerSet) {
          const diff = currentDoc.sold.pcs + i.qty.pcs - currentDoc.pcsPerSet;
          newSold.set = currentDoc.sold.set + i.qty.set + 1;
          newSold.pcs = diff;
        } else if (currentDoc.sold.pcs + i.qty.pcs < currentDoc.pcsPerSet) {
          newSold.set = currentDoc.sold.set + i.qty.set;
          newSold.pcs = currentDoc.sold.pcs + i.qty.pcs;
        }

        const newStocks = {
          set: 0,
          pcs: 0,
        };

        if (i.qty.set > 0 && i.qty.pcs > 0) {
          newStocks.set = currentDoc.stocks.set - i.qty.set;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.set = newStocks.set - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerSet - i.qty.pcs;
            newStocks.pcs = diff;
          }
        } else if (i.qty.set > 0 && i.qty.pcs <= 0) {
          newStocks.set = currentDoc.stocks.set - i.qty.set;
          newStocks.pcs = currentDoc.stocks.pcs;
        } else if (i.qty.set <= 0 && i.qty.pcs > 0) {
          newStocks.set = currentDoc.stocks.set;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.set = newStocks.set - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerSet - i.qty.pcs;
            newStocks.pcs = diff;
          }
        }

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: {
            set: newStocks.set,
            pcs: newStocks.pcs,
          },
          sold: {
            set: newSold.set,
            pcs: newSold.pcs,
          },
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome1 + nIncome2,
        });
      } else if (i.unit === unit.bundle) {
        const docRef = doc(db, "products", i.prodId);
        const docSnap = await getDoc(docRef);
        const currentDoc = docSnap.data();

        const nc = currentDoc.price.bundle - currentDoc.capital;
        const cap2 = currentDoc.capital / currentDoc.pcsPerBundle;
        const nc2 = currentDoc.price.pcs - cap2;
        const nIncome1 = i.qty.bundle * nc;
        const nIncome2 = i.qty.pcs * nc2;

        const newSold = {
          box: 0,
          pcs: 0,
        };

        if (currentDoc.sold.pcs + i.qty.pcs === currentDoc.pcsPerBundle) {
          newSold.bundle = currentDoc.sold.bundle + i.qty.bundle + 1;
          newSold.pcs = 0;
        } else if (currentDoc.sold.pcs + i.qty.pcs > currentDoc.pcsPerBundle) {
          const diff =
            currentDoc.sold.pcs + i.qty.pcs - currentDoc.pcsPerBundle;
          newSold.bundle = currentDoc.sold.bundle + i.qty.bundle + 1;
          newSold.pcs = diff;
        } else if (currentDoc.sold.pcs + i.qty.pcs < currentDoc.pcsPerBundle) {
          newSold.bundle = currentDoc.sold.bundle + i.qty.bundle;
          newSold.pcs = currentDoc.sold.pcs + i.qty.pcs;
        }

        const newStocks = {
          box: 0,
          pcs: 0,
        };

        if (i.qty.bundle > 0 && i.qty.pcs > 0) {
          newStocks.bundle = currentDoc.stocks.bundle - i.qty.bundle;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.bundle = newStocks.bundle - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerBundle - i.qty.pcs;
            newStocks.pcs = diff;
          }
        } else if (i.qty.bundle > 0 && i.qty.pcs <= 0) {
          newStocks.bundle = currentDoc.stocks.bundle - i.qty.bundle;
          newStocks.pcs = currentDoc.stocks.pcs;
        } else if (i.qty.bundle <= 0 && i.qty.pcs > 0) {
          newStocks.bundle = currentDoc.stocks.bundle;
          if (currentDoc.stocks.pcs > i.qty.pcs) {
            newStocks.pcs = currentDoc.stocks.pcs - i.qty.pcs;
          } else {
            newStocks.bundle = newStocks.bundle - 1;
            const diff =
              currentDoc.stocks.pcs + currentDoc.pcsPerBundle - i.qty.pcs;
            newStocks.pcs = diff;
          }
        }

        await updateDoc(doc(db, "products", i.prodId), {
          stocks: {
            bundle: newStocks.bundle,
            pcs: newStocks.pcs,
          },
          sold: {
            bundle: newSold.bundle,
            pcs: newSold.pcs,
          },
          sales: currentDoc.sales + i.total,
          income: currentDoc.income + nIncome1 + nIncome2,
        });
      }

      const catRefs = doc(db, "categories", i.catId);
      const catSnap = await getDoc(catRefs);
      const currentCat = catSnap.data();

      await updateDoc(doc(db, "categories", i.catId), {
        sales: currentCat.sales + currentCat.sales + i.total,
      });

      newSalesData.push(i);
    }

    const q = query(collection(db, "products"), orderBy("productName"));
    const querySnapshot = await getDocs(q);
    const prods = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    const saleRef = collection(db, "sales");

    const newSale = await addDoc(saleRef, {
      customer: customer,
      date: moment().format("LLL"),
      sales: total,
      data: newSalesData,
    });

    if (newSale) {
      setProducts(prods);
      setData(prods[0]);
      setFieldData([]);
      setSales([]);
      setTotal(0);
      setIsloaded(true);
    }
  };

  const searchTable = (e) => {
    const lists = document
      .getElementById("btnlists")
      .querySelectorAll("button");
    const textToSearch = e.target.value.toUpperCase();
    for (let i of lists) {
      const text = i.innerText;
      if (text.toUpperCase().indexOf(textToSearch) > -1) i.style.display = "";
      else i.style.display = "none";
    }
  };

  if (isLoaded) {
    return (
      <div className="counter">
        <div className="counter-viewer">
          {fieldData.length !== 0 ? (
            <div>
              <div className="counter-viewer-header">
                <div className="input-field-counter">
                  <label>Customer Name : </label>
                  <p id="pn" className="color-red d-none">
                    Please enter customer name
                  </p>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>
                <div className="actions-field">
                  <button className="bg-red" onClick={() => setFieldData([])}>
                    Clear
                  </button>
                  <button className="bg-green" onClick={() => saveSale()}>
                    Save
                  </button>
                </div>
              </div>
              <table className="ctbl">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldData.map((f, k) => (
                    <tr key={k}>
                      <td>{f.prodName}</td>
                      <td>
                        {f.unit === unit.piece ? (
                          `${f.qty} Pcs`
                        ) : f.unit === unit.pack ? (
                          <>
                            {f.qty.pack > 0 && f.qty.pcs > 0
                              ? `${f.qty.pack} Pack & ${f.qty.pcs} Pcs`
                              : f.qty.pack > 0 && f.qty.pcs <= 0
                              ? `${f.qty.pack} Pack`
                              : `${f.qty.pcs} Pcs`}
                          </>
                        ) : f.unit === unit.box ? (
                          <>
                            {f.qty.box > 0 && f.qty.pcs > 0
                              ? `${f.qty.box} Box & ${f.qty.pcs} Pcs`
                              : f.qty.box > 0 && f.qty.pcs <= 0
                              ? `${f.qty.box} Box`
                              : `${f.qty.pcs} Pcs`}
                          </>
                        ) : f.unit === unit.roll ? (
                          <>
                            {f.qty.roll > 0 && f.qty.meter > 0
                              ? `${f.qty.roll} Roll & ${f.qty.meter} Meter`
                              : f.qty.roll > 0 && f.qty.meter <= 0
                              ? `${f.qty.roll} Roll`
                              : `${f.qty.meter} Meter`}
                          </>
                        ) : f.unit === unit.set ? (
                          <>
                            {f.qty.set > 0 && f.qty.pcs > 0
                              ? `${f.qty.set} Set & ${f.qty.pcs} Pcs`
                              : f.qty.set > 0 && f.qty.pcs <= 0
                              ? `${f.qty.set} Set`
                              : `${f.qty.pcs} Pcs`}
                          </>
                        ) : f.unit === unit.pair ? (
                          `${f.qty} Pair`
                        ) : f.unit === unit.bundle ? (
                          <>
                            {f.qty.bundle > 0 && f.qty.pcs > 0
                              ? `${f.qty.bundle} Bundle & ${f.qty.pcs} Pcs`
                              : f.qty.bundle > 0 && f.qty.pcs <= 0
                              ? `${f.qty.bundle} Bundle`
                              : `${f.qty.pcs} Pcs`}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {f.unit === unit.piece ? (
                          `₱${f.price.toLocaleString("en", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} / Pcs`
                        ) : f.unit === unit.pack ? (
                          <>
                            {f.qty.pack > 0 && f.qty.pcs > 0
                              ? `₱${f.price.pack.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Pack & ₱${f.price.pcs.toLocaleString(
                                  "en",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )} / Pcs`
                              : f.qty.pack > 0 && f.qty.pcs <= 0
                              ? `₱${f.price.pack.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Pack`
                              : `₱${f.price.pcs.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Pcs`}
                          </>
                        ) : f.unit === unit.box ? (
                          <>
                            {f.qty.box > 0 && f.qty.pcs > 0
                              ? `₱${f.price.box.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Box & ₱${f.price.pcs.toLocaleString(
                                  "en",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )} / Pcs`
                              : f.qty.box > 0 && f.qty.pcs <= 0
                              ? `₱${f.price.box.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Box`
                              : `₱${f.price.pcs.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Pcs`}
                          </>
                        ) : f.unit === unit.roll ? (
                          <>
                            {f.qty.roll > 0 && f.qty.meter > 0
                              ? `₱${f.price.roll.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Roll & ₱${f.price.meter.toLocaleString(
                                  "en",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )} / Meter`
                              : f.qty.roll > 0 && f.qty.meter <= 0
                              ? `₱${f.price.roll.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Roll`
                              : `₱${f.price.meter.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Meter`}
                          </>
                        ) : f.unit === unit.set ? (
                          <>
                            {f.qty.set > 0 && f.qty.pcs > 0
                              ? `₱${f.price.set.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Set & ₱${f.price.pcs.toLocaleString(
                                  "en",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )} / Pcs`
                              : f.qty.set > 0 && f.qty.pcs <= 0
                              ? `₱${f.price.set.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Set`
                              : `₱${f.price.pcs.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Pcs`}
                          </>
                        ) : f.unit === unit.pair ? (
                          `₱${f.price.toLocaleString("en", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} / Pair`
                        ) : f.unit === unit.bundle ? (
                          <>
                            {f.qty.bundle > 0 && f.qty.pcs > 0
                              ? `₱${f.price.bundle.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Bundle & ₱${f.price.pcs.toLocaleString(
                                  "en",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )} / Pcs`
                              : f.qty.bundle > 0 && f.qty.pcs <= 0
                              ? `₱${f.price.bundle.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Bundle`
                              : `₱${f.price.pcs.toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} / Pcs`}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        ₱
                        {f.total.toLocaleString("en", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <b>Total :</b>
                    </td>
                    <td>
                      <b>
                        ₱
                        {total.toLocaleString("en", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p>Selected Products will apear here..</p>
          )}
        </div>
        <div className="product-lists">
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search product here..."
              onKeyUp={(e) => searchTable(e)}
              onChange={(e) => searchTable(e)}
            />
          </div>
          <div id="btnlists">
            {products.map((prd, id) => (
              <button
                key={id}
                onClick={() => {
                  add(prd);
                }}
              >
                <img src={prd.productImage} alt={prd.productName} />
                {prd.productName}
              </button>
            ))}
          </div>
        </div>

        <div className={isModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-counter">
            <button className="modal-close" onClick={() => setIsModal(false)}>
              <RiCloseLine />
            </button>
            <div className="counter-contents">
              <div className="counter-left">
                <img src={data.productImage} alt="product" />
              </div>
              <div className="counter-right">
                <h3>{data.productName}</h3>
                <table className="cr-table">
                  <tbody>
                    <tr>
                      <th>Unit : </th>
                      <td>{data.unit}</td>
                    </tr>
                    <tr>
                      <th>Stocks : </th>
                      <td>
                        {data.unit === unit.piece
                          ? `${data.stocks} Pcs`
                          : data.unit === unit.pack
                          ? `${data.stocks.pack} Packs & ${data.stocks.pcs} Pcs`
                          : data.unit === unit.box
                          ? `${data.stocks.box} Box's & ${data.stocks.pcs} Pcs`
                          : data.unit === unit.roll
                          ? `${data.stocks.roll} Roll's & ${data.stocks.meter} Meters`
                          : data.unit === unit.set
                          ? `${data.stocks.set} Set's & ${data.stocks.pcs} Pcs`
                          : data.unit === unit.pair
                          ? `${data.stocks} Pair`
                          : data.unit === unit.bundle
                          ? `${data.stocks.bundle} Bundle's & ${data.stocks.pcs} Pcs`
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th>Price : </th>
                      <td>
                        {data.unit === unit.piece
                          ? `₱${data.price} / Pcs`
                          : data.unit === unit.pack
                          ? `₱${data.price.pack} / Packs & ₱${data.price.pcs} / Pcs`
                          : data.unit === unit.box
                          ? `₱${data.price.box} / Box & ₱${data.price.pcs} / Pcs`
                          : data.unit === unit.roll
                          ? `₱${data.price.roll} / Roll & ₱${data.price.meter} / Meter`
                          : data.unit === unit.set
                          ? `₱${data.price.set} / Set & ₱${data.price.pcs} / Pcs`
                          : data.unit === unit.pair
                          ? `₱${data.price} / Pair`
                          : data.unit === unit.bundle
                          ? `₱${data.price.bundle} / Bundle & ₱${data.price.pcs} / Pcs`
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {data.unit === unit.piece ? (
                  <div className="counter-select-field">
                    <div className="field-form">
                      <label>Qty Pcs to sell : </label>
                      <Select
                        className="selects"
                        options={options(data.stocks, "Pcs")}
                        defaultValue={qtyPiece}
                        onChange={(e) => setQtyPiece(e.value)}
                      />
                    </div>
                  </div>
                ) : data.unit === unit.pack ? (
                  <>
                    <div className="counter-select-field">
                      <div className="field-form">
                        <label>Qty pack to sell : </label>
                        <Select
                          className="selects"
                          options={options(data.stocks.pack, "Pack")}
                          defaultValue={qtyPack}
                          onChange={(e) => setQtyPack(e.value)}
                        />
                      </div>
                    </div>
                    <div className="counter-select-field mt-2">
                      <div className="field-form">
                        <label>Qty Pcs to sell : </label>
                        <Select
                          className="selects"
                          options={
                            data.stocks.pack > 0
                              ? options2(data.pcsPerPack, "Pcs")
                              : options2(data.stocks.pcs, "Pcs")
                          }
                          defaultValue={qtyPackPcs}
                          onChange={(e) => setQtyPackPcs(e.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : data.unit === unit.box ? (
                  <>
                    <div className="counter-select-field">
                      <div className="field-form">
                        <label>Qty box to sell : </label>
                        <Select
                          className="selects"
                          options={options(data.stocks.box, "Box")}
                          defaultValue={qtyBox}
                          onChange={(e) => setQtyBox(e.value)}
                        />
                      </div>
                    </div>
                    <div className="counter-select-field mt-2">
                      <div className="field-form">
                        <label>Qty Pcs to sell : </label>
                        <Select
                          className="selects"
                          options={
                            data.stocks.box > 0
                              ? options2(data.pcsPerBox, "Pcs")
                              : options2(data.stocks.pcs, "Pcs")
                          }
                          defaultValue={qtyBoxPcs}
                          onChange={(e) => setQtyBoxPcs(e.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : data.unit === unit.roll ? (
                  <>
                    <div className="counter-select-field">
                      <div className="field-form">
                        <label>Qty Roll to sell : </label>
                        <Select
                          className="selects"
                          options={options(data.stocks.roll, "Roll")}
                          defaultValue={qtyRoll}
                          onChange={(e) => setQtyRoll(e.value)}
                        />
                      </div>
                    </div>
                    <div className="counter-select-field mt-2">
                      <div className="field-form">
                        <label>Qty Meter to sell : </label>
                        <Select
                          className="selects"
                          options={
                            data.stocks.roll > 0
                              ? options2(data.meterPerRoll, "Meter")
                              : options2(data.stocks.meter, "Meter")
                          }
                          defaultValue={qtyMeter}
                          onChange={(e) => setQtyMeter(e.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : data.unit === unit.set ? (
                  <>
                    <div className="counter-select-field">
                      <div className="field-form">
                        <label>Qty Set to sell : </label>
                        <Select
                          className="selects"
                          options={options(data.stocks.set, "Set")}
                          defaultValue={qtySet}
                          onChange={(e) => setQtySet(e.value)}
                        />
                      </div>
                    </div>
                    <div className="counter-select-field mt-2">
                      <div className="field-form">
                        <label>Qty Pcs to sell : </label>
                        <Select
                          className="selects"
                          options={
                            data.stocks.set > 0
                              ? options2(data.pcsPerSet, "Pcs")
                              : options2(data.stocks.pcs, "Pcs")
                          }
                          defaultValue={qtySetPcs}
                          onChange={(e) => setQtySetPcs(e.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : data.unit === unit.pair ? (
                  <div className="counter-select-field">
                    <div className="field-form">
                      <label>Qty Pair to sell : </label>
                      <Select
                        className="selects"
                        options={options(data.stocks, "Pair")}
                        defaultValue={qtyPair}
                        onChange={(e) => setQtyPair(e.value)}
                      />
                    </div>
                  </div>
                ) : data.unit === unit.bundle ? (
                  <>
                    <div className="counter-select-field">
                      <div className="field-form">
                        <label>Qty Bundle to sell : </label>
                        <Select
                          className="selects"
                          options={options(data.stocks.bundle, "Bundle")}
                          defaultValue={qtyBundle}
                          onChange={(e) => setQtyBundle(e.value)}
                        />
                      </div>
                    </div>
                    <div className="counter-select-field mt-2">
                      <div className="field-form">
                        <label>Qty Pcs to sell : </label>
                        <Select
                          className="selects"
                          options={
                            data.stocks.bundle > 0
                              ? options2(data.pcsPerBundle, "Pcs")
                              : options2(data.stocks.pcs, "Pcs")
                          }
                          defaultValue={qtyBundlePcs}
                          onChange={(e) => setQtyBundlePcs(e.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            <button
              className="add-items"
              onClick={() => {
                if (data.unit === unit.piece) {
                  if (qtyPiece > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: qtyPiece,
                        price: data.price,
                        total: data.price * qtyPiece,
                      },
                    ]);
                    setTotal(total + data.price * qtyPiece);
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        productName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: qtyPiece,
                        price: data.price,
                        total: data.price * qtyPiece,
                      },
                    ]);
                  }
                } else if (data.unit === unit.pack) {
                  if (qtyPack > 0 || qtyPackPcs > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: {
                          pack: qtyPack,
                          pcs: qtyPackPcs,
                        },
                        price: {
                          pack: data.price.pack,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.pack * qtyPack +
                          data.price.pcs * qtyPackPcs,
                      },
                    ]);
                    setTotal(
                      total +
                        data.price.pack * qtyPack +
                        data.price.pcs * qtyPackPcs
                    );
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        productName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: {
                          pack: qtyPack,
                          pcs: qtyPackPcs,
                        },
                        price: {
                          pack: data.price.pack,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.pack * qtyPack +
                          data.price.pcs * qtyPackPcs,
                      },
                    ]);
                  }
                } else if (data.unit === unit.box) {
                  if (qtyBox > 0 || qtyBoxPcs > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: {
                          box: qtyBox,
                          pcs: qtyBoxPcs,
                        },
                        price: {
                          box: data.price.box,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.box * qtyBox + data.price.pcs * qtyBoxPcs,
                      },
                    ]);
                    setTotal(
                      total +
                        data.price.box * qtyBox +
                        data.price.pcs * qtyBoxPcs
                    );
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        productName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: {
                          box: qtyBox,
                          pcs: qtyBoxPcs,
                        },
                        price: {
                          box: data.price.box,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.box * qtyBox + data.price.pcs * qtyBoxPcs,
                      },
                    ]);
                  }
                } else if (data.unit === unit.roll) {
                  if (qtyRoll > 0 || qtyMeter > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: {
                          roll: qtyRoll,
                          meter: qtyMeter,
                        },
                        price: {
                          roll: data.price.roll,
                          meter: data.price.meter,
                        },
                        total:
                          data.price.roll * qtyRoll +
                          data.price.meter * qtyMeter,
                      },
                    ]);
                    setTotal(
                      total +
                        data.price.roll * qtyRoll +
                        data.price.meter * qtyMeter
                    );
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        productName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: {
                          roll: qtyRoll,
                          meter: qtyMeter,
                        },
                        price: {
                          roll: data.price.roll,
                          meter: data.price.meter,
                        },
                        total:
                          data.price.roll * qtyRoll +
                          data.price.meter * qtyMeter,
                      },
                    ]);
                  }
                } else if (data.unit === unit.set) {
                  if (qtySet > 0 || qtySetPcs > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: {
                          set: qtySet,
                          pcs: qtySetPcs,
                        },
                        price: {
                          set: data.price.set,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.set * qtySet + data.price.pcs * qtySetPcs,
                      },
                    ]);
                    setTotal(
                      total +
                        data.price.set * qtySet +
                        data.price.pcs * qtySetPcs
                    );
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        productName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: {
                          set: qtySet,
                          pcs: qtySetPcs,
                        },
                        price: {
                          set: data.price.set,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.set * qtySet + data.price.pcs * qtySetPcs,
                      },
                    ]);
                  }
                } else if (data.unit === unit.pair) {
                  if (qtyPair > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: qtyPair,
                        price: data.price,
                        total: data.price * qtyPair,
                      },
                    ]);
                    setTotal(total + data.price * qtyPair);
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        prodName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: qtyPair,
                        price: data.price,
                        total: data.price * qtyPair,
                      },
                    ]);
                  }
                } else if (data.unit === unit.bundle) {
                  if (qtyBundle > 0 || qtyBundlePcs > 0) {
                    setFieldData([
                      ...fieldData,
                      {
                        prodName: data.productName,
                        unit: data.unit,
                        qty: {
                          bundle: qtyBundle,
                          pcs: qtyBundlePcs,
                        },
                        price: {
                          bundle: data.price.bundle,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.bundle * qtyBundle +
                          data.price.pcs * qtyBundlePcs,
                      },
                    ]);
                    setTotal(
                      total +
                        data.price.bundle * qtyBundle +
                        data.price.pcs * qtyBundlePcs
                    );
                    setSales([
                      ...sales,
                      {
                        prodId: data.id,
                        prodName: data.productName,
                        unit: data.unit,
                        catId: data.categoryId,
                        qty: {
                          bundle: qtyBundle,
                          pcs: qtyBundlePcs,
                        },
                        price: {
                          bundle: data.price.bundle,
                          pcs: data.price.pcs,
                        },
                        total:
                          data.price.bundle * qtyBundle +
                          data.price.pcs * qtyBundlePcs,
                      },
                    ]);
                  }
                }

                setQtyPiece(0);
                setQtyPack(0);
                setQtyPackPcs(0);
                setQtyBox(0);
                setQtyBoxPcs(0);
                setQtyRoll(0);
                setQtyMeter(0);
                setQtySet(0);
                setQtySetPcs(0);
                setQtyPair(0);
                setQtyBundle(0);
                setQtyBundlePcs(0);
                setIsModal(false);
              }}
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Counter;
