import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  profileImage: { type: String, required: true }, // base64 string
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() }, // ITC (Indian Time) - you might handle time zone on usage
  updatedAt: { type: Date, default: () => new Date() }
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("User", userSchema);
