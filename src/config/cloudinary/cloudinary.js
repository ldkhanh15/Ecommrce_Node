const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
cloudinary.api.usage(function (error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log("Dung lượng đã sử dụng:", result.credits.usage);
    console.log("Dung lượng tối đa:", result.credits.limit);
  }
});
const storageImage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: "e_commerce"
  },
});
const storageVideo = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'video', folder: 'e_commerce'
  }

})
const uploadImage = multer({ storage: storageImage });
const uploadVideo = multer({ storage: storageVideo });

module.exports = { uploadImage, uploadVideo };
