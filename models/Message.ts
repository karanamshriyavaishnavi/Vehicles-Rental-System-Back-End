import mongoose from "mongoose";

// Define the Message Schema
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  }, 
  text: { type: String, required: false },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // other fields
});

// Create the Message model
const Message = mongoose.model("Message", MessageSchema);

export default Message;
