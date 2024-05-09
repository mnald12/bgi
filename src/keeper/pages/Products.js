import { useEffect, useState } from "react";
import "../css/products.css";
import "../css/modal.css";
import Loader from "../components/Loader";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../db/config";

const Products = () => {
  const [isLoaded, setIsloaded] = useState(false);
  const [products, setProducts] = useState([]);

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
          <h3 className="page-title">Products</h3>
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
            </tr>
          </thead>
          <tbody id="tbody">
            {products.map((prod, id) => (
              <tr key={id} className={prod.isArchived ? "d-none" : ""}>
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
                    {prod.stocks.pack === 0 && prod.stocks.pcs === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <>
                        <span>{prod.stocks.pack} Packs and </span>
                        <span>{prod.stocks.pcs} Pcs</span>
                      </>
                    )}
                  </td>
                ) : prod.unit === unit.piece ? (
                  <td>
                    {prod.stocks === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <span>{prod.stocks} Pcs </span>
                    )}
                  </td>
                ) : prod.unit === unit.box ? (
                  <td>
                    {prod.stocks.box === 0 && prod.stocks.pcs === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <>
                        <span>{prod.stocks.box} Box's and </span>
                        <span>{prod.stocks.pcs} Pcs</span>
                      </>
                    )}
                  </td>
                ) : prod.unit === unit.roll ? (
                  <td>
                    {prod.stocks.roll === 0 && prod.stocks.meter === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <>
                        <span>{prod.stocks.roll} Rolls and </span>
                        <span>{prod.stocks.meter} Meters</span>
                      </>
                    )}
                  </td>
                ) : prod.unit === unit.set ? (
                  <td>
                    {prod.stocks.set === 0 && prod.stocks.pcs === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <>
                        <span>{prod.stocks.set} Sets and </span>
                        <span>{prod.stocks.pcs} Pcs</span>
                      </>
                    )}
                  </td>
                ) : prod.unit === unit.pair ? (
                  <td>
                    {prod.stocks === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <span>{prod.stocks} Pair </span>
                    )}
                  </td>
                ) : prod.unit === unit.bundle ? (
                  <td>
                    {prod.stocks.bundle === 0 && prod.stocks.pcs === 0 ? (
                      <span style={{ color: "red" }}>Out of stock</span>
                    ) : (
                      <>
                        <span>{prod.stocks.bundle} Bundles and </span>
                        <span>{prod.stocks.pcs} Pcs</span>
                      </>
                    )}
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Products;
