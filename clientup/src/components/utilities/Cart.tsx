import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state_management'; 
import './Cart.css'; 
import { removeFromCart, updateCartQuantity } from '../../state_management/actions/cartAction';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';

const MyCart: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.CartReducer.items);
    const isLoggedIn = useSelector((state: RootState) => state.AuthReducer.isLoggedIn)
    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    };

    const handleRemoveFromCart = (productId: string) => {
        dispatch(removeFromCart({ productId }));
    };


    const handleProceedToCheckout = () => {
        if (isLoggedIn) {
            navigate(routes.CHECKOUT); 
        } else {
            navigate(routes.LOGIN); 
        }
    };


    return (
        <div className="cart-container">
            <h2>My Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img
                                src={item.product.image}
                                alt={item.product.product_name}
                            />

                            <div className="item-details">
                                <h3>{item.product.product_name}</h3>
                                <p>Price: Rs {item.product.price}</p>
                                {/* <p>Quantity: {item.quantity}</p> */}
                                <div className="quantity-control">
                                    <label htmlFor={`quantity-${index}`}>Quantity:</label>
                                    <select
                                        id={`quantity-${index}`}
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.product._id, +e.target.value)}
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <p>Total Price: Rs {item.product.price * item.quantity}</p>
                                <button onClick={() => handleRemoveFromCart(item.product._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="subtotal">
                        <p>Subtotal: Rs {subtotal}</p>
                        </div>
                        <div>
                            <button className="proceed-button" onClick={handleProceedToCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>


                </div>
            )}
        </div>
    );
};


export default MyCart


