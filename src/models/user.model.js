import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";


const userSchema = new Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true     // if we want a field to be searchable, we make index true
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName:{
    type: String,
    required: true,
    trim: true,
    index: true     // if we want a field to be searchable, we make index true
  },
  avatar: {
    type: String,   // cloudinary URL
    required: true
  },
  coverImage: {
    type: String,   // cloudinary URL
  },

  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video"
    }
  ],

  password: {
    type: String,
    required: [true, 'Password is required']
  },

  refreshToken: {
    type: String
  }
},
{
  timestamps: true
})

userSchema.pre("save", async function (next){    // Note: dont use arrow function because it cannot access the current context, but here context is needed for this. use
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next()
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = function(){
  try {
    return jwt.sign(
      { // payload
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    )
  } catch (error) {
    throw new ApiError(402, error.message)
  }
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    { // payload
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User", userSchema)