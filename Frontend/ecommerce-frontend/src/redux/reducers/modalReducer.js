import { SHOW_MODAL, HIDE_MODAL } from '../actions/modalActions';

const initialState = {
  isVisible: false,
  modalType: '',
  title: '',
  message: '',
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        isVisible: true,
        modalType: action.payload.modalType,
        title: action.payload.title,
        message: action.payload.message,
      };
    case HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
};

export default modalReducer;
