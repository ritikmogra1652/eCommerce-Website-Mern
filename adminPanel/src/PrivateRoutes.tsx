import React from "react";
import routes, {  beforeLoginRoutes } from "./constants/routes";
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

    if (authToken) {
        if (beforeLoginRoutes.includes(route) && route == routes.ADMIN_LOGIN) {
            return <Navigate to={routes.ADMIN_PROFILE} />;
            
        }else {
            return <RouteComponent />;
        }
    } else {
        if (beforeLoginRoutes.includes(route)) {
            return <RouteComponent />;
        } else {
            return <Navigate to={routes.ADMIN_LOGIN} />;
        }
    }
}

export default PrivateRoutes;