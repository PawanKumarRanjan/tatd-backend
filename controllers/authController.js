import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateOtp } from "../utils/otpService.js";

async function saveOtp(userId, email, mobile) {
  const otpCode = generateOtp();

  await Otp.deleteMany({ userId, $or: [{ email }, { mobile }] });

  const otpDoc = new Otp({
    userId,
    email: email || undefined,
    mobile: mobile || undefined,
    otp: otpCode,
  });

  await otpDoc.save();
  return otpCode;
}

export async function registerUser(req, res) {
  try {
    const { mobile, email, profileImage, password } = req.body;

    if (!mobile || !email || !profileImage || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      $or: [{ mobile }, { email }],
    });
    if (userExists) {
      return res.status(409).json({ message: "Mobile or Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    console.log("Current date:", formattedDate);

    const newUser = new User({
      mobile,
      email,
      profileImage,
      password: hashedPassword,
      createdAt: formattedDate,
    });

    await newUser.save();

    // Generate OTP for mobile and email (optional, you can skip email if you want)
    const mobileOtp = await saveOtp(newUser._id, null, mobile);
    const emailOtp = await saveOtp(newUser._id, email, null);

    return res.status(201).json({
      message: "User registered successfully",
      otp: { mobileOtp, emailOtp },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function generateNewOtp(req, res) {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or Mobile required" });
    }

    const user = await User.findOne(email ? { email } : { mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpCode = await saveOtp(user._id, email, mobile);
    return res.status(200).json({ message: "OTP generated", otp: otpCode });
  } catch (error) {
    console.error("Generate OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function verifyOtpLogin(req, res) {
  try {
    const { email, mobile, otp } = req.body;

    if ((!email && !mobile) || !otp) {
      return res.status(400).json({ message: "Email or Mobile and OTP are required" });
    }

    const user = await User.findOne(email ? { email } : { mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpDoc = await Otp.findOne({
      userId: user._id,
      otp,
      ...(email ? { email } : { mobile }),
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await otpDoc.deleteOne();

    const tokenPayload = { email: user.email, mobile: user.mobile };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.loginAttempts += 1;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password must match" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "Old password not allowed" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function verifyPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return res.status(200).json({ valid: isMatch });
  } catch (error) {
    console.error("Verify password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
