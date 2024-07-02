import React from 'react';
import { Link, useNavigate, } from 'react-router-dom';
// import "./Navbar.css";
import {  useDispatch, useSelector } from 'react-redux';
// import { clearProfile } from '../state_management/Actions/actions';
import routes from '../../constants/routes';
import { RootState } from '../../state_management';
import './Navbar.css'
import { logOutAction } from '../../state_management/actions/authAction';
import { bindActionCreators } from 'redux';

const Navbar: React.FC = () => {

    const isLoggedIn = useSelector((state: RootState) => state.AuthReducer.isLoggedIn);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const actions = bindActionCreators(
        {
            logOutAction,
        },
        dispatch
    );

    const handleLogout = () => {
        actions.logOutAction();
        navigate(routes.HOMEPAGE);
    }


    return (
        <nav>
            <ul>
                <li><Link to="/">HOMEPAGE</Link></li>
                <li><Link to={routes.CART}>CART</Link></li>

                {isLoggedIn ? (
                    <>
                        <li><Link to={routes.MYORDERS}>My Orders</Link></li>
                        <li><Link to={routes.MYPROFILE}>My Profile</Link></li>
                        <li><Link to={routes.HOMEPAGE} onClick={handleLogout}>Logout</Link></li>
                    </>
                ) : (
                    <>

                            <li><Link to={routes.SIGNUP}>SignUp</Link></li>
                    </>
                )}

            </ul>
        </nav>
    )
}



export default Navbar;