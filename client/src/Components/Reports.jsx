import React, { useEffect, useState } from "react";
import moment from "moment";
import "./Reports.css";
import { fetchApi } from "../functions/inAppFunctions";
import Swal from "sweetalert2";

const Heading = ({ date, changeMonth, resetDate }) => (
  <nav className="calendar--nav">
    <a onClick={() => changeMonth(date.month() - 1)}>&#8249;</a>
    <h1 onClick={() => resetDate()}>
      {date.format("MMMM")} <small>{date.format("YYYY")}</small>
    </h1>
    <a onClick={() => changeMonth(date.month() + 1)}>&#8250;</a>
  </nav>
);

const Day = ({ currentDate, date, startDate, endDate, onClick }) => {
  let className = [];

  if (moment().isSame(date, "day")) {
    className.push("active");
  }

  if (date.isSame(startDate, "day")) {
    className.push("start");
  }

  if (date.isBetween(startDate, endDate, "day")) {
    className.push("between");
  }

  if (date.isSame(endDate, "day")) {
    className.push("end");
  }

  if (!date.isSame(currentDate, "month")) {
    className.push("muted");
  }

  return (
    <span
      onClick={() => onClick(date)}
      currentDate={date}
      className={className.join(" ")}
    >
      {date.date()}
    </span>
  );
};

