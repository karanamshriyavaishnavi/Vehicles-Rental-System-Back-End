import mongoose from "mongoose";


const Feedback = new mongoose.Schema({
    customer:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"customer"
    },
    order:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"book"
    },
    date:{
        type:Date
    },
    rating:{
        type:Number
    },
    feed:{
        type:String
    }
})

let FeedBackModel = mongoose.model('feedback',Feedback)

export default FeedBackModel