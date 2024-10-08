//const express = require("express"); // old way
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import createError from "http-errors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import seatingRoutes from "./routes/seatingRoutes.js";
import memberShipRoutes from "./routes/memberShipRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import { verifyAccessToken } from "./utils/jwt.js";

dotenv.config({});

import connectDb from "./utils/db.js";
import { port, requestOrigin } from "./config.js";
const app = express();
// Some middleware
app.use(morgan("dev")); // log requests and errors in development mode
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: requestOrigin,
    //credentials: true,
  })
);

// const corsOptions = {
//   origin: requestOrigin,
//   credentials: true,
// };

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello from express.");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/seating", seatingRoutes);
app.use("/api/v1/membership", memberShipRoutes); //verifyAccessToken
app.use("/api/v1/member", memberRoutes);

//Error handler
app.use(async (req, res, next) => {
  //const error = new Error("Not found");
  //error.status = 404;
  //next(error);
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
