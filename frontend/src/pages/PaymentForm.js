import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ solde, email }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        try {
            const { data: clientSecret } = await axios.post('http://localhost:5000/api/payments/stripe-intent', {
                email,
                amount: solde,
            });

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: { email },
                },
            });

            if (paymentResult.error) {
                setError(paymentResult.error.message);
            } else if (paymentResult.paymentIntent.status === 'succeeded') {
                setSuccess(true);
                setError('');
            }
        } catch (err) {
            setError('Erreur lors du traitement du paiement. Veuillez réessayer.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Paiement</h3>
            <CardElement />
            <button type="submit" disabled={!stripe || success}>
                Payer {solde}$
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Paiement réussi !</p>}
        </form>
    );
};

export default PaymentForm;
