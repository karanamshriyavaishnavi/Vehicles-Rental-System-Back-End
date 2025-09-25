import mongoose from "mongoose";


const vehical = new mongoose.Schema({
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'owners'
    },
    vehicalName:{
        type:String
    },
    vehicalNumber:{
        type:String
    },
    vehicalType:{
        type:String,
        enum:{
            values:[
                "Car",
                "Bike",
                "Auto",
                "Rikshaw"
            ]
        }
    },
    Amount:{
        type:String
    },
    driverAmount:{
        type:String,
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    street:{
        type:String
    },
    Image:{
        type:String
    }

})


let VehicalModel = mongoose.model('vehical',vehical);


export default VehicalModel