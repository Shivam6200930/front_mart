// store.js
import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../Reducer/RegisterReducer';
import LoginReducer from '../Reducer/loginReducer';
import userReducer from '../Reducer/userReducer';

const store = configureStore({
  reducer: {
    register: registerReducer,
    login: LoginReducer,
    user_details:userReducer
  },
});

export default store;
