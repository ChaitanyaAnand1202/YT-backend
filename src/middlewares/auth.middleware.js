import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler( async(req, _, next) => { // since response is not sent, _ is used (just professional standard)


  try {
    // cookies can be accessed via the cookieParser through cookies or through Authorization field of header(in mobile devices)
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");    // this last part is used to extract the token
  
    if(!accessToken){
      throw new ApiError(401, "Unauthorized request");
    }
  
  
    // this will give the access token after decrypting
    // we recieve the object defined in body of accessToken as response (see generateAccessToken in user.models)
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  

    // find if user exists for the id that is obtained from the cookies
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
    if(!user){
      throw new ApiError(401, "Invalid Access Token");
    }
    

    // add the user obtained to the request req
    req.user = user;
    next();


    // how verification is done? -> if the req contains a user object that has details of the user, this means the user was verified with the accessToken in the cookie
    // so the user is the same as the one who logged in and added the token to the cookies after login

  } catch (error) {
    throw new ApiError(404, error?.message || "authentication failed : invalid access token")
  }

} )