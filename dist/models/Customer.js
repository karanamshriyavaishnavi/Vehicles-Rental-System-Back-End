"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Customer = new mongoose_1.default.Schema({
    fullName: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    role: {
        type: String,
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
const CustomerModel = mongoose_1.default.model("customer", Customer);
exports.default = CustomerModel;
