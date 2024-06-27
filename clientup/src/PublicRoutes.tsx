import React from "react";

import PrivateRoutes from "./PrivateRoutes";
import { Routes, Route } from "react-router-dom";
import routes from "./constants/routes";
import Navbar from "./components/utilities/Navbar";
import HomePage from "./components/home/HomePage";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Cart from "./components/utilities/Cart";


interface Props {
    component: React.ComponentType;
    route: string;
}


export const WithHeader = (props: Props) => {
    return (
        <>
            <div>
                <Navbar />
                <div>
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
                {/* { <Route
                    path={routes.MYORDERS}
                    element={
                        <WithHeader component={MyOrders} route={routes.MYORDERS} />
                    }

                />

                <Route
                    path={routes.MYPROFILE}
                    element={
                        <WithHeader component={MyProfile} route={routes.MYPROFILE} />
                    }

                /> } */}

            </Routes>
        </div>
    )
}

export default PublicRoutes