'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    BooleanInput,
    required,
    SaveButton,
    Toolbar,
    ListButton,
    TopToolbar,
    useRecordContext,
    useNotify,
    useRefresh,
} from 'react-admin';
import { Editor } from '@tinymce/tinymce-react';
import { useFormContext } from 'react-hook-form';
import { Card, Box, Typography, Button, CircularProgress } from '@mui/material';
import { CameraIcon } from '@heroicons/react/24/outline';
import { transliterate } from '@/utils/transliterate';
import { createTinyMCEUploadHandler } from '@/utils/tinymceUploadHandler';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

const EquipmentImageUpload = () => {
    const record  = useRecordContext();
    const notify  = useNotify();
    const refresh = useRefresh();
    const fileRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    if (!record) return null;

    const imageSrc = record.imageUrl ? `${apiUrl}${record.imageUrl}` : undefined;

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const form = new FormData();
            form.append('image', file);
            const res = await fetch(`${apiUrl}/api/admin/equipment/${record.id}/image`, {
                method: 'POST',
                body: form,
                credentials: 'include',
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Ошибка загрузки');
            }
            notify('Изображение успешно загружено', { type: 'success' });
            refresh();
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : 'Ошибка при загрузке', { type: 'error' });
        } finally {
            setLoading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
                Главное изображение товара
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Превью */}
                <Box
                    sx={{
                        width: 120, height: 90, borderRadius: 2, overflow: 'hidden',
                        border: '1px solid #e5e7eb', flexShrink: 0, bgcolor: '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Typography variant="caption" color="text.secondary" align="center" sx={{ px: 1 }}>
                            Нет фото
                        </Typography>
                    )}
                </Box>
                {/* Кнопка */}
                <Box>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={loading ? <CircularProgress size={16} /> : <CameraIcon style={{ width: 16, height: 16 }} />}
                        onClick={() => fileRef.current?.click()}
                        disabled={loading}
                        sx={{ mb: 0.5 }}
                    >
                        {loading ? 'Загрузка...' : (imageSrc ? 'Заменить изображение' : 'Загрузить изображение')}
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block">
                        JPG, PNG, WEBP · до 5 МБ
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const ContentInput = ({ source, label }: { source: string; label: string }) => {
    const { setValue, watch } = useFormContext();
    const content = watch(source);

    const handleEditorChange = useCallback(
        (newContent: string) => {
            setValue(source, newContent, { shouldValidate: true, shouldDirty: true });
        },
        [setValue, source]
    );

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>{label}</Typography>
            <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                value={content || ''}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
                    toolbar: 'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | code | help',
                    base_url: '/tinymce',
                    suffix: '.min',
                    image_uploadtab: true,
                    images_upload_handler: createTinyMCEUploadHandler('equipment'),
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
        </Box>
    );
};

const SlugInput = ({ source, label, ...props }: { source: string; label: string; fullWidth?: boolean }) => {
    const { setValue, watch } = useFormContext();
    const title = watch('title');
    const slug = watch(source);
    const [initialSlug] = useState(slug);
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (initialSlug && title) {
            if (initialSlug !== transliterate(title)) setIsManual(true);
        }
    }, [initialSlug, title]);

    useEffect(() => {
        if (title && !isManual && (!slug || slug === '')) {
            setValue(source, transliterate(title));
        }
    }, [title, slug, setValue, source, isManual]);

    return (
        <TextInput
            source={source}
            label={label}
            helperText="Изменение slug может нарушить существующие ссылки"
            onChange={() => setIsManual(true)}
            validate={required()}
            {...props}
        />
    );
};

export const EquipmentEdit = () => (
    <Edit title="Редактирование товара" actions={<TopToolbar><ListButton /></TopToolbar>}>
        <Card className="p-6">
            <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
                <EquipmentImageUpload />
                <TextInput source="title" label="Название" validate={required()} fullWidth />
                <TextInput source="shortDescription" label="Краткое описание" validate={required()} multiline rows={3} fullWidth />
                <TextInput
                    source="price"
                    label="Цена (₽)"
                    helperText="Оставьте пустым, если цена договорная"
                    fullWidth
                />
                <ContentInput source="content" label="Полное описание" />
                <SlugInput source="slug" label="Slug" fullWidth />
                <BooleanInput source="isPublished" label="Опубликовать" />
                <TextInput source="metaTitle" label="Meta Title" fullWidth />
                <TextInput source="metaDescription" label="Meta Description" multiline rows={2} fullWidth />
            </SimpleForm>
        </Card>
    </Edit>
);

export default EquipmentEdit;
