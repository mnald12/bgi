import "../css/dashboard.css";
import growth from "../images/growth.png";
import profit from "../images/profit.png";
import caps from "../images/capital.png";
import LineChart from "../hooks/Lines";
import BarChart from "../hooks/BarChart";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../db/config";
import moment from "moment/moment";

const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const fn = (n) => {
  return Number(n).toLocaleString("en", options);
};

const checkDiff = (n1, n2) => {
  const p = 100 * Math.abs((n1 - n2) / ((n1 + n2) / 2)).toFixed(2);
  if (p > 100) return p - 100;
  else return p;
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

  useEffect(() => {
    const getPs = async () => {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      let tc = 0;
      let ts = 0;
      let ti = 0;

      for (let i of prods) {
        tc += i.totalCapital;
        ts += i.sales;
        ti += i.income;
      }

      setTotalCapital(tc);
      setTotalSales(ts);
      setTotalIncome(ti);
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

      for (let i of sales) {
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
    };

    getSales();

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
          <LineChart />
        </div>
        <div
          style={{
            position: "relative",
            marginTop: "20px",
            width: "100%",
            height: "100%",
          }}
        >
          <BarChart />
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Dashboard;
