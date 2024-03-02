import { categories } from "../../datas";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const Categories = () => {
  const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  if (isLoaded) {
    return (
      <div className="categories">
        <div className="page-header">
          <h3 className="page-title">Categories</h3>
          <div className="search-bars">
            <input type="text" placeholder="Search categories here..." />
            <button className="add-bar">Add categories</button>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-left"></div>
        </div>
        <table>
          <thead>
            <tr>
              <th width="70%">Category Name</th>
              <th width="15%">Sales</th>
              <th width="15%">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, id) => (
              <tr key={id}>
                <td>{cat.name}</td>
                <td>
                  ₱{" "}
                  {cat.sales.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="btn-flex">
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
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Categories;
