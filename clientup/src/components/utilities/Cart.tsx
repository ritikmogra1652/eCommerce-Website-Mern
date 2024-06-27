import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management'; // Assuming RootState includes CartState
import './Cart.css'; // Import your CSS file for styling

const MyCart: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.CartReducer.items);

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

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
                                <p>Quantity: {item.quantity}</p>
                                {/* <p>Total Price: Rs {item.product.price * item.quantity}</p> */}
                            </div>
                        </div>
                    ))}
                    <div className="subtotal">
                        <p>Subtotal: Rs {subtotal}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCart;
