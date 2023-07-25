import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Nav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navs() {
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Retrieve the logged-in username from local storage
    const storedUsername = localStorage.getItem("loggedInUsername");
    setLoggedInUsername(storedUsername);
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUsername");
    window.location.reload();
  };

  return (
    <div>
      <div className="my-nav">
        <div className="navigation-wrap bg-light start-header start-style">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <nav className="navbar navbar-expand-md navbar-light">
                  <a className="navbar-brand" target="_blank">
                    <img
                      src="https://assets.codepen.io/1462889/fcy.png"
                      alt=""
                    />
                  </a>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul className="navbar-nav ml-auto py-4 py-md-0">
                      <Link to="/home">
                        <li
                          className={`nav-item pl-4 pl-md-0 ml-0 ml-md-4 ${
                            location.pathname === "/home" ? "active" : ""
                          }`}
                        >
                          <a
                            className="nav-link dropdown-toggle"
                            data-toggle="dropdown"
                            role="button"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            Home
                          </a>
                        </li>
                      </Link>
                      <Link to="/Cars">
                        <li
                          className={`nav-item pl-4 pl-md-0 ml-0 ml-md-4 ${
                            location.pathname === "/Cars" ? "active" : ""
                          }`}
                        >
                          <a className="nav-link">Cars</a>
                        </li>
                      </Link>
                      <Link to="/invoice">
                        <li
                          className={`nav-item pl-4 pl-md-0 ml-0 ml-md-4 ${
                            location.pathname === "/invoice" ? "active" : ""
                          }`}
                        >
                          <a className="nav-link">Invoice</a>
                        </li>
                      </Link>
                      <Link to="/Search">
                        <li
                          className={`nav-item pl-4 pl-md-0 ml-0 ml-md-4 ${
                            location.pathname === "/Search" ? "active" : ""
                          }`}
                        >
                          <a className="nav-link" href="#">
                            Search
                          </a>
                        </li>
                      </Link>
                      <Link to="/Reports">
                        <li
                          className={`nav-item pl-4 pl-md-0 ml-0 ml-md-4 ${
                            location.pathname === "/Reports" ? "active" : ""
                          }`}
                        >
                          {" "}
                          <a className="nav-link" href="#">
                            Reports
                          </a>
                        </li>
                      </Link>
                    </ul>
                    <div className="form-inline my-2 my-lg-0">
                      <div className="navButton profile">
                        <div id="status-dropdown">
                          <div className="avatar">
                            <i
                              className="fa fa-circle status color-busy"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-circle status color-busy"
                              aria-hidden="true"
                            ></i>
                          </div>
                          <div id="status-dropdown-content">
                            <a href="#">
                              <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              Account Info
                            </a>
                            <a onClick={handleLogout}>
                              <i className="fas fa-sign-out-alt"></i>Log out
                            </a>
                          </div>
                        </div>
                        <div id="dropdown">
                          <span id="nav-username">{loggedInUsername}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navs;
