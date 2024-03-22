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

  if (isLoaded) {
    return (
      <div className="products">
        <div className="page-header">
          <h3 className="page-title">Products</h3>
          <div className="search-bars">
            <input
              type="text"
              className="w-300px"
              placeholder="Search products here..."
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
