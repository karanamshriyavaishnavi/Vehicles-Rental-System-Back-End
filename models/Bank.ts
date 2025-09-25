import mongoose from "mongoose";

const BankSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "owners",
      required: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    bankBranch: {
      type: String,
      required: true,
      trim: true,
    },
    AccountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    IfscCode: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const BankModel = mongoose.model("Bank", BankSchema);

export default BankModel;
