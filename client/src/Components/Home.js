import React from "react";
import { useState, useEffect } from "react";
import Navs from "./Navs";
import "./Home.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    document.title = "Home";
  });

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCardClick = () => {
    Swal.fire({
      title: "Register",
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Name" value="${name}">
        <input type="text" id="phoneNumber" class="swal2-input" placeholder="Phone Number" value="${phoneNumber}">
      `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const updatedName = document.getElementById("name").value;
        const updatedPhoneNumber = document.getElementById("phoneNumber").value;
        setName(updatedName);
        setPhoneNumber(updatedPhoneNumber);

        // Check if the phone number already exists
        axios
          .get(
            `https://cms-api-zeta.vercel.app/register/checkPhoneNumber/${updatedPhoneNumber}`
          )
          .then((response) => {
            const exists = response.data.exists;

            if (exists) {
              Swal.fire({
                title: "Error!",
                text: "Phone number already exists.",
                icon: "error",
              });
              setName("");
              setPhoneNumber("");
            } else {
              // Send registration data to the backend
              axios
                .post("https://cms-api-zeta.vercel.app/register/Users", {
                  name: updatedName,
                  phoneNumber: updatedPhoneNumber,
                })
                .then((response) => {
                  Swal.fire({
                    title: "Success!",
                    text: "Registration details submitted successfully.",
                    icon: "success",
                  });
                  setName("");
                  setPhoneNumber("");
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error!",
                    text: "Failed to submit registration details.",
                    icon: "error",
                  });
                });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to check phone number.",
              icon: "error",
            });
          });
      },
      confirmButtonText: "Submit",
    });
    setName("");
    setPhoneNumber("");
  };

  return (
    <div>
      <Navs></Navs>
      <div className="ccards" style={{ paddingTop: "120px" }}>
        <div className="container">
          <div className="row">
            <div className="col-6">
              <div className="card" onClick={handleCardClick}>
                <h1>Register</h1>
                {/* <p>1</p> */}
              </div>
            </div>
            <div className="col-6">
              <Link to="/Cars" style={{ textDecoration: "none" }}>
                <div className="card">
                  <h1>Cars</h1>
                  {/* <p>2</p> */}
                </div>
              </Link>
            </div>
            <div className="col-6">
              <Link to="/Reports" style={{ textDecoration: "none" }}>
                <div className="card">
                  <h1>Reports</h1>
                  {/* <p>3</p> */}
                </div>
              </Link>
            </div>
            <div className="col-6">
              <Link to="/Search" style={{ textDecoration: "none" }}>
                <div className="card">
                  <h1>Search</h1>
                  {/* <p>3</p> */}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
