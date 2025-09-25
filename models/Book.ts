import mongoose from "mongoose";




const BookSchema = new mongoose.Schema({
    customer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "customer"
    },
    vehical: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'vehical',
        required:true
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
const BookModel = mongoose.model('Book', BookSchema);
export default BookModel;