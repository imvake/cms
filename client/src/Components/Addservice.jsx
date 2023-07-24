import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Addservice.css";
import { useParams } from "react-router";

// to generate Random Invoice
function generateRandomInvoiceNumber() {
  const randomDigits = Math.floor(Math.random() * 1000000);
  return `INV-${randomDigits}`;
}

// to get the current Date
function getCurrentDate() {
  const date = new Date();
  const formattedDate = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
  return formattedDate;
}

function Addservice() {
  useEffect(() => {
    document.title = "Add Service";
  });

  const carId = useParams().id;

  const [items, setItems] = useState([
    { description: "", price: 0, quantity: 0 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState(
    generateRandomInvoiceNumber()
  );
  const [issuedDate, setIssuedDate] = useState(getCurrentDate());
  const [loggedInUsername, setLoggedInUsername] = useState("");

  // to get the Username
  useEffect(() => {
    // Retrieve the logged-in username from local storage
    const storedUsername = localStorage.getItem("loggedInUsername");
    setLoggedInUsername(storedUsername);
  }, []);

  const addRow = () => {
    setItems([...items, { description: "", price: 0, quantity: 0 }]);
  };

  const deleteRow = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    let total = 0;
    items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const itemDiscount = itemTotal * (discount / 100);
      total += itemTotal - itemDiscount;
    });
    return total;
  };

  const handleSubmit = async () => {
    try {
      const formattedItems = items.map((item) => ({
        items: item.description,
        unitCost: item.price,
        quantity: item.quantity,
        price: item.price * item.quantity,
      }));

      const response = await axios.post(
        "http://localhost:3001/Services/payments",
        {
          carId,
          invoiceNumber,
          issuedDate,
          issuedBy: loggedInUsername,
          description: formattedItems,
          total: calculateTotal(),
        }
      );

      // Payment added successfully
      Swal.fire({
        title: "Success!",
        text: "Payment added successfully.",
        icon: "success",
      });

      // Clear the form and set initial values
      setInvoiceNumber(generateRandomInvoiceNumber());
      setIssuedDate(getCurrentDate());
      setItems([{ description: "", price: 0, quantity: 0 }]);
      setDiscount(0);
    } catch (error) {
      // Error adding payment
      Swal.fire({
        title: "Error!",
        text: "Failed to add payment.",
        icon: "error",
      });
    }
  };

  return (
    <div
      className="invoice-box"
      style={{ marginTop: "160px", marginBottom: "50px" }}
    >
      <table cellPadding="0" cellSpacing="0">
        <tr className="top">
          <td colSpan="5">
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
                  Invoice #: {invoiceNumber} <br />
                  Created: {issuedDate} <br />
                  Due: {issuedDate}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr className="information">
          <td colSpan="5">
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
                  {/* {loggedInUsername}@gmail.com */}
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

        {items.map((item, index) => (
          <tr className="item" key={index}>
            <td>
              <input
                type="text"
                value={item.description}
                onChange={(e) => {
                  const updatedItems = [...items];
                  updatedItems[index].description = e.target.value;
                  setItems(updatedItems);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={item.price}
                onChange={(e) => {
                  const updatedItems = [...items];
                  updatedItems[index].price = parseFloat(e.target.value);
                  setItems(updatedItems);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const updatedItems = [...items];
                  updatedItems[index].quantity = parseInt(e.target.value);
                  setItems(updatedItems);
                }}
              />
            </td>
            <td>
              OMR{" "}
              {(item.price * item.quantity * (1 - discount / 100)).toFixed(2)}
            </td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => deleteRow(index)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}

        <tr>
          <td colSpan="6">
            <button className="btn-add-row btn btn-success" onClick={addRow}>
              Add Service
            </button>
          </td>
        </tr>

        <tr className="total">
          <td colSpan="3"></td>
          <td>Total: OMR {calculateTotal().toFixed(2)}</td>
        </tr>
      </table>
      <button className="btn btn-success" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Addservice;
