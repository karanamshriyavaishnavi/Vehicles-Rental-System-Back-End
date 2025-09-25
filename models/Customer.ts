import mongoose from "mongoose";

const Customer = new mongoose.Schema({
  fullName: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  role:{
    type:String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
});

const CustomerModel = mongoose.model("customer", Customer);

export default CustomerModel;
