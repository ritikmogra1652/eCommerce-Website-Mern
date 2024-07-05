import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { IProduct } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';

const AdminProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(8);
    // const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const navigate = useNavigate();


    const fetchProducts = async () => {
        setLoading(true);
        // setError(null);

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
                // setTotalProducts(response.data.data.total);
            } else {
                // setError(response.data.message);
            }
        } catch (err) {

            // return setError('No Product Found');

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
        return <div>Loading...</div>;
    }

    if (!products || products.length === 0) {
        return (
            <>
                <h1>All Products</h1>
                <div className="homepage__search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <h2>No Product Found</h2></>
        );
    }


    const handleEditClick = (id: string) => {
        navigate(routes.ADMIN_EDIT_PRODUCTS.replace(":id", id));    
    };

    return (
        <div>


            <h1>All Products</h1>


            <div className="homepage__search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Image</th>
                        <th>Edit</th>
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
                                <img src={product.image} alt={product.product_name} width="50" />
                            </td>
                            <td>
                                <button onClick={() => { handleEditClick(product._id) }}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
