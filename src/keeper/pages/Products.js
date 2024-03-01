import { useEffect, useState } from "react";
import "../css/products.css";
import "../css/modal.css";
import Loader from "../components/Loader";
import { products } from "../../datas";
import { HiOutlineEye } from "react-icons/hi";

const Products = () => {
  const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
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
            <input type="text" placeholder="Search products here..." />
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

export default Products;
