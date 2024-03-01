import CountUp from "react-countup";
import "../css/dashboard.css";
import growth from "../images/growth.png";
import LineChart from "../hooks/Lines";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import {
  lastMonthsSales,
  lastYearSales,
  thisMonthsSales,
  thisYearSales,
  todaysSales,
  yesterdaysSales,
} from "../../datas";

const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const fn = (n) => {
  return Number(n).toLocaleString("en", options);
};

const checkDiff = (n1, n2) => {
  return 100 * Math.abs((n1 - n2) / ((n1 + n2) / 2)).toFixed(2);
};

const Dashboard = () => {
  const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
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
              <h4>
                ₱{" "}
                <CountUp
                  end={todaysSales}
                  duration={3}
                  decimals={2}
                  decimal="."
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
              </h4>
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
              <h4>
                ₱{" "}
                <CountUp
                  end={thisMonthsSales}
                  duration={3}
                  decimals={2}
                  decimal="."
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
              </h4>
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
              <h4>
                ₱{" "}
                <CountUp
                  end={thisYearSales}
                  duration={3}
                  decimals={2}
                  decimal="."
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
              </h4>
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
