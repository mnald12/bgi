import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../db/config";
import { BsEyeFill } from "react-icons/bs";
import Loader from "../components/Loader";
import { SideData } from "../Admin";

const Sales = () => {
  const { setSideActive, setSaleId } = useContext(SideData);
  const [isLoaded, setIsloaded] = useState(false);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const get = async () => {
      const q = query(collection(db, "sales"), orderBy("date"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const sales = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setSales(sales);
      }
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
      <div className="categories">
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
        <div className="d-flex">
          <div className="d-left"></div>
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
                      setSaleId(sale.id);
                      setSideActive("sale");
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
    );
  } else {
    return <Loader />;
  }
};

export default Sales;
