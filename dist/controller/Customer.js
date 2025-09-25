"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Customer_1 = __importDefault(require("../models/Customer"));
const Vehicals_1 = __importDefault(require("../models/Vehicals"));
const Book_1 = __importDefault(require("../models/Book"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Feedbacks_1 = __importDefault(require("../models/Feedbacks"));
//costomer upload image storage
const storage1 = multer_1.default.diskStorage({
    destination: "upload/CustomerImages",
    filename: (req, file, cb) => {
        const unnifix = (0, uuid_1.v4)();
        const fileextansction = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + unnifix + fileextansction);
    },
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
// Customer Register Route
router.post("/register", upload1.single("image"), async (req, res, next) => {
    try {
        const { fullName, mobileNumber, address, password, email, confirmPassword, image, } = req.body;
        console.log(req.body);
        console.log(req.file?.path);
        // Check if password matches confirmPassword
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ message: "Password and Confirm Password do not match." });
        }
        // Check if email already exists
        const existingCustomer = await Customer_1.default.findOne({ email: email });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }
        // Create new customer
        const newCustomer = await Customer_1.default.create({
            fullName,
            mobileNumber,
            address,
            password: password,
            email,
            image: req.file?.filename,
            role: "customer",
        });
        return res.status(201).json({
            success: true,
            message: "Successfully registered.",
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
//customer login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const Customer = await Customer_1.default.findOne({
            email: email,
            password: password,
        });
        if (!Customer) {
            return res.status(404).json({
                success: false,
                message: "internal server error",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "Successful Login",
                Customer: Customer,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
});
//getting all customer data
router.get("/", async (req, res, next) => {
    try {
        const VehicalData = await Vehicals_1.default.find({});
        if (!VehicalData) {
            return res.status(404).json({
                success: false,
                message: "No Vehicle Data",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                VehicalData,
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
//get the vehical by city name
router.get("/vehical/:userid", async (req, res, next) => {
    const city = req.query.city;
    const userid = req.params.userid;
    const type = req.query.type;
    try {
        const user = await Customer_1.default.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No customer found with this id",
            });
        }
        let Vehical;
        if (city) {
            Vehical = await Vehicals_1.default.find({ city: city }).exec();
        }
        else if (type) {
            Vehical = await Vehicals_1.default.find({ vehicalType: type });
        }
        else if (city && type) {
            Vehical = await Vehicals_1.default.find({ city: city, vehicalType: type });
        }
        else {
            Vehical = await Vehicals_1.default.find().exec();
        }
        if (Vehical.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no Vehical found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                Vehical: Vehical,
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
const storage = multer_1.default.diskStorage({
    destination: "upload/lincese",
    filename: (req, file, cb) => {
        const unnifix = (0, uuid_1.v4)();
        const fileextansction = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + unnifix + fileextansction);
    },
});
const Filefilter = (req, file, cb) => {
    const ALLOw_TYPE = ["image/png", "image/jpeg"];
    if (ALLOw_TYPE.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Image Field is PNG or JPGE Formate Only"));
    }
};
// Create multer upload instance
const upload = (0, multer_1.default)({ storage: storage, fileFilter: Filefilter });
// Route handler for booking a vehicle
router.post("/book/:userid/:vehicalid", upload.single("Lisence"), async (req, res, next) => {
    const userid = req.params.userid;
    const vehicalid = req.params.vehicalid; // Fix parameter name
    try {
        const user = await Customer_1.default.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No customer found with this id",
            });
        }
        const vehical = await Vehicals_1.default.findById(vehicalid);
        if (!vehical) {
            return res.status(404).json({
                success: false,
                message: "No vehicle found with this id",
            });
        }
        const { Username, Useremmail, UserphoneNumber, hours, DriverType, amount, totalamount, date, DriverName, DriverAge, } = req.body;
        // Check if driver details are provided
        let lisencePath = "";
        if (DriverType === "withOutdriver") {
            // Check if license file is uploaded
            if (req.file) {
                lisencePath = req.file.path; // Save license file path
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Driver license is required",
                });
            }
        }
        const newBooking = await Book_1.default.create({
            customer: userid,
            vehical: vehicalid,
            Username,
            Useremmail,
            UserphoneNumber,
            hours,
            DriverType,
            amount,
            totalamount,
            date,
            lisence: req.file?.filename,
            DriverName,
            DriverAge,
        });
        if (newBooking) {
            return res.status(201).json({
                success: true,
                message: "Booking successful",
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
router.get("/bookings/:customerId", async (req, res, next) => {
    const customerId = req.params.customerId;
    try {
        // Check if customer exists
        const customer = await Customer_1.default.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "No customer found with this ID.",
            });
        }
        // Fetch bookings for the given customer ID
        const bookings = await Book_1.default.find({ customer: customerId }).populate("vehical");
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this customer.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully.",
            bookings,
            customer,
        });
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// router.get('/request/:id',async(req:Request,res:Response,next:NextFunction)=>{
//     const id : string = req.params.id as string;
//     try{
//         const user = await CustomerModel.findById(id);
//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:"internal server error"
//             })
//         }
//         const Vehicals = await BookModel.aggregate([
//             {
//                 $match:{
//                     $or:[
//                         {customer : new mongoose.Types.ObjectId(id)},
//                        {status:"processing"},
//                        {DriverType:"withdriver"}
//                     ]
//                 }
//             },
//             {
//                 $lookup:{
//                     from: VehicalModel.collection.name,
//                     localField:"vehical",
//                     foreignField:"_id",
//                     as :"vehicals"
//                 }
//             }
//         ]);
//         console.log(Vehicals);
//         if(Vehicals.length === 0){
//             return res.status(404).json({
//                 success:false,
//                 message:"No Request Found"
//             })
//         }else{
//             return res.status(200).json({
//                 success:true,
//                 Vehicals:Vehicals
//             })
//         }
//     }catch(error){
//         console.log(error)
//         return res.status(500).json({
//             success:false,
//             message:"internal server error"
//         })
//     }
// })
//without driver
router.get("/request/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const User = await Customer_1.default.findById(id);
        if (!User) {
            return res.status(404).json({
                succes: false,
                message: "no customer found with this id",
            });
        }
        const currentdate = Date.now();
        const Aceepts = await Book_1.default.aggregate([
            {
                $match: {
                    customer: new mongoose_1.default.Types.ObjectId(id),
                    status: "accept",
                    DriverType: "withoutdriver",
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
                $sort: {
                    date: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        if (Aceepts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no request found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                View: Aceepts,
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
//with driver
router.get("/driver/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const User = await Customer_1.default.findById(id);
        if (!User) {
            return res.status(404).json({
                succes: false,
                message: "no customer found with this id",
            });
        }
        const currentdate = Date.now();
        // const Aceepts = await BookModel.find({customer:id,DriverType:"withdriver"}).populate('vehical')
        const Aceepts = await Book_1.default.aggregate([
            {
                $match: {
                    customer: new mongoose_1.default.Types.ObjectId(id),
                    status: "accept",
                    DriverType: "withdriver",
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
                $sort: {
                    date: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        console.log(Aceepts);
        if (Aceepts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no request found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                View: Aceepts,
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
//payment
router.post("/payments/:orderid", async (req, res, next) => {
    const orderid = req.params.orderid;
    try {
        // console.log(orderid,"id")
        const Order = await Book_1.default.findById(orderid);
        // console.log(Order)
        const books = await Book_1.default.find().exec();
        //console.log(books, "orders")
        if (!Order) {
            return res.status(404).json({
                success: false,
                message: "no order found",
            });
        }
        const already = await Payment_1.default.findOne({ order: orderid });
        if (already) {
            return res.status(404).json({
                success: false,
                message: "Payment Already Done",
            });
        }
        const { Cardholder, cardNumber, expire, cvv, amount } = req.body;
        const payment = await Payment_1.default.create({
            order: orderid,
            vehical: Order.vehical,
            customer: Order.customer,
            amount: Order.totalamount,
            Payments: {
                Cardholder,
                cardNumber,
                expire,
                cvv,
            },
            date: Date.now(),
        });
        if (payment) {
            return res.status(201).json({
                success: true,
                message: "Payment done",
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
router.get("/history/:id", async (req, res, next) => {
    const id = req.params.id;
    // Validate ObjectId format
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer ID format",
        });
    }
    try {
        const customer = await Customer_1.default.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "No customer found with this ID",
            });
        }
        const currentdate = new Date();
        // Using aggregation with $lookup and $match
        const history = await Payment_1.default.aggregate([
            {
                $match: {
                    customer: new mongoose_1.default.Types.ObjectId(id),
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
                    as: "orders",
                },
            },
            // {
            //     $match: {
            //         'orders.date': { $lte: currentdate }
            //     }
            // }
        ]);
        if (history.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No history found",
            });
        }
        return res.status(200).json({
            success: true,
            history,
        });
    }
    catch (error) {
        console.error("Error fetching history:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
//give feedbacks
router.post("/feedback/:userid/:orderid", async (req, res, next) => {
    const userid = req.params.userid;
    const orderid = req.params.orderid;
    try {
        const order = await Payment_1.default.find({
            customer: userid,
            order: orderid,
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "no order found",
            });
        }
        const { feed, rating } = req.body;
        const Already = await Feedbacks_1.default.findOne({
            customer: userid,
            order: orderid,
        });
        console.log(Already);
        if (Already) {
            return res.status(400).json({
                success: false,
                message: "Feedbak already done",
            });
        }
        else {
            const newfeed = await Feedbacks_1.default.create({
                customer: userid,
                order: orderid,
                date: Date.now(),
                feed: feed,
                rating: rating,
            });
            if (newfeed) {
                return res.status(201).json({
                    success: true,
                    message: "Feedbak send successfully",
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
//! POST API for sending a message from customer to owner (with customerId and ownerId as URL params)
exports.default = router;
