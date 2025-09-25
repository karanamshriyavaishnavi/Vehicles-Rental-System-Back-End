"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Feedback = new mongoose_1.default.Schema({
    customer: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "customer"
    },
    order: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "book"
    },
    date: {
        type: Date
    },
    rating: {
        type: Number
    },
    feed: {
        type: String
    }
});
let FeedBackModel = mongoose_1.default.model('feedback', Feedback);
exports.default = FeedBackModel;
