import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../sections/LoadingBox';
import MessageBox from '../sections/MessageBox';
import { Storage } from '../Storage';
import { getError } from '../UtilityE';

const reducer = (state, action) => {
  //switch case
  switch (action.type) {
    //gets request
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    //if success sets loading to false and fills orders
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    //if error sends error message
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryPage() {
  const { state } = useContext(Storage);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      //Starts fetch request
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        //makes ajax request to request data
        const { data } = await axios.get(`/api/orders/mine`, {
          //verifies and gets user from the backend
          headers: { authorization: `Barrier ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1> Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
