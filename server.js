//login details in server

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// ✅ Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

//post api for sigup
app.post("/signup", async (req, res) => {
    try{
        const{ username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use!" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully!" });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
});
    
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

