import { createContext, useReducer } from 'react';

export const Storage = createContext();

//
const initialState = {
  //checks storage for user info
  userInfo: localStorage.getItem('userInfo')
    ? //if it exists it uses parse to convert the string to a js object
      JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    //This condition checks if customer information exists
    customerInformation: localStorage.getItem('customerInformation')
      ? JSON.parse(localStorage.getItem('customerInformation'))
      : //if it doesn't exists it becomes an empty obj
        {},
    //This condition checks if cart item exists, using parse to convert to js obj.
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    //This condition checks if payment method exists exists, using parse to convert to js obj.
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : //if it doesn't exists it becomes empty string
        '',
  },
};

//switch used to execute a statement from multiple others
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      //addMerch adds selected item to cart
      const addMerch = action.payload;
      //merchLocated searches for item adding one if item is there
      const merchLocated = state.cart.cartItems.find(
        (item) => item._id === addMerch._id
      );
      //Used once determined if item is in cart
      const cartItems = merchLocated
        ? //update current item with new item
          state.cart.cartItems.map((item) =>
            //keeps item same if its similar
            item._id === merchLocated._id ? addMerch : item
          )
        : //this adds item to array if cart is null
          [...state.cart.cartItems, addMerch];
      // Storage used so items don't dissapear when page is refreshed
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      //returns values in field only updating cart items
      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      //filter used to check if item is not equal to current _id
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      // Storage used so items don't dissapear when page is refreshed
      //stringify convers the items to string and saves them
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    //Updates cart after use by clearing it and making it an empty array
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    //Keeps the previous state then updates the user info based on backend data
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    //defining  user log out
    case 'USER_LOGOUT':
      //Maintains previous state setting user info to null
      return {
        ...state,
        userInfo: null,
        //used to empty cart item and user information when signed out
        cart: {
          cartItems: [],
          customerInformation: {},
          paymentMethod: '',
        },
      };
    //Saves user information
    case 'SAVE_CUSTOMER_INFORMATION':
      return {
        ...state,
        cart: {
          //changes state in the cart
          ...state.cart,
          //Focus changes on customerInformation card updating it with the data from payload
          customerInformation: action.payload,
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          //Saves payment method
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    default:
      return state;
  }
}

//Storageprovider is a wrapper used for the application that passes props to children
export function StorageProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Storage.Provider value={value}>{props.children}</Storage.Provider>;
}
