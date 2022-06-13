import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import MerchPage from './pages/MerchPage';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Storage } from './Storage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import CustomerInfoPage from './pages/CustomerInfoPage';
import PaymentPage from './pages/PaymentPage';
import SignUpPage from './pages/SignUpPage';
import OrderPage from './pages/OrderPage';
import OrderInfoPage from './pages/OrderInfoPage';
import UserAccountPage from './pages/UserAccountPage';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Storage);
  const { cart, userInfo } = state;

  //Handles logging out
  const logoutHandler = () => {
    //calls ctxDispatch dispatching a user logout action
    ctxDispatch({ type: 'USER_LOGOUT' });
    //remove.Item is used to remove specified info from local storage
    localStorage.removeItem('userInfo');
    localStorage.removeItem('customerInformation');
    localStorage.removeItem('paymentMethod');
  };
  return (
    // Browser Router is used to create area for routing to create paths
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        {/*Used to show one toast at a time */}
        <ToastContainer position="top-center" limit={1} />
        <header>
          {/* Navbar is a component from bootstrap to create a navigation bar in the header*/}
          <Navbar bg="primary" varian="primary">
            {/* Container is used to put items in a row */}
            <Container>
              {/* Linkcontainer is similar to a href used to redirect user to homescreen*/}
              <LinkContainer to="/">
                <Navbar.Brand>Anime Stop</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {/* Sums up total of current items */}
                      {cart.cartItems.reduce((a, b) => a + b.total, 0)}
                    </Badge>
                  )}
                </Link>
                {/*This checks to see if user info exists or if it doesn't */}
                {userInfo ? (
                  //This section is used to display user name
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    {/*On drop downn it will display profile information and history information */}
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Account</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    {/*Used to show loggout if dropped down clicked */}
                    <Link
                      className="dropdown-item"
                      to="#logout"
                      onClick={logoutHandler}
                    >
                      Log Out
                    </Link>
                  </NavDropdown>
                ) : (
                  //if user does not exist it redirectrs to login page
                  <Link className="nav-link" to="/signin">
                    Log In
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-1">
            {/*Routes is used to define the path between pages*/}
            <Routes>
              <Route path="/merch/:slug" element={<MerchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/profile" element={<UserAccountPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<OrderPage />} />
              <Route path="/order/:id" element={<OrderInfoPage />} />
              <Route path="/shipping" element={<CustomerInfoPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All Rights Reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
