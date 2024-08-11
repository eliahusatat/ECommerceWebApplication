// component
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// style
import './Navbar.css';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('jwtToken') !== null);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(localStorage.getItem('jwtToken') !== null);
        };

        // Add event listener for storage changes
        window.addEventListener('storage', handleStorageChange);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li className="navbar-item">
                    <NavLink to="/" className={({ isActive }) => isActive ? "navbar-link active-link" : "navbar-link"} end>
                        Home
                    </NavLink>
                </li>
                {isAuthenticated && (
                    <>
                        <li className="navbar-item">
                            <NavLink to="/products" className={({ isActive }) => isActive ? "navbar-link active-link" : "navbar-link"}>
                                Products
                            </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink to="/cart" className={({ isActive }) => isActive ? "navbar-link active-link" : "navbar-link"}>
                                MyCart
                            </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink to="/management" className={({ isActive }) => isActive ? "navbar-link active-link" : "navbar-link"}>
                                ProductManagement
                            </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink to="/orders" className={({ isActive }) => isActive ? "navbar-link active-link" : "navbar-link"}>
                                MyOrders
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
