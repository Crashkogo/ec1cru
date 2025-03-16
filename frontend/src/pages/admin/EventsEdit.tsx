/* import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import Quill from '../../quill-config';
import 'quill/dist/quill.snow.css';
import './quill-custom.css';

// Схема валидации для мероприятий
const eventsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  content: z.string().min(1, 'Content is required'),
  isPublished: z.boolean(),
  status: z.boolean(),
  ours: z.boolean(),
  slug: z.string().min(1, 'Slug is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
});

type EventsFormInputs = z.infer<typeof eventsSchema>;

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
  const [tempImages, setTempImages] = useState<string[]>([]);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventsFormInputs>({
    resolver: zodResolver(eventsSchema),
    defaultValues: {
      isPublished: false,
      content: '',
      status: false,
      ours: true,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const title = watch('title');
  const content = watch('content');

  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          [{ align: ['', 'center', 'right', 'justify'] }],
          [{ float: ['', 'left', 'right'] }],
          ['clean'],
        ],
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    },
    formats: [
      'header', 'bold', 'italic', 'underline', 'strike', 'list',
      'link', 'image', 'blockquote', 'code-block', 'align', 'float', 'margin', 'display',
    ],
  });

  // Загрузка данных мероприятия
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/posts/events/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event = response.data;
        setValue('title', event.title);
        setValue('shortDescription', event.shortDescription);
        setValue('content', event.content);
        setValue('isPublished', event.isPublished);
        setValue('status', event.status);
        setValue('ours', event.ours);
        setValue('slug', event.slug);
        setValue('metaTitle', event.metaTitle);
        setValue('metaDescription', event.metaDescription);
        setValue('startDate', new Date(event.startDate).toISOString().split('T')[0]);
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Ошибка при загрузке мероприятия');
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug, setValue]);

  const insertImageToEditor = useCallback((url: string) => {
    if (quill) {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
      const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, 'image', fullUrl);
      console.log('Image inserted:', fullUrl);
      if (fullUrl.includes('/uploads/events/temp/')) {
        setTempImages((prev) => [...prev, fullUrl]);
      }
    }
  }, [quill]);

  const uploadImageToServer = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', watch('slug') || 'temp');
    formData.append('entity', 'events');

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
  }, [watch]);

  const selectLocalImage = useCallback(() => {
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
  }, [uploadImageToServer, insertImageToEditor]);

  const handleFloat = useCallback((value: string) => {
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        const [leaf] = quill.getLeaf(range.index);
        const domNode = leaf?.domNode;
        if (domNode instanceof HTMLElement && domNode.tagName === 'IMG') {
          quill.formatText(range.index, 1, 'float', value || '', 'user');
          quill.formatText(range.index, 1, 'margin', value ? '0 1em 1em 0' : '0', 'user');
          quill.formatText(range.index, 1, 'display', 'inline', 'user');
          setValue('content', quill.root.innerHTML, { shouldValidate: true });
        }
      }
    }
  }, [quill, setValue]);

  useEffect(() => {
    if (quill && toolbarRef.current) {
      console.log('Quill initialized');
      const imageButton = toolbarRef.current.querySelector('.ql-image');
      if (imageButton) {
        imageButton.addEventListener('click', selectLocalImage);
      }

      const floatButtons = toolbarRef.current.querySelectorAll('.ql-float');
      floatButtons.forEach((button) => {
        const value = button.getAttribute('value') || '';
        button.addEventListener('click', () => handleFloat(value));
      });

      quill.on('text-change', () => {
        setValue('content', quill.root.innerHTML, { shouldValidate: true });
      });

      if (content && quill.root.innerHTML !== content) {
        quill.root.innerHTML = content;
      }

      return () => {
        if (imageButton) {
          imageButton.removeEventListener('click', selectLocalImage);
        }
        floatButtons.forEach((button) => {
          const value = button.getAttribute('value') || '';
          button.removeEventListener('click', () => handleFloat(value));
        });
      };
    }
  }, [quill, content, setValue, selectLocalImage, handleFloat]);

  useEffect(() => {
    if (title) {
      const slug = transliterate(title);
      setValue('slug', slug);
    }
  }, [title, setValue]);

  const onSubmit: SubmitHandler<EventsFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      let updatedContent = data.content;
      if (tempImages.length > 0) {
        tempImages.forEach((tempUrl) => {
          const newUrl = tempUrl.replace('/uploads/events/temp/', `/uploads/events/${data.slug}/`);
          updatedContent = updatedContent.replace(tempUrl, newUrl);
        });
        await axios.post('http://localhost:5000/api/posts/move-images', {
          oldSlug: 'temp',
          newSlug: data.slug,
        }, { headers: { Authorization: `Bearer ${token}` } });
        setTempImages([]);
        data.content = updatedContent;
      }

      await axios.patch(`http://localhost:5000/api/posts/events/${slug}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Ошибка при обновлении мероприятия: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

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
          <textarea {...register('shortDescription')} className="w-full p-2 border rounded" placeholder="Введите краткое описание..." />
          {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Основное содержание</label>
          <div ref={quillRef} className="mb-4 bg-white">
            <div ref={toolbarRef} className="ql-toolbar ql-snow" />
            <div className="ql-container ql-snow">
              <div className="ql-editor" />
            </div>
          </div>
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Дата начала</label>
          <input type="date" {...register('startDate')} className="w-full p-2 border rounded" />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
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
            Прошедшее
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center font-medium">
            <input type="checkbox" {...register('ours')} className="mr-2" />
            Наше мероприятие
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
          Обновить мероприятие
        </button>
      </form>
    </div>
  );
};

export default EventsEdit; */