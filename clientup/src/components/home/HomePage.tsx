import React, { useEffect, useState } from 'react';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { IProduct } from '../../interface/commonInterfaces';
import axios from 'axios';
import './HomePage.css';
import { addToCart } from '../../state_management/actions/cartAction';
import { useDispatch } from 'react-redux';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import {  useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';


const HomePage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
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
        // setError(null);

        try {
            let url = `${backendApiUrl}${endPoints.GET_PRODUCTS}?page=${currentPage}&limit=${productsPerPage}`;
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
                setCurrentPage(1);

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
    }, [currentPage, productsPerPage, searchTerm,sortOrder]);


    const handleAddToCart = (product: IProduct) => {
        const quantity = 1;
        dispatch(addToCart(product, quantity));
        toastMessageSuccess("add to cart");


        // dispatch(syncCart(cart.items));
    };


    const handleProductClick = (product: IProduct) => {
        setSelectedProduct(product);
    };

    const handleReviewClick = (productId: string) => {

        navigate(routes.REVIEW, { state: { productId:productId } });
    }

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    // if (error) {

    //     return (
    //         <>
    //             <div>{error}</div></> 
    //     );
    // }
    if (!products || products.length === 0) {
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
                <h2>No Product Found</h2></>
        );
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
                {products.map(product => (
                    <div key={product._id} className="homepage__product-item">
                        <img
                            src={product.images[0].imageUrl}
                            alt={product.product_name}
                            onClick={() => handleProductClick(product)}
                            className="homepage__product-image"
                            onError={(e) => {
                                console.log('Error loading image:', e);
                                // setError('Error loading image');
                            }}
                        />
                        <h2>{product.product_name}</h2>
                        <p>Price: Rs {product.price}</p>
                        <p>In stock: {product.stock}</p>
                        <button onClick={() => handleAddToCart(product)} disabled={Number(product.stock) === 0} className={`${Number(product.stock) === 0 ? 'homepage__out-of-stock' : ''
                            }`}>{Number(product.stock) > 0 ? "Add to Cart" : "Out of Stock" }</button><br />
                        <button onClick={() => handleReviewClick(product._id)}>Review Product</button>
                    </div>
                ))}
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
                        <button onClick={() => handleAddToCart(selectedProduct)} disabled={Number(selectedProduct.stock) === 0} className={`${Number(selectedProduct.stock) ? 'homepage__out-of-stock' : ''
                            }`}>{Number(selectedProduct.stock) > 0 ? "Add to Cart" : "Out of Stock"}</button><br />
                        <button onClick={() => handleReviewClick(selectedProduct._id)}>Review Product</button>
                    </div>
                </div>
            )}


        </>
    );
};

export default HomePage;
