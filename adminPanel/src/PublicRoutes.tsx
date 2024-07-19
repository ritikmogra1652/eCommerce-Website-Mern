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
import AdminProducts from "./components/admin/AdminProducts";
import EditProduct from "./components/admin/EditProduct";
import EditAdminProfile from "./components/admin/EditAdminProfile";
import AddCategory from "./components/admin/AddCategory";
import UpdatePassword from "./components/admin/UpdatePassword";
// import EditProfile from "./components/auth/EditProfile";
import AdminUserList from './components/admin/AdminUserList';
import AdminReviews from "./components/admin/AdminReviews";

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
                <Route
                    path={routes.ADMIN_ADD_CATEGORY}
                    element={
                        <AdminHeader component={AddCategory} route={routes.ADMIN_ADD_CATEGORY} />
                    }

                />
                <Route
                    path={routes.ADMIN_UPDATE_PASSWORD}
                    element={
                        <AdminHeader component={UpdatePassword} route={routes.ADMIN_UPDATE_PASSWORD} />
                    }

                />
                <Route
                    path={routes.ADMIN_GET_USERS}
                    element={
                        <AdminHeader component={AdminUserList} route={routes.ADMIN_GET_USERS} />
                    }

                />
                <Route
                    path={routes.ADMIN_REVIEWS}
                    element={
                        <AdminHeader component={AdminReviews} route={routes.ADMIN_REVIEWS} />
                    }

                />
                <Route
                    path={routes.ADMIN_DASHBOARD}
                    element={
                        <AdminHeader component={AdminDashboard} route={routes.ADMIN_DASHBOARD} />
                    }

                />


            </Routes>
        </div>
    )
}

export default PublicRoutes