# Node.js Authentication System

A complete user authentication backend system built with **Node.js**, **Express.js**, and **MongoDB**. It supports user registration, OTP-based login (via email or mobile), secure password management, and JWT-based authentication.

---

## 🚀 Features

- ✅ User Registration with email, mobile, password, and profile image
- 🔐 OTP Generation & Verification for login (email or mobile)
- 🔄 Regenerate OTP (expires in 5 minutes)
- 🔑 Password Change (JWT protected)
- 🧪 Password Verification (without login)
- 🔒 Passwords stored securely using `bcrypt`
- ⏱ All date/time values stored in ITC format
- 🪪 JWT Token generation upon successful login

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **Time Format**: ITC (stored as `Date` in MongoDB)

---
