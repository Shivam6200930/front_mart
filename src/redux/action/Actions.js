// actions.jsimport Cookies from 'js-cookie';
import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE } from '../ActionType/actionType'
import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from '../ActionType/actionType'
import { SET_TOTAL_PRICE } from '../ActionType/actionType';

export const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

export const registerSuccess = (message) => ({
  type: REGISTER_SUCCESS,
  payload: message,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});


export const loginRequest = () => ({
    type: LOGIN_REQUEST,
  });
  
  export const loginSuccess = (user) => {
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('user_id', user._id);
    localStorage.setItem('role', user.role);
    return {
      type: LOGIN_SUCCESS,
      payload: user,
    };
  };
  
  export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
  });
  
  export const logout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    return {
      type: LOGOUT,
    };
  };

  export const setTotalPrice = (totalPrice) => ({
    type: SET_TOTAL_PRICE,
    payload:totalPrice
  });
  
