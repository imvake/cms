import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login({ onLogin, isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the logged-in username from local storage
    const loggedInUser = localStorage.getItem("loggedInUsername");
    setUsername(loggedInUser);

    if (loggedInUser !== null && loggedInUser !== undefined) {
      navigate("/home", { replace: true }); // If already authenticated, redirect to home page
      setIsAuthenticated(true);
    } else {
      setLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      console.log(response);
      // Handle success response and set loggedIn state to true
      setMsg(response.data.message);
      onLogin(); // Call the onLogin callback to update the isAuthenticated state
      localStorage.setItem("loggedInUsername", username);
      navigate("/home"); // Navigate to the home page

      // Display SweetAlert notification for successful login
      Swal.fire({
        icon: "success",
        title: "Logged In",
        text: `Logged in as ${username}`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      setMsg("An error occurred");

      // Display SweetAlert notification for unsuccessful login
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid username or password",
      });
    }
  };

  return (
    <>
      {loggedIn ? (
        <div className="pt-4">
          <section className="vh-100">
            <div className="container-fluid h-custom">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-md-9 col-lg-6 col-xl-5">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                    className="img-fluid"
                    alt="Sample image"
                  />
                </div>
                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example3"
                        className="form-control form-control-lg"
                        placeholder="Enter a valid email address"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <label className="form-label" htmlFor="form3Example3">
                        Email address
                      </label>
                    </div>

                    <div className="form-outline mb-3">
                      <input
                        type="password"
                        id="form3Example4"
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label className="form-label" htmlFor="form3Example4">
                        Password
                      </label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          value=""
                          id="form2Example3"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form2Example3"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{
                          paddingLeft: "2.5rem",
                          paddingRight: "2.5rem",
                        }}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  <span>{msg}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Login;
