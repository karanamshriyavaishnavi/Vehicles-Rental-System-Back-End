"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BankSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "owners",
        required: true,
    },
    bankName: {
        type: String,
        required: true,
        trim: true,
    },
    bankBranch: {
        type: String,
        required: true,
        trim: true,
    },
    AccountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    IfscCode: {
        type: String,
        required: true,
        uppercase: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
const BankModel = mongoose_1.default.model("Bank", BankSchema);
exports.default = BankModel;
