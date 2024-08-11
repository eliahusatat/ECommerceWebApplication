//style
import './OrderItem.css';

const OrderItem = ({ item }) => {
  return (
    <div className="order-item">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
    </div>
  );
};

export default OrderItem;
