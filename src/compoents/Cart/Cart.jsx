import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Cart.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const[c,setC]=useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        // console.log(response.data.user.cartItem)
         setC(response.data.user.cartItem)
      } catch (error) {
        console.log(error)
      }
    })()
    
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
    calculateTotalPrice(storedCartItems);
    if (storedCartItems.length > 0) {
      toast.success("Add to cart successful!!");
    }
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
    toast.success("Removed from cart");
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
    const temp_cart = [cartItems];
    localStorage.setItem('buyProducts', JSON.stringify(temp_cart));
    localStorage.setItem('cartItems', JSON.stringify([]));
    setCartItems([]);
    navigate('/buy');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = cartItems.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(nextPage => Math.min(nextPage + 1, Math.ceil(cartItems.length / itemsPerPage)));
  };

  return (
    <div className="container">
      <div className="cart-container">
        <div className="prev-next">
        
          <div className="cart-items">
            {displayedItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <p className="cart-item-title">{item.name}</p>
                <p className="cart-item-price">₹{item.price}</p>

                <div className="quantity-container">
                  <button className="quantity-btn" onClick={() => decreaseQuantity(startIndex + index)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="quantity-btn" onClick={() => increaseQuantity(startIndex + index)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(startIndex + index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {cartItems.length > itemsPerPage && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
              <button onClick={handleNextPage} disabled={currentPage === Math.ceil(cartItems.length / itemsPerPage)}>Next</button>
            </div>
          )}
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
          </div>
          <div className="bottom-bar">
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
            {cartItems.length > 0 && (
              <button className="buy-now-btn" onClick={buyNow}>
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
