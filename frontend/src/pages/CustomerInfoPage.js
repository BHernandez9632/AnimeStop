import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../Storage';
import CheckOutBar from '../sections/CheckOutBar';

export default function CustomerInfoPage() {
  //defining navigate hook
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const {
    userInfo,
    //used to read the customers input from the state
    cart: { customerInformation },
  } = state;

  //Defines gathered users information with a state hook if it exists it uses it if not it makes it an empty string
  const [fName, setFName] = useState(customerInformation.fName || '');
  const [address, setAddress] = useState(customerInformation.address || '');
  const [city, setCity] = useState(customerInformation.city || '');
  const [pCode, setPCode] = useState(customerInformation.pCode || '');
  const [country, setCountry] = useState(customerInformation.country || '');

  useEffect(() => {
    //checks user info from state
    if (!userInfo) {
      // if info doesn't exists it redirects them to signin
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  //used to prevent page from refreshing on submit
  const submitHandler = (e) => {
    e.preventDefault();
    //dispatches saving customer information
    ctxDispatch({
      type: 'SAVE_CUSTOMER_INFORMATION',
      payload: {
        fName,
        address,
        city,
        pCode,
        country,
      },
    });
    //saves customer infromation in local storage
    localStorage.setItem(
      'customerInformation',
      JSON.stringify({
        fName,
        address,
        city,
        pCode,
        country,
      })
    );
    //then navigates user to the payment page
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Info</title>
      </Helmet>
      <CheckOutBar step1 step2></CheckOutBar>
      <div className="container small-container">
        <h1 className="my-3"> Customer Info </h1>
        {/*defines fields for users information */}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fName">
            <Form.Label>Full Name</Form.Label>
            {/*Used to gather users full name */}
            <Form.Control
              value={fName}
              //Hooked used to update name entered
              onChange={(e) => setFName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            {/* Used to gather address information*/}
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            {/* Used to gather city*/}
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pCode">
            <Form.Label>Postal Code</Form.Label>
            {/*Used to gather postal code */}
            <Form.Control
              value={pCode}
              onChange={(e) => setPCode(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            {/*Used to gather users country */}
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          {/*button for submitting information form */}
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
