import React, { useEffect } from "react";
import routes, {  beforeLoginRoutes } from "./constants/routes";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from './state_management/index';
import { isExpired } from "react-jwt";
import { toastMessageSuccess } from "./components/utilities/CommonToastMessage";
import { logOutAction } from "./state_management/actions/authAction";
import { bindActionCreators } from "redux";


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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const actions = bindActionCreators(
        {
            logOutAction,
        },
        dispatch
    );

    useEffect(() => {
        if (authToken) sessionExpire();
    }, [authToken]);

    const sessionExpire = () => {
        const isMyTokenExpired = isExpired(authToken);
        if (isMyTokenExpired) {
            localStorage.clear();
            actions.logOutAction();
            toastMessageSuccess("expired");
            navigate(routes.ADMIN_LOGIN);
        }
    };

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