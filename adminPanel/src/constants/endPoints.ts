export const backendApiUrl = "http://localhost:4001";
const endPoints = {
  GET_PRODUCTS: "/products",
  ADMIN_GET_PRODUCT: "/products",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_PROFILE: "/admin/profile",
  ADMIN_GET_ORDERS: "/admin/getOrders",
  ADMIN_GET_USERS: "/admin/getUsers",
  ADMIN_ADD_PRODUCTS: "/add-products",
  UPDATE_PRODUCT: "/products",
  UPDATE_MYPROFILE: "/users/update_profile",
  UPDATE_ADMINPROFILE: "/admin/update_profile",
  ADMIN_ADD_CATEGORY: "/add-category",
  ADMIN_GET_CATEGORIES: "/categories",
  ADMIN_UPDATE_PASSWORD: "/admin/update_password",
  ADMIN_UPDATE_STATUS: "/update-status",
  ADMIN_UPDATE_USER_STATUS: "/admin/update-user-status",
  ADMIN_GET_REVIEWS: "/admin/get_reviews",
  ADMIN_UPDATE_REVIEW_STATUS: "/admin/update_review_status",
  ADMIN_TOTAL_SALES: "/dashboard/total-sales",
  ADMIN_TOTAL_PRODUCTS: "/dashboard/total-products",
  ADMIN_TOTAL_USERS: "/dashboard/total-users",
  ADMIN_TOTAL_ORDERS: "/dashboard/total-orders",
  ADMIN_TOP_SELLING_PRODUCT: "/dashboard/top-selling-products",
  ADMIN_TOP_CUSTOMERS: "/dashboard/top-customers",
};

export default endPoints;
