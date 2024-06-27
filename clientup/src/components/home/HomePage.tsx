import React, { useEffect, useState } from 'react';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { IProduct } from '../../interface/commonInterfaces';
import axios from 'axios';
import './HomePage.css'; // Import your CSS file for styling
import { addToCart } from '../../state_management/actions/cartAction';
import { useDispatch } from 'react-redux';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(6);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    const dispatch = useDispatch();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

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
                setError(response.data.message);
            }
        } catch (err) {

            return setError('No Product Found');
            
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500); // Debounce time in milliseconds (adjust as needed)

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, productsPerPage, searchTerm]); 


    const handleAddToCart = (product: IProduct) => {
        const quantity = 1; 
        dispatch(addToCart(product, quantity));

        // Sync cart with backend if logged in
        // dispatch(syncCart(cart.items));
    };
    

    const handleProductClick = (product: IProduct) => {
        setSelectedProduct(product); // Set selected product for modal
    };

    const closeModal = () => {
        setSelectedProduct(null); // Reset selected product to close modal
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {

        return (
            <>
                <div>{error}</div></> 
        );
    }

    return (
        
        <>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="home-page">
                {products.map(product => (
                    <div key={product._id} className="product-item">
                        <img
                            src={product.image}
                            alt={product.product_name}
                            onClick={() => handleProductClick(product)}
                            className="product-image"
                            onError={(e) => {
                                console.log('Error loading image:', e);
                                setError('Error loading image');
                            }}
                        />
                        <h2>{product.product_name}</h2>
                        <p>Price: Rs {product.price}</p>
                        <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
            </div>

            {selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedProduct.product_name}</h2>
                        <img src={selectedProduct.image} alt={selectedProduct.product_name} />
                        <p>{selectedProduct.description}</p>
                        <p>Price: Rs {selectedProduct.price}</p>
                        <button onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</button>
                    </div>
                </div>
            )}

        </>
    );
};


export default HomePage