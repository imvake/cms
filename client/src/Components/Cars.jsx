import React, { useState, useEffect } from "react";
import Navs from "./Navs";
import "./Invoice.css";
import axios from "axios";
import Swal from "sweetalert2";
import Addservice from "./Addservice";
import { Link } from "react-router-dom";

function Cars() {
  useEffect(() => {
    document.title = "Cars";
  });
  const avatar = "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Fetch registrations data from the server
    axios
      .get("https://cms-api-zeta.vercel.app/register/registrations")
      .then((response) => {
        const registrationsData = response.data;
        setRegistrations(registrationsData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this registration!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send delete request to the backend
        axios
          .delete(`https://cms-api-zeta.vercel.app/register/delete/${id}`)
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "Registration has been deleted.",
              icon: "success",
            });
            // Update the registration list on the client-side
            setRegistrations((prevRegistrations) =>
              prevRegistrations.filter(
                (registration) => registration._id !== id
              )
            );
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete registration.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div>
      <Navs />
      <div style={{ paddingTop: "100px" }}>
        <h1>Cars</h1>
        {registrations.map((registration) => (
          <div key={registration._id}>
            <div className="container pt-4">
              <div className="col-12">
                <div className="business-card">
                  <div className="media media-left">
                    <img
                      className="media-object img-circle profile-img rounded-circle"
                      src={avatar}
                    />

                    <div className="row">
                      <div className="col-12">
                        <div className="media-body pl-4">
                          <h4 className="media-heading">
                            <span style={{ color: "red" }}>Name:</span>{" "}
                            {registration.name}
                          </h4>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="media-body pl-4">
                          <h4 className="media-heading">
                            <span style={{ color: "green" }}>
                              Phone Number: &nbsp;
                            </span>
                            {registration.phoneNumber}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-6">
                          <Link to={`/Seecars/${registration._id}`}>
                            <button className="btn btn-success">
                              See Cars
                            </button>
                          </Link>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(registration._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
