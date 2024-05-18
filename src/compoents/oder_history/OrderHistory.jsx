import axios from 'axios';
import React, { useEffect, useState } from 'react';

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`https://new-backend-s80n.onrender.com/api/users/loggedUser`);
        if (response.data.user && response.data.user.OrderHistory) {
          setOrderHistory(response.data.user.OrderHistory);
        } else {
          console.error('Order history data not found in response');
        }
      } catch (err) {
        console.error('Error fetching order history:', err.message);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div>
      {orderHistory.length > 0 ? (
        <ul>
          {orderHistory.map((order, index) => (
            <li key={index}>{JSON.stringify(order)}</li>
          ))}
        </ul>
      ) : (
        <p>No order history available.</p>
      )}
    </div>
  );
}

export default OrderHistory;
