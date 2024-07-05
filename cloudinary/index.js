const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,   // This instance contains your Cloudinary account credentials (cloud name, API key, and API secret) and is used to interact with the Cloudinary service.
    params : {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
});

module.exports = {
    cloudinary,
    storage
}