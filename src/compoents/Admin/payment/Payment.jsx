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
              
            } else {
              console.log("Signature verification failed");
              toast.error('Payment Failure');
            }
          } catch (error) {
            console.error("Error capturing payment:", error);
          }
          navigate('/')
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
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prevState => ({ ...prevState, [name]: value }));
  };
  const saveAddress = async() => {
    // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/adress/${userId}`,{adressDetails:addressData},{withCredentials:true})
    // console.log(`response of adress:${response}`)
    const {name,phone,pincode,locality,address,city,state}=addressData
    if(name && phone && pincode && locality && address && city && state){
      setShowAddressForm(false);
    }else{
      alert("all flied are requried except option ")
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
