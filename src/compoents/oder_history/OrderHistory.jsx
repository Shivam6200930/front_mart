import axios from 'axios';
import React, { useEffect, useState } from 'react';

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        console.log('Response:', response.data);
        if (response.data.user && response.data.user.orderHistory) {
          setOrderHistory(response.data.user.orderHistory);
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
        <div>
          <h2>Order History</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((ordersArray, index) => (
                ordersArray.map((order, subIndex) => (
                  <tr key={index + '-' + subIndex}>
                    <td>{order.name}</td>
                    <td>
                      {order.imageUrl ? (
                        <img src={order.imageUrl} alt={order.name} style={{ width: '20%' }} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>${order.price}</td>
                    <td>{order.quantity}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No order history available.</p>
      )}
    </div>
  );
}

export default OrderHistory;
