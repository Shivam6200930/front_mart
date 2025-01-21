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
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [buyProducts, setBuyProducts] = useState([]);
  const [Amounts, setAmounts] = useState(0);
  const [paymentId, setPaymentId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id:'',
    name: '',
    email: '',
    phone: '',
    moreaddress:[{}],
    cartitems:[]
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

  const loggedIn = localStorage.getItem('loggedIn');
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
 
  const fetchCartProductDetails = async (productIds) => {
    console.log("ProductsId",productIds)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/products/byIds`,
        { productIds },
        {withCredentials: true, // Ensure cookies or credentials are sent
          headers: {
            'Content-Type': 'application/json', },
         }
      );
      // console.log("productDtalis:",response.data.products)
      // setBuyProducts(response.data.products)
      // console.log("setBuyProducts",buyProducts)
      return response.data.products;

      
    } catch (error) {
      console.error('Error fetching product details:', error);
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
  
      console.log("Fetched User Details:", userDetails);
  
      // Extract product IDs from cart items
      const cartItems = userDetails.cart.items.map(item => item.productId) || [];
      console.log(cartItems)
      // Fetch product details using product IDs
      if (cartItems.length === 0) {
        console.warn("No cart items found for this user.");
      }
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
      
      const extract_buyproducts = cartWithProductDetails.map((item) => ({
        ...item.productDetails, // Product details
        quantity: item.quantity, // Cart item quantity overrides product quantity
        
      }));
      // Update state with user data
      setUserData({
        id: userDetails._id || '',
        name: userDetails.name || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        moreaddress: userDetails.address?.moreaddress || [],
        cartItems: cartWithProductDetails, // Cart items with product details
      });

     setBuyProducts(extract_buyproducts)
     console.log("Buy Products:", extract_buyproducts);
     console.log("Buy Products in state:",buyProducts);
      console.log("Updated UserData:", {
        id: userDetails._id || '',
        name: userDetails.name || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        moreaddress: userDetails.address.moreaddress || [],
        cartItems: cartWithProductDetails,
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  


  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`,
    //       { withCredentials: true }
    //     );

    //     const userdetails = response.data.user;
    //     const userMoreAddress = userdetails.address.moreaddress
    //     // Set the userData state with all user fields
    //     setUserData({
    //       id:userdetails._id,
    //       name: userdetails.name || '',
    //       email: userdetails.email || '',
    //       phone: userdetails.phone || '', // Ensure address is an array
    //       moreaddress: userMoreAddress||[], // Handle nested address arrays
    //       items:userdetails.cart.items
    //     });

    //     // Set selectedAddress with the first address or null if empty
    //     setSelectedAddress(userMoreAddress[0] || null);
    //     console.log("Fetched userData:", userdetails.cart.items[0].productId);
    //     console.log("userData",userMoreAddress)
        
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // };

    // const fetchBuyProducts = async () => {
    //   const [productIds]=userData.items.map()=>{
    //     productId
    //   try {
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_BACKEND_URL}/api/users/products/byIds`,{productIds },
    //       { withCredentials: true }
    //     );
    //     const cartItems = response.data.cart || [];
    //     setBuyProducts(cartItems);
    //     if (cartItems.length === 0) {
    //       toast.error('Your cart is empty!');
    //       navigate('/cart');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching cart items:', error);
    //   }
    // };


    fetchUserData();
    // fetchBuyProducts();
  }, [navigate]);


  const handlePayment = async (addr) => {
    setSelectedAddress(addr)
    console.log("addr:",selectedAddress)
    if(!selectedAddress){
      alert("please select the address")
      return;
    }
    try {
      const updatedBuyProducts = buyProducts.map((product) => ({
        ...product,
        address: addr, // Include address details in the product entry
    }));

    console.log("Updated buyProducts with address:", updatedBuyProducts);
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
          try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/order_history/${userData.id}`, 
              { 
                products_details: updatedBuyProducts ,
              }, 
              { withCredentials: true });
            console.log("OrderHistory saved successfully:",response.data)
          }catch(error){
            console.log("unable to save orderHistory error:",error)
            alert("unable to save orderHistory:",error)
          }
          try{
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/deletecart/${userData.id}`)
            console.log("successfully delete cart items from backend")
          }catch(error){
            console.log("unable to delete cart Items:",error)
          }
          navigate('/');
        },
        prefill: {
          name: addressData.name,
          email: userData.email,
          contact: addressData.phone,
        },
        notes: {
          address:selectedAddress ,
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveAddress = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const newAddress = { ...addressData }; 
      console.log("newaddress:",newAddress)
      // Post the new address to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/address/${userId}`,
        { address: newAddress },
        { withCredentials: true }
      );

      toast.success('Address saved successfully');

      // Update the state with the newly saved address
      setUserData(
        {address:newAddress},
      );
      setTimeout(() => {
        window.location.reload();
      }, 100);
      setSelectedAddress(newAddress); // Set the new address as the selected one
      setShowAddressForm(false);
      console.log("useData:",userData)
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address.');
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
              <div className="button-s">
              <button onClick={saveAddress}>Save and Deliver Here</button>
              <button onClick={() => setShowAddressForm(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="order-details">
            <h2>Order Details</h2>
            <p>Total Price: ₹{totalPrice}</p>
            {userData.moreaddress.length > 0 ? (
              userData.moreaddress.map((addr, index) => (
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
            <button onClick={() => setShowAddressForm(true)}>Add Address</button>
          </div>
          

          )}
        </div>
      )}
    </>
  );
}

export default Payment;
