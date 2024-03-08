import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { useEffect, useState } from "react";

const Sample = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const af = async () => {
      const docRef = doc(db, "users", "admin");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUser(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    af();
  }, []);

  return <h1>assdsa</h1>;
};

export default Sample;
