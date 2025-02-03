import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./productDetails.css";

function ProductDetails() {
  const loggedIn = localStorage.getItem("loggedIn")
  const [userdata, setUserdata] = useState({
    id: "",
    cartItem: [],
  });
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [district, setDistrict] = useState("");  // State for district
  const [village, setVillage] = useState("");    // State for village
  const [pincodeError, setPincodeError] = useState(""); // Error message state
  const [loading, setLoading] = useState(false); // Loading state for the API call

  const navigate = useNavigate();
  const { state } = useLocation();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
      const temp = {
        id: response.data.user._id,
        cartItem: response.data.user.cartItem,
      };
      setUserdata(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to validate the pincode and display the district/village
  const validatePincode = async (pin) => {
    setLoading(true);
    setPincodeError(""); // Reset error message before validation

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
      if (response.data[0].Status === "Success") {
        // Reset error message and set district, village, delivery date
        const postOfficeDetails = response.data[0].PostOffice[0];
        setDistrict(postOfficeDetails.District);
        setVillage(postOfficeDetails.Name); // Name is assumed to refer to the village or locality

        // Set a random delivery date between 1-5 days from current date
        const maxDays = 5;
        const deliveryDays = Math.floor(Math.random() * maxDays) + 1;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
        const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        setDeliveryDate(formattedDate);

      } else {
        // Invalid pincode
        setDistrict(""); // Clear previous district data
        setVillage("");  // Clear previous village data
        setDeliveryDate(""); // Clear previous delivery date
        setPincodeError("Invalid Pincode. Please check and enter a valid pincode.");
      }
    } catch (error) {
      console.error(error);
      setPincodeError("Error validating pincode. Please try again.");
      setDistrict(""); // Clear previous district data
      setVillage("");  // Clear previous village data
      setDeliveryDate(""); // Clear previous delivery date
    } finally {
      setLoading(false);
    }
  };

  // Add product to the cart
  const addToCart = async () => {
    const newItem = {
      productId: state._id,
      name: state.name,
      imageUrl: state.imageUrl,
      price: state.price,
      quantity: 1
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/add/${userdata.id}`,
        { productId: newItem.productId, quantity: newItem.quantity },
        { withCredentials: true }
      );
      setUserdata((prev) => ({
        ...prev,
        cartItem: response.data.cart,
      }));
      navigate("/cart");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="product-container">
      <div className="image-box">
        <img className="product-image" src={state.imageUrl} alt={state.name} />
        <div className="button-container">
          {loggedIn && (
            <button className="add-to-cart" onClick={addToCart}>
              Add to Cart
            </button>
          )}
          <button className="home" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>

      <div className="product-details">
        <h1 className="product-name">{state.name}</h1>
        <p className="price">₹{state.price}</p>
        <p className="description">{state.description}</p>

        <div className="offers">
          <p className="offers-text">Available Offers: 10% off with code</p>
        </div>

        <div className="delivery-search">
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button className="search-button" onClick={() => validatePincode(pincode)}>
            {loading ? "Validating..." : "Search"}
          </button>
        </div>
        {pincodeError && <p className="error-message">{pincodeError}</p>}

        {deliveryDate && !pincodeError && (
          <p className="delivery-date">Estimated Delivery: {deliveryDate}</p>
        )}

        {/* Display district and village information only if pincode is valid */}
        {district && !pincodeError && (
          <p className="delivery-info"><strong>District:</strong> {district}</p>
        )}

        {village && !pincodeError && (
          <p className="delivery-info"><strong>Village/Locality:</strong> {village}</p>
        )}

        <div className="highlights">
          <p className="highlight-title">Highlights:</p>
          <ul className="highlight-list">
            <li>Easy payment options</li>
            <li>Free shipping on orders above ₹1000</li>
          </ul>
        </div>

        <div className="product-specifications">
          <h3>Product Specifications:</h3>
          <ul>
            <li>Feature1: {state.specifications?.Feature1}</li>
            <li>Feature2: {state.specifications?.Feature2}</li>
            <li>Feature3: {state.specifications?.Feature3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
