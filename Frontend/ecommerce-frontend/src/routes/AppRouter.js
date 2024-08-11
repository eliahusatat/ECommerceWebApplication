//pages component
import Home from '../pages/HomePage/Home';
import Products from '../pages/ProductsPage/Products';
import MyCart from '../pages/MyCartPage/MyCart';
import ProductManagement from '../pages/ProductManagementPage/ProductManagement';
import MyOrders from '../pages/MyOrdersPage/MyOrders';
//react-router
import { Routes, Route } from 'react-router-dom';

function AppRouter() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/management" element={<ProductManagement />} />
          <Route path="/orders" element={<MyOrders />} /> 
        </Routes>
      </div>
    );
  }
  
  export default AppRouter;