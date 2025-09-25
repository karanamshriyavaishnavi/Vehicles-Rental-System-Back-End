import mongoose from "mongoose";


const Owner = new mongoose.Schema({
    fullName: {
        type: String,
      },
      mobileNumber: {
        type: Number,
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


const OwnerModel = mongoose.model('Owners',Owner)

export default OwnerModel