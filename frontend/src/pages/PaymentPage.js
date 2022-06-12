import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import CheckOutBar from '../sections/CheckOutBar';
import { Storage } from '../Storage';

export default function PaymentPage() {
  //uses navigate hook to navigate data
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Storage);
  //uses state to get cart
  const {
    //from the cart it gets customer information and payment method
    cart: { customerInformation, paymentMethod },
  } = state;
  //defines state for payment method name
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    //Takes user back to previous state if address does not exist
    if (!customerInformation.address) {
      navigate('/shipping');
    }
  }, [customerInformation, navigate]);

  //prevents refresh of page on submit
  const submitHandler = (e) => {
    e.preventDefault();
    //dispatches save payment method
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    //Saves selected method in local storage
    localStorage.setItem('paymentMethod', paymentMethodName);
    //redirects user to next state
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckOutBar step1 step2 step3></CheckOutBar>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3"> Payment Method </h1>
        {/*Sumbit handler for created form */}
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            {/*Check boxed that is checked if payment method is PayPal */}
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/*Check boxed that is checked if payment method is Stripe */}
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          {/*Button used to input selected payment method */}
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
