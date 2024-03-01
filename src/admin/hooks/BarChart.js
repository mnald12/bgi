import React from "react";
import { Bar } from "react-chartjs-2";
import { categories } from "../../datas";

const labelsValue = [];
const dataValue = [];

for (let i of categories) {
  labelsValue.push(i.name);
  dataValue.push(i.sales);
}

const data = {
  labels: labelsValue,
  datasets: [
    {
      label: "Sales",
      data: dataValue,
      backgroundColor: "midnightblue", // Customize bar color
    },
    // Add more datasets as needed
  ],
};

const BarChart = () => {
  return (
    <Bar height={300} data={data} options={{ maintainAspectRatio: false }} />
  );
};

export default BarChart;
