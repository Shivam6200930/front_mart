import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./productDetails.css";

function ProductDetails() {
  const loggedIn = localStorage.getItem("loggedIn");
  const [userdata, setUserdata] = useState({
    id: "",
    cartItem: [],
  });
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        setUserdata({
          id: response.data.user._id,
          cartItem: response.data.user.cartItem,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const validatePincode = async (pin) => {
    if (!pin) {
      setPincodeError("Please enter a pincode.");
      return;
    }
    setLoading(true);
    setPincodeError("");

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
      if (response.data[0]?.Status === "Success") {
        const postOfficeDetails = response.data[0].PostOffice[0];
        setDistrict(postOfficeDetails.District);
        setVillage(postOfficeDetails.Name);

        const deliveryDays = Math.floor(Math.random() * 5) + 1;
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
        setDeliveryDate(estimatedDate.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }));
      } else {
        setDistrict("");
        setVillage("");
        setDeliveryDate("");
        setPincodeError("Invalid Pincode. Please enter a valid one.");
      }
    } catch (error) {
      console.error("Error validating pincode:", error);
      setPincodeError("Error validating pincode. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!loggedIn) {
      alert("Please log in to add items to the cart.");
      return;
    }
    setLoadingCart(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/add/${userdata.id}`,
        { productId: state._id, quantity: 1 },
        { withCredentials: true }
      );
      setUserdata((prev) => ({ ...prev, cartItem: response.data.cart }));
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="product-container">
      <div className="image-box">
        <img className="product-image" src={state.imageUrl} alt={state.name} />
        <div className="button-container">
          {loggedIn && !loadingCart ? (
            <button className="add-to-cart" onClick={addToCart}>
              Add to Cart
            </button>
          ) : (
            <button className="add-to-cart" disabled>
              {loadingCart ? "Adding..." : "Log in to add"}
            </button>
          )}
          <button className="home" onClick={() => navigate("/")}>Home</button>
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
          <button className="search-button" onClick={() => validatePincode(pincode)} disabled={loading}>
            {loading ? "Validating..." : "Search"}
          </button>
        </div>
        {pincodeError && <p className="error-message">{pincodeError}</p>}
        {deliveryDate && <p className="delivery-date">Estimated Delivery: {deliveryDate}</p>}
        {district && <p className="delivery-info"><strong>District:</strong> {district}</p>}
        {village && <p className="delivery-info"><strong>Village/Locality:</strong> {village}</p>}
      </div>
    </div>
  );
}

export default ProductDetails;
