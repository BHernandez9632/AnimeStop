import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Merch from '../sections/Products';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../sections/LoadingBox';
import MessageBox from '../sections/MessageBox';

const reducer = (state, action) => {
  //switch used to execute a statement from multiple others
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, merchs: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomePage() {
  //uses reducer by defining an array with two values
  //logger used to log state changes between dispatching actions
  const [{ loading, error, merchs }, dispatch] = useReducer(logger(reducer), {
    merchs: [],
    loading: true,
    error: '',
  });
  //Effect hook is used to accept two parameters a function and an array
  useEffect(() => {
    //async function used to send ajax request
    const fetchData = async () => {
      //starts the loading action
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/merchs');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ trype: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {/*Helmet tag used to demonstrate selected title on tab */}
      <Helmet>
        <title>AnimeStop</title>
      </Helmet>
      <h1>Anime Stop</h1>
      <div className="merchs">
        {/* used to show conditional rendering */}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          // Message box component ysed to show error message
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {merchs.map((merch) => (
              //Col is used to set how many items are on the screen depending on size
              //Key attribute makes it a unique value
              <Col key={merch.slug} sm={6} md={5} lg={4} className="mb-3">
                {/*Line 67 used to create a component for later use*/}
                <Merch merch={merch}></Merch>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomePage;
