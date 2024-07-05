const routes = {
  ADMIN_LOGIN: "/",
  ADMIN_DASHBOARD: "/admindashboard",
  ADMIN_PROFILE: "/adminprofile",
  ADMIN_GET_ORDERS: "/getorders",
  ADMIN_ADD_PRODUCTS: "/add-products",
  ADMIN_EDIT_PRODUCTS: "/edit-products/:id",
  ADMIN_EDIT_PROFILE: "/editprofile",
  ADMIN_GET_PRODUCTS: "/getproducts",
};

export const beforeLoginRoutes = [
  routes.ADMIN_LOGIN,
];

// export const adminRoutes = [
//   routes.ADMIN_DASHBOARD,
//   routes.ADMIN_PROFILE,
//   routes.ADMIN_GET_ORDERS,
//   routes.ADMIN_ADD_PRODUCTS,
// ];
export default routes;
