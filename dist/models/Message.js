"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Message Schema
const MessageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    receiver: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Message = mongoose_1.default.model("Message", MessageSchema);
exports.default = Message;
