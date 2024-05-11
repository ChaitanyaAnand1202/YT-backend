import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId);  // find the user from database
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken(); // generate access and refresh token

    user.refreshToken = refreshToken; // assigning the generated refresh token into db
    await user.save({ validateBeforeSave: false });    // saving the changes made to the current user object

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
}

const registerUser = asyncHandler( async (req, res) => {
  
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


  // get all info from frontned
  const { username, email, fullName, password } = req.body    
  // console.log(email);

  // validation
  // check if any fields empty
  if( [username, email, fullName, password].some((item) => item?.trim() === "") ){
    throw new ApiError(400, "All fields are required");
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
  // const coverImageLocalPath = req.files?.coverImage[0]?.path  // always chain all items condotionally since they mat not exist

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){  // to make sure that all parts of multer path exist
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log(avatarLocalPath)
  // console.log(coverImageLocalPath)


  if(!avatarLocalPath){
    throw new ApiError( 405 , "avatar file is required")
  }

  // upload to cloudinary
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath)  // upload takes time and we dont want to proceed without upload
  const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath)

  // check if avatar uploaded successfully
  if(!avatarResponse){
    throw new  ApiError(410, "Avatar file not uploaded to cloudinary");
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

const loginUser = asyncHandler( async (req , res) => {

  // req.body -> data
  // username or email recieved from body or not
  // check if user exists
  // password check
  // generate access and refresh token
  // send this token with cookies
  
  // req.body -> data
  const {username, email, password} = req.body;

  // username or email recieved from body or not
  if(!username && !email){
    throw new ApiError(400, "username or password is required");
  }

  // check if user exists
  const userFromDatabase = await User.findOne({
    $or: [ { username }, { email }]
  }  )

  if(!userFromDatabase){
    throw new ApiError(404, "Invalid User Credentials - User does not exist in database");
  }

  // password check
  const isPasswordValid = await userFromDatabase.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401, "Invalid User Credentials - incorrect password");
  }

  // generate access and refresh token
  const {accessToken, refreshToken} = generateAccessAndRefreshTokens(userFromDatabase._id);

  // getting details of user after login except password and refreshToken to be returned
  const loggedInUser = await User.findById(userFromDatabase._id).select("-password -refreshToken");  
  
  if(!loggedInUser){
    throw new ApiError(405, "User could not be loggedIn after token generation");
  }

  const options = {
    httpOnly : true,
    secure : true
  }
  
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, 
          accessToken, 
          refreshToken
        },
        "User Loggged in successfully"
      )
    )
} )

export {registerUser}