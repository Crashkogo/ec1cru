import React, { useEffect, useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  content: z.string().min(1, 'Content is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid start date is required' }),
  isPublished: z.boolean(),
  status: z.boolean(),
  ours: z.boolean(),
  slug: z.string().min(1, 'Slug is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  eventLink: z.string().optional(),
});

type EventFormInputs = z.infer<typeof eventSchema>;

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

const EventsEdit: React.FC = () => {
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
  } = useForm<EventFormInputs>({
    resolver: zodResolver(eventSchema),
    defaultValues: { isPublished: false, content: '', status: false, ours: false, eventLink: '' },
  });

  const title = watch('title');
  const content = watch('content');
  const startDate = watch('startDate');

  const extractTempImages = (htmlContent: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    const tempImageUrls: string[] = [];

    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.includes('/uploads/events/temp/') && !tempImageUrls.includes(src)) {
        tempImageUrls.push(src);
      }
    });

    return tempImageUrls;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !slug) {
      setLoading(false);
      return;
    }
  
    axios
      .get<EventFormInputs>(`${import.meta.env.VITE_API_URL}/api/posts/events/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const event = response.data;
        setValue('title', event.title);
        setValue('shortDescription', event.shortDescription);
        setValue('content', event.content);
        // Форматируем Date в строку для datetime-local
        const dateStr = event.startDate.toString().replace(':00.000Z', '');
        setValue('startDate', dateStr);
        setValue('isPublished', event.isPublished);
        setValue('status', event.status);
        setValue('ours', event.ours);
        setValue('slug', event.slug);
        setValue('metaTitle', event.metaTitle || '');
        setValue('metaDescription', event.metaDescription || '');
        setValue('eventLink', event.eventLink || '');
        setOriginalSlug(event.slug);
        const tempUrls = extractTempImages(event.content);
        setTempImages(tempUrls);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
        setLoading(false);
      });
  }, [slug, setValue]);

  useEffect(() => {
    if (title) {
      const newSlug = transliterate(title);
      setValue('slug', newSlug);
    }
  }, [title, setValue]);

  useEffect(() => {
    if (startDate) {
      const now = new Date();
      const start = new Date(startDate);
      setValue('status', now > start);
    }
  }, [startDate, setValue]);

  const handleEditorInit = useCallback((evt: unknown, editor: TinyMCEEditor) => {
    console.log('TinyMCE initialized:', evt, editor);
  }, []);

  const handleEditorChange = useCallback(
    (newContent: string) => {
      setValue('content', newContent, { shouldValidate: true });
      const tempUrls = extractTempImages(newContent);
      setTempImages(tempUrls);
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      let updatedContent = data.content;
  
      if (tempImages.length > 0 || (originalSlug && originalSlug !== data.slug)) {
        if (tempImages.length > 0) {
          tempImages.forEach((tempUrl) => {
            const newUrl = tempUrl.replace('/uploads/events/temp/', `/uploads/events/${data.slug}/`);
            updatedContent = updatedContent.replace(tempUrl, newUrl);
          });
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
            {
              oldSlug: 'temp',
              newSlug: data.slug,
              entity: 'events',
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTempImages([]);
        }
        if (originalSlug && originalSlug !== data.slug) {
          updatedContent = updatedContent.replace(
            new RegExp(`/uploads/events/${originalSlug}/`, 'g'),
            `/uploads/events/${data.slug}/`
          );
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
            {
              oldSlug: originalSlug,
              newSlug: data.slug,
              entity: 'events',
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOriginalSlug(data.slug);
        }
        data.content = updatedContent;
      }
  
      // Оставляем startDate как есть
      console.log('Sending data:', data); // Отладка
  
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/posts/events/${slug}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Ошибка при обновлении мероприятия: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Редактирование мероприятия</h2>
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
          <label className="block mb-2 font-medium">Дата начала</label>
          <input
            type="datetime-local"
            {...register('startDate')}
            className="w-full p-2 border rounded"
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
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
              images_upload_url: `${import.meta.env.VITE_API_URL}/api/posts/upload-image?entity=events`,
              images_upload_base_path: `${import.meta.env.VITE_API_URL}`,
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
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('ours')} className="mr-2" />
            Наше мероприятие
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Ссылка на мероприятие</label>
          <input
            {...register('eventLink')}
            className="w-full p-2 border rounded"
            placeholder="Введите ссылку на мероприятие..."
          />
          {errors.eventLink && <p className="text-red-500 text-sm mt-1">{errors.eventLink.message}</p>}
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

export default EventsEdit;