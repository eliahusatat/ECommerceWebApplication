//services
import apiService from '../../services/apiService';
//component
import ProductForm from '../../components/ProductForm/ProductForm';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
//style
import './ProductManagement.css';
//hooks
import React, { useState, useEffect } from 'react';
import useProducts from '../../hooks/useProducts';
//store
import { showModal } from '../../redux/actions/modalActions';
import { useDispatch } from 'react-redux';

const ProductManagementPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const openModal = (type) => {setModalType(type)};
  const { products } = useProducts();
  const dispatch = useDispatch();

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  const handleDeleteProduct = async (product) => {
    const response = await apiService.request(`Products/DeleteProduct/${product.productId}`, {}, 'delete');
    if (response.status === 200) {
      setAllProducts(prevProducts => prevProducts.filter(p => p.productId !== product.productId));
      dispatch(showModal('success', 'The product has been successfully deleted', response.message));
    } else {
      dispatch(showModal('error', 'Failed to delete product', response.message));
    }
  };

  const handleAddProduct = () => {
    openModal('add');
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    openModal('edit');
  };

  const extraButtons = (
    <div>
      <button className="extra-buttons" onClick={handleAddProduct}>Add Product</button>
    </div>
  );

  return (
    <div className="product-management-page">
      <h1>Products Management</h1>
      <ProductsGrid
        products={allProducts}
        title="Product Management"
        buttonText="Delete"
        onButtonClick={handleDeleteProduct}
        extraButtons={extraButtons}
        secondBtn={true}
        secondBtnTxt="Edit"
        onSecondBtnClick={handleEditProduct}
      />
      {modalType && (
        <ProductForm
          type={modalType}
          onClose={() => setModalType(null)}
          setProducts={setAllProducts}
          product={currentProduct}
        />
      )}
    
    </div>
  );
};

export default ProductManagementPage;
