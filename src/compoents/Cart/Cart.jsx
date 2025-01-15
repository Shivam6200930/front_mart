import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Cart.css';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SET_TOTAL_PRICE } from '../../redux/ActionType/actionType'
const Cart = () => {
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const itemsPerPage = 3;
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true); 
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getCart/${userId}`, { withCredentials: true });
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to load cart items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, updateFlag]); 

  
  const totalPrice = useMemo(() => {
    const total = cartItems.reduce((total, item) => {
      if (item.productId && item.productId.price) {
        return total + item.productId.price * item.quantity;
      }
      return total; // Skip items with missing or invalid productId
    }, 0);
    dispatch({ type: SET_TOTAL_PRICE, payload: total }); 
    return total;
  }, [cartItems, dispatch]);
  
  
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setIsLoading(true); // Set loading true during update
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/${userId}`,
        { productId, quantity: newQuantity },
        { withCredentials: true }
      );
      setCartItems(response.data.cart);
      setUpdateFlag((prev) => !prev);
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false); // Stop loading after update
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setIsLoading(true); // Set loading true during removal
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/remove/${userId}/${productId}`,
        { withCredentials: true }
      );
      setCartItems(response.data.cart);
      setUpdateFlag((prev) => !prev);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false); // Stop loading after removal
    }
  };

  // Buy Now functionality
  const buyNow = () => {
    localStorage.setItem('buyProducts', JSON.stringify(cartItems));
    localStorage.setItem('cartItems', JSON.stringify([]));
    setCartItems([]);
    navigate('/buy');
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = cartItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  const handleNextPage = () => {
    setCurrentPage((nextPage) => Math.min(nextPage + 1, Math.ceil(cartItems.length / itemsPerPage)));
  };

  return (
    <div className="container">
      {isLoading ? (
         <div id="loading-container">
         <div id="loading-spinner"></div>
         <p>Loading...</p>
     </div>
      ) : (
        <div className="cart-container">
          <div className="prev-next">
            <div className="cart-items">
            {displayedItems.map((item) => (
  <div key={item.productId?._id || item.id || Math.random()} className="cart-item">
    {item.productId ? (
      <>
        <img src={item.productId?.imageUrl} alt={item.productId?.name} />
        <p className="cart-item-title">{item.productId?.name}</p>
        <p className="cart-item-price">₹{item.productId?.price}</p>

        <div className="quantity-container">
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
          >
            +
          </button>
        </div>

        <button
          className="remove-btn"
          onClick={() => removeFromCart(item.productId._id)}
        >
          Remove
        </button>
      </>
    ) : (
      <p className="cart-item-error">This product is unavailable or has been removed.</p>
    )}
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
      )}
    </div>
  );
};

export default Cart;
