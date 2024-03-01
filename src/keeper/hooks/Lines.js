import React from "react";
import { Line } from "react-chartjs-2";

const data = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      label: "Sales",
      data: [1023, 900, 3312, 1232, 980, 1000, 720],
      borderColor: "rgba(75, 192, 192, 1)", // Customize line color
      fill: false,
      tension: 0.6, // Adjust line tension for smoother curves
    },
  ],
};

const options = {
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Week",
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
  return <Line height={300} data={data} options={options} />;
};

export default LineChart;
