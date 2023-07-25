import axios from "axios";
import Swal from "sweetalert2";

const fetchApi = async (url, setState, resetState) => {
  try {
    const response = await axios.get(`https://cms-api-zeta.vercel.app/${url}`);
    setState(response.data);
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response.data.message || "Fetch Error.",
      icon: "error",
    });
    if (resetState) {
      resetState("");
    }
  }
};

export { fetchApi };
