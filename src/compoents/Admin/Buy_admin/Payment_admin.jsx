import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
function Payment() {
  const [orderId, setOrderId] = useState('');
  const [buyProducts, setBuyProduct] = useState([]);
  const [paymentId, setPaymentId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [flag, setFlag] = useState(true);
  const [Amounts, setAmounts] = useState(0)
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });
const navigate=useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://backend-shivammart.vercel.app/api/users/loggedUser", { withCredentials: true });
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email
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
      item.forEach(item => {
        total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
      })
    });
    setTotalPrice(total);
  };

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post('https://backend-shivammart.vercel.app/api/users/razorpay/order', {
        amount: totalPrice * 100
      }, { withCredentials: true });
      console.log(`oderrtesponse:${JSON.stringify(orderResponse.data)}`)
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
          }
          setPaymentId(response.razorpay_payment_id);
          try {
            const verifySignatureResponse = await axios.post('https://backend-shivammart.vercel.app/api/users/razorpay/verify-signature', sucessData, { withCredentials: true });
            if (verifySignatureResponse.data.success) {
              setPaymentId(response.razorpay_payment_id);
              toast.success('Payment Successfully!!');

              await axios.post(`https://backend-shivammart.vercel.app/api/users/razorpay/capture/${response.razorpay_payment_id}`, { email: userData.email, amount: totalPrice * 100 }, { withCredentials: true });

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
          address: 'Your Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

     

      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          axios.post('https://backend-shivammart.vercel.app/api/users/razorpay/verify-signature', response)
          alert(response.error.description);
          rzp1.close()
          navigate('/admin')

        })
        rzp1.open();
      } else {
        console.error("Razorpay script is not loaded.");
      }
      const buyProducts = JSON.parse(localStorage.getItem("buyProducts")) || [];
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(`https://backend-shivammart.vercel.app/api/users/order_history/${userId}`, { products_details: buyProducts }, { withCredentials: true });
      console.log("Order history saved:", response.data);
      const loadscript=src=>{
        return new Promise(function(resolve, reject) {
          rzp1.close()
          console.log(`load:${loadscript}`);
        })
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }

    

    // try {
    //   const id=JSON.parse(localStorage.getItem("user_id"));
    //   const response = await axios.post(`http://localhost:5858/api/users/csv_file/${id}`, {
    //     order_id: orderId,
    //     buyProducts_data: buyProducts
    //   },{ withCredentials: true });
    //   console.log(`response of csv: ${response.data}`);
    // } catch (e) {
    //   console.log(e);
    // }
  };


  return (
    <div className="payment-gateway">
      <div className="login-success">
        <h1>Login Successfully ✓</h1>
        <h2>{userData.name}</h2>
      </div>
      <div className="payment-form">
        <form>
          <input type="text" className="form-control" placeholder="Enter your address" />
        </form>
      </div>
      <button onClick={handlePayment}>Pay ₹{totalPrice}</button>
      {paymentId && <p>Payment successful! Payment ID: {paymentId}</p>}
    </div>
  );
}

export default Payment;
