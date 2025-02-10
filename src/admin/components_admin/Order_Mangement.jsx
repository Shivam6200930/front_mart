import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/OrderManagement.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../compoents/Loading/Loading"

const OrderManagement = () => {
  const navigate=useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId,setUserId]=useState()
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/allOrder`);
      response.data.orders.forEach((order) => {
        // console.log(`User: ${JSON.stringify(order.user._id)}`);
        setUserId(order.user._id)
        
      });
      
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError("Error fetching orders:",err);
      setLoading(false);
    }
  };

  const updateOrder = async (orderId, deliveryStatus, paymentStatus) => {
    try {
      console.log(userId)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/updated/${orderId}/${userId}`, 
        {
        deliveryStatus:deliveryStatus
      },{withCredentials:true});
      console.log(`response:${response.data}`)
      fetchOrders()
    } catch (err) {
      alert("internal server error")
      setError("Error updating order:",err);
      console.log(err)
    }
  };

  if (loading) return <p className="loading"><Loading/></p>;

  return (
    <div className="order-container">
      <h1>Order Management</h1>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Delivery Status</th>
            <th>Payment Status</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name} ({order.user?.email})</td>
              <td>
                <select
                  className="status-dropdown"
                  value={order.deliveryStatus}
                  onChange={(e) => updateOrder(order._id, e.target.value, order.paymentStatus)}
                >
                  <option value="Order Created">Order Created</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>{order.paymentStatus}</td>
              <td>
                <ul>
                  {order.products.map((product) => (
                    <li key={product.productId._id}>
                      {product.productId.name} - {product.quantity} pcs
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button className="update-button" onClick={() => updateOrder(order._id, "Delivered", "Paid")}>
                  Mark as Delivered & Paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
