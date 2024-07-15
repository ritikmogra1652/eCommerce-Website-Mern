import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import routes from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';
import { ICategory } from '../../interface/commonInterfaces';
interface FormFields {
  product_name: string;
  description: string;
  category_id: string;
  price: number;
  images: FileList;
  stock: number;
}

const schema = yup.object().shape({
  product_name: yup.string().required('Product name is required').trim(),
  description: yup.string().required('Description is required').trim(),
  category_id: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').positive('Price must be a positive number'),
  images: yup.mixed<FileList>().required('Image is required'),
  stock: yup.number().required('Stock is required').positive('Stock must be a positive number'),
});

const AddProduct: React.FC = () => {
  const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormFields>({
    resolver: yupResolver(schema),
  }); 

  const [categories, setCategories] = useState<ICategory[]>([]); 
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const AuthStr = 'Bearer '.concat(jwtToken as string);
      const response = await axios.get(
        `${backendApiUrl}${endPoints.ADMIN_GET_CATEGORIES}`,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      setCategories(response.data?.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  useEffect(() => {
    

    fetchCategories();
  }, [jwtToken]);

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
      const productImageFiles = Array.from(data.images);

      let productImageBase64:string[] = [];
      if (productImageFiles) {
        productImageBase64 = await Promise.all(productImageFiles.map(file=>convertToBase64(file)));
      }

      const productData = {
        ...data,
        images: productImageBase64.map(base64 => ({ imageUrl: base64 }))
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
      navigate(routes.ADMIN_GET_PRODUCTS);
      toastMessageSuccess("Product added successfully");
      reset();
    }
    catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-item">
          <label className="add-product-label" htmlFor="product_name">Product Name</label>
          <input {...register('product_name')} type="text" id="product_name" className="add-product-input" />
          <p className="add-product-error-message">{errors.product_name?.message}</p>
        </div>

        <div className="form-item">
          <label className="add-product-label" htmlFor="description">Description</label>
          <textarea {...register('description')} id="description" className="add-product-textarea" />
          <p className="add-product-error-message">{errors.description?.message}</p>
        </div>

        <div className="form-item">
          <label className="add-product-label" htmlFor="price">Price</label>
          <input {...register('price')} type="number" id="price" className="add-product-input" />
          <p className="add-product-error-message">{errors.price?.message}</p>
        </div>

        <div className="form-item">
          <label className="add-product-label" htmlFor="images">Image</label>
          <input {...register('images')} type="file" id="images" className="add-product-input" multiple/>
          <p className="add-product-error-message">{errors.images?.message}</p>
        </div>

        <div className="form-item">
          <label className="add-product-label" htmlFor="stock">Stock</label>
          <input {...register('stock')} type="number" id="stock" className="add-product-input" />
          <p className="add-product-error-message">{errors.stock?.message}</p>
        </div>

        <div className="form-item">
          <label className="add-product-label" htmlFor="category_id">Category</label>
          <select {...register('category_id')} id="category_id" className="add-product-select">
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.categoryName}</option>
            ))}
          </select>
          <p className="add-product-error-message">{errors.category_id?.message}</p>
        </div>

        <button type="submit" className="add-product-submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
