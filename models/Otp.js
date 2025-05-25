import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String },    // optional, store email if OTP for email
  mobile: { type: String },   // optional, store mobile if OTP for mobile
  otp: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date(), expires: 300 } // expires in 5 mins (300s)
});

export default mongoose.model("Otp", otpSchema);
