//hooks
import React, { useState } from 'react';
//component
import OrderItem from '../OrderItem/OrderItem';
//style
import './Order.css';


const Order = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const orderItems = order.products || [];

  return (
    <div className="order">
      <div className="order-header" onClick={handleToggleExpand}>
        <h2>Order ID: {order.orderId}</h2>
        <p>Items: {orderItems.length}</p>
        <p>Total: ${orderItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
        <button>{isExpanded ? 'Hide Items' : 'Show Items'}</button>
      </div>
      {isExpanded && (
        <div className="order-items">
          {orderItems.map(item => (
            <OrderItem key={item.orderItemId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
