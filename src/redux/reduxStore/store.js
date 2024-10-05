// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../Reducer/RegisterReducer';
import LoginReducer from '../Reducer/loginReducer';
import userReducer from '../Reducer/userReducer';
import cartReducer from '../Reducer/cartReducer'; // Import your cart reducer

const store = configureStore({
  reducer: {
    register: registerReducer,
    login: LoginReducer,
    user_details: userReducer,
    cart: cartReducer, 
  },
});

export default store;
