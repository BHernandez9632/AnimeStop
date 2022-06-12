import { useContext } from 'react';
import { Storage } from '../Storage';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import MessageBox from '../sections/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, total) => {
    const { data } = await axios.get(`/api/merchs/${item._id}`);
    if (data.stockCount < total) {
      window.alert('Out of Stock');
      return;
    }
    //updates item in cart
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, total },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  //used to authenticate user, if authenticated user is redirected to shipping page
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      {/*Helmet used to set title of page */}
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <h1>Cart</h1>
      <Row>
        {/*Used to show list of items */}
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              No Items <Link to="/">Shop</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {/*Used to show list of items */}
              {cartItems.map((item) => (
                //Used to distinguis
                <ListGroup.Item key={item._id}>
                  <Row className="aligh-items-center">
                    <Col md={4}>
                      {/*Shows image and its information for cart*/}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      {''}
                      <Link to={`/merch/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      {/*This button decreases the number of items in cart */}
                      <Button
                        onClick={() => updateCartHandler(item, item.total - 1)}
                        variant="light"
                        disabled={item.total === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.total}</span>{' '}
                      {/*This button Increases the number of items in cart */}
                      <Button
                        onClick={() => updateCartHandler(item, item.total + 1)}
                        variant="light"
                        disabled={item.total === item.stockCount}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    {/*Ussed for displaying item price */}
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    {/*Sums up quantity of items in cart */}
                    Subtotal ({cartItems.reduce((a, b) => a + b.price, 0)} )
                    items) : $ {/* Multiplies price of cart by total*/}
                    {cartItems.reduce((a, b) => a + b.price * b.total, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/*This button is used to checkout from cart screen */}
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
