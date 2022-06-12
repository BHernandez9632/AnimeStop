import mongoose from 'mongoose';

//This schema is used to define the fields in merch
const merchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stockCount: { type: Number, required: true },
    brand: { type: String, required: true },
    srating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//This builds a model based on the schemas
const Merch = mongoose.model('Merch', merchSchema);

export default Merch;
