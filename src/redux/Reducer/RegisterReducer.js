import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE } from '../ActionType/actionType';

const initialState = {
  loading: false,
  successMessage: '',
  errorMessage: '',
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        successMessage: '',
        errorMessage: '',
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
        errorMessage: '',
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        successMessage: '',
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default registerReducer;
