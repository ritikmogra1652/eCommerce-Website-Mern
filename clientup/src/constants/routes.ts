const routes = {
    HOMEPAGE: "/",
    SIGNUP:"/signup",
    LOGIN: "/login",
    MYORDERS: "/myorders",
    MYPROFILE: "/myprofile",
    CART: "/cart",
    CHECKOUT:"/checkout",
    ADMIN_LOGIN:"/admin",
    ADMIN_DASHBOARD:"/admindashboard",
    ADMIN_PROFILE:"/adminprofile",
    ADMIN_GET_ORDERS:"/getorders",
    ADMIN_ADD_PRODUCTS:"/add-products"
};

export const beforeLoginRoutes = [
    routes.HOMEPAGE,
    routes.LOGIN,
    routes.CART,
    routes.SIGNUP,
    routes.ADMIN_LOGIN
];

export default routes;
