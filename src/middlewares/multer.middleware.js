import multer from "multer";
// import nanoid from nanoid (not installed yet)

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)    
    // can also use uniqueids(like nanoid) to save files with unique name beacuse user may uoload files with same name which can cause the files to be overwritten
    // cb(null, file.originalname + "-" + nanoid())
    // but since we are going to upload these files to the cloudinary service in small time intervals, so it may be hard to get 2 files with the same name
  }
})

export const upload = multer({
  storage: storage
})