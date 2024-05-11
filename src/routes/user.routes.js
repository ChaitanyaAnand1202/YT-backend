import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route('/register').post(
  upload.fields(    // fields is used because more than one files is accepted
    [
      {
        name: "avatar",    // make sure these names should be same in the frontend
        maxCount: 1
      },
      {
        name: "coverImage",    // make sure these names are same in frontend
        maxCount: 1
      }
    ]
  ),  
  registerUser
)

userRouter.route('/login').post(loginUser)   // login needs no authentication -> after login tokens are generated

// secured routes -> routes after authorization

userRouter.route('/logout').post(verifyJWT , logoutUser)    // logout will happpen only after token in cookies are verified
userRouter.route('/refresh-token').post(refreshAccessToken)




export default userRouter