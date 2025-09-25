"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vehical = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'owners'
    },
    vehicalName: {
        type: String
    },
    vehicalNumber: {
        type: String
    },
    vehicalType: {
        type: String,
        enum: {
            values: [
                "Car",
                "Bike",
                "Auto",
                "Rikshaw"
            ]
        }
    },
    Amount: {
        type: String
    },
    driverAmount: {
        type: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    street: {
        type: String
    },
    Image: {
        type: String
    }
});
let VehicalModel = mongoose_1.default.model('vehical', vehical);
exports.default = VehicalModel;
