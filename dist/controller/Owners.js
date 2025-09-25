"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Owner_1 = __importDefault(require("../models/Owner"));
const router = (0, express_1.Router)();
const Vehicals_1 = __importDefault(require("../models/Vehicals"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const Bank_1 = __importDefault(require("../models/Bank"));
const Book_1 = __importDefault(require("../models/Book"));
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Feedbacks_1 = __importDefault(require("../models/Feedbacks"));
//Owner upload image storage
const storage1 = multer_1.default.diskStorage({
    destination: 'upload/owner',
    filename: (req, file, cb) => {
        const unnifix = (0, uuid_1.v4)();
        const fileextansction = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + unnifix + fileextansction);
    }
});
const Filefilter1 = (req, file, cb) => {
    const ALLOw_TYPE = ["image/png", "image/jpeg"];
    if (ALLOw_TYPE.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Image Field is PNG or JPGE Formate Only"));
    }
};
const upload1 = (0, multer_1.default)({ storage: storage1, fileFilter: Filefilter1 });
// Owner Register Route
router.post("/register", upload1.single("image"), async (req, res, next) => {
    try {
        const { fullName, mobileNumber, address, password, email, confirmPassword, } = req.body;
        console.log(req.body);
        console.log(req.file?.path);
        // Check if password matches confirmPassword
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ message: "Password and Confirm Password do not match." });
        }
        // Check if email already exists
        const existingCustomer = await Owner_1.default.findOne({ email: email });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }
        // Create new customer
        const newCustomer = await Owner_1.default.create({
            fullName,
            mobileNumber,
            address,
            password: password,
            email,
            role: "owner",
            image: req.file?.path,
        });
        return res.status(201).json({
            success: true,
            message: "Successfully Owner registered.",
            customer: newCustomer,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
//Owner Login
//owner login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const Owner = await Owner_1.default.findOne({
            email: email,
            password: password,
        });
        console.log(email, password);
        if (!Owner) {
            return res.status(404).json({
                success: false,
                message: "Invalid credintials",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "Login Successfull",
                user: Owner,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
//add the vehical
const storage2 = multer_1.default.diskStorage({
    destination: 'upload/Vehicals/',
    filename: (req, file, cb) => {
        const unnifix = (0, uuid_1.v4)();
        const fileextansction = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + unnifix + fileextansction);
    }
});
const Filefilter2 = (req, file, cb) => {
    const ALLOw_TYPE = ["image/png", "image/jpeg", "image/jpge"];
    if (ALLOw_TYPE.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Image Field is PNG or JPGE Formate Only"));
    }
};
const upload2 = (0, multer_1.default)({ storage: storage2, fileFilter: Filefilter2 });
//add the vehical
router.post("/vehical/:id", upload2.single("Image"), async (req, res, next) => {
    const id = req.params.id;
    const imagepath = req.file?.path;
    try {
        console.log(id);
        const owner = await Owner_1.default.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "no Owner found with this id",
            });
        }
        const { brand, vehicleNumber, vehicleType, costPerHour, costWithDriver, city, state, street, } = req.body;
        const Newvehical = await Vehicals_1.default.create({
            owner: id,
            vehicalName: brand,
            vehicalNumber: vehicleNumber,
            vehicalType: vehicleType,
            Amount: costPerHour,
            driverAmount: costWithDriver,
            city,
            state,
            street,
            Image: imagepath,
        });
        if (Newvehical) {
            return res.status(201).json({
                success: true,
                message: "Vehical Added Successfull",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
//get the vehicals
router.get("/vehical/:id", async (req, res, next) => {
    const id = req.params.id;
    const city = req.query.city;
    try {
        const owner = await Owner_1.default.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "No owner found with this id",
            });
        }
        let vehicals = await Vehicals_1.default.find({ owner: id }).exec();
        if (city) {
            vehicals = vehicals.filter((item) => item.name === city);
        }
        if (vehicals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No vehicals found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                vehicals: vehicals,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
//update the vehicals
router.put("/vehicals/:ownerid/:id", upload2.single("Image"), async (req, res, next) => {
    const id = req.params.id;
    const ownerid = req.params.ownerid;
    try {
        const owner = await Owner_1.default.findById(ownerid);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "no Owner found with this id",
            });
        }
        const vehical = await Vehicals_1.default.findById(id);
        if (!vehical) {
            return res.status(404).json({
                success: false,
                message: "no vehicals found with this id",
            });
        }
        const { vehicalName, vehicalNumber, vehicalType, Amount, driverAmount, city, state, street, } = req.body;
        const updateVehical = await Vehicals_1.default.findByIdAndUpdate(id, {
            vehicalName,
            vehicalNumber,
            vehicalType,
            Amount,
            driverAmount,
            city,
            state,
            street,
            Image: req.file?.filename,
        }, { new: true });
        if (updateVehical) {
            return res.status(201).json({
                success: true,
                message: "vehical update successfully",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
//delete the vehical
router.delete("/vehical/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const vehical = await Vehicals_1.default.findById(id);
        if (!vehical) {
            return res.status(404).json({
                success: false,
                message: "no vehicals found with this id",
            });
        }
        else {
            const deletevehical = await Vehicals_1.default.findByIdAndDelete(vehical._id);
            if (deletevehical) {
                return res.status(200).json({
                    success: false,
                    message: "vehicals delete success",
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
router.post("/bank/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        // Check if Owner exists
        const owner = await Owner_1.default.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "No owner found",
            });
        }
        const { bankName, bankBranch, AccountNumber, IfscCode } = req.body;
        // Validate required fields
        if (!bankName || !bankBranch || !AccountNumber || !IfscCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // Create bank details
        const bank = await Bank_1.default.create({
            owner: id,
            bankName,
            bankBranch,
            AccountNumber,
            IfscCode,
        });
        return res.status(201).json({
            success: true,
            message: "Bank details added successfully",
            bank,
        });
    }
    catch (error) {
        console.error("Error adding bank details:", error);
        next(error); // Pass to the global error handler
    }
});
//view booking with driver
router.get("/booking/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        // Find the owner by ID
        const owner = await Owner_1.default.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "No owner found with this ID",
            });
        }
        // Find vehicles owned by the owner
        const vehicles = await Vehicals_1.default.find({ owner: id });
        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No vehicles found",
            });
        }
        // Extract vehicle IDs from vehicles array
        const vehicleIds = vehicles.map((item) => item._id); // Extracting vehicle _id values
        console.log(vehicleIds, "vehiclasids");
        // Find bookings based on specified conditions using aggregation
        // const currentDate = new Date();
        const bookings = await Book_1.default.aggregate([
            {
                $match: {
                    vehical: {
                        $in: vehicleIds.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                    },
                    DriverType: "withdriver",
                    status: "Processing",
                },
            },
            // Add more stages to the aggregation pipeline as needed
            // For example, to lookup additional details about vehicles:
            {
                $lookup: {
                    from: Vehicals_1.default.collection.name,
                    localField: "vehical",
                    foreignField: "_id",
                    as: "vehicles",
                },
            },
        ]);
        console.log(bookings);
        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                bookings: bookings,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
//view booking without drivers
router.get("/bookings/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        // Find the owner by ID
        const owner = await Owner_1.default.findById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "No owner found with this ID",
            });
        }
        console.log(Vehicals_1.default.collection.name, "sdfhfgda");
        // Find vehicles owned by the owner
        const vehicles = await Vehicals_1.default.find({ owner: id });
        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No vehicles found",
            });
        }
        // Extract vehicle IDs from vehicles array
        const vehicleIds = vehicles.map((item) => item._id); // Extracting vehicle _id values
        console.log(vehicleIds, "vehiclasids");
        // Find bookings based on specified conditions using aggregation
        const currentDate = new Date();
        const bookings = await Book_1.default.aggregate([
            {
                $match: {
                    vehical: {
                        $in: vehicleIds.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                    },
                    DriverType: "withoutdriver",
                    status: "Processing",
                },
            },
            // Add more stages to the aggregation pipeline as needed
            // For example, to lookup additional details about vehicles:
            {
                $lookup: {
                    from: Vehicals_1.default.collection.name,
                    localField: "vehical",
                    foreignField: "_id",
                    as: "vehicles",
                },
            },
        ]);
        console.log(bookings, "without");
        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                bookings: bookings,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
