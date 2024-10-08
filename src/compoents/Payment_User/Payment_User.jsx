import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import Login from '../login/login';
import './Payment_user.css';

function Payment() {
  const [orderId, setOrderId] = useState('');
  const [buyProducts, setBuyProduct] = useState([]);
  const [paymentId, setPaymentId] = useState('');
  const [flag, setFlag] = useState(true);
  const [Amounts, setAmounts] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    addressType: "Home"
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true);

  const loggedIn = localStorage.getItem('loggedIn');
  const navigate = useNavigate();

  // Fetch the total price from the Redux store
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone
        };
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
     
    };

    const fetchBuyProducts = async () => {
      try {
        const storeBuyProduct = JSON.parse(localStorage.getItem('buyProducts')) || [];
        setBuyProduct(storeBuyProduct);
        if (storeBuyProduct.length === 0) {
          setFlag(false);
        }
      } catch (error) {
        console.error("Error fetching buyProducts data:", error);
      }
    };

    fetchUserData();
    fetchBuyProducts();
    if (totalPrice === 0) {
      toast.error('Your cart is empty!');
      navigate('/cart'); // Redirect if cart is empty
    }
  }, [totalPrice, navigate]);

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/razorpay/order`, {
        amount: totalPrice * 100
      }, { withCredentials: true });
      const orderData = orderResponse.data;
      setAmounts(orderData.amount);
      setOrderId(orderData.id);

      const options = {
        key: 'rzp_test_gwXTpGbNWP2B41',
        amount: orderData.amount,
        currency: 'INR',
        name: 'Shivam Mart',
        description: 'Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const sucessData = {
            Razorpay_payment_id: response.razorpay_payment_id,
            Razorpay_order_id: response.razorpay_order_id,
            Razorpay_signature: response.razorpay_signature,
          };
          setPaymentId(response.razorpay_payment_id);
          try {
            const verifySignatureResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/razorpay/verify-signature`, sucessData, { withCredentials: true });
            if (verifySignatureResponse.data.success) {
              setPaymentId(response.razorpay_payment_id);
              await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/razorpay/capture/${response.razorpay_payment_id}`, { email: userData.email, amount: totalPrice * 100 }, { withCredentials: true });
            } else {
              console.log("Signature verification failed");
              toast.error('Payment Failure');
            }
          } catch (error) {
            console.error("Error capturing payment:", error);
          }
          toast.success('Payment Successfully!!');
          navigate('/');
        },
        prefill: {
          name: addressData.name,
          email: userData.email,
          contact: addressData.phone,
        },
        notes: {
          address: 'Your Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify-signature`, response);
          alert(response.error.description);
          rzp1.close();
          navigate('/');
        });
        rzp1.open();
      } else {
        console.error("Razorpay script is not loaded.");
      }

      const buyProducts = JSON.parse(localStorage.getItem("buyProducts")) || [];
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/order_history/${userId}`, { products_details: buyProducts }, { withCredentials: true });
      console.log("Order history saved:", response.data);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prevState => ({ ...prevState, [name]: value }));
  };

  const saveAddress = async () => {
    const { name, phone, pincode, locality, address, city, state } = addressData;
    if (name && phone && pincode && locality && address && city && state) {
      setShowAddressForm(false);
    } else {
      alert("All fields are required except optional fields.");
    }
  };

  return (
    <>
      {!loggedIn ? (
        <Login />
      ) : (
        <div className="payment-container">
          {showAddressForm ? (
            <div className="address-form">
              <h2>Delivery Address</h2>
              <input type="text" name="name" placeholder="Name" value={addressData.name} onChange={handleAddressChange} />
              <input type="number" name="phone" placeholder="10-digit mobile number" value={addressData.phone} onChange={handleAddressChange} />
              <input type="number" name="pincode" placeholder="Pincode" value={addressData.pincode} onChange={handleAddressChange} />
              <input type="text" name="locality" placeholder="Locality" value={addressData.locality} onChange={handleAddressChange} />
              <input type="text" name="address" placeholder="Address (Area and Street)" value={addressData.address} onChange={handleAddressChange} />
              <input type="text" name="city" placeholder="City/District/Town" value={addressData.city} onChange={handleAddressChange} />
              <input type="text" name="state" placeholder="State" value={addressData.state} onChange={handleAddressChange} />
              <input type="text" name="landmark" placeholder="Landmark (Optional)" value={addressData.landmark} onChange={handleAddressChange} />
              <input type="text" name="alternatePhone" placeholder="Alternate Phone (Optional)" value={addressData.alternatePhone} onChange={handleAddressChange} />
              <div className="address-type">
                <label>
                  <input type="radio" name="addressType" value="Home" checked={addressData.addressType === 'Home'} onChange={handleAddressChange} /> Home (All day delivery)
                </label>
                <label>
                  <input type="radio" name="addressType" value="Work" checked={addressData.addressType === 'Work'} onChange={handleAddressChange} /> Work (Delivery between 10 AM - 5 PM)
                </label>
              </div>
              <button onClick={saveAddress}>Save and Deliver Here</button>
            </div>
          ) : (
            <div className="order-details">
              <div className="login-d"><h1>Login✅</h1></div>
              <h2>Order Details</h2>
              <p>Name: {addressData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Phone: {addressData.phone}</p>
              <p>Address:<br />State: {addressData.state}<br />City: {addressData.city}<br />Country: India<br />Pincode: {addressData.pincode}</p>
              <p>Total Price: ₹{totalPrice}</p> 
              <button onClick={handlePayment}>Proceed to Payment</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Payment;
