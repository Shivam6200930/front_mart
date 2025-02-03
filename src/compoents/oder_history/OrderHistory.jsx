import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrderHistory.module.css";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate()
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`,
          { withCredentials: true }
        );

        const orderData = response.data.user?.orderHistory || [];
        console.log("Fetched order data:", orderData);
        setOrderHistory(orderData);
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError(err.response?.data?.message || "Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Order History</h2>
      {orderHistory.length === 0 ? (
        <p className={styles.empty}>You have no orders yet.</p>
      ) : (
        orderHistory.reverse().map((order, orderIndex) => (
          <div className={styles.orderCard} key={`order-${order._id}-${orderIndex}`}>
            <div className={styles.orderHeader}>
              <span>Order ID: {order._id || "N/A"}</span>
              <span>Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Unknown"}</span>
              <span>Status: {order.deliveryStatus || "Unknown"}</span>
            </div>

            <div className={styles.products}>
                <div className={styles.productList}>
                    <div
                      className={styles.product}
                      key={`product-${order.productId}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the parent order card's onClick
                        navigate("/order_details", { state: {orderId: order._id } });
                      }}
                    >
                      <div className={styles.productImage}>
                        <img
                          src={order.imageUrl || "default-image.jpg"}
                          alt={order.name || "Product"}
                          onError={(e) => (e.target.src = "default-image.jpg")}
                        />
                      </div>
                      <div className={styles.productDetails}>
                        <h4>{order.name || "Unnamed Product"}</h4>
                        <p>Price: ₹{order.price !== undefined ? order.price : "N/A"}</p>
                        <p>Quantity: {order.quantity !== undefined ? order.quantity : 0}</p>
                        <p>
                          Total: ₹
                          {order.price !== undefined && order.quantity !== undefined
                            ? order.price * order.quantity
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  
                </div>
             
            </div>

            <div className={styles.orderFooter}>
              <p>Payment Method: {order.paymentMethod || "N/A"}</p>
              <p>Payment Status: {order.paymentStatus || "Pending"}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;