import React from "react";
import routes, { beforeLoginRoutes } from "./constants/routes";
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
    let returnData;
    const userData = useSelector((state: RootState) => state.AuthReducer);
    if (beforeLoginRoutes.includes(route)) {
        returnData = <RouteComponent />;

    }
    else {
        if (userData && userData?.isLoggedIn) {
            returnData = <RouteComponent />;
        }
        else {
            returnData = <Navigate to={routes.LOGIN} />;
        }
    }
    return returnData;
}

export default PrivateRoutes;