// import { Action, Dispatch } from "redux";
import { IProduct } from "../../interface/commonInterfaces";
import ActionType from "../../resources/enums";

export const addToCart = (product: IProduct, quantity: number) => ({
  type: ActionType.ADD_TO_CART,
  payload: { product, quantity },
});

export const removeFromCart = (productId: string) => ({
  type: ActionType.REMOVE_FROM_CART,
  payload: productId,
});

export const clearCart = () => ({
  type: ActionType.CLEAR_CART,
});