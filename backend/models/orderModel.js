import mongoose from 'mongoose';

const orderModelSchema = new mongoose.Schema(
  {
    //Array that saves item information
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        total: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        merch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Merch',
          required: true,
        },
      },
    ],
    //Contains Customer Information
    customerInformation: {
      fName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    //Payment type selected
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
//Turns orderModelSchema into Order Model
const Order = mongoose.model('Order', orderModelSchema);

export default Order;
