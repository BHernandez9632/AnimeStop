import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Storage } from '../Storage';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../UtilityE';

const reducer = (state, action) => {
  //switch case
  switch (action.type) {
    //if request accept it load true
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    //if it is a success make it false
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    //otherwise retruns error
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserAccountPage() {
  //gets user information from context and stores it
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const { userInfo } = state;
  //Defines state fro name, email, password, passconfrimation
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  //handles sumbission of the form
  const submitHandler = async (e) => {
    //prevents refresh on submit
    e.preventDefault();
    try {
      //sends ajax request  using a put request
      const { data } = await axios.put(
        '/api/users/profile',
        {
          //data entered by user
          name,
          email,
          password,
        },
        {
          //used to authorize the request
          headers: { authorization: `Barrier ${userInfo.token}` },
        }
      );
      //if success updates the profile
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      //dispatches a sign in action with data
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      //updates data in local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      //displays succes message
      toast.success('Updated Complete');
      //catches error
    } catch (err) {
      //sends fetch fail action
      dispatch({
        type: 'FETCH_FAIL',
      });
      //displays error on error
      toast.error(getError(err));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>Account Information</title>
      </Helmet>
      <h1 className="my-3">Account Informtion</h1>
      {/*Implements submit handler for form */}
      <form onSubmit={submitHandler}>
        {/*New User Name */}
        <Form.Group className="mb-3" controlId="fname">
          <Form.Label>Name</Form.Label>
          {/* fetches fname from use info*/}
          <Form.Control
            value={name}
            //Changes name to new set name
            onChange={(e) => setName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          {/*New User Name */}
          <Form.Label>Email</Form.Label>
          {/* fetches fname from use info*/}
          <Form.Control
            value={email}
            //Changes name to new set name
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            //updates password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            // confirms updated password
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/*Button for updating information */}
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
