import "../css/sale.css";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../db/config";
import { SideData } from "../Admin";
import Loader from "../components/Loader";
import logo from "../images/logo.png";
const Sale = () => {
  const { saleId } = useContext(SideData);
  const [isLoaded, setIsloaded] = useState(false);
  const [data, setData] = useState([]);

  const unit = {
    piece: "Piece",
    pack: "Pack",
    box: "Box",
    roll: "Roll",
    set: "Set",
    pair: "Pair",
    bundle: "Bundle",
  };

  useEffect(() => {
    const getSale = async () => {
      const docSnap = await getDoc(doc(db, "sales", saleId));
      setData(docSnap.data());
    };
    getSale();
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, [data, saleId]);

  if (isLoaded) {
    return (
      <>
        <div className="sale">
          <img className="logs" alt="logo" src={logo} />
          <div className="reciept">
            <h3>BGI Electrical Contractors, Supplies and Manpower Services</h3>
            <p>
              Maharlika Highway (across SORECO II NGCCP) Cabid-an Sorsogon City
            </p>
            <p>(056) 311 4057</p>

            <br />

            <p>
              Customer : <span>{data.customer}</span>
            </p>
            <p>
              Date : <span>{data.date}</span>
            </p>
            <p>
              Cashier : <span>{data.cashier}</span>
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
              {data.data.map((f, k) => (
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
                            })} / Pack & ₱${f.price.pcs.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} / Pcs`
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
                            })} / Box & ₱${f.price.pcs.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} / Pcs`
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
                            })} / Roll & ₱${f.price.meter.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} / Meter`
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
                            })} / Set & ₱${f.price.pcs.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} / Pcs`
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
                            })} / Bundle & ₱${f.price.pcs.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} / Pcs`
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
                  {data.total.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr className="trs">
                <td></td>
                <td></td>
                <td>Discount {`(${data.discount}%)`} :</td>
                <td>
                  ₱
                  {data.totalDiscount.toLocaleString("en", {
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
                    {data.totalAmmount.toLocaleString("en", {
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
                  {data.cash.toLocaleString("en", {
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
                  {data.change.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Sale;
