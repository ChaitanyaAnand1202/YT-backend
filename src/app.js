import express from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser";

const app = express();

// this much is also ok but we can add other configs
// app.use(cors());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
})); // to enable frontend and other resource sharing



app.use(express.json({ limit:'16kb' })); // to parse json data received
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // to parse url data (params and all that)
app.use(express.static("public")); // to store some files on server which are publicly availble
app.use(cookieParser()); // to read and write cookies from client


export { app };
