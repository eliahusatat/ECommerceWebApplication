//services
import apiService from '../../services/apiService';
//style
import './ProductForm.css';
//hooks
import React, { useState } from 'react';
//store
import { showModal } from '../../redux/actions/modalActions';
import { connect } from 'react-redux';

const ProductForm = ({ type, onClose, showModal, setProducts, product = {} }) => {
  console.log(product);
  let isEdit = type === 'edit';
  const [formData, setFormData] = useState({
    name: product?.name && isEdit ? product.name : '',
    description: product?.description && isEdit ? product.description : '',
    price: product?.price && isEdit ? product.price : 0.0,
    stock: product?.stock && isEdit ? product.stock : 0
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let productId = product?.productId ? product.productId : 0;
    const { name, description, price, stock } = formData;
    let endpoint = 'Products/EditProduct';
    let msg = 'Edited';
    let data = { productId, name, description, price, stock };
    let reqType = 'put';
    if (type === 'add') {
      data = { name, description, price, stock };
      endpoint = 'Products/AddProduct';
      msg = 'Added';
      reqType = 'post';
    }
    try {
      const response = await apiService.request(endpoint, data, reqType);
      if (response.status === 200) {
        if (type === 'add') {
          setProducts(prevProducts => [...prevProducts, response.data]);
        } else {
          setProducts(prevProducts => prevProducts.map(p => 
            p.productId === product.productId ? { ...p, ...data } : p
          ));
        }
        showModal('success', `Successful action`, `You have successfully ${msg} the product`);
      } else {
        showModal('error', `${msg} error`, response.message);
      }
    } catch (error) {
      showModal('error', `${msg} error`, error.toString());
    }
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{type === 'add' ? 'Add' : 'Edit'} Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{type === 'add' ? 'Add' : 'Edit'}</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  showModal,
};
export default connect(null, mapDispatchToProps)(ProductForm);
