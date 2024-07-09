import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { IProduct } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(8);
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
            }
        } catch (err) {
            console.error('No Product Found');
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

    if (loading) {
        return <div className="admin-products-loading">Loading...</div>;
    }

    if (!products || products.length === 0) {
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
                <div className="admin-products-no-data">
                    <h2>No Product Found</h2>
                </div>
            </div>
        );
    }

    const handleEditClick = (id:string) => {
        navigate(routes.ADMIN_EDIT_PRODUCTS,{state :{id:id}});
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
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.product_name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <img src={product.image} alt={product.product_name} />
                            </td>
                            <td>
                                <button onClick={() => { handleEditClick(product._id) }}>Edit</button>
                                <button onClick={() => { handleEditClick(product._id) }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
