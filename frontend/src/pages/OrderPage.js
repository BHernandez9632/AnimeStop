import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import CheckOutBar from '../sections/CheckOutBar';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Storage } from '../Storage';
import { Link, useNavigate } from 'react-router-dom';
import { getError } from '../UtilityE';
import { toast } from 'react-toastify';
import LoadingBox from '../sections/LoadingBox';

//degining switch case
const reducer = (state, action) => {
  //switch case
  switch (action.type) {
    //creates a request
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    //successfully created
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    //failed to create
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function OrderPage() {
  const navigate = useNavigate();
  //useReducer gets data and dispatch action
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  //gets state and dispatch from the useContext function
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const { cart, userInfo } = state;

  //The round2decimal is used to round the number to two decimal points
  const round2decimal = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  //calculates items price wrapping the items price in the round2decimal format
  cart.itemsPrice = round2decimal(
    //calcuualtes sum of the total then multiplying it by prices in the cart
    cart.cartItems.reduce((a, b) => a + b.total * b.price, 0)
  );

  cart.shippingPrice =
    //this makes it so that if price is over 100 it makes it zero otherwise it makes it 10
    cart.itemsPrice > 100 ? round2decimal(0) : round2decimal(10);
  //tax price used is 15%
  cart.taxPrice = round2decimal(0.15 * cart.itemsPrice);
  //the total price is gathered by adding all other prices
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      //Creates ajax request
      const { data } = await Axios.post(
        '/api/orders',
        {
          //whats requested
          orderItems: cart.cartItems,
          customerInformation: cart.customerInformation,
          itemsPrice: cart.itemsPrice,
          paymentMethod: cart.paymentMethod,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          //Second paramater passing options setting an authorization to barrier authenticating the api
          headers: {
            authorization: `Barrier ${userInfo.token}`,
          },
        }
      );
      //dispatches a cart clear option
      ctxDispatch({ type: 'CART_CLEAR' });
      //dispatch creates a success that is stored
      dispatch({ type: 'CREATE_SUCCESS' });
      //clears items for next order
      localStorage.removeItem('cartItems');
      //redirects users to order details page
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      //Displays error if failed
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  //Checks payment conditon
  useEffect(() => {
    //if the payment doesn't exist
    if (!cart.paymentMethod) {
      //redirect user to payment screen
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    <div>
      <CheckOutBar step1 step2 step3 step4></CheckOutBar>
      <Helmet>
        <title>Review Order</title>
      </Helmet>
      <h1 className="my-3">Review Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            {/* Creates a standalone card body with customer information*/}
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {cart.customerInformation.fName} <br />
                <strong>Address: </strong> {cart.customerInformation.address},
                {cart.customerInformation.city},{' '}
                {cart.customerInformation.pCode},{' '}
                {cart.customerInformation.country}
              </Card.Text>
              {/* Link allows user to edit information in card*/}
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            {/* Creates a standalone card body with payment method*/}
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            {/* Creates a standalone card body with Selected items*/}
            <Card.Body>
              <Card.Title>Item</Card.Title>
              <ListGroup variant="flush">
                {/* Used to convert each item to list group item*/}
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    {/*Creates a row for each item */}
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        {''}
                        <Link to={`/merch/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.total}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            {/* Creates a standalone card body containg the review summary */}
            <Card.Body>
              <Card.Title> Review Order </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    {/* Item price*/}
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    {/*Shipping cost */}
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    {/* Taxes on purchase */}
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    {/* Total purchase*/}
                    <Col>Total</Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    {/* Button used to place order*/}
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                    {/*Shows a loading box */}
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
