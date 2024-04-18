import { useEffect, useState } from "react";
import "../css/products.css";
import "../css/modal.css";
import Loader from "../components/Loader";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../db/config";
import { GrRevert } from "react-icons/gr";
import { RiCloseLine } from "react-icons/ri";
import { LuArchiveRestore } from "react-icons/lu";

const Archived = () => {
  const [isLoaded, setIsloaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [prdId, setPrdId] = useState("");

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
    const get = async () => {
      const q = query(collection(db, "products"), orderBy("productName"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setProducts(prods);
    };
    get();

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const revert = async (id) => {
    setIsModal(false);
    setProducts((l) => l.filter((item) => item.id !== id));
    await updateDoc(doc(db, "products", id), {
      isArchived: false,
    });
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
      <div className="products">
        <div className="page-header">
          <h3 className="page-title">Archives</h3>
          <div className="search-bars">
            <input
              type="search"
              className="w-300px"
              placeholder="Search products here..."
              onKeyUp={(e) => searchTable(e)}
              onChange={(e) => searchTable(e)}
            />
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
            {products.map((prod, id) => (
              <tr key={id} className={prod.isArchived ? "" : "d-none"}>
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
                  <button
                    className="view"
                    title="revert"
                    onClick={() => {
                      setIsModal(true);
                      setPrdId(prod.id);
                    }}
                  >
                    <GrRevert />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={isModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button className="modal-close" onClick={() => setIsModal(false)}>
              <RiCloseLine />
            </button>
            <div className="text-center">
              <LuArchiveRestore className="icn" color="orange" />
            </div>
            <h3>Do you want to revert this product?</h3>
            <p>
              This action will restore the product to the product list, making
              it visible and accessible
            </p>
            <button className="dbtns delete" onClick={() => revert(prdId)}>
              Revert
            </button>
            <button className="dbtns cancel" onClick={() => setIsModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Archived;
