import path from 'path';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Datauri from 'datauri';
import dotenv from 'dotenv';
import handleError from '../helpers/errorHelper';

dotenv.config();

const dataUri = new Datauri();

export const memoryUpload = multer({
  fileFilter: (req, currentFile, callback) => {
    const { mimetype } = currentFile;
    if (mimetype.startsWith('image') || mimetype.startsWith('video')) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  storage: multer.memoryStorage(),
  limits: 5 * 1024 ** 2,
});

export const cloudUpload = (req, res, next) => {
  const { files } = req;
  if (!files) return next();

  Promise.all(
    files.map(
      file =>
        new Promise((resolve, reject) => {
          const { mimetype } = file;
          dataUri.format(path.extname(file.originalname), file.buffer);

          cloudinary.v2.uploader.upload(
            dataUri.content,
            {
              public_id: `${file.originalname
                .split('.')
                .slice(0, -1)
                .join('.')}`,
              resource_type: mimetype.startsWith('image') ? 'image' : 'video',
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
        })
    )
  )
    .then(urls => {
      urls.forEach((url, index) => {
        files[index].url = url;
      });
      next();
    })
    .catch(() =>
      handleError(res, 'An error occured while attaching uploaded media files')
    );

  return undefined;
};
