import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// get user info from frontend
// validation -> check if any field empty..
// check if user already exists -> username, email
// check if file recieved -> avatar required
// upload the images to cloudinary -> save response
// check if avatar successfully uploaded to cloudinary
// construct the user object -> add entry to db
// remove password and refresh token from response (reponse from db)
// check for user creation entry in db
// return the response to frontend ( dont want to send password to frontend )

const registerUser = asyncHandler( async (req, res) => {
  
  // get all info from frontned
  const { username, email, fullName, password } = req.body    
  console.log(email);

  // validation
  // check if any fields empty
  if( [username, email, fullName, password].some((item) => item?.trim() === "") ){
    throw new ApiError(400, "All fields are reuired");
  }

  // check if user already exists
  const existingUser = await User.findOne({     // for all db calls add await
    $or: [{ username }, { email }]
  })

  if(existingUser){
    throw new ApiError(409, "user with username or email already exists");
  }


  // check if images recieved from multer -> avatar is required
  const avatarLocalPath = req.files?.avatar[0]?.path       // req.files is provided by multer
  const coverImageLocalPath = req.files?.coverImage[0]?.path  // always chain all items condotionally since they mat not exist

  if(!avatarLocalPath){
    throw new ApiError( 400 , "avatar file is required")
  }

  // upload to cloudinary
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath)  // upload takes time and we dont want to proceed without upload
  const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath)

  // check if avatar uploaded successfully
  if(!avatarResponse){
    throw new  ApiError(400, "Avatar file is required");
  }


  // create User object to add to db
  const user = await User.create({     // db calls need await
    fullName,
    avatar : avatarResponse.url,
    coverImage: coverImageResponse?.url || "",       // since coverImage is not required
    email,
    password,
    username: username.toLowerCase()
  })

  // remove password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  //check if user created
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering user in db")
  }

  // return the response using ApiResponse
  return res.status(201).json(
    new ApiResponse(200, createdUser, "user registration successful")
  )
} )

export {registerUser}