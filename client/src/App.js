import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Invoice from "./Components/Invoice";
import Addservice from "./Components/Addservice";
import Navs from "./Components/Navs";
import Cars from "./Components/Cars";
import Seecars from "./Components/Seecars";
import Search from "./Components/Search";
import Reports from "./Components/Reports";
import SeeInvoice from "./Components/SeeInvoice";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated ? <Navs /> : <></>}
      <Routes>
        {!isAuthenticated ? (
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
        ) : (
          <>
            <Route
              path="/home"
              element={<Home isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/Cars"
              element={<Cars isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/invoice"
              element={<Invoice isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/addservice/:id"
              element={<Addservice isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/Seeinvoice/:id"
              element={<SeeInvoice isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/Seecars/:id"
              element={<Seecars isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/Search"
              element={<Search isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/Reports"
              element={<Reports isAuthenticated={isAuthenticated} />}
            />
          </>
        )}
        <Route path="/*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
