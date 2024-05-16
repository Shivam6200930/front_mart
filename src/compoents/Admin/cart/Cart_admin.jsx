import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Cart_admin.css';
import { toast } from 'react-toastify'; 
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
    toast.success("Add to cart sucessfull!!"); 
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
    toast.success("Remove from cart");
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
    const temp_cart=[cartItems]
    localStorage.setItem('buyProducts',JSON.stringify(temp_cart));
    // const updatedOrderPlaced = [...cartItems,cartItems];
    // localStorage.setItem('old_orderPlaced', JSON.stringify(updatedOrderPlaced));
    localStorage.setItem('cartItems', JSON.stringify([]));
    setCartItems([]);
    Navigate('/buy_admin');
  };

  return (
    <div className="container">
      {/* <div className="cart-header">
        <span>Shopping Cart</span>
        <span>Total Price: ₹{totalPrice}</span>
      </div> */}
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <p id="cart-item-title">{item.name}</p>
            <p id="cart-item-price">₹{item.price}</p>
            
            <div className="quantity-container">
              <button className="quantity-btn" onClick={() => decreaseQuantity(index)}>-</button>
              <span>{item.quantity}</span>
              <button className="quantity-btn" onClick={() => increaseQuantity(index)}>+</button>
            </div>

            <button className="remove-btn" onClick={() => removeFromCart(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="price-details">
        <h2>Price Details</h2>
        <div className="price-details-row">
          <span>Total Items:</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="price-details-row">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
          <div className="bottom-bar">
            <div className="continue">
        <button className="continue-shopping-btn" onClick={() => Navigate("/admin")}>
          Continue Shopping
        </button>
        </div>
        <div className="buy-now">
        {flag && (
          <button className="buy-now-btn" onClick={buyNow}>
            Buy Now
          </button>
        )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
