// src/pages/MyOrdersPage/MyOrdersPage.js
import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import Order from '../../components/Order/Order';
import { useDispatch } from 'react-redux';
import { showModal } from '../../redux/actions/modalActions';
import { showLoader, hideLoader } from '../../redux/actions/loaderActions';
import {processOrdersData} from "../../utils/Helper"



import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoader());
        const response = await apiService.request('Orders/GetOrders', {}, 'get');
        if (response.status === 200) {
          setOrders(processOrdersData(response.data));
        } else {
          dispatch(showModal('error', 'Failed to fetch orders', response.message));
        }
      } catch (error) {
        dispatch(showModal('error', 'Failed to fetch orders (request)', error));
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>
      {
        orders.map(order => (
          <Order key={order.orderId} order={order} />
        ))
      }
    </div>
  );
};

export default MyOrders;
