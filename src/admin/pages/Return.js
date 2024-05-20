import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../db/config";
import Loader from "../components/Loader";

const Return = () => {
  const [returns, setReturns] = useState([]);

  const [isLoaded, setIsloaded] = useState(false);

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
      const q = query(collection(db, "returns"), orderBy("date", "desc"));
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
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Problem</th>
              <th>Solution</th>
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
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Return;
