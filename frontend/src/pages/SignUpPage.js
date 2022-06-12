import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Storage } from '../Storage';
import { toast } from 'react-toastify';

export default function SignUpPage() {
  const navigate = useNavigate();
  //The useLocation hook is used to search
  const { search } = useLocation();
  //instances from UrlSearchParams passing a search obj then getting redirect from query
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  //This searches to see if it exists if not it will redirect back to homepage
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //defines User input as a state hook with empty default value
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //used to save information in local storage
  const { state, dispatch: ctxDispatch } = useContext(Storage);

  //This prevents page refresh on user submit
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();

    //This returns error if password does not match confirmed password
    if (password !== confirmPassword) {
      toast.error('Invalid Entry');
      return;
    }

    try {
      //sends an ajax request to backend signup passing user info extracting data from the res
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });

      //This dispatches the action and the payload passed along with it
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      //saves user information in browser storage after converting it to string
      localStorage.setItem('userInfo', JSON.stringify(data));
      //Navigates to the directed url but defaults to homepage if it does not exists
      navigate(redirect || '/');
      //displays error
    } catch (err) {
      alert('Invalid Entry');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    //This container is used for the Making a new account page
    <Container className="small-container">
      <Helmet>
        <title>Make New Account</title>
      </Helmet>
      <h1 className="my-3">Make New Account</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          {/*Gathers users name */}
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        {/*Gathers users email */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {/*Gathers users password */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {/* Confirms users password */}
        <Form.Group className="mb-3" controlId="confrimPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />{' '}
        </Form.Group>
        {/* Button used to submit new sign up information*/}
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Returning User?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Log In</Link>
        </div>
      </Form>
    </Container>
  );
}
