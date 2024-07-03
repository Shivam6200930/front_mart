import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../ActionType/actionType';

const initialState = {
  loading: false,
  user: null,
  error: null,
  loggedIn: localStorage.getItem('loggedIn') === 'true',
  user_id: localStorage.getItem('user_id'),
  role: localStorage.getItem('role'),
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
        user: action.payload,
        loggedIn: true,
        user_id: action.payload._id,
        role: action.payload.role,
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
        ...state,
        loading: false,
        user: null,
        loggedIn: false,
        user_id: null,
        role: null,
        error: null,
      };
    default:
      return state;
  }
};

export default loginReducer;
