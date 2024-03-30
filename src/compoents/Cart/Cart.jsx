import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Cart = () => {
  const Navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
    if (storedCartItems.length === 0) {
      setFlag(false);
    }
    
    calculateTotalPrice(storedCartItems);
    toast.success("Add to cart sucessfull!!")
  }, []);

  const calculateTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
  };

  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
    toast.success("Remove from cart")
  };

  const increaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity += 1;
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
  };

  const decreaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity -= 1;
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
    }
  };

  const buyNow = () => {
    const orderPlaced = JSON.parse(localStorage.getItem('orderPlaced')) || [];
    const updatedOrderPlaced = [...orderPlaced, ...cartItems];
    localStorage.setItem('orderPlaced', JSON.stringify(updatedOrderPlaced));
    localStorage.setItem('cartItems', JSON.stringify([]));
    setCartItems([]);
    Navigate('/buy');
    {state:totalPrice}
  };

  return (
    <div id="container">
      <div id="cart-header">
        <span>Shopping Cart</span>
        <span>Total Price: ₹{totalPrice}</span>
      </div>

      <div id="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <p id="cart-item-title">{item.name}</p>
            <p id="cart-item-price">₹{item.price}</p>
            
            <div id="quantity-container">
              <button id="quantity-btn" onClick={() => decreaseQuantity(index)}>-</button>
              <span>{item.quantity}</span>
              <button id="quantity-btn" onClick={() => increaseQuantity(index)}>+</button>
            </div>

            <button id="remove-btn" onClick={() => removeFromCart(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div id="price-details">
        <h2>Price Details</h2>
        <div id="price-details-row">
          <span>Total Items:</span>
          <span>{cartItems.length}</span>
        </div>
        <div id="price-details-row">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      <div id="bottom-bar">
        <button id="continue-shopping-btn" onClick={() => Navigate("/admin")}>
          Continue Shopping
        </button>
        {flag && (
          <button id="buy-now-btn" onClick={buyNow}>
            Buy Now
          </button>
        )}
      </div>
      <ToastContainer position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Cart;
