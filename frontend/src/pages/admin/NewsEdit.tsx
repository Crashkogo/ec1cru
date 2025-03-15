import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import Quill from '../../quill-config'; // Предполагается, что файл в src
import 'quill/dist/quill.snow.css';
import './quill-custom.css';

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
  const [tempImages, setTempImages] = useState<string[]>([]); // Храним временные URL
  const [originalSlug, setOriginalSlug] = useState<string | null>(null); // Исходный slug

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

  // Настройка Quill
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        [{ align: ['', 'center', 'right', 'justify'] }],
        [{ float: ['', 'left', 'right'] }],
        ['clean'],
      ],
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    },
    formats: [
      'header', 'bold', 'italic', 'underline', 'strike', 'list',
      'link', 'image', 'blockquote', 'code-block', 'align', 'float', 'margin', 'display'
    ],
  });

  // Загрузка данных новости
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !slug) {
      setLoading(false);
      return;
    }

    axios
      .get<{ title: string; shortDescription: string; content: string; isPublished: boolean; slug: string; metaTitle?: string; metaDescription?: string }>(
        `http://localhost:5000/api/posts/news/${slug}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        const news = response.data;
        setValue('title', news.title);
        setValue('shortDescription', news.shortDescription);
        setValue('content', news.content);
        setValue('isPublished', news.isPublished);
        setValue('slug', news.slug);
        setValue('metaTitle', news.metaTitle || '');
        setValue('metaDescription', news.metaDescription || '');
        setOriginalSlug(news.slug); // Сохраняем исходный slug
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, [slug, setValue]);

  // Обработчик загрузки изображения
  const insertImageToEditor = (url: string) => {
    if (quill) {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
      const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, 'image', fullUrl);
      console.log('Image inserted:', fullUrl);
      if (fullUrl.includes('/uploads/news/temp/')) {
        setTempImages((prev) => [...prev, fullUrl]); // Сохраняем временные URL
      }
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', watch('slug') || 'temp');
    formData.append('entity', 'news');

    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.post<{ location: string }>(
      'http://localhost:5000/api/posts/upload-image',
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Server response:', response.data);
    if (!response.data.location) {
      throw new Error('No location in server response');
    }
    return response.data.location;
  };

  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      console.log('File selected');
      const file = input.files?.[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      try {
        console.log('Uploading image...');
        const imageUrl = await uploadImageToServer(file);
        insertImageToEditor(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Ошибка при загрузке изображения: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
      }
    };
  };

  // Привязка обработчиков через useEffect
  useEffect(() => {
    if (quill) {
      console.log('Quill initialized');
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
      quill.getModule('toolbar').addHandler('float', (value: string) => {
        const range = quill.getSelection();
        if (range) {
          const [leaf] = quill.getLeaf(range.index);
          if (leaf && (leaf.domNode as HTMLElement).tagName === 'IMG') {
            (leaf.domNode as HTMLElement).style.float = value || '';
            (leaf.domNode as HTMLElement).style.margin = value ? '0 1em 1em 0' : '0';
            (leaf.domNode as HTMLElement).style.display = 'inline';
            setValue('content', quill.root.innerHTML, { shouldValidate: true });
          }
        }
      });
      quill.on('text-change', () => {
        setValue('content', quill.root.innerHTML, { shouldValidate: true });
      });
      if (content && quill.root.innerHTML !== content) {
        quill.root.innerHTML = content;
      }
    }
  }, [quill, setValue, content, selectLocalImage]);

  // Синхронизация slug
  useEffect(() => {
    if (title) {
      const newSlug = transliterate(title);
      setValue('slug', newSlug);
    }
  }, [title, setValue]);

  const onSubmit: SubmitHandler<NewsFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      let updatedContent = data.content;
      if (tempImages.length > 0 || (originalSlug && originalSlug !== data.slug)) {
        // Обновляем URL для временных изображений
        if (tempImages.length > 0) {
          tempImages.forEach((tempUrl) => {
            const newUrl = tempUrl.replace('/uploads/news/temp/', `/uploads/news/${data.slug}/`);
            updatedContent = updatedContent.replace(tempUrl, newUrl);
          });
          await axios.post('http://localhost:5000/api/posts/move-images', {
            oldSlug: 'temp',
            newSlug: data.slug,
          }, { headers: { Authorization: `Bearer ${token}` } });
          setTempImages([]);
        }
        // Обновляем URL, если slug изменился
        if (originalSlug && originalSlug !== data.slug) {
          updatedContent = updatedContent.replaceAll(`/uploads/news/${originalSlug}/`, `/uploads/news/${data.slug}/`);
          await axios.post('http://localhost:5000/api/posts/move-images', {
            oldSlug: originalSlug,
            newSlug: data.slug,
          }, { headers: { Authorization: `Bearer ${token}` } });
          setOriginalSlug(data.slug);
        }
        data.content = updatedContent;
      }

      await axios.patch(
        `http://localhost:5000/api/posts/news/${slug}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
          <textarea {...register('shortDescription')} className="w-full p-2 border rounded" placeholder="Введите краткое описание..." />
          {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Основное содержание</label>
          <div ref={quillRef} className="mb-4 bg-white" />
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
          <input {...register('slug')} className="w-full p-2 border rounded" placeholder="Автоматически генерируется..." />
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
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default NewsEdit;