const Days = ({ date, startDate, endDate, onClick }) => {
  const thisDate = moment(date);
  const daysInMonth = moment(date).daysInMonth();
  const firstDayDate = moment(date).startOf("month");
  const previousMonth = moment(date).subtract(1, "month");
  const previousMonthDays = previousMonth.daysInMonth();
  const nextMonth = moment(date).add(1, "month");
  let days = [];
  let labels = [];

  for (let i = 1; i <= 7; i++) {
    labels.push(<span className="label">{moment().day(i).format("ddd")}</span>);
  }

  for (let i = firstDayDate.day(); i > 1; i--) {
    previousMonth.date(previousMonthDays - i + 2);

    days.push(
      <Day
        key={moment(previousMonth).format("DD MM YYYY")}
        onClick={(date) => onClick(date)}
        currentDate={date}
        date={moment(previousMonth)}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }

  for (let i = 1; i <= daysInMonth; i++) {
    thisDate.date(i);

    days.push(
      <Day
        key={moment(thisDate).format("DD MM YYYY")}
        onClick={(date) => onClick(date)}
        currentDate={date}
        date={moment(thisDate)}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }

  const daysCount = days.length;
  for (let i = 1; i <= 42 - daysCount; i++) {
    nextMonth.date(i);
    days.push(
      <Day
        key={moment(nextMonth).format("DD MM YYYY")}
        onClick={(date) => onClick(date)}
        currentDate={date}
        date={moment(nextMonth)}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }

  return (
    <nav className="calendar--days">
      {labels.concat()}
      {days.concat()}
    </nav>
  );
};

const Reports = () => {
  const [date, setDate] = useState(moment());
  const [startDate, setStartDate] = useState(moment().subtract(5, "day"));
  const [endDate, setEndDate] = useState(moment().add(3, "day"));
  const [carData, setCarData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [report, setReport] = useState("");

  useEffect(() => {
    // Retrieve the logged-in username from local storage
    const storedUsername = localStorage.getItem("loggedInUsername");
    setLoggedInUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (carData[0] !== undefined) {
      let sort = [];
      carData.map((user) => {
        user.cars.map((carDetails) => {
          const receivedDate = new Date(
            carDetails.receivedDate
          ).toLocaleDateString();
          const start = new Date(startDate._d).toLocaleDateString();
          const end = new Date(endDate._d).toLocaleDateString();

          if (receivedDate >= start && receivedDate <= end) {
            sort.push(carDetails);
          }
        });
      });
      setAllCars(sort);
      setReport("cars");
    }
  }, [carData]);

  useEffect(() => {
    if (invoiceData[0] !== undefined) {
      let sort = [];
      invoiceData.map((invoice) => {
        const issuedDate = new Date(invoice.issuedDate).toLocaleDateString();
        const start = new Date(startDate._d).toLocaleDateString();
        const end = new Date(endDate._d).toLocaleDateString();

        if (issuedDate >= start && issuedDate <= end) {
          sort.push(invoice);
        }
      });
      setAllInvoices(sort);
    }
  }, [invoiceData]);

  const resetDate = () => {
    setDate(moment());
  };

  const changeMonth = (month) => {
    const updatedDate = moment(date);
    updatedDate.month(month);
    setDate(updatedDate);
  };

  const changeDate = (selectedDate) => {
    if (
      startDate === null ||
      selectedDate.isBefore(startDate, "day") ||
      !startDate.isSame(endDate, "day")
    ) {
      setStartDate(moment(selectedDate));
      setEndDate(moment(selectedDate));
    } else if (
      selectedDate.isSame(startDate, "day") &&
      selectedDate.isSame(endDate, "day")
    ) {
      setStartDate(null);
      setEndDate(null);
    } else if (selectedDate.isAfter(startDate, "day")) {
      setEndDate(moment(selectedDate));
    }
  };

  const generateReport = () => {
    // **** Fetching from DB **** //
    fetchApi(`register/Seecars/Allcars`, setCarData, false);
    fetchApi(`Services/Seeinvoice/Allinvoices`, setInvoiceData, false);
  };

  const notFound = () => {
    Swal.fire({
      title: "Error!",
      text: "No Invoice Found",
      icon: "error",
    });
    setReport("cars");
  };

  return (
    <div className="mainDiv" style={{ gap: report === "invoice" ? 0 : "50px" }}>
      <div className="calendar">
        <Heading
          date={date}
          changeMonth={(month) => changeMonth(month)}
          resetDate={resetDate}
        />
        <Days
          onClick={(date) => changeDate(date)}
          date={date}
          startDate={startDate}
          endDate={endDate}
        />
        <div className="container">
          <button className="btn btn-primary" onClick={generateReport}>
            {" "}
            Generate Report
          </button>
        </div>
      </div>
      {report === "" ? (
        <></>
      ) : report !== "cars" ? (
        <>
          <div className="backBtn">
            <button
              className="btn btn-success"
              onClick={() => setReport("cars")}
            >
              Back
            </button>
          </div>
          {allInvoices[0] !== undefined
            ? allInvoices.map((ele, ind) => {
                if (report === ele.carId) {
                  return (
                    <div key={ind} className="invoice-box">
                      <table cellPadding="0" cellSpacing="0">
                        <tr className="top">
                          <td colSpan="4">
                            <table>
                              <tr>
                                <td className="title">
                                  <img
                                    src="https://assets.codepen.io/1462889/fcy.png"
                                    style={{ width: "100%", maxWidth: "300px" }}
                                    alt="Logo"
                                  />
                                </td>
                                <td>
                                  Invoice #: {ele.invoiceNumber} <br />
                                  Created: {ele.issuedDate} <br />
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <tr className="information">
                          <td colSpan="4">
                            <table>
                              <tr>
                                <td>
                                  Faisal Carage, Inc.
                                  <br /> Alsharqiyah
                                  <br /> CA 12345
                                </td>

                                <td>
                                  Issued By: {loggedInUsername}
                                  <br /> Printed By: {loggedInUsername}
                                  <br />
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr className="heading">
                          <td>Item</td>
                          <td>Unit Cost</td>
                          <td>Quantity</td>
                          <td>Price</td>
                        </tr>
                        {ele.description.map((item, index) => (
                          <tr className="item" key={index}>
                            <td>{item.items}</td>
                            <td>{item.unitCost}</td>
                            <td>{item.quantity}</td>
                            <td>OMR {item.price}</td>
                          </tr>
                        ))}
                        <tr className="total">
                          <td colSpan="3"></td>
                          <td style={{ paddingTop: "25px" }}>
                            Total: OMR {ele.total}
                          </td>
                        </tr>
                      </table>
                    </div>
                  );
                } else {
                  notFound();
                }
              })
            : notFound()}
        </>
      ) : (
        <div className="container pt-4">
          <div class="container">
            <table class="table table-fixed">
              <thead>
                <tr>
                  <th class="col-xs-3">Name: </th>
                  <th class="col-xs-3">Plate No. </th>
                  <th class="col-xs-3">Car Model </th>
                  <th class="col-xs-6">Engine Type</th>
                  <th class="col-xs-6">Recieved Date </th>
                  <th class="col-xs-6"> </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(allCars) && allCars.length > 0 ? (
                  allCars.map((car) => (
                    <tr key={car._id}>
                      <td>{car.carName}</td>
                      <td>{car.plateNo}</td>
                      <td>{car.carModel}</td>
                      <td>{car.engineType}</td>
                      <td>{new Date(car.receivedDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => setReport(car._id)}
                        >
                          See Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No cars found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
