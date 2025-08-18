// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const petitionRoutes = require("./routes/petitions");
const authRoutes = require("./routes/auth"); // assuming auth routes exist

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", petitionRoutes);
app.use("/api/auth", authRoutes); // login/register

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
