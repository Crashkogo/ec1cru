import { RequestHandler } from 'express';
import { UploadedFile } from 'express-fileupload';
import { path, fs, __dirname } from './utils';

export const uploadImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const file = req.files.file as UploadedFile;
  const slug = req.body.slug || 'temp';
  const entity = typeof req.query.entity === 'string' ? req.query.entity : req.body.entity || 'news';
  const uploadDir = path.join(__dirname, '../../frontend/public/uploads', entity, slug);

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await file.mv(filePath);
    const imageUrl = `/uploads/${entity}/${slug}/${fileName}`;
    res.json({ location: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

export const moveImagesAfterCreate: RequestHandler = async (req, res) => {
  const { oldSlug = 'temp', newSlug } = req.body;
  const entity = req.body.entity;
  const oldDir = path.join(__dirname, '../../frontend/public/uploads', entity, oldSlug);
  const newDir = path.join(__dirname, '../../frontend/public/uploads', entity, newSlug);

  try {
    if (fs.existsSync(oldDir)) {
      if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
      const files = fs.readdirSync(oldDir);
      for (const file of files) {
        const oldPath = path.join(oldDir, file);
        const newPath = path.join(newDir, file);
        fs.renameSync(oldPath, newPath);
      }
      fs.rmdirSync(oldDir);
    }
    res.json({ message: 'Images moved successfully' });
  } catch (error) {
    console.error('Error moving images:', error);
    res.status(500).json({ message: 'Error moving images' });
  }
};

export const uploadGalleryImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.image) {
    res.status(400).json({ message: 'No image uploaded' });
    return;
  }
  const image = req.files.image as UploadedFile;
  const entity = 'ready-solutions';
  const slug = 'temp';
  const uploadDir = path.join(__dirname, '../../frontend/public/uploads', entity, slug);

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${image.name}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await image.mv(filePath);
    const imageUrl = `/uploads/${entity}/${slug}/${fileName}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

export const moveGalleryImagesAfterCreate: RequestHandler = async (req, res) => {
  const { images, slug } = req.body;
  const entity = 'ready-solutions';
  const oldDir = path.join(__dirname, '../../frontend/public/uploads', entity, 'temp');
  const newDir = path.join(__dirname, '../../frontend/public/uploads', entity, slug);

  try {
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
    const movedImages = images.map((imageUrl: string) => {
      const fileName = path.basename(imageUrl);
      const oldPath = path.join(oldDir, fileName);
      const newPath = path.join(newDir, fileName);
      if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath);
      return `/uploads/${entity}/${slug}/${fileName}`;
    });
    if (fs.existsSync(oldDir) && fs.readdirSync(oldDir).length === 0) fs.rmdirSync(oldDir);
    res.status(200).json({ images: movedImages });
  } catch (error) {
    console.error('Error moving gallery images:', error);
    res.status(500).json({ message: 'Error moving gallery images' });
  }
};