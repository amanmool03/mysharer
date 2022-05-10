import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import fileRoutes from "./routes/files";
import { v2 as cloudinary } from "cloudinary";

//configure dotenv
dotenv.config();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//intialize express app
const app = express();

//Using cors middleware
app.use(cors());

//Body parser for post
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//setup routes
app.use("/api/files", fileRoutes);

//listening to the port
const PORT = process.env.PORT;
app.listen(process.env.PORT, () =>
  console.log(`Server is listening in PORT ${PORT}`)
);
