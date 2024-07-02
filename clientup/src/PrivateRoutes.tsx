import React from "react";
import routes, { adminRoutes, beforeLoginRoutes } from "./constants/routes";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from './state_management/index';


interface Props {
    component: React.ComponentType;
    route: string;
}
const PrivateRoutes: React.FC<Props> = ({
    component: RouteComponent,
    route
}) => {

    const userData = useSelector((state: RootState) => state.AuthReducer);
    const authToken = userData?.authData?.jwtToken;
    if ([routes.HOMEPAGE, routes.CART].includes(route)) {
        return <RouteComponent />;
    }

    if (authToken) {
        if (beforeLoginRoutes.includes(route) && route == routes.LOGIN) {
            return <Navigate to={routes.HOMEPAGE} />;
            
        } else if(adminRoutes.includes(route) && userData?.authData?.role !== 'admin') {
            return <Navigate to={routes.ADMIN_LOGIN} />;
        }else {
            return <RouteComponent />;
        }
    } else {
        if (beforeLoginRoutes.includes(route)) {
            return <RouteComponent />;
        } else {
            return <Navigate to={routes.LOGIN} />;
        }
    }
}

export default PrivateRoutes;