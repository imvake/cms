import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./see-invoice.css";
import { fetchApi } from "../functions/inAppFunctions";

const SeeInvoice = () => {
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [selectID, setSelectedID] = useState("");
  const [cars, setCars] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [ids, setIds] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    document.title = "Invoice";

    const pay = localStorage.getItem("buttons");
    if (pay !== undefined && pay !== null) {
      setIds(JSON.parse(pay));
    }

    // Retrieve the logged-in username from local storage
    const storedUsername = localStorage.getItem("loggedInUsername");
    setLoggedInUsername(storedUsername);

    // **** Fetching from DB **** //
    fetchApi(`register/Seecars/${id}/cars`, setCars, false);
  }, [id]);

  useEffect(() => {
    if (selectID !== "") {
      // **** Fetching from DB **** //
      fetchApi(
        `Services/Seeinvoice/${selectID}/invoices`,
        setInvoices,
        setSelectedID
      );
    }
  }, [selectID]);

  const addID = (id) => {
    setSelectedID(id);
    setIds([...ids, id]);
    let buttons = ids;
    buttons.push(id);
    localStorage.setItem("buttons", JSON.stringify(buttons));
  };

  return (
    <>
      {selectID !== "" ? (
        <div className="mainInvoiceDiv">
          <div className="backBtnDiv">
            <button
              className="btn btn-success"
              onClick={() => setSelectedID("")}
            >
              Back
            </button>
          </div>
          {invoices.map((ele, ind) => {
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
          })}
        </div>
      ) : (
        <div className="display-cars">
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
                  {Array.isArray(cars) && cars.length > 0 ? (
                    cars.map((car) => {
                      let flag = ids.includes(car._id);
                      return (
                        <tr key={car._id}>
                          <td>{car.carName}</td>
                          <td>{car.plateNo}</td>
                          <td>{car.carModel}</td>
                          <td>{car.engineType}</td>
                          <td colSpan={flag ? 2 : 1}>
                            {new Date(car.receivedDate).toLocaleDateString()}
                          </td>
                          {!flag ? (
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => addID(car._id)}
                              >
                                Pay
                              </button>
                            </td>
                          ) : (
                            <></>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">No cars found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeeInvoice;
