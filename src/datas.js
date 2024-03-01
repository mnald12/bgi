import p1 from "./images/prod1.jpg";
import p2 from "./images/prod2.jpg";
import p3 from "./images/prod3.jpg";
import p4 from "./images/prod4.jpg";

const products = [
  {
    productName: "Aclara Electric Meter",
    img: p1,
    unit: "Piece",
    data: {
      price: 1450,
      stocks: 231,
      totalStocks: 534,
      sold: 212,
    },
  },
  {
    productName: "OMNI Compact USB Extension Wire",
    img: p2,
    unit: "Piece",
    data: {
      price: 350,
      stocks: 431,
      totalStocks: 654,
      sold: 412,
    },
  },
  {
    productName: "Firefly Hand Bulb",
    img: p3,
    unit: "Piece",
    data: {
      price: 150,
      stocks: 683,
      totalStocks: 2114,
      sold: 817,
    },
  },
  {
    productName: "Firefly Rechargable Emergency Bulb",
    img: p4,
    unit: "Piece",
    data: {
      price: 250,
      stocks: 231,
      totalStocks: 1241,
      sold: 901,
    },
  },
];

const categories = [
  {
    name: "Pipes",
    sales: 12354,
  },
  {
    name: "Wires & Cables",
    sales: 22521,
  },
  {
    name: "Switches",
    sales: 6261,
  },
  {
    name: "Power Accessories",
    sales: 11591,
  },
  {
    name: "Conduit Fittings",
    sales: 9588,
  },
];

const sales = [];

const units = [
  {
    name: "Piece",
    method: null,
  },
  {
    name: "Pack",
    method: null,
  },
  {
    name: "Box",
    method: null,
  },
  {
    name: "Roll",
  },
  {
    name: "Set",
  },
  {
    name: "Pair",
  },
  {
    name: "Bundle",
  },
];

const todaysSales = 546;

const yesterdaysSales = 1235;

const thisMonthsSales = 19451;

const lastMonthsSales = 12415;

const thisYearSales = 190231;

const lastYearSales = 300123;

const todaysIncome = 78;

const yesterdaysIncome = 201;

const thisMonthsIncome = 5021;

const lastMonthsIncome = 6055;

const thisYearIncome = 40123;

const lastYearIncome = 91223;

export {
  products,
  categories,
  sales,
  units,
  todaysSales,
  yesterdaysSales,
  thisMonthsSales,
  lastMonthsSales,
  thisYearSales,
  lastYearSales,
  todaysIncome,
  yesterdaysIncome,
  thisMonthsIncome,
  lastMonthsIncome,
  thisYearIncome,
  lastYearIncome,
};
