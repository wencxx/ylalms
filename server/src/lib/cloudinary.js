const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: "djgmga5gf",
    api_key: '442119484651297',
    api_secret: 'cklkbLXUBvD9kFJtjxjvI8fatks',
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ylalms',
        allowed_format: ["jpg", "png", "jpeg"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    }
})

module.exports = { cloudinary, storage } 