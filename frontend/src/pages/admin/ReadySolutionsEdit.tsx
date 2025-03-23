// src/pages/admin/ReadySolutionsEdit.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

interface Program {
  id: number;
  fullName: string;
  shortName: string;
}

interface ReadySolution {
  type: 'PROCESSING' | 'PRINT_FORM' | 'REPORT';
  freshSupport: boolean;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  images: string[];
  isPublished: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  programs: { program: Program }[];
}

// Схема валидации
const solutionSchema = z.object({
  type: z.enum(['PROCESSING', 'PRINT_FORM', 'REPORT']),
  freshSupport: z.boolean(),
  title: z.string().min(1, 'Название обязательно'),
  shortDescription: z.string().min(1, 'Краткое описание обязательно'),
  fullDescription: z.string().min(1, 'Полное описание обязательно'),
  price: z.string().min(1, 'Цена обязательна'),
  isPublished: z.boolean(),
  slug: z.string().min(1, 'Slug обязателен'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type SolutionFormInputs = z.infer<typeof solutionSchema>;

const transliterate = (text: string): string => {
  const ruToEn: { [key: string]: string } = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y',
    ь: '', э: 'e', ю: 'yu', я: 'ya', ' ': '-', ',': '', '.': '',
  };

  return text
    .toLowerCase()
    .split('')
    .map((char) => ruToEn[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const SERVER_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReadySolutionsEdit: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [tempImages, setTempImages] = useState<string[]>([]); // Для TinyMCE
  const [galleryImages, setGalleryImages] = useState<string[]>([]); // Для галереи
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SolutionFormInputs>({
    resolver: zodResolver(solutionSchema),
    defaultValues: { freshSupport: false, isPublished: false, fullDescription: '' },
  });

  const title = watch('title');
  const fullDescription = watch('fullDescription');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !slug) {
      setLoading(false);
      return;
    }

    // Загрузка данных решения
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/admin/ready-solutions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const solution = response.data.find((s: ReadySolution) => s.slug === slug);
        if (solution) {
          setValue('type', solution.type);
          setValue('freshSupport', solution.freshSupport);
          setValue('title', solution.title);
          setValue('shortDescription', solution.shortDescription);
          setValue('fullDescription', solution.fullDescription);
          setValue('price', solution.price.toString());
          setValue('isPublished', solution.isPublished);
          setValue('slug', solution.slug);
          setValue('metaTitle', solution.metaTitle || '');
          setValue('metaDescription', solution.metaDescription || '');
          // Преобразуем пути изображений в абсолютные URL
          const absoluteImages = solution.images.map((img: string) => `${SERVER_BASE_URL}${img}`);
          setGalleryImages(absoluteImages);
          setSelectedPrograms(solution.programs.map((p: { program: Program }) => p.program.id));
          setOriginalSlug(solution.slug);
          const tempUrls = extractTempImages(solution.fullDescription);
          setTempImages(tempUrls);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching solution:', error);
        setLoading(false);
      });

    // Загрузка программ
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/admin/programs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPrograms(response.data))
      .catch((error) => console.error('Error fetching programs:', error));
  }, [slug, setValue]);

  useEffect(() => {
    if (title) {
      const newSlug = transliterate(title);
      setValue('slug', newSlug);
    }
  }, [title, setValue]);

  const extractTempImages = (htmlContent: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    const tempImageUrls: string[] = [];

    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.includes('/uploads/ready-solutions/temp/') && !tempImageUrls.includes(src)) {
        tempImageUrls.push(src);
      }
    });

    return tempImageUrls;
  };

  const handleEditorInit = useCallback((evt: unknown, editor: TinyMCEEditor) => {
    console.log('TinyMCE initialized:', evt, editor);
  }, []);

  const handleEditorChange = useCallback(
    (newContent: string) => {
      setValue('fullDescription', newContent, { shouldValidate: true });
      const tempUrls = extractTempImages(newContent);
      setTempImages(tempUrls);
    },
    [setValue]
  );

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const token = localStorage.getItem('token');
    const uploadedImages: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/posts/upload-gallery-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const absoluteUrl = `${SERVER_BASE_URL}${response.data.url}`;
        console.log('Absolute URL:', absoluteUrl);
        uploadedImages.push(absoluteUrl);
      } catch (error) {
        console.error('Error uploading gallery image:', error);
      }
    }
    setGalleryImages((prev) => [...prev, ...uploadedImages]);
  };

  const onSubmit: SubmitHandler<SolutionFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      let updatedFullDescription = data.fullDescription;
      let movedGalleryImages = galleryImages;

      // Обработка изображений TinyMCE
      if (tempImages.length > 0 || (originalSlug && originalSlug !== data.slug)) {
        if (tempImages.length > 0) {
          tempImages.forEach((tempUrl) => {
            const newUrl = tempUrl.replace('/uploads/ready-solutions/temp/', `/uploads/ready-solutions/${data.slug}/`);
            updatedFullDescription = updatedFullDescription.replace(tempUrl, newUrl);
          });
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
            {
              oldSlug: 'temp',
              newSlug: data.slug,
              entity: 'ready-solutions',
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTempImages([]);
        }
        if (originalSlug && originalSlug !== data.slug) {
          updatedFullDescription = updatedFullDescription.replace(
            new RegExp(`/uploads/ready-solutions/${originalSlug}/`, 'g'),
            `/uploads/ready-solutions/${data.slug}/`
          );
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
            {
              oldSlug: originalSlug,
              newSlug: data.slug,
              entity: 'ready-solutions',
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOriginalSlug(data.slug);
        }
      }

      // Обработка изображений галереи
      if (galleryImages.length > 0) {
        // Убираем SERVER_BASE_URL из путей перед отправкой на сервер
        const relativeImages = galleryImages.map((img) => img.replace(SERVER_BASE_URL, ''));
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/posts/move-gallery-images`,
          { images: relativeImages, slug: data.slug },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Преобразуем возвращённые пути обратно в абсолютные
        movedGalleryImages = response.data.images.map((url: string) => `${SERVER_BASE_URL}${url}`);
        setGalleryImages(movedGalleryImages); // Обновляем состояние для немедленного отображения
      }

      const solutionData = {
        ...data,
        price: parseFloat(data.price),
        fullDescription: updatedFullDescription,
        images: movedGalleryImages.map((img) => img.replace(SERVER_BASE_URL, '')), // Сохраняем относительные пути в базе
        programIds: selectedPrograms,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/posts/admin/ready-solutions/${slug}`,
        solutionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/admin/ready-solutions');
    } catch (error) {
      console.error('Error updating solution:', error);
      alert('Ошибка при обновлении решения: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Редактирование готового решения</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Тип решения</label>
          <select {...register('type')} className="w-full p-2 border rounded">
            <option value="PROCESSING">Обработка</option>
            <option value="PRINT_FORM">Печатная форма</option>
            <option value="REPORT">Отчёт</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('freshSupport')} className="mr-2" />
            Поддержка 1C:Fresh
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Название</label>
          <input
            {...register('title')}
            className="w-full p-2 border rounded"
            placeholder="Введите название..."
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Краткое описание</label>
          <textarea
            {...register('shortDescription')}
            className="w-full p-2 border rounded"
            placeholder="Введите краткое описание..."
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Полное описание</label>
          <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={fullDescription}
            onEditorChange={handleEditorChange}
            onInit={handleEditorInit}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic underline strikethrough | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | link image | ' +
                'removeformat | code | help',
              base_url: '/tinymce',
              suffix: '.min',
              image_uploadtab: true,
              images_upload_url: `${import.meta.env.VITE_API_URL}/api/posts/upload-image?entity=ready-solutions`,
              images_upload_base_path: `${import.meta.env.VITE_API_URL}`,
              automatic_uploads: true,
              file_picker_types: 'image',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
          {errors.fullDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Цена</label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            className="w-full p-2 border rounded"
            placeholder="Введите цену..."
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Программы</label>
          {programs.map((program) => (
            <div key={program.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={program.id}
                checked={selectedPrograms.includes(program.id)}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  setSelectedPrograms((prev) =>
                    e.target.checked ? [...prev, id] : prev.filter((p) => p !== id)
                  );
                }}
                className="mr-2"
              />
              <span>
                {program.fullName} ({program.shortName})
              </span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Изображения для галереи</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryImageUpload}
            className="w-full p-2 border rounded"
          />
          {galleryImages.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                  onError={() => console.error('Image load error:', img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('isPublished')} className="mr-2" />
            Опубликовать
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Slug</label>
          <input
            {...register('slug')}
            className="w-full p-2 border rounded"
            placeholder="Автоматически генерируется..."
            readOnly
          />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Мета-заголовок</label>
          <input
            {...register('metaTitle')}
            className="w-full p-2 border rounded"
            placeholder="Введите мета-заголовок..."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Мета-описание</label>
          <textarea
            {...register('metaDescription')}
            className="w-full p-2 border rounded"
            placeholder="Введите мета-описание..."
            rows={3}
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default ReadySolutionsEdit;