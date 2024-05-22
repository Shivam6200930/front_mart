import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const [orderId, setOrderId] = useState('');
  const [buyProducts, setBuyProducts] = useState([]);
  const [paymentId, setPaymentId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [flag, setFlag] = useState(true);
  const [amounts, setAmounts] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchBuyProducts = async () => {
      try {
        const storeBuyProduct = JSON.parse(localStorage.getItem('buyProducts')) || [];
        setBuyProducts(storeBuyProduct);
        if (storeBuyProduct.length === 0) {
          setFlag(false);
        } else {
          calculateTotal(storeBuyProduct);
        }
      } catch (error) {
        console.error("Error fetching buyProducts data:", error);
      }
    };

    fetchUserData();
    fetchBuyProducts();
  }, []);

  const calculateTotal = (buyProductsData) => {
    let total = 0;
    buyProductsData.forEach(item => {
      total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
    });
    setTotalPrice(total);
  };

  const handlePayment = async () => {
    if (!address) {
      toast.error("Please enter your address");
      return;
    }
    if (buyProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
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
          const successData = {
            Razorpay_payment_id: response.razorpay_payment_id,
            Razorpay_order_id: response.razorpay_order_id,
            Razorpay_signature: response.razorpay_signature,
          };
          setPaymentId(response.razorpay_payment_id);
          try {
            const verifySignatureResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/razorpay/verify-signature`, successData, { withCredentials: true });
            if (verifySignatureResponse.data.success) {
              setPaymentId(response.razorpay_payment_id);
              toast.success('Payment Successful!!');
              

              await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/razorpay/capture/${response.razorpay_payment_id}`, {
                email: userData.email,
                amount: totalPrice * 100
              }, { withCredentials: true });

              const userId = localStorage.getItem("user_id");
              await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/order_history/${userId}`, {
                products_details: buyProducts,
                address: address
              }, { withCredentials: true });
              localStorage.removeItem("buyProducts");
              navigate('/')
            } else {
              console.log("Signature verification failed");
              toast.error('Payment Failure');
            }
          } catch (error) {
            console.error("Error capturing payment:", error);
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: '+916200874410',
        },
        notes: {
          address: address,
        },
        theme: {
          color: '#3399cc',
        },
      };

      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          alert(response.error.description);
          navigate('/');
          
        });
        rzp1.open();
      } else {
        console.error("Razorpay script is not loaded.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <div className="payment-gateway">
      <div className="login-success">
        <h1>Login Successfully ✓</h1>
        <h2>{userData.name}</h2>
      </div>
      <div className="payment-form">
        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit">Pay ₹{totalPrice}</button>
        </form>
      </div>
      {paymentId && <p>Payment successful! Payment ID: {paymentId}</p>}
    </div>
  );
}

export default Payment;
