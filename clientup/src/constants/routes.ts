const routes = {
  HOMEPAGE: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  MYORDERS: "/myorders",
  MYPROFILE: "/myprofile",
  UPDATE_PASSWORD: "/updatepassword",
  EDIT_PROFILE: "/editprofile",
  CART: "/cart",
  CHECKOUT: "/checkout",
  REVIEW: "/review-product",

};

export const beforeLoginRoutes = [
  routes.HOMEPAGE,
  routes.LOGIN,
  routes.CART,
  routes.SIGNUP,
  routes.REVIEW
];

export default routes;
