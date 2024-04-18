import "../css/dashboard.css";
import growth from "../images/growth.png";
import profit from "../images/profit.png";
import caps from "../images/capital.png";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../db/config";
import moment from "moment/moment";
import { Bar, Line } from "react-chartjs-2";

const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const fn = (n) => {
  return Number(n).toLocaleString("en", options);
};

const checkDiff = (n1, n2) => {
  const p = Math.round(100 * Math.abs((n1 - n2) / ((n1 + n2) / 2)).toFixed(2));
  if (p > 100) return p - 100;
  else return p;
};

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

const lineOptions = {
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

const Dashboard = () => {
  const [isLoaded, setIsloaded] = useState(false);

  const [todaysSales, setTodaysSales] = useState(0);
  const [yesterdaysSales, setYesterdaysSales] = useState(0);
  const [thisMonthsSales, setThisMonthsSales] = useState(0);
  const [lastMonthsSales, setLastMonthsSales] = useState(0);
  const [thisYearSales, setThisYearSales] = useState(0);
  const [lastYearSales, setLastYearSales] = useState(0);

  const [todaysIncome, setTodaysIncome] = useState(0);
  const [yesterdaysIncome, setYesterdaysIncome] = useState(0);
  const [thisMonthsIncome, setThisMonthsIncome] = useState(0);
  const [lastMonthsIncome, setLastMonthsIncome] = useState(0);
  const [thisYearIncome, setThisYearIncome] = useState(0);
  const [lastYearIncome, setLastYearIncome] = useState(0);

  const [totalSales, setTotalSales] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalCapital, setTotalCapital] = useState(0);

  const [barData, setBarData] = useState({});
  const [lineDatas, setLineDatas] = useState({});

  useEffect(() => {
    const getPs = async () => {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      let tc = 0;

      for (let i of prods) {
        tc += i.totalCapital;
      }

      setTotalCapital(tc);
    };

    getPs();

    const getSales = async () => {
      const q = query(collection(db, "sales"));
      const querySnapshot = await getDocs(q);
      const sales = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      const m = +moment().format("M");
      const d = +moment().format("D");
      const y = +moment().format("YYYY");

      let ts = 0;
      let ys = 0;

      let ti = 0;
      let ty = 0;

      let tms = 0;
      let lms = 0;

      let tmi = 0;
      let lmi = 0;

      let tys = 0;
      let lys = 0;

      let tyi = 0;
      let lyi = 0;

      let tfs = 0;
      let tfi = 0;

      for (let i of sales) {
        tfs += i.sales;
        tfi += i.income;

        if (i.dates.year === y && i.dates.month === m && i.dates.day === d) {
          ts += i.sales;
          ti += i.income;
          console.log("td");
        }
        if (
          i.dates.year === y &&
          i.dates.month === m &&
          i.dates.day === d - 1
        ) {
          ys += i.sales;
          ty += i.income;
        }
        if (i.dates.year === y && i.dates.month === m) {
          tms += i.sales;
          tmi += i.income;
        }
        if (i.dates.year === y && i.dates.month === m - 1) {
          lms += i.sales;
          lmi += i.income;
        }

        if (i.dates.year === y) {
          tys += i.sales;
          tyi += i.income;
        }
        if (i.dates.year === y - 1) {
          lys += i.sales;
          lyi += i.income;
        }
      }

      setTodaysSales(ts);
      setYesterdaysSales(ys);
      setThisMonthsSales(tms);
      setLastMonthsSales(lms);
      setThisYearSales(tys);
      setLastYearSales(lys);
      setTodaysIncome(ti);
      setYesterdaysIncome(ty);
      setThisMonthsIncome(tmi);
      setLastMonthsIncome(lmi);
      setThisYearIncome(tyi);
      setLastYearIncome(lyi);

      setTotalSales(tfs);
      setTotalIncome(tfi);
    };

    getSales();

    const getCats = async () => {
      const q = query(collection(db, "categories"));
      const querySnapshot = await getDocs(q);
      const cats = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const bdata = {
        labels: mapLabel(cats),
        datasets: [
          {
            label: "Sales",
            data: mapSale(cats),
            backgroundColor: "midnightblue",
          },
        ],
      };
      setBarData(bdata);
    };

    getCats();

    const setLines = async () => {
      let mon = moment().weekday(1)._d.getDate();
      let tue = moment().weekday(2)._d.getDate();
      let wed = moment().weekday(3)._d.getDate();
      let thu = moment().weekday(4)._d.getDate();
      let Fri = moment().weekday(5)._d.getDate();
      let Sat = moment().weekday(6)._d.getDate();
      let sun = moment().weekday(7)._d.getDate();

      const q = query(collection(db, "sales"));
      const querySnapshot = await getDocs(q);
      const sales = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      const lineData = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
          {
            label: "Sales",
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
            tension: 0.6,
          },
          {
            label: "Income",
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: "rgba(255, 159, 64, 1)",
            fill: false,
            tension: 0.6,
          },
        ],
      };

      for (let i of sales) {
        if (i.dates.day === sun) {
          lineData.datasets[0].data[0] += i.sales;
          lineData.datasets[1].data[0] += i.income;
        }
        if (i.dates.day === mon) {
          lineData.datasets[0].data[1] += i.sales;
          lineData.datasets[1].data[1] += i.income;
        }
        if (i.dates.day === tue) {
          lineData.datasets[0].data[2] += i.sales;
          lineData.datasets[1].data[2] += i.income;
        }
        if (i.dates.day === wed) {
          lineData.datasets[0].data[3] += i.sales;
          lineData.datasets[1].data[3] += i.income;
        }
        if (i.dates.day === thu) {
          lineData.datasets[0].data[4] += i.sales;
          lineData.datasets[1].data[4] += i.income;
        }
        if (i.dates.day === Fri) {
          lineData.datasets[0].data[5] += i.sales;
          lineData.datasets[1].data[5] += i.income;
        }
        if (i.dates.day === Sat) {
          lineData.datasets[0].data[6] += i.sales;
          lineData.datasets[1].data[6] += i.income;
        }
      }

      setLineDatas(lineData);
    };

    setLines();

    setTimeout(() => {
      setIsloaded(true);
    }, 1000);
  }, []);

  if (isLoaded) {
    return (
      <div className="dashboard">
        <h3 className="page-title">Dashboard</h3>
        <div className="dash-container">
          <div className="dashcard-3">
            <div className="card-content">
              <p>Today's Sales</p>
              <h4>₱ {fn(todaysSales)}</h4>
              <div className="card-bottom">
                <p>₱ {fn(yesterdaysSales)} Yesterday</p>
                {todaysSales > yesterdaysSales ? (
                  <b>+{checkDiff(todaysSales, yesterdaysSales)}%</b>
                ) : (
                  <b className="color-red">
                    -{checkDiff(todaysSales, yesterdaysSales)}%
                  </b>
                )}
              </div>
            </div>
            <div className="logo">
              <img src={growth} alt="growth" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>This Month's Sales</p>
              <h4>₱ {fn(thisMonthsSales)}</h4>
              <div className="card-bottom">
                <p>₱ {fn(lastMonthsSales)} Last Month</p>
                {thisMonthsSales > lastMonthsSales ? (
                  <b>+{checkDiff(thisMonthsSales, lastMonthsSales)}%</b>
                ) : (
                  <b className="color-red">
                    -{checkDiff(thisMonthsSales, lastMonthsSales)}%
                  </b>
                )}
              </div>
            </div>
            <div className="logo">
              <img src={growth} alt="growth" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>This Year's Sales</p>
              <h4>₱ {fn(thisYearSales)}</h4>
              <div className="card-bottom">
                <p>₱ {fn(lastYearSales)} Last Year</p>
                {thisYearSales > lastYearSales ? (
                  <b>+{checkDiff(thisYearSales, lastYearSales)}%</b>
                ) : (
                  <b className="color-red">
                    -{checkDiff(thisYearSales, lastYearSales)}%
                  </b>
                )}
              </div>
            </div>
            <div className="logo">
              <img src={growth} alt="growth" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>Today's Income</p>
              <h4>₱ {fn(todaysIncome)}</h4>
              <div className="card-bottom">
                <p>₱ {fn(yesterdaysIncome)} Yesterday</p>
                {todaysIncome > yesterdaysIncome ? (
                  <b>+{checkDiff(todaysIncome, yesterdaysIncome)}%</b>
                ) : (
                  <b className="color-red">
                    -{checkDiff(todaysIncome, yesterdaysIncome)}%
                  </b>
                )}
              </div>
            </div>
            <div className="logo">
              <img src={profit} alt="profit" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>This Month's Income</p>
              <h4>₱ {fn(thisMonthsIncome)}</h4>
              <div className="card-bottom">
                <p>₱ {fn(lastMonthsIncome)} Last Month</p>
                {thisMonthsIncome > lastMonthsIncome ? (
                  <b>+{checkDiff(thisMonthsIncome, lastMonthsIncome)}%</b>
                ) : (
                  <b className="color-red">
                    -{checkDiff(thisMonthsIncome, lastMonthsIncome)}%
                  </b>
                )}
              </div>
            </div>
            <div className="logo">
              <img src={profit} alt="profit" />
            </div>
          </div>

          <div className="dashcard-3">
            <div className="card-content">
              <p>This Year's Income</p>
              <h4>₱ {fn(thisYearIncome)}</h4>
              <div className="card-bottom">
                <p>₱ {fn(lastYearIncome)} Last Year</p>
                {thisYearIncome > lastYearIncome ? (
                  <b>+{checkDiff(thisYearIncome, lastYearIncome)}%</b>
                ) : (
                  <b className="color-red">
                    -{checkDiff(thisYearIncome, lastYearIncome)}%
                  </b>
                )}
              </div>
            </div>
            <div className="logo">
              <img src={profit} alt="profit" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>Total Capital</p>
              <h4>
                ₱{" "}
                {totalCapital.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className="logo">
              <img src={caps} alt="profit" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>Total Sales</p>
              <h4>
                ₱{" "}
                {totalSales.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className="logo">
              <img src={growth} alt="profit" />
            </div>
          </div>
          <div className="dashcard-3">
            <div className="card-content">
              <p>Total Income</p>
              <h4>
                ₱{" "}
                {totalIncome.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className="logo">
              <img src={profit} alt="profit" />
            </div>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            marginTop: "20px",
            width: "100%",
            height: "100%",
          }}
        >
          <Line height={300} data={lineDatas} options={lineOptions} />
        </div>
        <div
          style={{
            position: "relative",
            marginTop: "20px",
            width: "100%",
            height: "100%",
          }}
        >
          <Bar
            height={300}
            data={barData}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Dashboard;
