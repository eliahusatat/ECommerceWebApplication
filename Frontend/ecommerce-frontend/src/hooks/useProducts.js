//services
import apiService from '../services/apiService';
//hooks
import { useState, useEffect } from 'react';
//store
import { useDispatch } from 'react-redux';
import { showModal } from '../redux/actions/modalActions';
import { showLoader, hideLoader } from '../redux/actions/loaderActions';



const useProducts = (type = "products") => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let endpoint = 'Products/GetProducts';
                let data = {};
                let reqType = 'get';
                if(type === 'cartProducts'){
                    endpoint = 'Orders/GetItemsInTheCart';
                }
                dispatch(showLoader());
                const response = await apiService.request(endpoint, data, reqType);
                dispatch(hideLoader());
                if (response.status === 200) {
                    setProducts(response.data);
                } else {
                    dispatch(showModal('error', 'Failed to fetch products', response.message));
                }
            } catch (error) {
                dispatch(showModal('error', 'Failed to fetch products', error));
            } finally {
                dispatch(hideLoader());
            }
        };

        fetchProducts();
    }, [dispatch,type]);
    return { products };
};


export default useProducts;
