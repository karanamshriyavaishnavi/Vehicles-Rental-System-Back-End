"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const Customer_1 = __importDefault(require("./controller/Customer"));
const Owners_1 = __importDefault(require("./controller/Owners"));
const Admin_1 = __importDefault(require("./controller/Admin"));
const Chats_1 = __importDefault(require("./controller/Chats"));
const app = (0, express_1.default)();
const PORT = 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/Vehicals', express_1.default.static('Vehicals'));
app.use('/Lisence', express_1.default.static('Lisence'));
app.use('/upload', express_1.default.static('upload'));
mongoose_1.default.connect('mongodb://localhost:27017/vehical').then(() => {
    console.log("mongodb is connected");
    app.listen(PORT, () => {
        console.log(`server is running this ${PORT}`);
    });
});
app.use('/api/customer', Customer_1.default);
app.use('/api/owner', Owners_1.default);
app.use('/api/admin', Admin_1.default);
app.use("/api/chats", Chats_1.default);
