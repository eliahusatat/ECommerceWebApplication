import { SHOW_LOADER, HIDE_LOADER } from '../actions/loaderActions';

const initialState = {
  isVisible: false,
};

const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return {
        ...state,
        isVisible: true,
      };
    case HIDE_LOADER:
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
};

export default loaderReducer;
