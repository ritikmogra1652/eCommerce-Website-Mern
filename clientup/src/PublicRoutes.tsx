import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { Routes, Route } from "react-router-dom";
import routes from "./constants/routes";
import Navbar from "./components/utilities/Navbar";
import HomePage from "./components/home/HomePage";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Cart from "./components/utilities/Cart";
import MyProfile from "./components/auth/MyProfile";
import Checkout from './components/utilities/CheckOut';
import MyOrder from "./components/utilities/MyOrder";
import AdminLogin from "./components/admin/AdminLogin";
import Sidebar from "./components/admin/Sidebar";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import AdminOrders from "./components/admin/AdminOrders";
import AddProduct from "./components/admin/AddProduct";
import './PublicRoutes.css';
import EditProfile from "./components/auth/EditProfile";

interface Props {
    component: React.ComponentType;
    route: string;
}


export const WithHeader = (props: Props) => {
    return (
        <>
            <div className="header-content">
                <Navbar  />
                <div className="main-content">
                    <PrivateRoutes {...props} />
                </div>
            </div>
        </>
    );
};

export const AdminHeader = (props: Props) => {
    return (
        <>
            <div className="header-content">
                <Sidebar />
                <div className="main-content">
                    <PrivateRoutes {...props} />
                </div>
            </div>
        </>
    );
};
const PublicRoutes: React.FC = () => {
    return (
        <div>
            <Routes>
                <Route
                    path={routes.HOMEPAGE}
                    element={
                        <WithHeader component={HomePage} route={routes.HOMEPAGE} />
                    }

                />
                <Route
                    path={routes.LOGIN}
                    element={
                        <WithHeader component={Login} route={routes.LOGIN} />
                    }

                />
                <Route
                    path={routes.SIGNUP}
                    element={
                        <WithHeader component={SignUp} route={routes.SIGNUP} />
                    }

                />
                <Route
                    path={routes.CART}
                    element={
                        <WithHeader component={Cart} route={routes.SIGNUP} />
                    }

                />
                <Route
                    path={routes.CHECKOUT}
                    element={
                        <WithHeader component={Checkout} route={routes.CHECKOUT} />
                    }

                />

                <Route
                    path={routes.MYPROFILE}
                    element={
                        <WithHeader component={MyProfile} route={routes.MYPROFILE} />
                    }

                />
                <Route
                    path={routes.MYORDERS}
                    element={
                        <WithHeader component={MyOrder} route={routes.MYORDERS} />
                    }

                /> 


                <Route
                    path={routes.ADMIN_LOGIN}
                    element={
                        <PrivateRoutes component={AdminLogin} route={routes.ADMIN_LOGIN} />
                    }

                />
                <Route
                    path={routes.ADMIN_DASHBOARD}
                    element={
                        <AdminHeader component={AdminDashboard} route={routes.ADMIN_DASHBOARD} />
                    }

                />
                <Route
                    path={routes.ADMIN_PROFILE}
                    element={
                        <AdminHeader component={AdminProfile} route={routes.ADMIN_PROFILE} />
                    }

                />
                <Route
                    path={routes.ADMIN_GET_ORDERS}
                    element={
                        <AdminHeader component={AdminOrders} route={routes.ADMIN_GET_ORDERS} />
                    }

                />
                <Route
                    path={routes.ADMIN_ADD_PRODUCTS}
                    element={
                        <AdminHeader component={AddProduct} route={routes.ADMIN_ADD_PRODUCTS} />
                    }

                />
                <Route
                    path={routes.EDIT_PROFILE}
                    element={
                        <WithHeader component={EditProfile} route={routes.EDIT_PROFILE} />
                    }

                />

            </Routes>
        </div>
    )
}

export default PublicRoutes