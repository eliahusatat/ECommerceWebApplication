import { combineReducers } from 'redux';
import modalReducer from './modalReducer';
import loaderReducer from './loaderReducer'; 

const rootReducer = combineReducers({
  modal: modalReducer,
  loader: loaderReducer
});

export default rootReducer;
