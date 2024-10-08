import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./productDetails.css";

function ProductDetails() {
  const [userdata, setUserdata] = useState({
    id: "",
    cartItem: [],
    loggedIn: false
  });

  const navigate = useNavigate();
  const { state } = useLocation();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
      const temp = {
        id: response.data.user._id,
        cartItem: response.data.user.cartItem,
        loggedIn: response.data.user.loggedIn
      };
      setUserdata(temp);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // Log the state object to ensure the product details are correctly passed
    console.log("Product state:", state);
    
    fetchData();
  }, [state]);
  
  useEffect(() => {
    
    fetchData();
  }, []);

  const addToCart = async () => {
    console.log("Product ID:", state._id)
    const newItem = {
      productId: state._id,
      name: state.name,
      imageUrl: state.imageUrl,
      price: state.price,
      quantity: 1 // Default quantity is 1, you can allow the user to specify quantity
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/add/${userdata.id}`,
        { productId: newItem.productId, quantity: newItem.quantity }, // Only sending necessary info
        { withCredentials: true }
      );
      console.log(response.data);
      setUserdata((prev) => ({
        ...prev,
        cartItem: response.data.cart, // Assuming the updated cart is returned from the backend
      }));
      navigate("/cart");
    } catch (e) {
      console.error(e);
    }
  };
  

  return (
    <div className="product-container">
      <div className="image-box">
        <img src={state.imageUrl} alt={state.name} />
        <div className="button-container">
          {userdata.loggedIn ? (
            <button className="add-to-cart" onClick={addToCart}>
              Add to Cart
            </button>
          ) : (
            <></>
          )}
          <button className="home" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>

      <div className="product-details">
        <h1 className="product-name">{state.name}</h1>
        <p className="price">Price: {state.price}</p>
        <p className="offers">Available Offers: 10% off with code</p>

        <div className="delivery-search">
          <input type="text" placeholder="Enter Pincode" />
          <button className="search-button">Search</button>
        </div>

        <div className="highlights">
          <p className="highlight-title">Highlights:</p>
          <ul className="highlight-list">
            <li>Easy payment options</li>
            <li>Free shipping on orders above 1000</li>
          </ul>
        </div>

        <div className="description">
          <p className="description-title">Description:</p>
          <p className="description-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in nisl vel justo fringilla ullamcorper.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
