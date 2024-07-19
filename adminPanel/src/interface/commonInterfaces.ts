
export interface IProduct {
    _id:string,
    product_name: string;
    description: string;
    category_id: string;
    price: number;
    images: IImage[];
    stock: number;
    createdAt: Date;


}

export interface IImage{
    imageUrl:string;
}


export interface ICategory {
    _id: string;
    categoryName: string;
    createdAt: Date;
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

export interface IUsersData {
  _id: string;
  username: string;
  profileImage: string;
}

export interface IProductsData {
  _id: string;
  product_name: string;
  image: string;
}

export interface IReviewData {
  _id: string;
  rating: number;
  comment: string;
  status: "approved" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  user: IUsersData;
  product: IProductsData;
}



export interface IUserDetails {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

export interface IProductDetails {
  _id: string;
  product_name: string;
}

export interface IReviewWithDetails {
  _id: string;
  rating: number;
  comment: string | null;
  status: "approved" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  user: IUserDetails;
  product: IProductDetails;
}


export interface ITopSellingProduct {
  labels: string[];
  data: number[];
}

export interface IUserInfo {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
  userId: string;
  userProfile: string;
  username: string;
  email: string;
  phone: string;
}
