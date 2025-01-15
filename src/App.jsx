import Login from "./compoents/login/login";
import Layout from "./compoents/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./compoents/register/register";
import Forget_Password from "./compoents/FrogettenPassword/Forget_Password";
import Profile from "./compoents/Profile/Profile";

import PageNotFound from "./compoents/pageNotFound/pageNotFound";
import ChangeUserPassword from "./compoents/changeUserPassword/ChangeUserPassword";
import Edit from "./compoents/Edit/Edit";
import Homepage from "./compoents/Homepage/Homepage";
import Search_products from "./compoents/search_products/search_products";
import ProductDetails from "./compoents/ProductDetails/ProductDetails";
import Cart from "./compoents/Cart/Cart";
import ResetPasswordPage from "./compoents/email-resetPassword/ResetPasswordPage";
import Contact from "./compoents/contact/Contact";
import OrderHistory from "./compoents/oder_history/OrderHistory";
import PaymentUser from "./compoents/Payment_User/Payment_User";
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/reduxStore/store';
function App() {              
  const { role } = useSelector((state) => state.login);
  return (
    <>
     <Provider store={store}>
      <Router>
        <Routes>
        {
          role === 'user' ?(
          <>    
          <Route path="/orderhistory" element={<Layout />}>
            <Route index element={<OrderHistory />} />
          </Route>
          <Route path="/buy" element={<Layout />}>
            <Route index element={<PaymentUser />} />
          </Route>
          <Route path="/profile" element={<Layout />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/changepassword" element={<Layout />}>
            <Route index element={<ChangeUserPassword />} />
          </Route>
          <Route path="/editprofile" element={<Layout />}>
            <Route index element={<Edit />} />
          </Route>
          </>):(<Route path="*" element={<PageNotFound />} />)
        }
        <Route path="/cart" element={<Layout />}>
            <Route index element={<Cart />} />
          </Route>
        <Route path="/view" element={<Layout />}>
            <Route index element={<ProductDetails />} />
          </Route>
          <Route path="/api/users/resetPassword/:id/:token" element={<ResetPasswordPage />} >
          </Route>
          <Route path="/contact" element={<Layout />}>
            <Route index element={<Contact />} />
          </Route>
          <Route path="/login" element={<Layout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/register" element={<Layout />}>
            <Route index element={<Register />} />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
          </Route>
          <Route path="/forgetpassword" element={<Layout />}>
            <Route index element={<Forget_Password />} />
          </Route>
          <Route path="/search_products" element={<Layout />}>
            <Route index element={<Search_products />} />
          </Route>
        </Routes>
      </Router>
      </Provider>
    </>
  )
}

export default App
