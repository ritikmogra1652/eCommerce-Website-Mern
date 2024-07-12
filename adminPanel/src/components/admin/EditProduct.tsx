import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import routes from '../../constants/routes';
import { toastMessageSuccess, toastMessageError } from '../utilities/CommonToastMessage';
import './EditProduct.css';
import { ICategory, IProduct } from '../../interface/commonInterfaces';

const schema = yup.object({
    product_name: yup.string().required('Product name is required'),
    description: yup.string().required('Description is required'),
    category_id: yup.string().required('Category id is required'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    images: yup.mixed<FileList>().required('Image is required'),
    stock: yup.number().required('Stock is required').positive('Stock must be a positive number'),
});

interface FormFields {
    product_name: string;
    description: string;
    category_id: string;
    price: number;
    images: FileList;
    stock: number;
}

const EditProduct = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });
    const AuthStr = 'Bearer ' + jwtToken;

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${backendApiUrl}${endPoints.ADMIN_GET_CATEGORIES}`,
                {
                    headers: { Authorization: AuthStr },
                }
            );
            setCategories(response.data?.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toastMessageError('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                `${backendApiUrl}${endPoints.GET_PRODUCTS}/${location.state.id}`,
                {
                    headers: { Authorization: AuthStr },
                }
            );
            const productData: IProduct = response.data.data;
            setProduct(productData);
            reset({
                product_name: productData.product_name,
                description: productData.description,
                category_id: productData.category_id,
                price: productData.price,
                stock: productData.stock,
            });
        } catch (error) {
            console.error('Error fetching product data:', error);
            toastMessageError('Failed to fetch product data');
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const convertToBase64 = async (file: File): Promise<string | null> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        setLoading(true);
        try {
            
            const productImageFiles = Array.from(data.images);
            let productImageBase64: string[] = [];

            if (productImageFiles.length > 0) {
                productImageBase64 = await Promise.all(
                    productImageFiles.map(file => convertToBase64(file))
                );
            } else if (product) {
                productImageBase64 = product.images.map(image => image.imageUrl);
            }
            const productData = {
                ...data,
                images: productImageBase64.map(base64 => ({ imageUrl: base64 }))
            };

            await axios.patch(
                `${backendApiUrl}${endPoints.UPDATE_PRODUCT}/${location.state.id}`,
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
            toastMessageError('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-edit-product-container">
            <h2>Edit Product</h2>
            {product ? (
                <form className="admin-edit-product-form" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="product_name">Product Name</label>
                        <input {...register('product_name')} type="text" id="product_name" />
                        {errors.product_name && <p className="admin-edit-product-error-message">{errors.product_name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea {...register('description')} id="description" />
                        {errors.description && <p className="admin-edit-product-error-message">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="category_id">Category</label>
                        <select {...register('category_id')} id="category_id">
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="admin-edit-product-error-message">{errors.category_id.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="price">Price</label>
                        <input {...register('price')} type="number" id="price" />
                        {errors.price && <p className="admin-edit-product-error-message">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="images">Images</label>
                        <input {...register('images')} type="file" id="images" multiple />
                        {errors.images && <p className="admin-edit-product-error-message">{errors.images.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="stock">Stock</label>
                        <input {...register('stock')} type="number" id="stock" />
                        {errors.stock && <p className="admin-edit-product-error-message">{errors.stock.message}</p>}
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Product'}
                    </button>
                </form>
            ) : (
                <div className="admin-edit-product-loading">Loading...</div>
            )}
        </div>
    );
};

export default EditProduct;
