import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import CustomerModel from "../models/Customer";
import VehicalModel from "../models/Vehicals";
import BookModel from "../models/Book";
import multer from "multer";
const router = Router();
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import PaymentModel from "../models/Payment";
import FeedBackModel from "../models/Feedbacks";
import OwnerModel from "../models/Owner";
import Message from "../models/Message";

//costomer upload image storage
const storage1 = multer.diskStorage({
  destination: "upload/CustomerImages",
  filename: (req: any, file: any, cb: any) => {
    const unnifix = uuidv4();
    const fileextansction = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + unnifix + fileextansction);
  },
});

const Filefilter1 = (req: any, file: any, cb: any) => {
  const ALLOw_TYPE = ["image/png", "image/jpeg"];
  if (ALLOw_TYPE.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Image Field is PNG or JPGE Formate Only"));
  }
};

const upload1 = multer({ storage: storage1, fileFilter: Filefilter1 });

// Customer Register Route
router.post(
  "/register",
  upload1.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        fullName,
        mobileNumber,
        address,
        password,
        email,
        confirmPassword,
        image,
      } = req.body;
      console.log(req.body);
      console.log(req.file?.path);

      // Check if password matches confirmPassword
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Password and Confirm Password do not match." });
      }

      // Check if email already exists
      const existingCustomer = await CustomerModel.findOne({ email: email });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      // Create new customer
      const newCustomer = await CustomerModel.create({
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

//customer login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const Customer = await CustomerModel.findOne({
        email: email,
        password: password,
      });
      if (!Customer) {
        return res.status(404).json({
          success: false,
          message: "internal server error",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Successful Login",
          Customer: Customer,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }
);

//getting all customer data
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const VehicalData = await VehicalModel.find({});
    if (!VehicalData) {
      return res.status(404).json({
        success: false,
        message: "No Vehicle Data",
      });
    } else {
      return res.status(200).json({
        success: true,
        VehicalData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

//get the vehical by city name
router.get(
  "/vehical/:userid",
  async (req: Request, res: Response, next: NextFunction) => {
    const city: string = req.query.city as string;
    const userid: string = req.params.userid as string;
    const type: string = req.query.type as string;
    try {
      const user = await CustomerModel.findById(userid);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No customer found with this id",
        });
      }

      let Vehical;

      if (city) {
        Vehical = await VehicalModel.find({ city: city }).exec();
      } else if (type) {
        Vehical = await VehicalModel.find({ vehicalType: type });
      } else if (city && type) {
        Vehical = await VehicalModel.find({ city: city, vehicalType: type });
      } else {
        Vehical = await VehicalModel.find().exec();
      }

      if (Vehical.length === 0) {
        return res.status(404).json({
          success: false,
          message: "no Vehical found",
        });
      } else {
        return res.status(200).json({
          success: true,
          Vehical: Vehical,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
);

const storage = multer.diskStorage({
  destination: "upload/lincese",
  filename: (req: any, file: any, cb: any) => {
    const unnifix = uuidv4();
    const fileextansction = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + unnifix + fileextansction);
  },
});

const Filefilter = (req: any, file: any, cb: any) => {
  const ALLOw_TYPE = ["image/png", "image/jpeg"];
  if (ALLOw_TYPE.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Image Field is PNG or JPGE Formate Only"));
  }
};

// Create multer upload instance
const upload = multer({ storage: storage, fileFilter: Filefilter });

// Route handler for booking a vehicle
router.post(
  "/book/:userid/:vehicalid",
  upload.single("Lisence"),
  async (req: Request, res: Response, next: NextFunction) => {
    const userid: string = req.params.userid as string;
    const vehicalid: string = req.params.vehicalid as string; // Fix parameter name
    try {
      const user = await CustomerModel.findById(userid);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No customer found with this id",
        });
      }

      const vehical = await VehicalModel.findById(vehicalid);
      if (!vehical) {
        return res.status(404).json({
          success: false,
          message: "No vehicle found with this id",
        });
      }

      const {
        Username,
        Useremmail,
        UserphoneNumber,
        hours,
        DriverType,
        amount,
        totalamount,
        date,
        DriverName,
        DriverAge,
      } = req.body;

      // Check if driver details are provided
      let lisencePath = "";
      if (DriverType === "withOutdriver") {
        // Check if license file is uploaded
        if (req.file) {
          lisencePath = req.file.path; // Save license file path
        } else {
          return res.status(400).json({
            success: false,
            message: "Driver license is required",
          });
        }
      }

      const newBooking = await BookModel.create({
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

router.get(
  "/bookings/:customerId",
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId: string = req.params.customerId as string;

    try {
      // Check if customer exists
      const customer = await CustomerModel.findById(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "No customer found with this ID.",
        });
      }

      // Fetch bookings for the given customer ID
      const bookings = await BookModel.find({ customer: customerId }).populate(
        "vehical"
      );

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
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

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
router.get(
  "/request/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;
    try {
      const User = await CustomerModel.findById(id);
      if (!User) {
        return res.status(404).json({
          succes: false,
          message: "no customer found with this id",
        });
      }
      const currentdate = Date.now();
      const Aceepts = await BookModel.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(id),
            status: "accept",
            DriverType: "withoutdriver",
          },
        },
        {
          $lookup: {
            from: VehicalModel.collection.name,
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
      } else {
        return res.status(200).json({
          success: true,
          View: Aceepts,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
);

//with driver
router.get(
  "/driver/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;
    try {
      const User = await CustomerModel.findById(id);
      if (!User) {
        return res.status(404).json({
          succes: false,
          message: "no customer found with this id",
        });
      }
      const currentdate = Date.now();
      // const Aceepts = await BookModel.find({customer:id,DriverType:"withdriver"}).populate('vehical')
      const Aceepts = await BookModel.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(id),
            status: "accept",
            DriverType: "withdriver",
          },
        },
        {
          $lookup: {
            from: VehicalModel.collection.name,
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
      } else {
        return res.status(200).json({
          success: true,
          View: Aceepts,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
);

//payment
router.post(
  "/payments/:orderid",
  async (req: Request, res: Response, next: NextFunction) => {
    const orderid: string = req.params.orderid as string;
    try {
      // console.log(orderid,"id")
      const Order = await BookModel.findById(orderid);
      // console.log(Order)
      const books = await BookModel.find().exec();
      //console.log(books, "orders")
      if (!Order) {
        return res.status(404).json({
          success: false,
          message: "no order found",
        });
      }
      const already = await PaymentModel.findOne({ order: orderid });
      if (already) {
        return res.status(404).json({
          success: false,
          message: "Payment Already Done",
        });
      }
      const { Cardholder, cardNumber, expire, cvv, amount } = req.body;
      const payment = await PaymentModel.create({
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
);

router.get(
  "/history/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format",
      });
    }

    try {
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "No customer found with this ID",
        });
      }

      const currentdate = new Date();

      // Using aggregation with $lookup and $match
      const history = await PaymentModel.aggregate([
        {
          $match: {
            customer: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: VehicalModel.collection.name,
            localField: "vehical",
            foreignField: "_id",
            as: "vehicals",
          },
        },
        {
          $lookup: {
            from: BookModel.collection.name,
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
    } catch (error) {
      console.error("Error fetching history:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

//give feedbacks
router.post(
  "/feedback/:userid/:orderid",
  async (req: Request, res: Response, next: NextFunction) => {
    const userid: string = req.params.userid as string;
    const orderid: string = req.params.orderid as string;
    try {
      const order = await PaymentModel.find({
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
      const Already = await FeedBackModel.findOne({
        customer: userid,
        order: orderid,
      });
      console.log(Already);
      if (Already) {
        return res.status(400).json({
          success: false,
          message: "Feedbak already done",
        });
      } else {
        const newfeed = await FeedBackModel.create({
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
);

//! POST API for sending a message from customer to owner (with customerId and ownerId as URL params)

  
  

export default router;
