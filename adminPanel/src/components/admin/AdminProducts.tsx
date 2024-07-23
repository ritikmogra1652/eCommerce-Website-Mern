import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { IProduct } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './AdminProducts.css';
import Loader from '../../commonComponents/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import * as yup from 'yup';
import Modal from '../commonComponents.tsx/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toastMessageError, toastMessageSuccess } from '../utilities/CommonToastMessage';
const schema = yup.object().shape({
    file: yup.mixed<FileList>().required('File is required')
});
interface AddFile {
    file: FileList;
}

const AdminProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(8);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = "Bearer " + jwtToken;
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);



    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);

        try {
            let url = `${backendApiUrl}${endPoints.GET_PRODUCTS}?page=${currentPage}&limit=${productsPerPage}`;
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
                setCurrentPage(1);
            }
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                setProducts(response.data.data.products);
                setTotalProducts(response.data.data.total);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };
    const ExportProductHandler = async () => {
        try {
            const res = await axios.get(`${backendApiUrl}${endPoints.ADMIN_EXPORT_PRODUCTS}`, {
                headers: { Authorization: AuthStr },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.log(err);
        }
    }

    const ImportProductHandler = async () => { 
        try {
            const res = await axios.get(`${backendApiUrl}${endPoints.ADMIN_EXPORT_SAMPLE_EXCEL}`, {
                headers: { Authorization: AuthStr },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Addproducts.xlsx');
            document.body.appendChild(link);
            link.click();
            openModal()
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (data: AddFile) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        try {
            await axios.post(`${backendApiUrl}${endPoints.ADMIN_IMPORT_PRODUCTS}`, formData, {
                headers: {
                    Authorization: AuthStr,
                    'Content-Type': 'multipart/form-data'
                },
            }).then(res => {
                if (res.data.success === true) {
                    toastMessageSuccess('Products Imported Successfully')
                    closeModal()
                    fetchProducts()
                } else {
                    toastMessageError(res.data.message)
                    closeModal()
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, productsPerPage, searchTerm]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleEditClick = (id: string) => {
        navigate(routes.ADMIN_EDIT_PRODUCTS, { state: { id: id } });
    };

    const handleReviewsClick = (id: string) => {
        navigate(routes.ADMIN_REVIEWS, { state: { id: id } });
    };

    return (
        <div className="admin-products-container">
            <h1>All Products</h1>
            <div className="admin-products-search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={()=>navigate(routes.ADMIN_ADD_PRODUCTS)}>Add Products</button>
                <button onClick={ImportProductHandler}>Import Products</button>
                <button onClick={ExportProductHandler}>Export Products</button>
            </div>
            
            <table className="admin-products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Image</th>
                        <th>Actions</th>
                        <th>Reviews</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={8}>
                                <Loader/>
                            </td>
                        </tr>
                    ) : !products || products.length === 0 ? (
                        <tr>
                            <td colSpan={8}>
                                <div className="admin-products-no-data">No Product Found</div>
                            </td>
                        </tr>
                    ) : (
                        products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.product_name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    {product.images.map((image, index) => (
                                        <img key={index} src={image.imageUrl} alt={product.product_name} />
                                    ))}
                                </td>
                                <td>
                                    <button onClick={() => { handleEditClick(product._id) }}>Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => { handleReviewsClick(product._id) }}>View Reviews</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className='admin-products-pagination'>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'admin__page' : ''}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <Modal show={showModal} onClose={closeModal}>
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>&times;</button>
                        <div className="modal-header">
                            <h2>Add CSV</h2>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="modal-form" noValidate>
                            <div>
                                <label htmlFor="file">File</label>
                                <input
                                    type="file"
                                    {...register('file')}
                                    id="file"
                                />
                                {errors.file && <p>{errors.file.message}</p>}
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </Modal>


        </div>
    );
};

export default AdminProducts;