//change status withdriver
const storages = multer_1.default.diskStorage({
    destination: 'upload/lincese',
    filename: (req, file, cb) => {
        const unnifix = (0, uuid_1.v4)();
        const fileextansction = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + unnifix + fileextansction);
    }
});
// Define file filter for license upload
const Filefilters = (req, file, cb) => {
    const ALLOw_TYPE = ["image/png", "image/jpge", "image/jpeg"];
    if (ALLOw_TYPE.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Image Field is PNG or JPGE Formate Only"));
    }
};
const uploads = (0, multer_1.default)({ storage: storages, fileFilter: Filefilters });
router.put("/status/:id", uploads.single("Lisence"), async (req, res, next) => {
    const id = req.params.id;
    try {
        const order = await Book_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "no order found with this id",
            });
        }
        const { status, DriverName, DriverAge } = req.body;
        let lisencePath = "";
        let update;
        if (status === "accept") {
            if (req.file) {
                lisencePath = req.file.path; // Save license file path
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Driver license is required",
                });
            }
            update = await Book_1.default.findByIdAndUpdate(id, {
                status: status,
                DriverName: DriverName,
                DriverAge: DriverAge,
                lisence: lisencePath,
            }, { new: true });
        }
        else if (status === "reject") {
            update = await Book_1.default.findByIdAndUpdate(id, {
                status: status,
            }, { new: true });
        }
        if (update) {
            return res.status(200).json({
                success: true,
                message: "update successfully",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
//change status withoutdriver
router.put("/statuss/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const order = await Book_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No order found with this id",
            });
        }
        const { status } = req.body; // Extract 'status' from req.body
        const update = await Book_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (update) {
            return res.status(201).json({
                success: true,
                message: "Update successful",
                data: update, // Optionally, send back the updated document
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Something went wrong, please try again later",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
//get the payment
router.get("/payment/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const Owner = await Owner_1.default.findById(id);
        if (!Owner) {
            return res.status(404).json({
                success: false,
                message: "no Owner found with this id",
            });
        }
        const Vehicals = await Vehicals_1.default.find({ owner: id });
        const vehicalsid = Vehicals.map((item) => item._id);
        console.log(vehicalsid);
        const payments = await Payment_1.default.aggregate([
            {
                $match: {
                    vehical: {
                        $in: vehicalsid.map((item) => new mongoose_1.default.Types.ObjectId(item)),
                    },
                },
            },
            {
                $lookup: {
                    from: Vehicals_1.default.collection.name,
                    localField: "vehical",
                    foreignField: "_id",
                    as: "vehicals",
                },
            },
            {
                $lookup: {
                    from: Book_1.default.collection.name,
                    localField: "order",
                    foreignField: "_id",
                    as: "Orders",
                },
            },
            {
                $sort: {
                    date: -1,
                },
            },
        ]);
        console.log(payments);
        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no payment done",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                payments: payments,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
router.get("/feedbacks/:id", async (req, res, next) => {
    const id = req.params.id; // Get the owner's ID from the URL
    try {
        // Step 1: Find the owner by ID (to ensure that the owner exists)
        const Owner = await Owner_1.default.findById(id);
        if (!Owner) {
            return res.status(404).json({
                success: false,
                message: "No owner found with this ID",
            });
        }
        // Step 2: Aggregate feedbacks for vehicles that belong to this owner
        const Feedbacks = await Feedbacks_1.default.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "order",
                    foreignField: "_id",
                    as: "books",
                },
            },
            { $unwind: "$books" },
            // Just unwind to see if the first lookup works
            {
                $lookup: {
                    from: "vehicals",
                    localField: "books.vehical",
                    foreignField: "_id",
                    as: "vehicals",
                },
            },
            { $unwind: "$vehicals" },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    feed: 1,
                    "books": 1,
                    "vehicals": 1
                },
            },
        ]);
        // Step 3: Check if no feedbacks found for the given owner
        if (Feedbacks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No feedbacks found for this owner",
            });
        }
        // Step 4: Return the feedbacks
        return res.status(200).json({
            success: true,
            message: "Feedbacks found",
            Feedbacks: Feedbacks,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = router;
