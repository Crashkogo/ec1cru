/* import React, { useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

// Схема валидации для Events
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'), // Убрали transform
  isPublished: z.boolean(),
  status: z.boolean(),
  ours: z.boolean(),
  slug: z.string().min(1, 'Slug is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
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

const EventsCreate: React.FC = () => {
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormInputs>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isPublished: false,
      status: false,
      ours: true,
      description: '',
      shortDescription: '',
    },
  });

  const title = watch('title');
  const description = watch('description');

  useEffect(() => {
    if (title) {
      const slug = transliterate(title);
      setValue('slug', slug);
    }
  }, [title, setValue]);

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        [{ align: [] }],
        ['clean'],
      ],
    },
  };

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    console.log('Данные для отправки:', data); // Для отладки
    try {
      await axios.post(
        'http://localhost:5000/api/posts/events', // Исправили эндпоинт
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Ошибка при создании события: ' + error.message);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Создание события</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Заголовок</label>
          <input
            {...register('title')}
            className="w-full p-2 border rounded"
            placeholder="Введите заголовок..."
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
          <label className="block mb-2 font-medium">Основное описание</label>
          <ReactQuill
            ref={quillRef}
            value={description}
            onChange={(newValue) => {
              setValue('description', newValue, { shouldValidate: true });
            }}
            modules={quillModules}
            className="mb-4 bg-white"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Дата начала</label>
          <input
            type="datetime-local"
            {...register('startDate')}
            className="w-full p-2 border rounded"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('isPublished')} className="mr-2" />
            Опубликовано
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('status')} className="mr-2" />
            Прошедшее событие
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('ours')} className="mr-2" />
            Наше событие
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
          <input
            {...register('metaTitle')}
            className="w-full p-2 border rounded"
            placeholder="Введите meta title..."
          />
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Сохранить событие
        </button>
      </form>
    </div>
  );
};

export default EventsCreate; */