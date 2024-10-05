import { SET_TOTAL_PRICE } from '../ActionType/actionType'; // Import action type

const initialState = {
  totalPrice: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOTAL_PRICE:
      return {
        ...state, // Always spread the existing state
        totalPrice: action.payload, // Update totalPrice based on the action payload
      };

    default:
      return state; // Return current state if action type doesn't match
  }
};

export default cartReducer;
