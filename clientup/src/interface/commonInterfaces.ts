
export interface IProduct {
  _id: string;
  product_name: string;
  description: string;
  category_id: string;
  price: number;
  images: IImage[];
  stock: number;
  createdAt: Date;
}
export interface IReview{
    _id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IImage{
    imageUrl: string;
}

export interface AddToCartPayload {
    product: IProduct;
    quantity: number;
}

export interface UpdateProfilePayload {
    username: string;
}

export interface RemoveFromCartPayload {
    productId: string;
}


export interface UpdateCartQuantityPayload {
  productId: string;
  quantity: number;
}



// export interface ISignUp {
//     username:string,
//     email:string,
//     phone:string,
//     password:string,
//     profileImage:string
// }

export interface IUserData{
    username:string
    email: string,
    role:string,
    jwtToken: string
}