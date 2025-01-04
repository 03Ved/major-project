const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust',
      allowedFormats: ['jpeg', 'png', 'jpg'],
      return_delete_token: true
    },
  });

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted:', result);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

const deleteBeforeInit = async () => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix("wanderlust/");
    console.log('All the images deleted: ', result);
  } catch (error) {
    console.error('Error deleting images:', error);
  }
}

module.exports = {cloudinary, storage, deleteImage, deleteBeforeInit};