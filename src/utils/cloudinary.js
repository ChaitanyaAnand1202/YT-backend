import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// cloudinary.config({ 
//   cloud_name: 'anand-dev-12', 
//   api_key: '282728916793433', 
//   api_secret: 'sllpYBAZ4HAdcOl6gJNOeXAKZvI' 
// });

// how upload works - file is uploaded by the user and is temporarily stored at a local server using multer middleware
// from the temporary local storage (public/temp) it is uploaded to cloudinary using this utility

// upload to cloudinary utility
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath){
      console.log("invalid file path in cloudinary upload");
      return null;
    }

    // upload the file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })

    // now file is uploaded successfully, return the response
    // console.log("File uploaded to cloudinary successfully", response.url);
    
    
    // remove the files after successfully uploading
    fs.unlinkSync(localFilePath);
    // return response
    return response;
    
  } catch (error) {
    // if there is an error during upload, it means file may be corrupted, so the file should be removed from the temporary local storage
    // file system is used to unlink(delete) the file synchronously -> file should be deleted first, only then proceed
    fs.unlinkSync(localFilePath);
  }
}

export { uploadOnCloudinary }