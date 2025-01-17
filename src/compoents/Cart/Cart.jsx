import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './Cart.module.css';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SET_TOTAL_PRICE } from '../../redux/ActionType/actionType';

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

  // Adjust currentPage if items are removed
  useEffect(() => {
    const maxPage = Math.ceil(cartItems.length / itemsPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage || 1); // Reset to 1 if no items left
    }
  }, [cartItems, currentPage, itemsPerPage]);

  const totalPrice = useMemo(() => {
    const total = cartItems.reduce((total, item) => {
      if (item.productId && item.productId.price) {
        return total + item.productId.price * item.quantity;
      }
      return total;
    }, 0);
    dispatch({ type: SET_TOTAL_PRICE, payload: total });
    return total;
  }, [cartItems, dispatch]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const buyNow = () => {
    localStorage.setItem('buyProducts', JSON.stringify(cartItems));
    localStorage.setItem('cartItems', JSON.stringify([]));
    setCartItems([]);
    navigate('/buy');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = cartItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  const handleNextPage = () => {
    setCurrentPage((nextPage) => Math.min(nextPage + 1, Math.ceil(cartItems.length / itemsPerPage)));
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className={styles.cartContainer}>
          <div className={styles.cartItems}>
            {displayedItems.map((item) => (
              <div key={item.productId?._id || item.id || Math.random()} className={styles.cartItem}>
                {item.productId ? (
                  <>
                    <img src={item.productId?.imageUrl} alt={item.productId?.name} />
                    <p className={styles.cartItemTitle}>{item.productId?.name}</p>
                    <p className={styles.cartItemPrice}>₹{item.productId?.price}</p>
                    <div className={styles.quantityContainer}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.productId._id)}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <p className={styles.cartItemError}>This product is unavailable or has been removed.</p>
                )}
              </div>
            ))}
          </div>
          {cartItems.length > itemsPerPage && (
            <div className={styles.pagination}>
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
              <button onClick={handleNextPage} disabled={currentPage === Math.ceil(cartItems.length / itemsPerPage)}>Next</button>
            </div>
          )}
          <div className={styles.priceDetails}>
            <h2>Price Details</h2>
            <div className={styles.priceDetailsRow}>
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className={styles.priceDetailsRow}>
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className={styles.bottomBar}>
              <button className={styles.continueShoppingBtn} onClick={() => navigate("/")}>
                Continue Shopping
              </button>
              {cartItems.length > 0 && (
                <button className={styles.buyNowBtn} onClick={buyNow}>
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
