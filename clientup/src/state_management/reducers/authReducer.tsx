import { IUserData } from "../../interface/commonInterfaces";
import ActionType from "../../resources/enums";
export interface IRootState {
    isLoggedIn: boolean;
    authData?: IUserData;
    // cartData?: IUserCartData;
}

const initialState: IRootState = {
    isLoggedIn: false,
    authData: {} as IUserData,
    // cartData:{} as ICartData,
}

interface LoginAction {
    type: ActionType.LOGIN;
    payload: IUserData;
}
interface LogoutAction {
    type: ActionType.LOGOUT;
}

    type Action =
        | LoginAction
        // | UpdateAuthAction
        | LogoutAction
const AuthReducer = (state: IRootState = initialState, action: Action): IRootState => {

    switch (action?.type) {
        case ActionType.LOGIN:
            return {
                ...state,
                isLoggedIn: action?.payload?.jwtToken? true: false, 
                authData: { ...state.authData, ...action?.payload },
            };
        case ActionType.LOGOUT:
            return {
                isLoggedIn: false,
                authData: {} as IUserData,
            };
        default:
            return state;
    }

}

export default AuthReducer;