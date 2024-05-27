import { RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../db/config";
import { IoWarningOutline } from "react-icons/io5";
import { HiOutlineEye } from "react-icons/hi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsloaded] = useState(false);
  const [catName, setCatName] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isUpModal, setIsUpModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [toUpdateCatId, setToUpdateCatId] = useState("");
  const [toUpdateCatName, setToUpdateCatName] = useState("");
  const [products, setProducts] = useState([]);
  const [isCatView, setIsCatView] = useState(false);
  const [isToView, setIsToView] = useState([]);

  useEffect(() => {
    const get = async () => {
      const q = query(collection(db, "categories"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const cats = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setCategories(cats);
    };
    get();

    const getProd = async () => {
      const q = query(collection(db, "products"), orderBy("productName"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setProducts(prods);
    };
    getProd();

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  const addCategory = async () => {
    if (catName === "") {
      document.getElementById("noname").classList.remove("d-none");
      setTimeout(() => {
        document.getElementById("noname").classList.add("d-none");
      }, 2000);
      return;
    }
    const categoryRef = collection(db, "categories");
    const newCat = await addDoc(categoryRef, {
      isDeleted: false,
      name: catName,
      sales: 0,
    });
    setCategories((prev) => [
      ...prev,
      {
        id: newCat.id,
        name: catName,
        sales: 0,
      },
    ]);
    setIsModal(false);
  };

  const viewCat = async (name) => {
    const prods = [];
    for (let i of products) {
      if (i.category === name) {
        prods.push(i.productName);
      }
    }
    setIsToView(prods);
    setIsCatView(true);
  };

  const updateCategory = async () => {
    await updateDoc(doc(db, "categories", toUpdateCatId), {
      name: toUpdateCatName,
    });
    const q = query(collection(db, "categories"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const cats = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setCategories(cats);
    setIsUpModal(false);
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

  const deleteCat = async () => {
    setIsDeleteModal(false);
    setCategories((l) => l.filter((item) => item.id !== idToDelete));
    await updateDoc(doc(db, "categories", idToDelete), {
      isDeleted: true,
    });
  };

  if (isLoaded) {
    return (
      <div className="categories">
        <div className="page-header">
          <h3 className="page-title">Categories</h3>
          <div className="search-bars">
            <input
              id="searchs"
              type="search"
              placeholder="Search categories here..."
              onKeyUp={(e) => searchTable(e)}
              onChange={(e) => searchTable(e)}
            />
            <button className="add-bar" onClick={() => setIsModal(true)}>
              Add categories
            </button>
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
          <tbody id="tbody">
            {categories.map((cat, id) => (
              <tr key={id} className={cat.isDeleted ? "d-none" : ""}>
                <td>{cat.name}</td>
                <td>
                  ₱{" "}
                  {cat.sales.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="btn-flex">
                  <button
                    onClick={() => {
                      viewCat(cat.name);
                    }}
                    className="view"
                    title="view"
                  >
                    <HiOutlineEye />
                  </button>
                  <button
                    className="upd"
                    title="edit"
                    onClick={() => {
                      setToUpdateCatId(cat.id);
                      setToUpdateCatName(cat.name);
                      setIsUpModal(true);
                    }}
                  >
                    <BiSolidEdit />
                  </button>
                  <button
                    onClick={() => {
                      setIdToDelete(cat.id);
                      setIsDeleteModal(true);
                    }}
                    className="del"
                    title="delete"
                  >
                    <RiDeleteBin6Line />
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
            <h3 className="modal-title">Add New Category</h3>
            <div className="input-group w-100">
              <p id="noname" className="d-none color-red">
                The category name cannot be left empty
              </p>
              <label>Category Name</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
            </div>
            <div className="w-100 text-right">
              <button className="cbtn" onClick={() => addCategory()}>
                Add Category
              </button>
            </div>
          </div>
        </div>
        <div className={isUpModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button className="modal-close" onClick={() => setIsUpModal(false)}>
              <RiCloseLine />
            </button>
            <h3 className="modal-title">Edit Category</h3>
            <div className="input-group w-100">
              <p id="unoname" className="d-none color-red">
                The category name cannot be left empty
              </p>
              <label>Category Name</label>
              <input
                type="text"
                value={toUpdateCatName}
                onChange={(e) => setToUpdateCatName(e.target.value)}
              />
            </div>
            <div className="w-100 text-right">
              <button
                className="cbtn bg-orange"
                onClick={() => updateCategory()}
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
        <div className={isDeleteModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button
              className="modal-close"
              onClick={() => setIsDeleteModal(false)}
            >
              <RiCloseLine />
            </button>
            <div className="text-center">
              <IoWarningOutline className="icn" />
            </div>
            <h3>Are you sure you want to delete this category?</h3>
            <p>
              This action will permanently remove the category, and it cannot be
              undone.
            </p>
            <button className="dbtns delete" onClick={() => deleteCat()}>
              Delete
            </button>
            <button
              className="dbtns cancel"
              onClick={() => setIsDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className={isCatView ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button className="modal-close" onClick={() => setIsCatView(false)}>
              <RiCloseLine />
            </button>
            <div>
              {isToView.length > 0 ? (
                <>
                  <h3>Product Lists</h3>
                  {isToView.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </>
              ) : (
                <h3>No Products</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Categories;
