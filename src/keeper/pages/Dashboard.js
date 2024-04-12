import "../css/dashboard.css";
import growth from "../images/growth.png";
import LineChart from "../hooks/Lines";
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

  useEffect(() => {
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

      let tms = 0;
      let lms = 0;

      let tys = 0;
      let lys = 0;

      for (let i of sales) {
        if (i.dates.year === y && i.dates.month === m && i.dates.day === d) {
          ts += i.sales;
          console.log("td");
        }
        if (
          i.dates.year === y &&
          i.dates.month === m &&
          i.dates.day === d - 1
        ) {
          ys += i.sales;
        }
        if (i.dates.year === y && i.dates.month === m) {
          tms += i.sales;
        }
        if (i.dates.year === y && i.dates.month === m - 1) {
          lms += i.sales;
        }

        if (i.dates.year === y) {
          tys += i.sales;
        }
        if (i.dates.year === y - 1) {
          lys += i.sales;
        }
      }

      setTodaysSales(ts);
      setYesterdaysSales(ys);
      setThisMonthsSales(tms);
      setLastMonthsSales(lms);
      setThisYearSales(tys);
      setLastYearSales(lys);
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
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Dashboard;
