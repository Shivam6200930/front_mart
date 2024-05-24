import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './OrderHistory.css'
function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        console.log('Response:', response.data);
        if (response.data.user && response.data.user.orderHistory) {
          setOrderHistory(response.data.user.orderHistory);
        } else {
          console.error('Order history data not found in response');
        }
      } catch (err) {
        console.error('Error fetching order history:', err.message);
      }finally{
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="container">
      <div className="order-items">
      {loading && (
          <div id="loading-container">
              <div id="loading-spinner"></div>
              <p>Loading...</p>
          </div>
      )}
        {orderHistory.length > 0 ? (
          orderHistory.map((ordersArray, index) => (
            ordersArray.map((order, subIndex) => (
              <div key={`${index}-${subIndex}`} className="order-item"> 
                <div className="order-content">
                  <img src={order.imageUrl || 'placeholder-image-url'} alt={order.name} />
                  <div className="details">
                    <h2>{order.name}</h2>
                    <p>Color: {order.color || 'N/A'} Size: {order.size || 'N/A'}</p>
                    <p>₹{order.price}</p>
                    <div className="order-status">
                      {order.refundStatus ? (
                        <span className="refund-status">Refund Completed</span>
                      ) : (
                        <span className="delivery-status">Delivered on {order.deliveryDate}</span>
                      )}
                    </div>
                  </div>
                </div>
                {order.refundDetails && (
                  <div className="refund-details">
                    <p>Refund ID: {order.refundId}</p>
                    <ul>
                      {order.refundDetails.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ))
        ) : (
          setLoading ? (<></>):( <div className="no-order">No order history available.</div>)
         
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
