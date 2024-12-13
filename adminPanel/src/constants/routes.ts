const routes = {
  ADMIN_LOGIN: "/",
  ADMIN_DASHBOARD: "/admindashboard",
  ADMIN_PROFILE: "/adminprofile",
  ADMIN_GET_ORDERS: "/getorders",
  ADMIN_ADD_PRODUCTS: "/add-products",
  ADMIN_EDIT_PRODUCTS: "/edit-products",
  ADMIN_EDIT_PROFILE: "/editprofile",
  ADMIN_GET_PRODUCTS: "/getproducts",
  ADMIN_GET_USERS: "/getusers",
  ADMIN_ADD_CATEGORY: "/addcategory",
  ADMIN_UPDATE_PASSWORD: "/updatepassword",
  ADMIN_UPDATE_STATUS: "/updatestatus",
  ADMIN_REVIEWS: "/get_reviews",
  ADMIN_CALENDER:"/calender"

};

export const beforeLoginRoutes = [routes.ADMIN_LOGIN];

// export const adminRoutes = [
//   routes.ADMIN_DASHBOARD,
//   routes.ADMIN_PROFILE,
//   routes.ADMIN_GET_ORDERS,
//   routes.ADMIN_ADD_PRODUCTS,
// ];
export default routes;
