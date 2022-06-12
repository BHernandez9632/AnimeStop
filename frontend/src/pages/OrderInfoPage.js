import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingBox from '../sections/LoadingBox';
import MessageBox from '../sections/MessageBox';
import { Storage } from '../Storage';
import { getError } from '../UtilityE';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

//This functions accepts action and state
function reducer(state, action) {
  //switch case
  switch (action.type) {
    //gets requests
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    //on successful get
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    //if it fails to get request
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //Request payments
    default:
      return state;
  }
}

export default function OrderInfoPage() {
  //gets user info from context api
  const { state } = useContext(Storage);
  const { userInfo } = state;

  //gets order id from params
  const params = useParams();
  //gets the id and renames it orderid
  const { id: orderId } = params;
  const navigate = useNavigate();

  //Defines loading, error, order,successpay, loadingpay
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    //reducer defined
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    //sends ajax request to backend
    const fetchOrder = async () => {
      try {
        //defines the fetch order function
        dispatch({ type: 'FETCH_REQUEST' });
        //sends an ajax request to the selected address
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          //Authorizes the entire request
          headers: { authorization: `Barrier ${userInfo.token}` },
        });
        //after it retrieces the api successfully it passes the order data from backend
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        //on error shows this meesge
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    //checks user info
    if (!userInfo) {
      //If the info is null it redirects them to the login page
      return navigate('/login');
    }
    //This if condition is true it will fetch order if its not it
    if (!order._id || (order._id && order._id !== orderId)) {
      //if its not it fetches the order
      fetchOrder();
    }
    //dependency array
  }, [order, userInfo, orderId, navigate]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        {/*Page heading */}
        <title>Order Number {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order Number {orderId} </h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            {/*Card is used to display information gathered  */}
            <Card.Body>
              <Card.Title>Shipment</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order.customerInformation.fName} <br />
                <strong>Address: </strong> {order.customerInformation.address},
                {order.customerInformation.city},{' '}
                {order.customerInformation.pCode},{' '}
                {order.customerInformation.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Item Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipment</Card.Title>
              <Card.Text>
                <strong>Payment Method: </strong> {order.paymentMethod}
              </Card.Text>
              {/*This card checks if order is paid  */}
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                //if it isn't paid it deisplays this message
                <MessageBox variant="danger">Payment Pending</MessageBox>
              )}
            </Card.Body>
          </Card>

          {/*This card is used to show Items  */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Item</Card.Title>
              <ListGroup variant="flush">
                {/*orderItems.map is used to render items in a list group */}
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    {/*Row and coloumn is used to put stuff next to each other */}
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>
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
            </Card.Body>
          </Card>
        </Col>
        {/*This is used to show actions in the order */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  {/* Displays item price*/}
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  {/* Displays shipping price*/}
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  {/* Displays tax amount*/}
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  {/* Displays summed order total*/}
                  <Row>
                    <Col>Final Price</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
