//style
import './ProductCard.css';
//store
import { useDispatch } from 'react-redux';
import { showModal } from '../../redux/actions/modalActions';
import { showLoader, hideLoader } from '../../redux/actions/loaderActions';

const ProductCard = ({ product, buttonText, onButtonClick, secondBtn, secondBtnTxt, onSecondBtnClick }) => {
  const dispatch = useDispatch();

  const handleButtonClick = async (btnNumber = 1) => {
    dispatch(showLoader());
    try {
      if (btnNumber === 1) {
        await onButtonClick(product);
      } else {
        await onSecondBtnClick(product);
      }
    } catch (error) {
      dispatch(showModal('error', 'Error', error));
    } finally {
      dispatch(hideLoader());
    }
  };

  const getButtonClass = (text) => {
    switch (text.toLowerCase()) {
      case 'delete':
      case 'remove from cart':
        return 'btn-delete';
      case 'edit':
        return 'btn-edit';
      default:
        return 'btn-default';
    }
  };

  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">Price: ${product.price.toFixed(2)}</p>
      <p className="stock">Stock: {product.stock}</p>
      <button className={`btn-1 ${getButtonClass(buttonText)}`} onClick={() => handleButtonClick(1)}>
        {buttonText}
      </button>
      {secondBtn && (
        <button className={`btn-2 ${getButtonClass(secondBtnTxt)}`} onClick={() => handleButtonClick(2)}>
          {secondBtnTxt}
        </button>)}
    </div>
  );
};

export default ProductCard;
