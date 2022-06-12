import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

//creates a path
const orderRouter = express.Router();
//implements an api for post
orderRouter.post(
  '/',
  //isAuth is responible for filling user of request
  isAuth,
  //expressAsyncHandler used to catch all errors
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      //Usese map function to convert underlined id to merch
      orderItems: req.body.orderItems.map((x) => ({ ...x, merch: x._id })),
      customerInformation: req.body.customerInformation,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    //calls new order to save
    const order = await newOrder.save();
    //status code saying order was created
    res.status(201).send({ message: 'Order Created', order });
  })
);

orderRouter.get(
  //responds to this api
  '/mine',
  //isAuth is responible for filling request
  isAuth,
  //expressAsyncHandler used to catch all errors
  expressAsyncHandler(async (req, res) => {
    //searches database and returns order to the frontend using find function based on user
    const orders = await Order.find({ user: req.user._id });
    //This sends the order if it exists
    res.send(orders);
  })
);

orderRouter.get(
  //responds to this api
  '/:id',
  //isAuth is responible for filling request
  isAuth,
  //expressAsyncHandler used to catch all errors
  expressAsyncHandler(async (req, res) => {
    //searches database and returns order to the frontend using findById function
    const order = await Order.findById(req.params.id);
    //This sends the order if it exists
    if (order) {
      res.send(order);
      //This sends an error if not found
    } else {
      res.status(404).send({ message: 'Not Found' });
    }
  })
);

orderRouter.put(
  //responds to this api
  '/:id/pay',
  //isAuth is responible for filling request
  isAuth,
  //expressAsyncHandler used to catch all errors
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    //checks if order exists
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      //saves the order
      const updateOrder = await order.save();
      //sends back order payed message
      res.send({ message: 'Payment Successful', order: updateOrder });
      //Displays error if order does not  exist
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
export default orderRouter;
