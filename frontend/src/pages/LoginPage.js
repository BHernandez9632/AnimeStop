import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Storage } from '../Storage';
import { toast } from 'react-toastify';
import { getError } from '../UtilityE';

export default function LoginPage() {
  const navigate = useNavigate();
  //The useLocation hook is used to search
  const { search } = useLocation();
  //instances from UrlSearchParams passing a search obj then getting redirect from query
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  //This searches to see if it exists if not it will redirect back to homepage
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //defines email as a state hook with empty default value
  const [email, setEmail] = useState('');
  //defines email as a state hook with empty default value
  const [password, setPassword] = useState('');

  //used to save information in local storage
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    //This prevents page refresh on user login
    e.preventDefault();
    try {
      //sends an ajax request to backend signin passing email and password extracting data from the res
      const { data } = await Axios.post('/api/users/signin', {
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
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    //checks user info
    if (userInfo) {
      //if it exists it redirects user to redirect variable
      navigate(redirect);
    }
    //all used variables are placed in dependancy array
  }, [navigate, redirect, userInfo]);
  return (
    //This container is used for log in/log out actions
    <Container className="small-container">
      {/*Displays Title on tab */}
      <Helmet>
        <title>Authentication</title>
      </Helmet>
      <h1 className="my-3">Account</h1>
      {/*Used to accept login submit as an argument */}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" logid="email">
          {/*Creates a label */}
          <Form.Label>Email</Form.Label>
          {/*Form.ControlCreates an input box requiring an email setting the hook*/}
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" logid="password">
          <Form.Label>Password</Form.Label>
          {/*Form.Control Creates an input box requiring a password setting the hook*/}
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          {/*Creates a button to input login information on click */}
          <Button type="submit">Log In</Button>
        </div>
        <div className="mb-3">
          {/*This creates a link that redirects new users to a sign up page*/}
          First time?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create Account</Link>
        </div>
      </Form>
    </Container>
  );
}
