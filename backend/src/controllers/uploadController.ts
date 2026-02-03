import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { path, fs, __dirname } from "../utils/index.js";

// ========== БЕЗОПАСНОСТЬ: Валидация загружаемых файлов ==========

// Whitelist допустимых типов файлов (только изображения)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Whitelist допустимых сущностей для загрузки
const ALLOWED_ENTITIES = [
  'news',
  'company-life',
  'events',
  'promotions',
  'ready-solutions',
  'courses',
  'testimonials',
  'newsletters'
];

// Валидация slug - только буквы, цифры, дефисы и 'temp'
const isValidSlug = (slug: string): boolean => {
  return slug === 'temp' || /^[a-z0-9-]+$/i.test(slug);
};

// Функция валидации загружаемого файла
const validateUploadedFile = (file: UploadedFile): { valid: boolean; error?: string } => {
  // Проверка MIME типа
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  // Дополнительная проверка расширения файла
  const ext = path.extname(file.name).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`
    };
  }

  return { valid: true };
};

// Функция для создания безопасного имени файла
const createSafeFileName = (originalName: string): string => {
  // Получаем расширение файла
  const ext = path.extname(originalName);

  // Создаем базовое имя без расширения
  let baseName = path.basename(originalName, ext);

  // Транслитерируем кириллицу и убираем небезопасные символы
  baseName = baseName
    .replace(/[а-яё]/gi, (match) => {
      const translitMap: { [key: string]: string } = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };
      return translitMap[match.toLowerCase()] || match;
    })
    .replace(/[^a-zA-Z0-9\-_.]/g, "_") // Заменяем небезопасные символы на подчеркивание
    .replace(/_{2,}/g, "_") // Убираем множественные подчеркивания
    .replace(/^_|_$/g, ""); // Убираем подчеркивания в начале и конце

  // Если имя стало пустым, используем 'image'
  if (!baseName) {
    baseName = "image";
  }

  return `${Date.now()}-${baseName}${ext}`;
};

// БЕЗОПАСНОСТЬ: Загрузка изображений доступна только администраторам
export const uploadImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  const file = req.files.file as UploadedFile;

  // БЕЗОПАСНОСТЬ: Валидация типа файла
  const validation = validateUploadedFile(file);
  if (!validation.valid) {
    res.status(400).json({ message: validation.error });
    return;
  }

  // Получаем slug из query параметров или body, по умолчанию "temp"
  const slug = (typeof req.query.slug === "string" ? req.query.slug : req.body.slug) || "temp";

  const entity =
    typeof req.query.entity === "string"
      ? req.query.entity
      : req.body.entity || "news";

  // БЕЗОПАСНОСТЬ: Валидация entity и slug для предотвращения path traversal
  if (!ALLOWED_ENTITIES.includes(entity)) {
    res.status(400).json({
      message: `Invalid entity. Allowed: ${ALLOWED_ENTITIES.join(', ')}`
    });
    return;
  }

  if (!isValidSlug(slug)) {
    res.status(400).json({
      message: "Invalid slug format. Only letters, numbers, and hyphens allowed"
    });
    return;
  }

  const uploadDir = path.join(
    __dirname,
    "../../frontend/public/uploads",
    entity,
    slug
  );

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = createSafeFileName(file.name);
  const filePath = path.join(uploadDir, fileName);

  try {
    await file.mv(filePath);
    const imageUrl = `/uploads/${entity}/${slug}/${fileName}`;
    res.json({ location: imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

export const moveImagesAfterCreate: RequestHandler = async (req, res) => {
  const { oldSlug = "temp", newSlug } = req.body;
  const entity = req.body.entity;
  const oldDir = path.join(
    __dirname,
    "../../frontend/public/uploads",
    entity,
    oldSlug
  );
  const newDir = path.join(
    __dirname,
    "../../frontend/public/uploads",
    entity,
    newSlug
  );

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
    res.json({ message: "Images moved successfully" });
  } catch (error) {
    console.error("Error moving images:", error);
    res.status(500).json({ message: "Error moving images" });
  }
};

// БЕЗОПАСНОСТЬ: Загрузка изображений галереи доступна только администраторам
export const uploadGalleryImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.image) {
    res.status(400).json({ message: "No image uploaded" });
    return;
  }
  const image = req.files.image as UploadedFile;

  // БЕЗОПАСНОСТЬ: Валидация типа файла
  const validation = validateUploadedFile(image);
  if (!validation.valid) {
    res.status(400).json({ message: validation.error });
    return;
  }

  const entity = "ready-solutions";
  const slug = "temp";
  const uploadDir = path.join(
    __dirname,
    "../../frontend/public/uploads",
    entity,
    slug
  );

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = createSafeFileName(image.name);
  const filePath = path.join(uploadDir, fileName);

  try {
    await image.mv(filePath);
    const imageUrl = `/uploads/${entity}/${slug}/${fileName}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

export const moveGalleryImagesAfterCreate: RequestHandler = async (
  req,
  res
) => {
  const { images, slug } = req.body;
  const entity = "ready-solutions";
  const oldDir = path.join(
    __dirname,
    "../../frontend/public/uploads",
    entity,
    "temp"
  );
  const newDir = path.join(
    __dirname,
    "../../frontend/public/uploads",
    entity,
    slug
  );

  try {
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
    const movedImages = images.map((imageUrl: string) => {
      const fileName = path.basename(imageUrl);
      const oldPath = path.join(oldDir, fileName);
      const newPath = path.join(newDir, fileName);
      if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath);
      return `/uploads/${entity}/${slug}/${fileName}`;
    });
    if (fs.existsSync(oldDir) && fs.readdirSync(oldDir).length === 0)
      fs.rmdirSync(oldDir);
    res.status(200).json({ images: movedImages });
  } catch (error) {
    console.error("Error moving gallery images:", error);
    res.status(500).json({ message: "Error moving gallery images" });
  }
};
