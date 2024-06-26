/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import { express } from "express";
const app = express()

// IIFE db connect
;( async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error", (error)=>{
      console.log("Error occured after connection:", error);
      throw error;
    })

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port : ${process.env.PORT}`);
    })

  } catch (error) {
    console.log("Error occured in db connnection: ", error);
    throw error;
  }
} )();
*/
import { app } from "./app.js";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
// require(dotenv).config({path: './env'})
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});




// connecting DB
connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port :: ${process.env.PORT || 8000}`);
  });
  app.on("error", (error) => {
    console.log("ERRR occured after connection :: ", error);
  });
})
.catch((err) => {
  console.log("MONGODB connection failed :::: " , err);
});
