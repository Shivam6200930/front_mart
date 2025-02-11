import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../login/login';
import './Payment_user.css';
import Loading from "../Loading/Loading";
function Payment() {
  const location = useLocation();
  const { totalPrice } = location.state || { totalPrice: 0 };
  const [orderId, setOrderId] = useState('');
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [buyProducts, setBuyProducts] = useState([]);
  const [Amounts, setAmounts] = useState(0);
  const [paymentId, setPaymentId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    moreaddress: [{}],
    cartitems: []
  });
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    addressType: 'Home',
  });

  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const navigate = useNavigate();
  // const totalPrice = useSelector((state) => state.cart.totalPrice);

  const fetchCartProductDetails = async (productIds) => {
    try {
      if (!productIds || productIds.length === 0) {
        console.warn("No product IDs provided for fetching details.");
        return [];
      }
     
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/products`,
        {productIds},
        {
          withCredentials: true,
        }
      );
  
      console.log("Fetched product details response:", response.data.products);
  
      return Array.isArray(response.data.products) ? response.data.products : [];
    } catch (error) {
      console.error("Error fetching product details:", error);
      return [];
    }
  };
  

  // Function to fetch user data including cart items and product details
  const fetchUserData = async () => {
    try {
      setIsLoading(true); // Start loading

      // Fetch user details
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`,
        { withCredentials: true }
      );

      const userDetails = response.data.user;

      // Extract product IDs from cart items
      const cartItems = userDetails.cart.items.map(item => item?.productId?._id || item.productId) || [];


      // Fetch product details using product IDs
      if (cartItems.length === 0) {
        console.warn("No cart items found for this user.");
      }
      console.log("Product IDs to fetch:", cartItems);
      const productDetails = cartItems.length
        ? await fetchCartProductDetails(cartItems)
        : [];

      // Combine cart items with their respective product details
      const cartWithProductDetails = userDetails.cart.items.map(item => {
        const product = productDetails.find(product => product._id === item.productId);
        return {
          ...item, // Original cart item details
          productDetails: product || {},

        };
      });
      console.log(`cartItems:${cartWithProductDetails}`)

      const extract_buyproducts = cartWithProductDetails.map((item) => ({
        ...item.productDetails,
        productId:item.productId,
        quantity: item.quantity, // Cart item quantity overrides product quantity

      }));
      // Update state with user data
      setUserData({
        id: userDetails._id || '',
        name: userDetails.name || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        moreaddress: userDetails.address?.moreaddress || [],
        cartItems: cartWithProductDetails, 
      });
      console.log(`name:${JSON.stringify(userData.cartItems)}`)

      setBuyProducts(extract_buyproducts)
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchUserData();
  }, [navigate,selectedAddress]);


  const handlePayment = async (addr) => {
    setSelectedAddress(addr)
    if (!isAddressSelected) {
      alert("Please select the address again to proceed with payment.");
      setIsAddressSelected(true);
      return;
    } 
    console.log(`selected address:${JSON.stringify(selectedAddress)}`)
    if (!selectedAddress) {
      alert("please select the address")
      return;
    }
    try {
     
      const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/razorpay/order`, {
        amount: totalPrice * 100
      }, { withCredentials: true });
      const orderData = orderResponse.data;
      setAmounts(orderData.amount);
      setOrderId(orderData.id);
      console.log(`order_id:${orderData.id}`)

      const updatedBuyProducts = buyProducts.map((product) => ({
        ...product,
        address: addr,
        
      }));
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
          try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/payment_email/${userData.email}`, { amount: totalPrice }, { withCredentials: true })
            console.log("Sucessfully send email.")
          } catch (error) {
            console.log("email doesnot send ", error)
          }
          navigate('/');
          try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/order_history/${userData.id}`,
              {
                products_details: updatedBuyProducts,
                orderId: orderData.id
              },
              { withCredentials: true });
          } catch (error) {
            console.log("unable to save orderHistory error:", error)
            alert("unable to save orderHistory:", error)
          }
          try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/deletecart/${userData.id}`)
            console.log("successfully delete cart items from backend")
          } catch (error) {              
            console.log("unable to delete cart Items:", error)
          }
          try {
            const orderPayload = {
              _id:orderData.id,
              user: userData.id,
              products: userData.cartItems.map(product => ({
                productId: product.productId,
                name: product.productDetails.name,
                quantity: product.quantity,
                total: totalPrice,
              })),
              paymentStatus: "Success",
              paymentMethod: "Razorpay",
              deliveryStatus: "Order Created",
              shippingAddress: {
                name: selectedAddress.name,
                phone: selectedAddress.phone,
                pincode: selectedAddress.pincode,
                locality: selectedAddress.locality,
                address: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.state,
                landmark: selectedAddress.landmark,
                alternatePhone: selectedAddress.alternatePhone,
              }
            };
            console.log(`orderPayload:${JSON.stringify(orderPayload)}`)

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/addOrder`, orderPayload, { withCredentials: true });
            console.log("Successfully added order.");
          } catch (error) {
            console.log("Unable to add order:", error);
          }


        },
        prefill: {
          name: addressData.name,
          email: userData.email,
          contact: addressData.phone,
        },
        notes: {
          address: selectedAddress,
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

      // const buyProducts = JSON.parse(localStorage.getItem("buyProducts")) || [];
      // const userId = userData.id//localStorage.getItem("user_id");
      // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/order_history/${userId}`, { products_details: buyProducts }, { withCredentials: true });
      // console.log("Order history saved:", response.data);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const handleAddressChange = async (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({ ...prevState, [name]: value }));
    if (name === "pincode" && value.length === 6) {
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
        const postOfficeData = response.data[0]?.PostOffice;

        if (postOfficeData && postOfficeData.length > 0) {
          setAddressData((prev) => ({
            ...prev,
            state: postOfficeData[0].State,
            city: postOfficeData[0].District,
          }));
        } else {
          setAddressData((prev) => ({ ...prev, state: "", city: "" }));
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
      }
    }
  };

  const saveAddress = async () => {
    try {
        setIsLoading(true); 
      
        if (!userData?.id) {
            toast.error("User ID is missing!");
            return;
        }

        console.log(`userId: ${userData.id}`);
        const newAddress = { ...addressData };

        // Post the new address to the backend
        await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/address/${userData.id}`,
            { address: newAddress },
            { withCredentials: true }
        );

        toast.success('Address saved successfully');

        // Update the state while keeping existing user data
        setUserData(prev => ({
            ...prev,
            address: newAddress
        }));

        setSelectedAddress(newAddress);
        setShowAddressForm(false);

        console.log("Updated userData:", userData);
    } catch (error) {
        console.error('Error saving address:', error);
        toast.error('Failed to save address. Please check if you filled all details correctly.');
    } finally {
        setIsLoading(false); 
    }
};



  return (
    <div>
    {!loggedIn ? (
      <Login />
    ) : (
      <div className="payment-container">
        {showAddressForm ? (
          <div className="address-form">
            <h2>Delivery Address</h2>
            <input type="text" name="name" placeholder="Name" value={addressData.name} onChange={handleAddressChange} required />
            <input type="number" name="phone" placeholder="10-digit mobile number" value={addressData.phone} onChange={handleAddressChange} required />
            <input type="number" name="pincode" placeholder="Pincode" value={addressData.pincode} onChange={handleAddressChange} required />
            <input type="text" name="locality" placeholder="Locality" value={addressData.locality} onChange={handleAddressChange} required />
            <input type="text" name="address" placeholder="Address (Area and Street)" value={addressData.address} onChange={handleAddressChange} required />
            <input type="text" name="city" placeholder="City/District/Town" value={addressData.city} onChange={handleAddressChange} readOnly required />
            <input type="text" name="state" placeholder="State" value={addressData.state} onChange={handleAddressChange} readOnly required />
            <input type="text" name="landmark" placeholder="Landmark (Optional)" value={addressData.landmark} onChange={handleAddressChange} />
            <div className="button-s">
              {!isLoading?(<button onClick={saveAddress}>Save and Deliver Here</button>):(<button onClick={saveAddress}>Saving....</button>)}
              <button onClick={() => setShowAddressForm(false)}>Cancel</button>
            </div>
          </div>
        ) : isLoading ? (
          
          <Loading />
        ) : (
          <div>
            <h2>Order Details</h2>
            <p>Total Price: ₹{totalPrice}</p>
            <div className="order-details">
              {userData.moreaddress.length > 0 ? (
                userData.moreaddress
                  .slice() // Create a copy before reversing to avoid mutating the original array
                  .reverse()
                  .map((addr, index) => (
                    <div
                      key={index}
                      className={`address-option ${selectedAddress === addr ? 'selected' : ''}`}
                      onClick={() => handlePayment(addr)}
                    >
                      <p>Name: {addr.name}</p>
                      <p>Locality: {addr.locality}</p>
                      <p>Village: {addr.address}</p>
                      <p>District: {addr.city}</p>
                      <p>State: {addr.state}</p>
                      <p>Pincode: {addr.pincode}</p>
                    </div>
                  ))
              ) : (
                <p>Please add the address</p>
              )}
            </div>
            <button onClick={() => setShowAddressForm(true)}>Add Address</button>
          </div>
        )}
      </div>
    )}
  </div>
  
);

}

export default Payment;
