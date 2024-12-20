import React, { useEffect, useState } from 'react';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { IProduct } from '../../interface/commonInterfaces';
import axios from 'axios';
import './HomePage.css';
import { addToCart } from '../../state_management/actions/cartAction';
import { useDispatch } from 'react-redux';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import Loader from '../../commonComponenets/Loader';

import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(8);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${backendApiUrl}${endPoints.GET_PRODUCTS}?page=${currentPage}&limit=${productsPerPage}`;
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
                
            }
            if (sortOrder) {
                url += `&sort=${sortOrder}`;
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
            console.error('Failed to fetch products', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, productsPerPage, searchTerm, sortOrder]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleAddToCart = (product: IProduct) => {
        const quantity = 1;
        dispatch(addToCart(product, quantity));
        toastMessageSuccess("Added to cart");
    };

    const handleProductClick = (product: IProduct) => {
        setSelectedProduct(product);
    };

    const handleReviewClick = (productId: string) => {
        navigate(routes.REVIEW, { state: { productId: productId } });
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <div className="homepage__search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="homepage__sort-dropdown"
                >
                    <option value="">Sort by</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>
            <div className="homepage__home-page">
                {loading ? (
                    // <Loader />
                    Array.from({ length: productsPerPage }).map((_, index) => (
                        <div key={index} className="homepage__product-item">
                            <Skeleton height={150} width={150} className="homepage__product-image" />
                            <h2><Skeleton width={100} /></h2>
                            <p><Skeleton width={50} /></p>
                            <button disabled>
                                <Skeleton width={80} height={30} />
                            </button>
                        </div>
                    ))
                ) : (
                    <>
                        {!products||products.length === 0 ? (
                                // <h2>No Products Found</h2>
                                Array.from({ length: productsPerPage }).map((_, index) => (
                                    <div key={index} className="homepage__product-item">
                                        <Skeleton height={150} width={150} className="homepage__product-image" />
                                        <h2><Skeleton width={100} /></h2>
                                        <p><Skeleton width={50} /></p>
                                        <button disabled>
                                            <Skeleton width={80} height={30} />
                                        </button>
                                    </div>
                                ))
                        ) : (
                            products.map(product => (
                                <div key={product._id} className="homepage__product-item">
                                    
                                    <img
                                        src={product.images[0].imageUrl}
                                        alt={product.product_name}
                                        onClick={() => handleProductClick(product)}
                                        className="homepage__product-image"
                                    />
                                    <h2>{product.product_name}</h2>
                                    <p>Price: Rs {product.price}</p>
                                    <p>In stock: {product.stock}</p>
                                    <button onClick={() => handleAddToCart(product)} disabled={Number(product.stock) === 0} className={`${Number(product.stock) === 0 ? 'homepage__out-of-stock' : ''}`}>
                                        {Number(product.stock) > 0 ? "Add to Cart" : "Out of Stock"}
                                    </button><br />
                                    <button onClick={() => handleReviewClick(product._id)}>Review Product</button>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
            <div className="homepage__pagination">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'homepage__active' : ''}
                    >
                        {number}
                    </button>
                ))}
            </div>
            {selectedProduct && (
                <div className="homepage__modal">
                    <div className="homepage__modal-content">
                        <span className="homepage__close" onClick={closeModal}>&times;</span>
                        <h2>{selectedProduct.product_name}</h2>
                        <div className="homepage__modal-slider">
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}
                            >
                                &#10094;
                            </button>
                            <img src={selectedProduct.images[currentImageIndex].imageUrl} alt={selectedProduct.product_name} />
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}
                            >
                                &#10095;
                            </button>
                        </div>
                        <p>{selectedProduct.description}</p>
                        <p>Price: Rs {selectedProduct.price}</p>
                        <button onClick={() => handleAddToCart(selectedProduct)} disabled={Number(selectedProduct.stock) === 0} className={`${Number(selectedProduct.stock) === 0 ? 'homepage__out-of-stock' : ''}`}>
                            {Number(selectedProduct.stock) > 0 ? "Add to Cart" : "Out of Stock"}
                        </button><br />
                        <button onClick={() => handleReviewClick(selectedProduct._id)}>Review Product</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomePage;
