import "../css/product.css";
import { useContext, useEffect, useState } from "react";
import { SideData } from "../Admin";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../db/config";
import Loader from "../components/Loader";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { RiCloseLine } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";

const Product = () => {
  const { productId } = useContext(SideData);
  const [product, setProduct] = useState({ productName: "" });
  const [isLoaded, setIsloaded] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { setSideActive } = useContext(SideData);

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
    console.log(productId);
    const getProd = async () => {
      const docSnap = await getDoc(doc(db, "products", productId));
      setProduct(docSnap.data());
    };
    getProd();

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, [productId]);

  const deleteProd = async () => {
    await deleteDoc(doc(db, "products", productId));
    setSideActive("products");
  };

  if (isLoaded) {
    return (
      <>
        <div className="product-detail">
          <div className="prod-actions">
            <button
              onMouseEnter={() =>
                (document.getElementById("res").style.opacity = 1)
              }
              onMouseLeave={() =>
                (document.getElementById("res").style.opacity = 0)
              }
            >
              <HiMiniInboxArrowDown color="forestgreen" />
            </button>
            <small id="res">Restock</small>
            <button
              onMouseEnter={() =>
                (document.getElementById("ed").style.opacity = 1)
              }
              onMouseLeave={() =>
                (document.getElementById("ed").style.opacity = 0)
              }
            >
              <BiSolidEdit color="orange" />
            </button>
            <small id="ed">Edit</small>
            <button
              onClick={() => setIsDeleteModal(true)}
              onMouseEnter={() =>
                (document.getElementById("del").style.opacity = 1)
              }
              onMouseLeave={() =>
                (document.getElementById("del").style.opacity = 0)
              }
            >
              <RiDeleteBin6Line color="red" />
            </button>
            <small id="del">Delete</small>
          </div>
          <div className="details">
            <div className="details-left">
              <img src={product.productImage} alt="prod" />
            </div>
            <div className="details-right">
              <table>
                <tr>
                  <td width="40%">
                    <b>Product Name</b>
                  </td>
                  <td width="60%">{product.productName}</td>
                </tr>
                <tr>
                  <td>
                    <b>Unit</b>
                  </td>
                  <td>{product.unit}</td>
                </tr>
                <tr>
                  <td>
                    <b>Category</b>
                  </td>
                  <td>{product.category}</td>
                </tr>
              </table>
              {product.unit === unit.piece ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">{product.totalStocks} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>{product.stocks} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Piece</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>{product.sold} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.pack ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.pack} Packs and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.pack} Packs and {product.stocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Pack</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.pack.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / pack and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.pack} Pack and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.box ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.box} Box and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.box} Box and {product.stocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Box</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.box.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / box and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.box} Box and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.roll ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.roll} Roll and{" "}
                      {product.totalStocks.meter} Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.roll} Roll and {product.stocks.meter}{" "}
                      Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Roll</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.roll.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Roll and ₱{" "}
                      {product.price.meter.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.roll} Roll and {product.sold.meter} Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.set ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.set} Set and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.set} Set and {product.stocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Set</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.set.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Set and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.set} Set and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.pair ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">{product.totalStocks} Pair</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>{product.stocks} Pair</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Pair</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>{product.sold} Pair</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.bundle ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.bundle} Bundle and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.bundle} Bundle and {product.stocks.pcs}{" "}
                      Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Bundle</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.bundle.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Bundle and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.bundle} Bundle and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className={isDeleteModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button
              className="modal-close"
              onClick={() => setIsDeleteModal(false)}
            >
              <RiCloseLine />
            </button>
            <div className="text-center">
              <IoWarningOutline className="icn" />
            </div>
            <h3>Are you sure you want to delete this product?</h3>
            <p>
              This action will permanently remove the product, and it cannot be
              undone.
            </p>
            <button
              className="dbtns delete"
              onClick={() => deleteProd(productId)}
            >
              Delete
            </button>
            <button
              className="dbtns cancel"
              onClick={() => setIsDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Product;
