/* import React, { useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

const promotionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isPublished: z.boolean(),
  status: z.boolean(),
  slug: z.string().min(1, 'Slug is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type PromotionFormInputs = z.infer<typeof promotionSchema>;

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

const PromotionsCreate: React.FC = () => {
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromotionFormInputs>({
    resolver: zodResolver(promotionSchema),
    defaultValues: { isPublished: false, status: true, content: '' },
  });

  const title = watch('title');
  const content = watch('content');

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

  const onSubmit: SubmitHandler<PromotionFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/posts/promotions', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Создание акции</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Заголовок</label>
          <input {...register('title')} className="w-full p-2 border rounded" placeholder="Введите заголовок..." />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Описание</label>
          <textarea {...register('description')} className="w-full p-2 border rounded" placeholder="Введите описание..." />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Основное содержание</label>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={(newValue) => {
              setValue('content', newValue, { shouldValidate: true }); // Синхронизация с useForm
            }}
            modules={quillModules}
            className="mb-4 bg-white"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
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
          <label className="block mb-2 font-medium">Дата окончания</label>
          <input
            type="datetime-local"
            {...register('endDate')}
            className="w-full p-2 border rounded"
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
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
            Активна
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Slug</label>
          <input {...register('slug')} className="w-full p-2 border rounded" placeholder="Автоматически генерируется..." readOnly />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Meta Title</label>
          <input {...register('metaTitle')} className="w-full p-2 border rounded" placeholder="Введите meta title..." />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Meta Description</label>
          <textarea {...register('metaDescription')} className="w-full p-2 border rounded" placeholder="Введите meta description..." rows={3} />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Сохранить акцию
        </button>
      </form>
    </div>
  );
};

export default PromotionsCreate; */