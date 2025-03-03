import React, { useEffect, useState } from 'react';
import CartCompo from '../../components/CartCompo';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(50); // Example fixed delivery fee
    const [discount, setDiscount] = useState(0);
    
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data);
            calculateTotal(response.data);
        } catch (err) {
            setError('Failed to load cart');
        }
        setLoading(false);
    };

    const calculateTotal = (cartItems) => {
        let subtotal = cartItems.reduce((sum, item) => sum + item.food_item.price * item.quantity, 0);
        setTotalAmount(subtotal);
        setDiscount(subtotal > 500 ? 50 : 0); // Example discount logic
    };

    const clearCart = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('/api/cart/clear/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart([]);
            setTotalAmount(0);
        } catch (err) {
            setError('Failed to clear cart');
        }
    };

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/payment/', {
                amount: totalAmount + deliveryCharge - discount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.href = response.data.payment_url;
        } catch (err) {
            setError('Payment failed');
        }
    };

    if (loading) return <div>Loading Cart...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="cart-container">
            <div className="cart-content">
                <div className="cart-items">
                    <h2>Your Cart</h2>
                    {cart.length === 0 ? <p>Cart is empty</p> : cart.map(item => <CartCompo key={item.id} value={item} />)}
                </div>
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <p>Subtotal: ₹{totalAmount}</p>
                    <p>Delivery: ₹{deliveryCharge}</p>
                    <p>Discount: -₹{discount}</p>
                    <h3>Total: ₹{totalAmount + deliveryCharge - discount}</h3>
                    <button onClick={handlePayment}>Proceed to Pay</button>
                    <button onClick={clearCart} className="clear-cart">Clear Cart</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
