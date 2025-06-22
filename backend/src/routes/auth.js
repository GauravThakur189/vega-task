const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  validateSignupData,
  validateSigninData,
} = require("../utils/validation");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("../config/database");
const mongoose = require("mongoose");

// authRouter.post("/signup", async (req, res) => {
//   // validation of data
//   try {
//     console.log("Received signup request with body:", req.body);
    
//     //await validateSignupData(req.body);
//     const user = req.body;
//     const {username, emailId, password } = user;
//     console.log(user);
//     //encrypting the password
//     const hashPassword = await bcrypt.hash(password, 10);

//     //creating the new instance of the user model
//     const newUser = new User({
//       username,
//       emailId,
//       password: hashPassword, // Store the hashed password
//     });

//    const savedUser = await newUser.save();
//    const token = jwt.sign({ id: savedUser._id }, "secret", { expiresIn: "1h" });
//    res.cookie("token",token,{
//     httpOnly: true,
//     sameSite: 'lax', // 'strict', 'lax', or 'none' (with secure: true for 'none')
//     // secure: true, // Uncomment in production with HTTPS
//     maxAge: 3600000 // 1 hour in milliseconds
//    })
    
//     res.json({message:"User created successfully",Data:savedUser});
//   } catch (error) {
//     res.status(400).send(error.message);
//     console.log("Error creating user", error.message);
//   }
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads', 'profiles');
    
    // Ensure directory exists
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

authRouter.post("/signup", upload.single('profileImage'), async (req, res) => {
  try {
    const { username, emailId, password } = req.body;
    const photoUrl = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      emailId,
      password: hashPassword,
      photoUrl: photoUrl,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, "secret", { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000
    });

    // Exclude password from response
    const userToReturn = {
      id: savedUser._id,
      username: savedUser.username,
      emailId: savedUser.emailId,
      photoUrl: savedUser.photoUrl,
    };

    res.status(200).json({ message: "User created successfully", user: userToReturn });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).send(error.message);
  }
});






authRouter.post("/login", async (req, res) => {
  
  try {
    const { emailId, password } = req.body;
    console.log("Login attempt with email:", emailId);
    
    const user = await User.findOne({ emailId });
    
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
      
      // Set cookie with appropriate options
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax', // 'strict', 'lax', or 'none' (with secure: true for 'none')
        // secure: true, // Uncomment in production with HTTPS
        maxAge: 3600000 // 1 hour in milliseconds
      });
      
      // Make sure to use these headers
      res.setHeader('Content-Type', 'application/json');
      
      // Send response
      return res.status(200).json({ 
        success: true, 
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          emailId: user.emailId,
          // Don't include sensitive data like password
        }
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

authRouter.get("/user", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});


authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
