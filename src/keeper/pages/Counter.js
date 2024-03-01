import { useEffect, useState } from "react";
import "../css/counter.css";
import "../css/modal.css";
import { RiCloseLine } from "react-icons/ri";
import Loader from "../components/Loader";
import { products } from "../../datas";
import { FaPlus } from "react-icons/fa6";

const Counter = () => {
  const [isModal, setIsModal] = useState(false);

  const [data, setData] = useState(products[0]);

  const add = (data) => {
    setIsModal(true);
    setData(data);
  };

  const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const [filedData, setFieldData] = useState([]);

  if (isLoaded) {
    return (
      <div className="counter">
        <div className="counter-viewer">
          {filedData.length !== 0 ? (
            <div>
              {filedData.map((f) => (
                <p>{f.prodName}</p>
              ))}
            </div>
          ) : (
            <p>Selected Products will apear here..</p>
          )}
        </div>
        <div className="product-lists">
          <div className="search-bar">
            <input type="text" placeholder="Search product here..." />
          </div>
          {products.map((prd, id) => (
            <button
              key={id}
              onClick={() => {
                add(prd);
              }}
            >
              <img src={prd.img} alt={prd.productName} />
              {prd.productName}
            </button>
          ))}
        </div>

        <div className={isModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-counter">
            <button className="modal-close" onClick={() => setIsModal(false)}>
              <RiCloseLine />
            </button>
            <div className="counter-contents">
              <div className="counter-left">
                <img src={data.img} alt="product" />
              </div>
              <div className="counter-right">
                <h3>{data.productName}</h3>
                <hr />
                <div className="counter-items">
                  <b>Unit</b> : {data.unit}
                </div>
                <div className="counter-items">
                  <b>Stocks</b> : {data.data.stocks}
                </div>
                <div className="counter-items">
                  <b>Price</b> : {data.data.price}
                </div>
                <br />
                <hr />
                <div className="counter-select">
                  <label>Qty to Sell</label>
                  <input type="number" />
                </div>
              </div>
            </div>
            <button
              className="add-items"
              onClick={() => {
                setFieldData([
                  ...filedData,
                  { prodName: data.productName, qty: 32, total: 12331 },
                ]);
                setIsModal(false);
              }}
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Counter;
