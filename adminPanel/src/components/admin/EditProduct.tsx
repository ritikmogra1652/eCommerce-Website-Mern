import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '../../constants/routes';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import './EditProduct.css';
import { ICategory } from '../../interface/commonInterfaces';

const schema = yup.object({
    product_name: yup.string().required('Product name is required'),
    description: yup.string().required('Description is required'),
    category_id:yup.string().required('Category id is required'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    image: yup.mixed<FileList>().required('Image is required'),
    stock: yup.number().required('Stock is required').positive('Stock must be a positive number'),
});

interface FormFields {
    product_name: string;
    description: string;
    category_id: string;
    price: number;
    image: FileList;
    stock: number;
}

export interface Product {
    product_name: string;
    description: string;
    category_id: string;
    price: number;
    image: string;
    stock: number;
}

const EditProduct = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });
    const AuthStr = 'Bearer ' + jwtToken;

    
    const fetchCategories = async () => {
        try {
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
    }, []);



    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                `${backendApiUrl}${endPoints.GET_PRODUCTS}/${id}`,
                {
                    headers: {
                        Authorization: AuthStr,
                    },
                }
            );
            const productData: Product = response.data.data;
            setProduct(productData);
            reset();
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const convertToBase64 = async (file: File): Promise<string | null> => {
        try {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            let profileImageBase64 = product?.image || '';
            if (data.image && data.image.length > 0) {
                const productImageFile = data.image[0];
                if (productImageFile) {
                    profileImageBase64 = await convertToBase64(productImageFile) || '';
                }
            }

            const productData = {
                ...data,
                image: profileImageBase64,
            };

            await axios.patch(
                `${backendApiUrl}${endPoints.UPDATE_PRODUCT}/${id}`,
                productData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: AuthStr,
                    },
                }
            );
            toastMessageSuccess('Product updated successfully');
            navigate(routes.ADMIN_GET_PRODUCTS);
            reset();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    return (
        <div className="admin-edit-product-container">
            <h2>Edit Product</h2>
            {product ? (
                <form className="admin-edit-product-form" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="product_name">Product Name</label>
                        <input {...register('product_name')} type="text" id="product_name" defaultValue={product.product_name} />
                        {errors.product_name && <p className="admin-edit-product-error-message">{errors.product_name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea {...register('description')} id="description" defaultValue={product.description} />
                        {errors.description && <p className="admin-edit-product-error-message">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="category_id">Category</label>
                        <select {...register('category_id')} id="category_id" defaultValue={product.category_id}>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="admin-edit-product-error-message">{errors.category_id.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="price">Price</label>
                        <input {...register('price')} type="number" id="price" defaultValue={product.price.toString()} />
                        {errors.price && <p className="admin-edit-product-error-message">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="image">Image</label>
                        <input {...register('image')} type="file" id="image" />
                        {errors.image && <p className="admin-edit-product-error-message">{errors.image.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="stock">Stock</label>
                        <input {...register('stock')} type="number" id="stock" defaultValue={product.stock.toString()} />
                        {errors.stock && <p className="admin-edit-product-error-message">{errors.stock.message}</p>}
                    </div>
                    <button type="submit">Update Product</button>
                </form>
            ) : (
                <div className="admin-edit-product-loading">Loading...</div>
            )}
        </div>
    );
};

export default EditProduct;
