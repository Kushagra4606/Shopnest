import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import './PaymentForm.css';

// User provided Publishable Key
const stripePromise = loadStripe('pk_test_51SrYPs4GYcBVYgJnFs4nQF3rRPdJP3VxQKvyg6YxneiOjDIm0PBNA3jqNscpxTr0AmFwgEe6qyUENdkl5PbGCbJ800zbKotx7e');

const CheckoutForm = ({ onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { cartTotal } = useCart();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        // 1. Create PaymentIntent on the server
        try {
            const response = await fetch('http://localhost:4242/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: cartTotal * 100 }), // INR in paise
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const clientSecret = data.clientSecret;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    setSuccess(true);
                    setProcessing(false);
                }
            }
        } catch (err) {
            setError(err.message);
            setProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="payment-success">
                <h3>Payment Successful!</h3>
                <p>Thank you for your purchase.</p>
                <button className="btn btn-primary" onClick={onClose}>Close</button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h3>Pay with Card</h3>
            <p className="payment-amount">Total: ₹{cartTotal.toLocaleString()}</p>

            <div className="card-element-container">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>

            {error && <div className="payment-error">{error}</div>}

            <button type="submit" disabled={!stripe || processing} className="btn btn-primary pay-btn">
                {processing ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        </form>
    );
};

const PaymentModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                <Elements stripe={stripePromise}>
                    <CheckoutForm onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
}

export default PaymentModal;
