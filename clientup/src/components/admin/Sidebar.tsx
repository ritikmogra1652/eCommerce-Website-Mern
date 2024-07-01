import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Adjust the path as necessary
import routes from '../../constants/routes';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={routes.ADMIN_PROFILE}>Profile</Link>
        </li>
        <li>
          <Link to={routes.ADMIN_GET_ORDERS}>Orders</Link>
        </li>
        <li>
          <Link to={routes.ADMIN_ADD_PRODUCTS}>Add Product</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
