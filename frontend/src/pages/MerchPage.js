import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Rating from '../sections/Rating';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../sections/LoadingBox';
import MessageBox from '../sections/MessageBox';
import { getError } from '../UtilityE';
import { Storage } from '../Storage';

const reducer = (state, action) => {
  //switch used to execute a statement from multiple others
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, merch: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function MerchPage() {
  // navigate used to access data in another page
  const navigate = useNavigate();
  const area = useParams();
  const { slug } = area;
  const [{ loading, error, merch }, dispatch] = useReducer(reducer, {
    merch: [],
    loading: true,
    error: '',
  });
  //Effect hook is used to accept two parameters a function and an array
  useEffect(() => {
    //uses reducer by defining an array with two values
    const fetchData = async () => {
      //starts the loading action
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/merchs/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  //useContext allows access to the state of context and change it
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const { cart } = state;
  const addToCartHandler = async () => {
    //merchLocated used to see if the item exists or not
    const merchLocated = cart.cartItems.find((x) => x._id === merch._id);
    //total is used to increse the quantity of item when product is clicked by 1
    const total = merchLocated ? merchLocated.total + 1 : 1;
    //this makes an ajax req to the current item
    const { data } = await axios.get(`/api/merchs/${merch._id}`);
    //stockCount is used to unsure the request amount is not more then stocked amount
    if (data.stockCount < total) {
      window.alert('Out of Stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...merch, total },
    });
    //navigate function is used to take user to the cart screen
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        {/*Col md={6} used to occupy half of width (image) */}
        <Col md={6}>
          <img className="img-large" src={merch.image} alt={merch.name}></img>
        </Col>
        {/*Col md={3} used to show product information name, rating, reviews*/}
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{merch.name}</title>
              </Helmet>
              <h1>{merch.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={merch.srating} review={merch.reviews}></Rating>
            </ListGroup.Item>

            <ListGroup.Item>Price : ${merch.price}</ListGroup.Item>

            <ListGroup.Item>
              Description: <p>{merch.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {/*Col md={3} used to occupy action */}
        <Col md={3}>
          {/*This card shows price, if in stock */}
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${merch.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {merch.stockCount > 0 ? (
                        //Badge used to show if item is in stock or not
                        <Badge bg="success">Stocked</Badge>
                      ) : (
                        <Badge bg="danger">Sold Out</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {merch.stockCount > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      {/*This button is used to add merch to cart using an onclick event handler */}
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default MerchPage;
