const routes = {
  HOMEPAGE: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  MYORDERS: "/myorders",
  MYPROFILE: "/myprofile",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ADMIN_LOGIN: "/admin",
  ADMIN_DASHBOARD: "/admin/admindashboard",
  ADMIN_PROFILE: "/admin/adminprofile",
  ADMIN_GET_ORDERS: "/admin/getorders",
  ADMIN_ADD_PRODUCTS: "/admin/add-products",
  EDIT_PROFILE: "/editprofile",
};

export const beforeLoginRoutes = [
  routes.HOMEPAGE,
  routes.LOGIN,
  routes.CART,
  routes.SIGNUP,
  routes.ADMIN_LOGIN,
];

export const adminRoutes = [
  routes.ADMIN_DASHBOARD,
  routes.ADMIN_PROFILE,
  routes.ADMIN_GET_ORDERS,
  routes.ADMIN_ADD_PRODUCTS,
];
export default routes;
