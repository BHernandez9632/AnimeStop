import mongoose from 'mongoose';

//This schema is used to define the fields in user
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

//This builds a model based on the schema
const User = mongoose.model('User', userSchema);

export default User;
