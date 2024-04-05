import "../css/sale.css";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../db/config";
import { SideData } from "../Admin";
import Loader from "../components/Loader";

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
      <div className="sale">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((d, k) => (
              <tr key={k}>
                <td>{d.productName}</td>
                <td>{d.total}</td>
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

export default Sale;
