import Login from "./compoents/login/login";
import Layout from "./compoents/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./compoents/register/register";
import Forget_Password from "./compoents/FrogettenPassword/Forget_Password";
import Profile from "./compoents/Profile/Profile";
import Layout_admin from "./compoents/Admin/Layout/Layout_admin";
import PageNotFound from "./compoents/pageNotFound/pageNotFound";
import ChangeUserPassword from "./compoents/changeUserPassword/ChangeUserPassword";
import Edit from "./compoents/Edit/Edit";
import Homepage from "./compoents/Homepage/Homepage";
import AddItems from './compoents/Admin/addItems/AddItems';
import Homepage_admin from "./compoents/Admin/HomePage/Homepage_admin";
import Search_products from "./compoents/search_products/search_products";
import ProductDetails from "./compoents/ProductDetails/ProductDetails";
import Cart from "./compoents/Cart/Cart";
import ResetPasswordPage from "./compoents/email-resetPassword/ResetPasswordPage";
import Profile_admin from "./compoents/Admin/profile_admin/Profile_admin";
import Contact from "./compoents/contact/Contact";
import Payment_admin from './compoents/Admin/Buy_admin/Payment_admin'
import Cart_admin from "./compoents/Admin/cart/Cart_admin"
import Search_admin from "./compoents/Admin/search_admin/Search_admin";
import Products_details_admin from "./compoents/Admin/Products_details_admin/Products_d_admin";
import ChangePassword_admin from "./compoents/Admin/changepassword/changePassword_admin";
import Edit_admin from "./compoents/Admin/edit/Edit_admin";
import OrderHistory from "./compoents/oder_history/OrderHistory";
import PaymentUser from "./compoents/Payment_User/Payment_User";
function App() {
  const role=localStorage.getItem('role')
  return (
    <>
    
      <Router>
        <Routes>
        {
           role === 'admin'?(<><Route path="/profile_admin" element={<Layout_admin />}>
            <Route index element={<Profile_admin />} />
          </Route>
          <Route path="/changePassword_admin" element={<Layout_admin />}>
            <Route index element={<ChangePassword_admin/>} />
          </Route>
            
          <Route path="/cart_admin" element={<Layout_admin />}>
            <Route index element={<Cart_admin />} />
          </Route>
          <Route path="/admin" element={<Layout_admin />}>
            <Route index element={<Homepage_admin />} />
          </Route>
          <Route path="/search_admin" element={<Layout_admin />}>
            <Route index element={<Search_admin />} />
          </Route>
          <Route path="/view_admin" element={<Layout_admin />}>
            <Route index element={<Products_details_admin />} />
          </Route>
          <Route path="/editprofile_admin" element={<Layout_admin />}>
            <Route index element={<Edit_admin />} />
          </Route>
          <Route path="/additems" element={<Layout_admin />}>
            <Route index element={<AddItems />} />
          </Route>  
          <Route path="/buy_admin" element={<Layout_admin />}>
            <Route index element={<Payment_admin />} />
          </Route>
          </>)
          :(
          <Route path="*" element={<PageNotFound />} 
          />)
        }
        {
          role === 'user' ?(
          <>
            <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
          </Route>
          <Route path="/orderhistory" element={<Layout />}>
            <Route index element={<OrderHistory />} />
          </Route>
          <Route path="/buy" element={<Layout />}>
            <Route index element={<PaymentUser />} />
          </Route>
          <Route path="/search_products" element={<Layout />}>
            <Route index element={<Search_products />} />
          </Route>
          <Route path="/view" element={<Layout />}>
            <Route index element={<ProductDetails />} />
          </Route>
          
          <Route path="/forgetpassword" element={<Layout />}>
            <Route index element={<Forget_Password />} />
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
          
          <Route path="/cart" element={<Layout />}>
            <Route index element={<Cart />} />
          </Route>
          </>):(<Route path="*" element={<PageNotFound />} />)
        }
          <Route path="/api/users/resetpassword/:userId/:token" element={<Layout />}>
            <Route index element={<ResetPasswordPage />} />
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
        </Routes>
      </Router>
    </>
  )
}

export default App
