const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Set Storage Engine
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// check file type
const checkFileType = (file, cb) => {
  // Allowed extentions
  const fileTypes = /jpeg|jpg|png|gif/;
  // check the extention
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb({ message: "Only images are allowed" });
  }
};

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("myImage");

const deleteFile = imagePath => {
  fs.unlinkSync(imagePath);
};

module.exports = { upload, deleteFile };
