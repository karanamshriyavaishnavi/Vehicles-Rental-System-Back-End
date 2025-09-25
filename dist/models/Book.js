"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookSchema = new mongoose_1.default.Schema({
    customer: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "customer"
    },
    vehical: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'vehical',
        required: true
    },
    Username: {
        type: String
    },
    Useremmail: {
        type: String
    },
    UserphoneNumber: {
        type: String
    },
    hours: {
        type: String
    },
    DriverType: {
        type: String,
        enum: ['withdriver', 'withoutdriver']
    },
    amount: {
        type: Number
    },
    totalamount: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Processing'
    },
    lisence: {
        type: String // Path to the uploaded license file
    },
    DriverName: {
        type: String
    },
    DriverAge: {
        type: String
    }
});
// Define BookModel
const BookModel = mongoose_1.default.model('Book', BookSchema);
exports.default = BookModel;
