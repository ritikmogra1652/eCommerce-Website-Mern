import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { IProduct } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './AdminProducts.css';
import Loader from '../../commonComponents/Loader';

const AdminProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(8);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');

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
        </div>
    );
};

export default AdminProducts;
