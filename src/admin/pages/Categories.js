import { RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../db/config";
import { IoWarningOutline } from "react-icons/io5";

const Categories = () => {
  const [categories, setCategories] = useState(null);
  const [isLoaded, setIsloaded] = useState(false);
  const [catName, setCatName] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  useEffect(() => {
    const get = async () => {
      const q = query(collection(db, "categories"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const cats = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setCategories(cats);
      }
    };
    get();
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
    const newCat = await addDoc(categoryRef, { name: catName, sales: 0 });
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
    await deleteDoc(doc(db, "categories", idToDelete));
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
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Categories;
