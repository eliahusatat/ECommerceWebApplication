//services
import apiService from '../../services/apiService';
//component
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
//style
import './MyCart.css';
//hooks
import useProducts from '../../hooks/useProducts';
import React, { useState, useEffect } from 'react';
//store
import { showModal } from '../../redux/actions/modalActions';
import { useDispatch } from 'react-redux';

const MyCartPage = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { products } = useProducts('cartProducts');

    useEffect(() => {
        setCartProducts(products);
    }, [products]);

    const handleRemoveFromCart = async (product) => {
        const response = await apiService.request(`Orders/DeleteItemFromCart/${product.productId}`, {}, 'delete');
        if (response.status === 200) {
            setCartProducts(prevProducts => prevProducts.filter(p => p.productId !== product.productId));
            dispatch(showModal('success', 'The product has been successfully removed', response.message));
        } else {
            dispatch(showModal('error', 'Failed to remove product', response.message));
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateOrder = async () => {
        const response = await apiService.request('Orders/CreateOrderFromCart', {}, 'post');
        setIsModalOpen(false);
        if (response.status === 200) {
            setCartProducts([]);
            dispatch(showModal('success', 'Order created successfully', response.message));
        } else {
            dispatch(showModal('error', 'Failed to create order', response.message));
        }
    };

    const totalCost = cartProducts.reduce((total, product) => total + product.price, 0).toFixed(2);


    return (
        <div className="my-cart-page">
            <h1>My Cart</h1>
            <button className="open-modal-btn" onClick={handleOpenModal}>View Cart Summary</button>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Cart Summary</h2>
                        <ul>
                            {cartProducts.map(product => (
                                <li key={product.productId}>{product.name}</li>
                            ))}
                        </ul>
                        <p>Total Cost: ${totalCost}</p>
                        <button className="pay-btn" onClick={handleCreateOrder}>Pay</button>
                    </div>
                </div>
            )}
            <ProductsGrid
                products={cartProducts}
                buttonText="Remove from Cart"
                onButtonClick={handleRemoveFromCart}
            />
        </div>
    );
};

export default MyCartPage;