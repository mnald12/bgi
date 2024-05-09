import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "../../db/config";
import { BsEyeFill } from "react-icons/bs";
import Loader from "../components/Loader";
import { RiCloseLine } from "react-icons/ri";
import { FcPrint } from "react-icons/fc";
import logo from "../images/logo.png";
import { useReactToPrint } from "react-to-print";

const Sales = () => {
  const [isLoaded, setIsloaded] = useState(false);
  const [sales, setSales] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [prevData, setPrevData] = useState({});

  const unit = {
    piece: "Piece",
    pack: "Pack",
    box: "Box",
    roll: "Roll",
    set: "Set",
    pair: "Pair",
    bundle: "Bundle",
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const get = async () => {
      const q = query(collection(db, "sales"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const sales = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setSales(sales);
      setPrevData(sales[0]);
    };
    get();
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

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
      <>
        <div className="sales">
          <div className="page-header">
            <h3 className="page-title">Sales</h3>
            <div className="search-bars">
              <input
                id="searchs"
                type="search"
                className="w-300px"
                placeholder="Search sales here..."
                onKeyUp={(e) => searchTable(e)}
                onChange={(e) => searchTable(e)}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Sales</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="tbody">
              {sales.map((sale, id) => (
                <tr key={id}>
                  <td>{sale.customer}</td>
                  <td>{sale.date}</td>
                  <td>
                    ₱{" "}
                    {sale.sales.toLocaleString("en", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="btn-flex">
                    <button
                      className="view"
                      title="view"
                      onClick={() => {
                        setPrevData(sale);
                        setIsPreview(true);
                      }}
                    >
                      <BsEyeFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={isPreview ? "modals d-flex" : "modals d-none"}>
          <div className="modal-bodys">
            <button
              className="modal-close"
              title="close"
              onClick={async () => {
                setIsPreview(false);
              }}
            >
              <RiCloseLine />
            </button>
            <button
              className="modal-print"
              title="print"
              onClick={() => handlePrint()}
            >
              <FcPrint />
            </button>
            <div ref={componentRef} className="print-container">
              <img className="logs" alt="logo" src={logo} />
              <div className="reciept">
                <h3>
                  BGI Electrical Contractors, Supplies and Manpower Services
                </h3>
                <p>
                  Maharlika Highway (across SORECO II NGCCP) Cabid-an Sorsogon
                  City
                </p>
                <p>(056) 311 4057</p>

                <br />

                <p>
                  Customer : <span>{prevData.customer}</span>
                </p>
                <p>
                  Date : <span>{prevData.date}</span>
                </p>
                <p>
                  Cashier : <span>{prevData.cashier}</span>
                </p>
              </div>
              <table className="ctbl tb2">
                <thead className="">
                  <tr>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {prevData.data.map((f, k) => (
                    <tr key={k}>
                      <td>{f.productName}</td>
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
                <tfoot className="tfoot">
                  <tr className="trss">
                    <td></td>
                    <td></td>
                    <td>Subtotal :</td>
                    <td>
                      ₱
                      {prevData.total.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="trs">
                    <td></td>
                    <td></td>
                    <td>Discount {`(${prevData.discount}%)`} :</td>
                    <td>
                      ₱
                      {prevData.totalDiscount.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="trs">
                    <td></td>
                    <td></td>
                    <td>
                      <b>Total :</b>
                    </td>
                    <td>
                      <b>
                        ₱
                        {prevData.totalAmmount.toLocaleString("en", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </b>
                    </td>
                  </tr>
                  <tr className="trs">
                    <td></td>
                    <td></td>
                    <td>Cash :</td>
                    <td>
                      ₱
                      {prevData.cash.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="trs">
                    <td></td>
                    <td></td>
                    <td>Change :</td>
                    <td>
                      ₱
                      {prevData.change.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Sales;
