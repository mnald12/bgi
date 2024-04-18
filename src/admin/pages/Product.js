import "../css/product.css";
import { useContext, useEffect, useState } from "react";
import { SideData } from "../Admin";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../db/config";
import Loader from "../components/Loader";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { BiSolidEdit } from "react-icons/bi";
import { RiCloseLine } from "react-icons/ri";
import { IoArchive, IoWarningOutline } from "react-icons/io5";
import { cryptoRandomStringAsync } from "crypto-random-string";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Product = () => {
  const { productId } = useContext(SideData);
  const [product, setProduct] = useState({ productName: "" });
  const [isLoaded, setIsloaded] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { setSideActive } = useContext(SideData);
  const [categories, setCategories] = useState([]);

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
    const getProd = async () => {
      const docSnap = await getDoc(doc(db, "products", productId));
      setProduct(docSnap.data());
    };
    getProd();

    const getCat = async () => {
      const q = query(collection(db, "categories"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const cats = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setCategories(cats);
    };
    getCat();

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, [productId]);

  const [isUpModal, setIsUpModal] = useState(false);
  const [img2, setImg2] = useState(null);

  const [upImg, setUpImg] = useState(null);
  const [upPname, setUpPname] = useState("");
  const [upUnit, setUpUnit] = useState("");
  const [upCat, setUpCat] = useState("");

  //pcs
  const [upSpPcs, setUpSpPcs] = useState(0);

  //pack
  const [upSpPack, setUpSpPack] = useState(0);
  const [upSpPackPcs, setUpSpPackPcs] = useState(0);

  //box
  const [upSpBox, setUpSpBox] = useState(0);
  const [upSpBoxPcs, setUpSpBoxPcs] = useState(0);

  //roll
  const [upSpRoll, setUpSpRoll] = useState(0);
  const [upSpMeter, setUpSpMeter] = useState(0);

  //set
  const [upSpSet, setUpSpSet] = useState(0);
  const [upSpSetPcs, setUpSpSetPcs] = useState(0);

  //pair
  const [upSpPair, setUpSpPair] = useState(0);

  //bundle
  const [upSpBundle, setUpSpBundle] = useState(0);
  const [upSpBundlePcs, setUpSpBundlePcs] = useState(0);

  const handleSelectChange2 = (val) => {
    const cat = JSON.parse(val);
    setUpCat(cat.name);
  };

  const updateProduct = async () => {
    setIsloaded(false);

    const uimgz = document.getElementById("uimgs");

    if (uimgz.files.length > 0) {
      const imageRef = ref(
        storage,
        `images/${img2.name + cryptoRandomStringAsync({ length: 10 })}23`
      );
      uploadBytes(imageRef, img2).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          if (upUnit === unit.piece) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: upSpPcs,
            });
          } else if (upUnit === unit.pack) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: {
                pack: upSpPack,
                pcs: upSpPackPcs,
              },
            });
          } else if (upUnit === unit.box) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: {
                box: upSpBox,
                pcs: upSpBoxPcs,
              },
            });
          } else if (upUnit === unit.roll) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: {
                roll: upSpRoll,
                meter: upSpMeter,
              },
            });
          } else if (upUnit === unit.set) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: {
                set: upSpSet,
                pcs: upSpSetPcs,
              },
            });
          } else if (upUnit === unit.pair) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: upSpPair,
            });
          } else if (upUnit === unit.bundle) {
            await updateDoc(doc(db, "products", productId), {
              productImage: url,
              productName: upPname,
              category: upCat,
              price: {
                bundle: upSpBundle,
                pcs: upSpBundlePcs,
              },
            });
          }
        });
      });
    } else {
      if (upUnit === unit.piece) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: upSpPcs,
        });
      } else if (upUnit === unit.pack) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: {
            pack: upSpPack,
            pcs: upSpPackPcs,
          },
        });
      } else if (upUnit === unit.box) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: {
            box: upSpBox,
            pcs: upSpBoxPcs,
          },
        });
      } else if (upUnit === unit.roll) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: {
            roll: upSpRoll,
            meter: upSpMeter,
          },
        });
      } else if (upUnit === unit.set) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: {
            set: upSpSet,
            pcs: upSpSetPcs,
          },
        });
      } else if (upUnit === unit.pair) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: upSpPair,
        });
      } else if (upUnit === unit.bundle) {
        await updateDoc(doc(db, "products", productId), {
          productName: upPname,
          category: upCat,
          price: {
            bundle: upSpBundle,
            pcs: upSpBundlePcs,
          },
        });
      }
    }

    const docSnap = await getDoc(doc(db, "products", productId));
    setProduct(docSnap.data());

    setIsUpModal(false);

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  };

  const deleteProd = async () => {
    await updateDoc(doc(db, "products", productId), {
      isArchived: true,
    });
    setSideActive("products");
  };

  const [isRestock, setIsRestock] = useState(false);

  const [newCap, setNewCap] = useState(product.capital);
  const [pcsToAdd, setPcsToAdd] = useState(0);
  const [packToAdd, setPackToAdd] = useState(0);
  const [packPcsToAdd, setPackPcsToAdd] = useState(0);
  const [boxToAdd, setBoxToAdd] = useState(0);
  const [boxPcsToAdd, setBoxPcsToAdd] = useState(0);
  const [rollToAdd, setRollToAdd] = useState(0);
  const [meterToAdd, setMeterToAdd] = useState(0);
  const [setToAdd, setSetToAdd] = useState(0);
  const [setsPcsToAdd, setSetsPcsToAdd] = useState(0);
  const [pairToAdd, setPairToAdd] = useState(0);
  const [bundleToAdd, setBundleToAdd] = useState(0);
  const [bundlePcsToAdd, setBundlePcsToAdd] = useState(0);

  const restockProduct = async () => {
    if (product.unit === unit.piece) {
      const ntc = pcsToAdd * +newCap;
      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: product.totalCapital + ntc,
        totalStocks: product.totalStocks + +pcsToAdd,
        stocks: product.stocks + +pcsToAdd,
      });
    } else if (product.unit === unit.pair) {
      const ntc = pairToAdd * +newCap;
      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: product.totalCapital + ntc,
        totalStocks: product.totalStocks + +pairToAdd,
        stocks: product.stocks + +pairToAdd,
      });
    } else if (product.unit === unit.pack) {
      let newTotalCapital = product.totalCapital;

      const newStocks = {
        pack: product.stocks.pack,
        pcs: product.stocks.pcs,
      };

      const newTotalStocks = {
        pack: product.totalStocks.pack,
        pcs: product.totalStocks.pcs,
      };

      if (packToAdd > 0 && packPcsToAdd > 0) {
        newStocks.pack += +packToAdd;
        newTotalStocks.pack += +packToAdd;
        newTotalCapital += +packToAdd * +newCap;

        if (newStocks.pcs + +packPcsToAdd === product.pcsPerPack) {
          newStocks.pcs = 0;
          newStocks.pack += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +packPcsToAdd > product.pcsPerPack) {
          const dif = newStocks.pcs + +packPcsToAdd - product.pcsPerPack;
          newStocks.pack += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +packPcsToAdd;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += sc * +packPcsToAdd;
        }

        if (newTotalStocks.pcs + +packPcsToAdd === product.pcsPerPack) {
          newTotalStocks.pcs = 0;
          newTotalStocks.pack += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.pcs + +packPcsToAdd > product.pcsPerPack) {
          const dif = newTotalStocks.pcs + +packPcsToAdd - product.pcsPerPack;
          newTotalStocks.pack += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +packPcsToAdd;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += sc * +packPcsToAdd;
        }
      } else if (packToAdd > 0 && packPcsToAdd <= 0) {
        newStocks.pack += +packToAdd;
        newTotalStocks.pack += +packToAdd;
        newTotalCapital += +packToAdd * +newCap;
      } else if (packToAdd <= 0 && packPcsToAdd > 0) {
        if (newStocks.pcs + +packPcsToAdd === product.pcsPerPack) {
          newStocks.pcs = 0;
          newStocks.pack += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +packPcsToAdd > product.pcsPerPack) {
          const dif = newStocks.pcs + +packPcsToAdd - product.pcsPerPack;
          newStocks.pack += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +packPcsToAdd;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += sc * +packPcsToAdd;
        }

        if (newTotalStocks.pcs + +packPcsToAdd === product.pcsPerPack) {
          newTotalStocks.pcs = 0;
          newTotalStocks.pack += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.pcs + +packPcsToAdd > product.pcsPerPack) {
          const dif = newTotalStocks.pcs + +packPcsToAdd - product.pcsPerPack;
          newTotalStocks.pack += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +packPcsToAdd;
          const sc = +newCap / product.pcsPerPack;
          newTotalCapital += sc * +packPcsToAdd;
        }
      }

      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: newTotalCapital,
        totalStocks: newTotalStocks,
        stocks: newStocks,
      });
    } else if (product.unit === unit.box) {
      let newTotalCapital = product.totalCapital;

      const newStocks = {
        box: product.stocks.box,
        pcs: product.stocks.pcs,
      };

      const newTotalStocks = {
        box: product.totalStocks.box,
        pcs: product.totalStocks.pcs,
      };

      if (boxToAdd > 0 && boxPcsToAdd > 0) {
        newStocks.box += +boxToAdd;
        newTotalStocks.box += +boxToAdd;
        newTotalCapital += +boxToAdd * +newCap;

        if (newStocks.pcs + +boxPcsToAdd === product.pcsPerBox) {
          newStocks.pcs = 0;
          newStocks.box += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +boxPcsToAdd > product.pcsPerBox) {
          const dif = newStocks.pcs + +boxPcsToAdd - product.pcsPerBox;
          newStocks.box += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +boxPcsToAdd;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += sc * +boxPcsToAdd;
        }

        if (newTotalStocks.pcs + +boxPcsToAdd === product.pcsPerBox) {
          newTotalStocks.pcs = 0;
          newTotalStocks.box += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.pcs + +boxPcsToAdd > product.pcsPerBox) {
          const dif = newTotalStocks.pcs + +boxPcsToAdd - product.pcsPerBox;
          newTotalStocks.box += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +boxPcsToAdd;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += sc * +boxPcsToAdd;
        }
      } else if (boxToAdd > 0 && boxPcsToAdd <= 0) {
        newStocks.box += +boxToAdd;
        newTotalStocks.box += +boxToAdd;
        newTotalCapital += +boxToAdd * +newCap;
      } else if (boxToAdd <= 0 && boxPcsToAdd > 0) {
        if (newStocks.pcs + +boxPcsToAdd === product.pcsPerBox) {
          newStocks.pcs = 0;
          newStocks.box += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +boxPcsToAdd > product.pcsPerBox) {
          const dif = newStocks.pcs + +boxPcsToAdd - product.pcsPerBox;
          newStocks.box += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +boxPcsToAdd;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += sc * +boxPcsToAdd;
        }

        if (newTotalStocks.pcs + +boxPcsToAdd === product.pcsPerBox) {
          newTotalStocks.pcs = 0;
          newTotalStocks.box += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.pcs + +boxPcsToAdd > product.pcsPerBox) {
          const dif = newTotalStocks.pcs + +boxPcsToAdd - product.pcsPerBox;
          newTotalStocks.box += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +boxPcsToAdd;
          const sc = +newCap / product.pcsPerBox;
          newTotalCapital += sc * +boxPcsToAdd;
        }
      }

      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: newTotalCapital,
        totalStocks: newTotalStocks,
        stocks: newStocks,
      });
    } else if (product.unit === unit.roll) {
      let newTotalCapital = product.totalCapital;

      const newStocks = {
        roll: product.stocks.roll,
        meter: product.stocks.meter,
      };

      const newTotalStocks = {
        roll: product.totalStocks.roll,
        meter: product.totalStocks.meter,
      };

      if (rollToAdd > 0 && meterToAdd > 0) {
        newStocks.roll += +rollToAdd;
        newTotalStocks.roll += +rollToAdd;
        newTotalCapital += +rollToAdd * +newCap;

        if (newStocks.meter + +meterToAdd === product.meterPerRoll) {
          newStocks.meter = 0;
          newStocks.roll += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.meter + +meterToAdd > product.meterPerRoll) {
          const dif = newStocks.meter + +meterToAdd - product.meterPerRoll;
          newStocks.roll += 1;
          newTotalCapital += +newCap;
          newStocks.meter = dif;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += dif * sc;
        } else {
          newStocks.meter += +meterToAdd;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += sc * +meterToAdd;
        }

        if (newTotalStocks.meter + +meterToAdd === product.meterPerRoll) {
          newTotalStocks.meter = 0;
          newTotalStocks.roll += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.meter + +meterToAdd > product.meterPerRoll) {
          const dif = newTotalStocks.meter + +meterToAdd - product.meterPerRoll;
          newTotalStocks.roll += 1;
          newTotalCapital += +newCap;
          newTotalStocks.meter = dif;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.meter += +meterToAdd;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += sc * +meterToAdd;
        }
      } else if (rollToAdd > 0 && meterToAdd <= 0) {
        newStocks.roll += +rollToAdd;
        newTotalStocks.roll += +rollToAdd;
        newTotalCapital += +rollToAdd * +newCap;
      } else if (rollToAdd <= 0 && meterToAdd > 0) {
        if (newStocks.meter + +meterToAdd === product.meterPerRoll) {
          newStocks.meter = 0;
          newStocks.roll += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.meter + +meterToAdd > product.meterPerRoll) {
          const dif = newStocks.meter + +meterToAdd - product.meterPerRoll;
          newStocks.roll += 1;
          newTotalCapital += +newCap;
          newStocks.meter = dif;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += dif * sc;
        } else {
          newStocks.meter += +meterToAdd;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += sc * +meterToAdd;
        }

        if (newTotalStocks.meter + +meterToAdd === product.meterPerRoll) {
          newTotalStocks.meter = 0;
          newTotalStocks.roll += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.meter + +meterToAdd > product.meterPerRoll) {
          const dif = newTotalStocks.meter + +meterToAdd - product.meterPerRoll;
          newTotalStocks.roll += 1;
          newTotalCapital += +newCap;
          newTotalStocks.meter = dif;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.meter += +meterToAdd;
          const sc = +newCap / product.meterPerRoll;
          newTotalCapital += sc * +meterToAdd;
        }
      }

      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: newTotalCapital,
        totalStocks: newTotalStocks,
        stocks: newStocks,
      });
    } else if (product.unit === unit.set) {
      let newTotalCapital = product.totalCapital;

      const newStocks = {
        set: product.stocks.set,
        pcs: product.stocks.pcs,
      };

      const newTotalStocks = {
        set: product.totalStocks.set,
        pcs: product.totalStocks.pcs,
      };

      if (setToAdd > 0 && setsPcsToAdd > 0) {
        newStocks.set += +setToAdd;
        newTotalStocks.set += +setToAdd;
        newTotalCapital += +setToAdd * +newCap;

        if (newStocks.pcs + +setsPcsToAdd === product.pcsPerSet) {
          newStocks.pcs = 0;
          newStocks.set += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +setsPcsToAdd > product.pcsPerSet) {
          const dif = newStocks.pcs + +setsPcsToAdd - product.pcsPerSet;
          newStocks.set += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +setsPcsToAdd;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += sc * +setsPcsToAdd;
        }

        if (newTotalStocks.pcs + +setsPcsToAdd === product.pcsPerSet) {
          newTotalStocks.pcs = 0;
          newTotalStocks.set += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.pcs + +setsPcsToAdd > product.pcsPerSet) {
          const dif = newTotalStocks.pcs + +setsPcsToAdd - product.pcsPerSet;
          newTotalStocks.set += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +setsPcsToAdd;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += sc * +setsPcsToAdd;
        }
      } else if (setToAdd > 0 && setsPcsToAdd <= 0) {
        newStocks.set += +setToAdd;
        newTotalStocks.set += +setToAdd;
        newTotalCapital += +setToAdd * +newCap;
      } else if (setToAdd <= 0 && setsPcsToAdd > 0) {
        if (newStocks.pcs + +setsPcsToAdd === product.pcsPerSet) {
          newStocks.pcs = 0;
          newStocks.set += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +setsPcsToAdd > product.pcsPerSet) {
          const dif = newStocks.pcs + +setsPcsToAdd - product.pcsPerSet;
          newStocks.set += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +setsPcsToAdd;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += sc * +setsPcsToAdd;
        }

        if (newTotalStocks.pcs + +setsPcsToAdd === product.pcsPerSet) {
          newTotalStocks.pcs = 0;
          newTotalStocks.set += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newTotalStocks.pcs + +setsPcsToAdd > product.pcsPerSet) {
          const dif = newTotalStocks.pcs + +setsPcsToAdd - product.pcsPerSet;
          newTotalStocks.set += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +setsPcsToAdd;
          const sc = +newCap / product.pcsPerSet;
          newTotalCapital += sc * +setsPcsToAdd;
        }
      }

      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: newTotalCapital,
        totalStocks: newTotalStocks,
        stocks: newStocks,
      });
    } else if (product.unit === unit.bundle) {
      let newTotalCapital = product.totalCapital;

      const newStocks = {
        bundle: product.stocks.bundle,
        pcs: product.stocks.pcs,
      };

      const newTotalStocks = {
        bundle: product.totalStocks.bundle,
        pcs: product.totalStocks.pcs,
      };

      if (bundleToAdd > 0 && bundlePcsToAdd > 0) {
        newStocks.bundle += +bundleToAdd;
        newTotalStocks.bundle += +bundleToAdd;
        newTotalCapital += +bundleToAdd * +newCap;

        if (newStocks.pcs + +bundlePcsToAdd === product.pcsPerBundle) {
          newStocks.pcs = 0;
          newStocks.bundle += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +bundlePcsToAdd > product.pcsPerBundle) {
          const dif = newStocks.pcs + +bundlePcsToAdd - product.pcsPerBundle;
          newStocks.bundle += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +bundlePcsToAdd;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += sc * +bundlePcsToAdd;
        }

        if (newTotalStocks.pcs + +bundlePcsToAdd === product.pcsPerBundle) {
          newTotalStocks.pcs = 0;
          newTotalStocks.bundle += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (
          newTotalStocks.pcs + +bundlePcsToAdd >
          product.pcsPerBundle
        ) {
          const dif =
            newTotalStocks.pcs + +bundlePcsToAdd - product.pcsPerBundle;
          newTotalStocks.bundle += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +bundlePcsToAdd;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += sc * +bundlePcsToAdd;
        }
      } else if (bundleToAdd > 0 && bundlePcsToAdd <= 0) {
        newStocks.bundle += +bundleToAdd;
        newTotalStocks.bundle += +bundleToAdd;
        newTotalCapital += +bundleToAdd * +newCap;
      } else if (bundleToAdd <= 0 && bundlePcsToAdd > 0) {
        if (newStocks.pcs + +bundlePcsToAdd === product.pcsPerBundle) {
          newStocks.pcs = 0;
          newStocks.bundle += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (newStocks.pcs + +bundlePcsToAdd > product.pcsPerBundle) {
          const dif = newStocks.pcs + +bundlePcsToAdd - product.pcsPerBundle;
          newStocks.bundle += 1;
          newTotalCapital += +newCap;
          newStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += dif * sc;
        } else {
          newStocks.pcs += +bundlePcsToAdd;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += sc * +bundlePcsToAdd;
        }

        if (newTotalStocks.pcs + +bundlePcsToAdd === product.pcsPerBundle) {
          newTotalStocks.pcs = 0;
          newTotalStocks.bundle += 1;
          newTotalCapital = newTotalCapital + 1 * +newCap;
        } else if (
          newTotalStocks.pcs + +bundlePcsToAdd >
          product.pcsPerBundle
        ) {
          const dif =
            newTotalStocks.pcs + +bundlePcsToAdd - product.pcsPerBundle;
          newTotalStocks.bundle += 1;
          newTotalCapital += +newCap;
          newTotalStocks.pcs = dif;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += dif * sc;
        } else {
          newTotalStocks.pcs += +bundlePcsToAdd;
          const sc = +newCap / product.pcsPerBundle;
          newTotalCapital += sc * +bundlePcsToAdd;
        }
      }

      await updateDoc(doc(db, "products", productId), {
        capital: +newCap,
        totalCapital: newTotalCapital,
        totalStocks: newTotalStocks,
        stocks: newStocks,
      });
    }

    const docSnap = await getDoc(doc(db, "products", productId));
    setProduct(docSnap.data());

    setIsRestock(false);
  };

  if (isLoaded) {
    return (
      <>
        <div className="product-detail">
          <div className="prod-actions">
            <button
              onClick={() => {
                setIsRestock(true);
                setNewCap(product.capital);
              }}
              onMouseEnter={() =>
                (document.getElementById("res").style.opacity = 1)
              }
              onMouseLeave={() =>
                (document.getElementById("res").style.opacity = 0)
              }
            >
              <HiMiniInboxArrowDown color="forestgreen" />
            </button>
            <small id="res">Restock</small>
            <button
              onMouseEnter={() =>
                (document.getElementById("ed").style.opacity = 1)
              }
              onMouseLeave={() =>
                (document.getElementById("ed").style.opacity = 0)
              }
              onClick={() => {
                setUpImg(product.productImage);
                setUpPname(product.productName);
                setUpUnit(product.unit);
                setUpCat(product.category);

                if (product.unit === unit.piece) {
                  setUpSpPcs(product.price);
                } else if (product.unit === unit.pack) {
                  setUpSpPack(product.price.pack);
                  setUpSpPackPcs(product.price.pcs);
                } else if (product.unit === unit.box) {
                  setUpSpBox(product.price.box);
                  setUpSpBoxPcs(product.price.pcs);
                } else if (product.unit === unit.roll) {
                  setUpSpRoll(product.price.roll);
                  setUpSpMeter(product.price.meter);
                } else if (product.unit === unit.set) {
                  setUpSpSet(product.price.set);
                  setUpSpSetPcs(product.price.pcs);
                } else if (product.unit === unit.pair) {
                  setUpSpPair(product.price);
                } else if (product.unit === unit.bundle) {
                  setUpSpBundle(product.price.bundle);
                  setUpSpBundlePcs(product.price.pcs);
                }

                setIsUpModal(true);
              }}
            >
              <BiSolidEdit color="orange" />
            </button>
            <small id="ed">Edit</small>
            <button
              onClick={() => setIsDeleteModal(true)}
              onMouseEnter={() =>
                (document.getElementById("del").style.opacity = 1)
              }
              onMouseLeave={() =>
                (document.getElementById("del").style.opacity = 0)
              }
            >
              <IoArchive color="red" />
            </button>
            <small id="del">Archive</small>
          </div>
          <div className="details">
            <div className="details-left">
              <img src={product.productImage} alt="prod" />
            </div>
            <div className="details-right">
              <table>
                <tr>
                  <td width="40%">
                    <b>Product Name</b>
                  </td>
                  <td width="60%">{product.productName}</td>
                </tr>
                <tr>
                  <td>
                    <b>Unit</b>
                  </td>
                  <td>{product.unit}</td>
                </tr>
                <tr>
                  <td>
                    <b>Category</b>
                  </td>
                  <td>{product.category}</td>
                </tr>
              </table>
              {product.unit === unit.piece ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">{product.totalStocks} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>{product.stocks} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Piece</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>{product.sold} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.pack ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.pack} Packs and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.pack} Packs and {product.stocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Pcs Per Pack</b>
                    </td>
                    <td>{product.pcsPerPack} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Pack</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.pack.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / pack and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.pack} Pack and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.box ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.box} Box and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.box} Box and {product.stocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Pcs Per Box</b>
                    </td>
                    <td>{product.pcsPerBox} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Box</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.box.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / box and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.box} Box and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.roll ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.roll} Roll and{" "}
                      {product.totalStocks.meter} Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.roll} Roll and {product.stocks.meter}{" "}
                      Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Meter Per Roll</b>
                    </td>
                    <td>{product.meterPerRoll} Meter</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Roll</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.roll.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Roll and ₱{" "}
                      {product.price.meter.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.roll} Roll and {product.sold.meter} Meter
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.set ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.set} Set and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.set} Set and {product.stocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Pcs Per Set</b>
                    </td>
                    <td>{product.pcsPerSet} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Set</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.set.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Set and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.set} Set and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.pair ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">{product.totalStocks} Pair</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>{product.stocks} Pair</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Pair</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>{product.sold} Pair</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : product.unit === unit.bundle ? (
                <table className="tbl">
                  <tr>
                    <td width="40%">
                      <b>Total Stocks</b>
                    </td>
                    <td width="60%">
                      {product.totalStocks.bundle} Bundle and{" "}
                      {product.totalStocks.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Stocks Left</b>
                    </td>
                    <td>
                      {product.stocks.bundle} Bundle and {product.stocks.pcs}{" "}
                      Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Pcs Per Bundle</b>
                    </td>
                    <td>{product.pcsPerBundle} Pcs</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total Capital</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.totalCapital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital Per Bundle</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.capital.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Selling Price</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.price.bundle.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Bundle and ₱{" "}
                      {product.price.pcs.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sold</b>
                    </td>
                    <td>
                      {product.sold.bundle} Bundle and {product.sold.pcs} Pcs
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sale</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.sales.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Income</b>
                    </td>
                    <td>
                      ₱{" "}
                      {product.income.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </table>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className={isUpModal ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body">
            <button className="modal-close" onClick={() => setIsUpModal(false)}>
              <RiCloseLine />
            </button>
            <div className="modal-content">
              <h3 className="modal-title">Edit Product</h3>
              <div className="modal-flex">
                <div className="modal-left">
                  <div className="img-preview">
                    <img id="uimg" alt="logo" src={upImg} />
                  </div>
                  <p>Product Image</p>
                  <input
                    type="file"
                    id="uimgs"
                    onChange={(e) => {
                      document.getElementById("uimg").src =
                        URL.createObjectURL(e.target.files[0]) + "#toolbar=0";
                      setImg2(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="modal-right">
                  <div className="input-group w-100">
                    <label>Product Name</label>
                    <input
                      id="prod-name"
                      type="text"
                      value={upPname}
                      onChange={(e) => setUpPname(e.target.value)}
                    />
                  </div>
                  <div className="input-group w-100">
                    <label>Category</label>
                    <select
                      onChange={(e) => {
                        handleSelectChange2(e.target.value);
                      }}
                    >
                      {categories.map((c, id) => (
                        <option
                          selected={c.name === upCat ? true : false}
                          value={JSON.stringify(c)}
                          key={id}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pcs */}

                  <div
                    className={
                      upUnit === "Piece"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpPcs}
                        onChange={(e) => setUpSpPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pack */}

                  <div
                    className={
                      upUnit === "Pack"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Pack</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpPack}
                        onChange={(e) => setUpSpPack(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-100">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpPackPcs}
                        onChange={(e) => setUpSpPackPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Box */}

                  <div
                    className={
                      upUnit === "Box"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Box</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpBox}
                        onChange={(e) => setUpSpBox(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-100">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpBoxPcs}
                        onChange={(e) => setUpSpBoxPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Roll */}

                  <div
                    className={
                      upUnit === "Roll"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Roll</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpRoll}
                        onChange={(e) => setUpSpRoll(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-100">
                      <label>Selling Price per Meter</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpMeter}
                        onChange={(e) => setUpSpMeter(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Set */}

                  <div
                    className={
                      upUnit === "Set"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Set</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpSet}
                        onChange={(e) => setUpSpSet(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-100">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpSetPcs}
                        onChange={(e) => setUpSpSetPcs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pair */}

                  <div
                    className={
                      upUnit === "Pair"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Pair</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpPair}
                        onChange={(e) => setUpSpPair(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bundle */}

                  <div
                    className={
                      upUnit === "Bundle"
                        ? "w-100 flex-wrap"
                        : "w-100 flex-wrap d-none"
                    }
                  >
                    <div className="input-group w-100">
                      <label>Selling Price per Bundle</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpBundle}
                        onChange={(e) => setUpSpBundle(e.target.value)}
                      />
                    </div>
                    <div className="input-group w-100">
                      <label>Selling Price per Piece</label>
                      <input
                        className="money"
                        type="number"
                        value={upSpBundlePcs}
                        onChange={(e) => setUpSpBundlePcs(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-container w-100">
                    <button
                      className="bg-orange"
                      id="ubtn"
                      onClick={() => updateProduct()}
                    >
                      Update Product
                    </button>
                  </div>
                </div>
              </div>
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
            <h3>Are you sure you want to archive this product?</h3>
            <p>
              This action will remove the product in the product list, but
              stayed in the database.
            </p>
            <button
              className="dbtns delete"
              onClick={() => deleteProd(productId)}
            >
              Archive
            </button>
            <button
              className="dbtns cancel"
              onClick={() => setIsDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className={isRestock ? "modal d-flex" : "modal d-none"}>
          <div className="modal-body-delete">
            <button className="modal-close" onClick={() => setIsRestock(false)}>
              <RiCloseLine />
            </button>
            <h3 className="modal-title">Restock Product</h3>

            <div className="input-group">
              <label>
                Capital Per{" "}
                {product.unit === unit.piece
                  ? "Pcs"
                  : product.unit === unit.pack
                  ? "Pack"
                  : product.unit === unit.box
                  ? "Box"
                  : product.unit === unit.roll
                  ? "Roll"
                  : product.unit === unit.set
                  ? "Set"
                  : product.unit === unit.bundle
                  ? "Bundle"
                  : "Pair"}
              </label>
              <input
                type="number"
                className="money"
                value={newCap}
                onChange={(e) => setNewCap(e.target.value)}
              />
            </div>

            <div className={product.unit === unit.piece ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Pcs)</label>
                <input
                  type="number"
                  value={pcsToAdd}
                  onChange={(e) => setPcsToAdd(e.target.value)}
                />
              </div>
            </div>

            <div className={product.unit === unit.pack ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Pack)</label>
                <input
                  type="number"
                  value={packToAdd}
                  onChange={(e) => setPackToAdd(e.target.value)}
                />
              </div>
              <div className="input-group mt-12px">
                <label>Qty to add (Pcs)</label>
                <input
                  type="number"
                  value={packPcsToAdd}
                  onChange={(e) => setPackPcsToAdd(e.target.value)}
                />
              </div>
            </div>

            <div className={product.unit === unit.box ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Box)</label>
                <input
                  type="number"
                  value={boxToAdd}
                  onChange={(e) => setBoxToAdd(e.target.value)}
                />
              </div>
              <div className="input-group mt-12px">
                <label>Qty to add (Pcs)</label>
                <input
                  type="number"
                  value={boxPcsToAdd}
                  onChange={(e) => setBoxPcsToAdd(e.target.value)}
                />
              </div>
            </div>

            <div className={product.unit === unit.roll ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Roll)</label>
                <input
                  type="number"
                  value={rollToAdd}
                  onChange={(e) => setRollToAdd(e.target.value)}
                />
              </div>
              <div className="input-group mt-12px">
                <label>Qty to add (Meter)</label>
                <input
                  type="number"
                  value={meterToAdd}
                  onChange={(e) => setMeterToAdd(e.target.value)}
                />
              </div>
            </div>

            <div className={product.unit === unit.set ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Set)</label>
                <input
                  type="number"
                  value={setToAdd}
                  onChange={(e) => setSetToAdd(e.target.value)}
                />
              </div>
              <div className="input-group mt-12px">
                <label>Qty to add (Pcs)</label>
                <input
                  type="number"
                  value={setsPcsToAdd}
                  onChange={(e) => setSetsPcsToAdd(e.target.value)}
                />
              </div>
            </div>

            <div className={product.unit === unit.pair ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Pair)</label>
                <input
                  type="number"
                  value={pairToAdd}
                  onChange={(e) => setPairToAdd(e.target.value)}
                />
              </div>
            </div>

            <div className={product.unit === unit.bundle ? "" : "d-none"}>
              <div className="input-group mt-12px">
                <label>Qty to add (Bundle)</label>
                <input
                  type="number"
                  value={bundleToAdd}
                  onChange={(e) => setBundleToAdd(e.target.value)}
                />
              </div>
              <div className="input-group mt-12px">
                <label>Qty to add (Pcs)</label>
                <input
                  type="number"
                  value={bundlePcsToAdd}
                  onChange={(e) => setBundlePcsToAdd(e.target.value)}
                />
              </div>
            </div>

            <br />
            <div className="text-right">
              <button
                className="dbtns delete"
                onClick={() => setIsRestock(false)}
              >
                Cancel
              </button>
              <button className="dbtns save" onClick={() => restockProduct()}>
                Save
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Product;
