import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { Routes, Route } from "react-router-dom";
import routes from "./constants/routes";
import AdminLogin from "./components/admin/AdminLogin";
import Sidebar from "./components/admin/Sidebar";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import AdminOrders from "./components/admin/AdminOrders";
import AddProduct from "./components/admin/AddProduct";
import './PublicRoutes.css';
import AdminProducts from "./components/admin/AdminProducts";
import EditProduct from "./components/admin/EditProduct";
import EditAdminProfile from "./components/admin/EditAdminProfile";
// import EditProfile from "./components/auth/EditProfile";

interface Props {
    component: React.ComponentType;
    route: string;
}

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
                    path={routes.ADMIN_EDIT_PROFILE}
                    element={
                        <AdminHeader component={EditAdminProfile} route={routes.ADMIN_EDIT_PROFILE} />
                    }

                />
                <Route
                    path={routes.ADMIN_GET_PRODUCTS}
                    element={
                        <AdminHeader component={AdminProducts} route={routes.ADMIN_GET_PRODUCTS} />
                    }

                />
                <Route
                    path={routes.ADMIN_EDIT_PRODUCTS}
                    element={
                        <AdminHeader component={EditProduct} route={routes.ADMIN_EDIT_PRODUCTS} />
                    }

                />

            </Routes>
        </div>
    )
}

export default PublicRoutes