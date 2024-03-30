import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./productDetails.css";

function ProductDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);

  const addToCart = () => {
    const existingCartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    const isProductInCart = existingCartItems.some(
      (item) => item.name === state.name
    );

    if (!isProductInCart) {
      const updatedCartItems = [
        ...existingCartItems,
        {
          name: state.name,
          imageUrl: state.imageUrl,
          price: state.price,
          quantity: state.quantity,
        },
      ];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
    navigate("/cart");
  };

  return (
    <div className="product-container">
      <div className="image-box">
        <img src={state.imageUrl} alt={state.name} />
        <div className="button-container">
          {localStorage.getItem('loggedIn')?(<button className="add-to-cart" onClick={addToCart}>
            Add to Cart
          </button>):(
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

        {/* Delivery Pincode Search Bar */}
        <div className="delivery-search">
          <input type="text" placeholder="Enter Pincode" />
          <button className="search-button">Search</button>
        </div>

        {/* Highlights */}
        <div className="highlights">
          <p className="highlight-title">Highlights:</p>
          <ul className="highlight-list">
            <li>Easy payment options</li>
            <li>Free shipping on orders above 1000</li>
          </ul>
        </div>

        {/* Description */}
        <div className="description">
          <p className="description-title">Description:</p>
          <p className="description-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            nisl vel justo fringilla ullamcorper.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
