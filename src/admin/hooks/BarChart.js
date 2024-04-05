import { Bar } from "react-chartjs-2";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../db/config";

const mapLabel = (arr) => {
  const newArray = [];

  for (let i of arr) {
    newArray.push(i.name);
  }

  return newArray;
};

const mapSale = (arr) => {
  const newArray = [];

  for (let i of arr) {
    newArray.push(i.sales);
  }

  return newArray;
};

let data;

const get = async () => {
  const q = query(collection(db, "categories"), orderBy("name"));
  const querySnapshot = await getDocs(q);
  if (querySnapshot) {
    const cats = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    data = {
      labels: mapLabel(cats),
      datasets: [
        {
          label: "Sales",
          data: mapSale(cats),
          backgroundColor: "midnightblue",
        },
      ],
    };
  }
};

get();

const BarChart = () => {
  return (
    <Bar height={300} data={data} options={{ maintainAspectRatio: false }} />
  );
};

export default BarChart;
