import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../ActionType/actionType';

const initialState = {
  loading: false,
  user: {
    loggedIn: false,
    user_id: null,
    role: null,
    email: null,
    phone: null,
    profileImageUrl: null,
    orderHistory: [],
    address: {},
    cart: {},
  },
  error: null,
  
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default loginReducer;
