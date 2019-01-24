import multer from 'multer';
import { promises as fs } from 'fs';

const storage = multer.diskStorage({
  destination: (req, currentFile, callback) => {
    const { mimetype } = currentFile;
    if (mimetype.startsWith('image/')) {
      fs.access('./media_upload/images')
        .then(() => callback(null, './media_upload/images'))
        .catch(async err => {
          if (err && err.code === 'ENOENT') {
            await fs.mkdir('./media_upload/images', { recursive: true });
            callback(null, './media_upload/images');
          }
        });
    } else if (mimetype.startsWith('video/')) {
      fs.access('./media_upload/videos')
        .then(() => callback(null, './media_upload/videos'))
        .catch(async err => {
          if (err && err.code === 'ENOENT') {
            await fs.mkdir('./media_upload/videos', { recursive: true });
            callback(null, './media_upload/videos');
          }
        });
    }
  },
  filename: (req, currentFile, callback) => {
    callback(
      null,
      `ir_${req.user.id}_${Math.floor(
        Math.random() * Number.MAX_SAFE_INTEGER
      )}_${currentFile.originalname.replace(/\s+/, '-')}`
    );
  },
});
const upload = multer({
  fileFilter: (req, currentFile, callback) => {
    const { mimetype } = currentFile;
    if (mimetype.startsWith('image') || mimetype.startsWith('video')) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  storage,
});

export default upload;
