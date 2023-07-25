import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Seecars() {
  useEffect(() => {
    document.title = "See Cars";
  });

  const [currentDate, setCurrentDate] = useState("");

  const { id } = useParams();
  // **** for DB **** //

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    plateno: "",
    carName: "",
    carModel: "Toyota",
    engineType: "Automatic",
    receivedDate: getCurrentDate(),
  });

  const { plateno, carName, carModel, engineType, receivedDate } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://cms-api-zeta.vercel.app/register/Seecars/${id}`,
        {
          plateNo: plateno,
          carName: carName,
          carModel: carModel,
          engineType: engineType,
          receivedDate: currentDate,
        }
      );

      // Car added successfully
      Swal.fire({
        title: "Success!",
        text: "Car added successfully.",
        icon: "success",
      });

      // Clear the form input fields
      setFormData({
        plateno: "",
        carName: "",
        carModel: "Toyota",
        engineType: "Automatic",
        receivedDate: getCurrentDate(),
      });
    } catch (error) {
      // Error adding car
      Swal.fire({
        title: "Error!",
        text: "Failed to add car.",
        icon: "error",
      });
    }
  };

  // Set the current date as the initial value
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleInputChange = (e) => {
    setCurrentDate(e.target.value);
  };

  // **** Fetching from DB **** //

  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `https://cms-api-zeta.vercel.app/register/Seecars/${id}/cars`
        );
        const carsData = response.data;
        setCars(carsData);
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch cars.",
          icon: "error",
        });
      }
    };

    fetchCars();
  }, [id]);

  // ****End OF Fetching from DB **** //

  // **** End of DB **** //

  // **** Logged in "Username" **** //

  // **** End of Logged in "Username" **** //

  // **** Delete  **** //
  const handleDelete = async (carId) => {
    try {
      const response = await axios.delete(
        `https://cms-api-zeta.vercel.app/register/Seecars/${id}/${carId}`
      );

      // Car deleted successfully
      Swal.fire({
        title: "Success!",
        text: "Car deleted successfully.",
        icon: "success",
      });

      // Remove the deleted car from the state
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
    } catch (error) {
      // Error deleting car
      Swal.fire({
        title: "Error!",
        text: "Failed to delete car.",
        icon: "error",
      });
    }
  };

  return (
    <div style={{ paddingTop: "120px" }}>
      <div>
        <div className="container pt-4">
          <div className="row">
            <div className="col-md-4">
              <div class="form-group">
                <label for="carName">Car Name : </label>
                <input
                  type="text"
                  class="form-control"
                  name="carName"
                  value={carName}
                  onChange={handleChange}
                  placeholder="E.g Corolla"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div class="form-group">
                <label for="plateno">Plate No: </label>
                <input
                  type="text"
                  class="form-control"
                  name="plateno"
                  value={plateno}
                  onChange={handleChange}
                  placeholder="63987AA"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div class="form-group">
                <label for="carModel">Car Model: </label>
                <select
                  class="form-control"
                  name="carModel"
                  value={carModel}
                  onChange={handleChange}
                >
                  <option value="Toyota">Toyota</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Honda">Honda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Kia">Kia</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="BMW">BMW</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="GMC">GMC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div class="form-group">
                <label for="engineType">Engine Type: </label>
                <select
                  class="form-control"
                  name="engineType"
                  value={engineType}
                  onChange={handleChange}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div class="form-group">
                <label for="chkin"> Received Date :</label>
                <input
                  className="form-control"
                  name="chkin"
                  id="chkin"
                  type="date"
                  value={receivedDate}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div>
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
                    cars.map((car) => (
                      <tr key={car._id}>
                        <td>{car.carName}</td>
                        <td>{car.plateNo}</td>
                        <td>{car.carModel}</td>
                        <td>{car.engineType}</td>
                        <td>
                          {new Date(car.receivedDate).toLocaleDateString()}
                        </td>
                        <td>
                          <Link to={`/addservice/${car._id}`}>
                            <button className="btn btn-success">
                              Add Services
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(car._id)}
                          >
                            Delete
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
        </div>
      </div>
    </div>
  );
}

export default Seecars;
