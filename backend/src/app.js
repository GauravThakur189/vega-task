// const express = require("express");
// const { connectToDatabase } = require("./config/database");
// const http = require("http");

// const User = require("./models/user");
// const {
//   validateSignupData,
//   validateSigninData,
// } = require("./utils/validation");
// const bcrypt = require("bcryptjs");
// const cookieParser = require("cookie-parser");
// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const cors = require("cors");
// const userRouter = require("./routes/user");
// const initializeSocket = require("../utils/socket");
// const chatRouter = require("./routes/chat");

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/",chatRouter)

// const server = http.createServer(app);
// initializeSocket(server)

// const DatabaseConnection = async () => {
//   const connection = await connectToDatabase();
//   if (!connection) {
//     console.error("Failed to connect to the database");
//     process.exit(1); // Exit the process with failure
//   } else {
//     server.listen(3000, connectToDatabase, () => {
//       console.log("Server is running on port 3000");
//     });

//     console.log("Connected to the database successfully");
//   }
// };

// DatabaseConnection();





// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();
// const authRoutes = require('./routes/auth');
// const cookieParser = require("cookie-parser");
// const blogRoutes = require('./routes/blogs');

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static('uploads'));

// const PORT = process.env.PORT || 3000;

// // Routes

// // const blogRoutes = require('./routes/blogs');

// app.use('/api', authRoutes);
// app.use('/api', blogRoutes);

// mongoose.connect(process.env.DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
// })
// .then(() => {
//   console.log("MongoDB connected successfully");
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch(err => {
//   console.error("DB Connection Error:", err);
//   process.exit(1); // Exit process with failure
// });













const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();

// ✅ CORS FIRST!
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ✅ Then middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Then static files (optional)
app.use('/uploads', express.static('uploads'));

// ✅ Then routes
app.use('/api', authRoutes);
app.use('/api', blogRoutes);

// ✅ Then DB and server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection failed', err);
});
