import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    UPDATE_USER_IMAGE_REQUEST,
    UPDATE_USER_IMAGE_SUCCESS,
    UPDATE_USER_IMAGE_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
    LOGOUT_USER,
  } from '../ActionType/actionType';
  
  const initialState = {
    loading: false,
  user: {
    name: '',
    email: '',
    phone: '',
    profileImageUrl: '',
    orderHistory: [],
    role: '',
    
  },
  error: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USER_REQUEST:
      case UPDATE_USER_IMAGE_REQUEST:
      case DELETE_USER_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          user: {
          ...state.user,
          ...action.payload,
        },
        };
      case UPDATE_USER_IMAGE_SUCCESS:
        return {
          ...state,
          loading: false,
          user: { ...state.user, profileImageUrl: action.payload },
        };
      case DELETE_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          user: null,
        };
      case FETCH_USER_FAILURE:
      case UPDATE_USER_IMAGE_FAILURE:
      case DELETE_USER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case LOGOUT_USER:
        return initialState;
      default:
        return state;
    }
  };
  
  export default userReducer;
  