//services
import apiService from '../../services/apiService';
//component
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
//style
import './Products.css';
//hooks
import useProducts from '../../hooks/useProducts';
//store
import { showModal } from '../../redux/actions/modalActions';
import { useDispatch } from 'react-redux';

const Products = () => {
  const { products } = useProducts();
  const dispatch = useDispatch();

  const handleAddToCart = async (product) => {
    const response = await apiService.request(`Orders/AddItemToCart/${product.productId}`, {}, 'post');
    if (response.status === 200) {
      dispatch(showModal('success', 'The product has been successfully added', response.message));
    } else {
      dispatch(showModal('error', 'Failed to add product', response.message));
    }
  };

  return (
    <div className="my-cart-page">
      <h1>Products</h1>
      <ProductsGrid
        products={products}
        buttonText="Add to Cart"
        onButtonClick={handleAddToCart}
      />
    </div>
  );
};

export default Products;
