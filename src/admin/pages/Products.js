import { useEffect, useState } from "react";
import "../css/products.css";
import "../css/modal.css";
import logo from "../images/logo.png";
import { RiCloseLine } from "react-icons/ri";
import Loader from "../components/Loader";
import { categories, products, units } from "../../datas";
import { HiOutlineEye } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";

const Products = () => {
  const [isLoaded, setIsloaded] = useState(false);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const [activeUnit, setActiveUnit] = useState("Piece");

  if (isLoaded) {
    return (
      <div className="products">
        <div className="page-header">
          <h3 className="page-title">Products</h3>
          <div className="search-bars">
            <input type="text" placeholder="Search products here..." />
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
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, id) => (
              <tr key={id}>
                <td>
                  <img src={prod.img} alt="prod" />
                </td>
                <td>{prod.productName}</td>
                <td>{prod.unit}</td>
                <td>
                  ₱{" "}
                  {prod.data.price.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>{prod.data.stocks}</td>
                <td className="btn-flex">
                  <button className="view" title="view">
                    <HiOutlineEye />
                  </button>
                  <button className="upd" title="edit">
                    <BiSolidEdit />
                  </button>
                  <button className="del" title="delete">
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
              <h3 className="modal-title">New Product</h3>
              <div className="modal-flex">
                <div className="modal-left">
                  <div className="img-preview">
                    <img alt="logo" src={logo} />
                  </div>
                  <p>Product Image</p>
                  <input type="file" />
                </div>
                <div className="modal-right">
                  <div className="input-group w-100">
                    <label>Product Name</label>
                    <input type="text" name="pname" />
                  </div>
                  <div className="input-group w-50">
                    <label>Category</label>
                    <select>
                      {categories.map((c, id) => (
                        <option key={id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group w-50">
                    <label>Unit</label>
                    <select onChange={(e) => setActiveUnit(e.target.value)}>
                      {units.map((u, id) => (
                        <option key={id}>{u.name}</option>
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Piece</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input className="money" type="number" name="pname" />
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs Per Pack</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Pack</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Pack</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input className="money" type="number" name="pname" />
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Pcs Per Box</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Box</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Box</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input className="money" type="number" name="pname" />
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Meter</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Meter Per Roll</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Roll</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Roll</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Meter</label>
                      <input className="money" type="number" name="pname" />
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece Per Set</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Set</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Set</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input className="money" type="number" name="pname" />
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Pair</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Pair</label>
                      <input className="money" type="number" name="pname" />
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
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Qty Piece Per Bundle</label>
                      <input type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Capital Per Bundle</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Bundle</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                    <div className="input-group w-30">
                      <label>Selling Price per Piece</label>
                      <input className="money" type="number" name="pname" />
                    </div>
                  </div>

                  <div className="mb-container w-100">
                    <button>Add Product</button>
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
