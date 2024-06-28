import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import { RootState } from '../../state_management'; // Assuming RootState includes CartState
// import { useNavigate } from 'react-router-dom';
// import './Checkout.css'; // Import your CSS file for styling
// import { clearCart } from '../../state_management/actions/cartAction';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';

const Checkout: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.CartReducer.items);
    const [address, setAddress] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // const navigate = useNavigate();
    // const dispatch = useDispatch();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);

    const handleOrder = async () => {
        setLoading(true);
        setError(null);

        const orderData = {
            address,
            phone,
            items: cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: subtotal
        };

        try {
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            const response = await axios.post(`${backendApiUrl}${endPoints.PLACE_ORDER}`, orderData, {
                headers: {
                    'Authorization': AuthStr
                }
            });

            if (response.data.success) {
                // dispatch(clearCart());
                // navigate('/order-success');
                console.log("orderSuccessfully----------------------------------");
                
            } else {
                setError('Order could not be placed. Please try again.');
            }
        } catch (err) {
            setError('Order could not be placed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="checkout-item">
                        <img src={item.product.image} alt={item.product.product_name} />
                        <div className="item-details">
                            <h3>{item.product.product_name}</h3>
                            <p>Price: Rs {item.product.price}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="checkout-summary">
                <p>Subtotal: Rs {subtotal}</p>
            </div>
            <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handleOrder(); }}>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="order-button" disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Checkout;
