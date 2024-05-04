import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"

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

export default userRouter