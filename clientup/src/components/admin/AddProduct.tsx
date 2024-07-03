import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import "./AddProduct.css"
import { toastMessageSuccess } from '../utilities/CommonToastMessage';

interface FormFields {
  product_name: string;
  description: string;
  // category_id?: string; 
  price: number;
  image: FileList;
  stock: number;
}

const schema = yup.object().shape({
  product_name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  // category_id: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').positive('Price must be a positive number'),
  image: yup.mixed<FileList>().required('Image is required'),
  stock: yup.number().required('Stock is required').positive('Stock must be a positive number'),
});

const AddProduct: React.FC = () => {
  const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
  // const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormFields>({
    resolver: yupResolver(schema),
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
      const productImageFile = data.image[0];
      let profileImageBase64 = null;
      if (productImageFile) {
        profileImageBase64 = await convertToBase64(productImageFile);
      }

      const productData = {
        ...data,
        image: profileImageBase64
      };

      const AuthStr = 'Bearer '.concat(jwtToken as string);
      await axios.post(
        `${backendApiUrl}${endPoints.ADMIN_ADD_PRODUCTS}`,
        productData,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      toastMessageSuccess("Product added successfully");
      reset();
    }
    catch (error) {
      alert('upload the image');
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="product_name">Product Name</label>
          <input {...register('product_name')} type="text" id="product_name" />
          <p className="error-message">{errors.product_name?.message}</p>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea {...register('description')} id="description" />
          <p className="error-message">{errors.description?.message}</p>
        </div>

        {/* <div>
          <label htmlFor="category_id">Category ID</label>
          <input {...register('category_id')} type="text" id="category_id" />
          <p>{errors.category_id?.message}</p>
        </div> */}

        <div>
          <label htmlFor="price">Price</label>
          <input {...register('price')} type="number" id="price" />
          <p className="error-message">{errors.price?.message}</p>
        </div>

        <div>
          <label htmlFor="image">Image</label>
          <input {...register('image')} type="file" id="image" />
          <p className="error-message">{errors.image?.message}</p>
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input {...register('stock')} type="number" id="stock" />
          <p className="error-message">{errors.stock?.message}</p>
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
