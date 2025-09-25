"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Message_1 = __importDefault(require("../models/Message"));
const router = (0, express_1.Router)();
// Send message route
router.post('/sendmessage/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params;
    const { text } = req.body;
    if (!sender || !receiver || !text) {
        return res.status(400).json({ message: 'Sender, Receiver, and Message text are required.' });
    }
    try {
        const senderId = new mongoose_1.default.Types.ObjectId(sender);
        const receiverId = new mongoose_1.default.Types.ObjectId(receiver);
        const newMessage = new Message_1.default({
            sender: senderId,
            receiver: receiverId,
            text,
            timestamp: new Date(),
        });
        await newMessage.save();
        res.status(200).json({ message: 'Message sent successfully', newMessage });
    }
    catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Error sending message', error: err });
    }
});
// Get messages route
router.get('/getmessages/:customerId/:ownerId', async (req, res) => {
    const { customerId, ownerId } = req.params;
    try {
        const customerIdObj = new mongoose_1.default.Types.ObjectId(customerId);
        const ownerIdObj = new mongoose_1.default.Types.ObjectId(ownerId);
        const messages = await Message_1.default.aggregate([
            {
                $match: {
                    $or: [
                        { sender: customerIdObj, receiver: ownerIdObj },
                        { sender: ownerIdObj, receiver: customerIdObj }
                    ]
                }
            },
            {
                $sort: { timestamp: 1 }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            {
                $lookup: {
                    from: "owners",
                    localField: "receiver",
                    foreignField: "_id",
                    as: "receiverDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    sender: 1,
                    receiver: 1,
                    text: 1,
                    timestamp: 1,
                    senderName: { $arrayElemAt: ["$senderDetails.name", 0] },
                    receiverName: { $arrayElemAt: ["$receiverDetails.name", 0] }
                }
            }
        ]);
        if (!messages.length) {
            return res.status(404).json({ message: 'No messages found' });
        }
        res.status(200).json({ messages });
    }
    catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Error fetching messages', error: err });
    }
});
router.get("/get/:customerId", async (req, res) => {
    const { customerId } = req.params;
    try {
        // Fetch messages where the customer is either the sender or receiver
        const messages = await Message_1.default.find({
            $or: [
                { sender: customerId },
                { receiver: customerId }
            ]
        }).sort({ timestamp: 1 }).exec(); // Sort messages by timestamp
        if (messages.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }
        res.status(200).json({
            success: true,
            messages,
        });
    }
    catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Error fetching messages", error: err });
    }
});
exports.default = router;
