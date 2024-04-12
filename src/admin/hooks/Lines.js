import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { db } from "../../db/config";
import moment from "moment";

const data = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      label: "Sales",
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: "rgba(75, 192, 192, 1)", // Customize line color
      fill: false,
      tension: 0.6, // Adjust line tension for smoother curves
    },
    {
      label: "Income",
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: "rgba(255, 159, 64, 1)", // Customize line color
      fill: false,
      tension: 0.6,
    },
  ],
};

const options = {
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Weekly sales",
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Value",
      },
    },
  },
  maintainAspectRatio: false,
};

const LineChart = () => {
  useEffect(() => {
    let mon = moment().weekday(1)._d.getDate();
    let tue = moment().weekday(2)._d.getDate();
    let wed = moment().weekday(3)._d.getDate();
    let thu = moment().weekday(4)._d.getDate();
    let Fri = moment().weekday(5)._d.getDate();
    let Sat = moment().weekday(6)._d.getDate();
    let sun = moment().weekday(7)._d.getDate();

    console.log(mon);

    const getSales = async () => {
      const q = query(collection(db, "sales"));
      const querySnapshot = await getDocs(q);
      const sales = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      for (let i of sales) {
        if (i.dates.day === sun) {
          data.datasets[0].data[0] = i.sales;
          data.datasets[1].data[0] = i.income;
        }
        if (i.dates.day === mon) {
          data.datasets[0].data[1] = i.sales;
          data.datasets[1].data[1] = i.income;
        }
        if (i.dates.day === tue) {
          data.datasets[0].data[2] = i.sales;
          data.datasets[1].data[2] = i.income;
        }
        if (i.dates.day === wed) {
          data.datasets[0].data[3] = i.sales;
          data.datasets[1].data[3] = i.income;
        }
        if (i.dates.day === thu) {
          data.datasets[0].data[4] = i.sales;
          data.datasets[1].data[4] = i.income;
        }
        if (i.dates.day === Fri) {
          data.datasets[0].data[5] = i.sales;
          data.datasets[1].data[5] = i.income;
        }
        if (i.dates.day === Sat) {
          data.datasets[0].data[6] = i.sales;
          data.datasets[1].data[6] = i.income;
        }
      }
    };

    getSales();
  }, []);

  return <Line height={300} data={data} options={options} />;
};

export default LineChart;
