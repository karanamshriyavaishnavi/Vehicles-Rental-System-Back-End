import express ,{json,urlencoded} from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import customer from './controller/Customer';
import owner from './controller/Owners';
import Admin from './controller/Admin'
import Chats from "./controller/Chats"
import Message from "./models/Message";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vehical";

app.use(cors())
app.use(express.json());
app.use('/Vehicals',express.static('Vehicals'))
app.use('/Lisence', express.static('Lisence'))
app.use('/upload', express.static('upload'))

app.get("/", (req, res) => {
    res.send("Backend is live and working!");
})

app.get("/api/test", (req, res) => {
    res.json({message: "Hello from backend API!"})
})

mongoose.connect(MONGO_URI).then(()=>{
    console.log("mongodb is connected");
    app.listen(PORT,()=>{
        console.log(`server is running this ${PORT}`)
    })

})
.catch((err) => {
    console.error("mongodb connection error.",err);
})

app.use('/api/customer',customer);
app.use('/api/owner',owner);
app.use('/api/admin',Admin);
app.use("/api/chats",Chats)