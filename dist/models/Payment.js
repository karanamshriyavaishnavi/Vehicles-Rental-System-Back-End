"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const payments = new mongoose_1.default.Schema({
    Cardholder: {
        type: String
    },
    cardNumber: {
        type: String
    },
    expire: {
        type: String
    },
    cvv: {
        type: Number
    }
});
const Payment = new mongoose_1.default.Schema({
    order: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "book"
    },
    vehical: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "vehical"
    },
    customer: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "customer"
    },
    Payments: {
        type: payments
    },
    status: {
        type: String,
        default: "Paid"
    },
    amount: {
        type: Number
    },
    date: {
        type: Date
    }
});
let PaymentModel = mongoose_1.default.model('payment', Payment);
exports.default = PaymentModel;
