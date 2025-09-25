import express ,{json,urlencoded} from "express";
import mongoose from "mongoose";
import cors from 'cors'
import bodyParser from "body-parser";
import customer from './controller/Customer';
import owner from './controller/Owners';
import Admin from './controller/Admin'
import Chats from "./controller/Chats"
const app = express();
const PORT = 8080

app.use(cors())
app.use(express.json());
app.use('/Vehicals',express.static('Vehicals'))
app.use('/Lisence', express.static('Lisence'))
app.use('/upload', express.static('upload'))





mongoose.connect('mongodb://localhost:27017/vehical').then(()=>{
    console.log("mongodb is connected");
    app.listen(PORT,()=>{
        console.log(`server is running this ${PORT}`)
    })

})


app.use('/api/customer',customer);
app.use('/api/owner',owner);
app.use('/api/admin',Admin);
app.use("/api/chats",Chats)