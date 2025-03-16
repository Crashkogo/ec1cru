import React, { useEffect, useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

// Схема валидации
const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  content: z.string().min(1, 'Content is required'),
  isPublished: z.boolean(),
  slug: z.string().min(1, 'Slug is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type NewsFormInputs = z.infer<typeof newsSchema>;

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

const NewsEdit: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormInputs>({
    resolver: zodResolver(newsSchema),
    defaultValues: { isPublished: false, content: '' },
  });

  const title = watch('title');
  const content = watch('content');

  // Парсинг HTML для извлечения URL-ов изображений
  const extractTempImages = (htmlContent: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    const tempImageUrls: string[] = [];

    console.log('Extracting temp images from content:', htmlContent);
    images.forEach((img) => {
      const src = img.getAttribute('src');
      console.log('Found image with src:', src);
      if (src && src.includes('/uploads/news/temp/') && !tempImageUrls.includes(src)) {
        tempImageUrls.push(src);
      }
    });

    console.log('Extracted temp images:', tempImageUrls);
    return tempImageUrls;
  };

  // Загрузка данных новости
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !slug) {
      setLoading(false);
      return;
    }

    axios
      .get<NewsFormInputs>(`${import.meta.env.VITE_API_URL}/api/posts/news/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const news = response.data;
        setValue('title', news.title);
        setValue('shortDescription', news.shortDescription);
        setValue('content', news.content);
        setValue('isPublished', news.isPublished);
        setValue('slug', news.slug);
        setValue('metaTitle', news.metaTitle || '');
        setValue('metaDescription', news.metaDescription || '');
        setOriginalSlug(news.slug);
        // Извлекаем изображения из /temp, если они есть в начальном контенте
        const tempUrls = extractTempImages(news.content);
        setTempImages(tempUrls);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, [slug, setValue]);

  // Обновление slug при изменении заголовка
  useEffect(() => {
    if (title) {
      const newSlug = transliterate(title);
      setValue('slug', newSlug);
    }
  }, [title, setValue]);

  const handleEditorInit = useCallback((evt: unknown, editor: TinyMCEEditor) => {
    console.log('TinyMCE initialized:', evt, editor);
  }, []);

  const handleEditorChange = useCallback(
    (newContent: string) => {
      setValue('content', newContent, { shouldValidate: true });
      // Извлекаем URL-ы изображений из нового контента
      const tempUrls = extractTempImages(newContent);
      setTempImages(tempUrls);
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<NewsFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      let updatedContent = data.content;

      console.log('Temp images before processing:', tempImages);
      console.log('Original slug:', originalSlug, 'New slug:', data.slug);

      // Обработка изображений
      if (tempImages.length > 0 || (originalSlug && originalSlug !== data.slug)) {
        // Перенос новых изображений из /temp в /slug
        if (tempImages.length > 0) {
          console.log('Moving images from /temp to /', data.slug);
          tempImages.forEach((tempUrl) => {
            const newUrl = tempUrl.replace('/uploads/news/temp/', `/uploads/news/${data.slug}/`);
            updatedContent = updatedContent.replace(tempUrl, newUrl);
          });

          const moveTempResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
            {
              oldSlug: 'temp',
              newSlug: data.slug,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Move temp images response:', moveTempResponse.data);
          setTempImages([]);
        }

        // Перенос существующих изображений, если slug изменился
        if (originalSlug && originalSlug !== data.slug) {
          console.log('Moving images from /', originalSlug, 'to /', data.slug);
          updatedContent = updatedContent.replace(
            new RegExp(`/uploads/news/${originalSlug}/`, 'g'),
            `/uploads/news/${data.slug}/`
          );

          const moveSlugResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
            {
              oldSlug: originalSlug,
              newSlug: data.slug,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Move slug images response:', moveSlugResponse.data);
          setOriginalSlug(data.slug);
        }

        data.content = updatedContent;
      } else {
        console.log('No temp images or slug changes to process');
      }

      console.log('Final content before sending:', data.content);
      const updateResponse = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/posts/news/${slug}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Update news response:', updateResponse.data);

      navigate('/admin/news');
    } catch (error) {
      console.error('Error updating news:', error);
      alert('Ошибка при обновлении новости: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Редактирование новости</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Заголовок</label>
          <input {...register('title')} className="w-full p-2 border rounded" placeholder="Введите заголовок..." />
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
          <label className="block mb-2 font-medium">Основное содержание</label>
          <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={content}
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
              images_upload_url: '${import.meta.env.VITE_API_URL}/api/posts/upload-image',
              images_upload_base_path: '${import.meta.env.VITE_API_URL}',
              automatic_uploads: true,
              file_picker_types: 'image',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('isPublished')} className="mr-2" />
            Опубликовано
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
          <label className="block mb-2 font-medium">Meta Title</label>
          <input {...register('metaTitle')} className="w-full p-2 border rounded" placeholder="Введите meta title..." />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Meta Description</label>
          <textarea
            {...register('metaDescription')}
            className="w-full p-2 border rounded"
            placeholder="Введите meta description..."
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

export default NewsEdit;