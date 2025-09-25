"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Owner_1 = __importDefault(require("../models/Owner"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Vehicals_1 = __importDefault(require("../models/Vehicals"));
const router = (0, express_1.Router)();
//admin login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email === "admin@gmail.com" && password === "admin123") {
            return res.status(200).json({
                success: true,
                message: "successfully login"
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});
//jget the coustomers
router.get('/users', async (req, res, next) => {
    try {
        const users = await Customer_1.default.find().exec();
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no user founds"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "All Users",
                users: users
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
//get the owners 
router.get('/owners', async (req, res, next) => {
    try {
        const Owners = await Owner_1.default.find().exec();
        if (Owners.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no owers found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                Owners: Owners
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/ordes', async (req, res, next) => {
    try {
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});
//view vehicals
router.get('/vehicles', async (req, res, next) => {
    const { type, place } = req.query; // Assuming 'type' and 'place' are passed as query parameters
    try {
        const vehicles = await Vehicals_1.default.find({ vehicalType: type, city: { $regex: new RegExp(place, 'i') } }).exec();
        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No vehicles found for the specified type and place',
            });
        }
        return res.status(200).json({
            success: true,
            vehicles,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
