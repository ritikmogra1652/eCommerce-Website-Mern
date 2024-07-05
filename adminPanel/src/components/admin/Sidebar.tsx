import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import './Sidebar.css';
import routes from '../../constants/routes';
import { logOutAction } from '../../state_management/actions/authAction';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const actions = bindActionCreators(
    {
      logOutAction,
    },
    dispatch
  );
  const handleLogout = () => {
    actions.logOutAction();
 
    navigate(routes.ADMIN_LOGIN);
  };

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
          <Link to={routes.ADMIN_GET_PRODUCTS}>Products</Link>
        </li>
        <li>
          <Link to={routes.ADMIN_ADD_PRODUCTS}>Add Product</Link>
        </li>
        <li>
          <Link to={routes.ADMIN_LOGIN}><button onClick={handleLogout}>Logout</button></Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
