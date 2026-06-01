'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    required,
    SaveButton,
    Toolbar,
    ListButton,
    TopToolbar,
    useCreate,
    useNotify,
    useRedirect,
} from 'react-admin';
import { Editor } from '@tinymce/tinymce-react';
import { useFormContext } from 'react-hook-form';
import { Card, Box, Typography } from '@mui/material';
import axios from 'axios';
import { transliterate } from '@/utils/transliterate';
import { createTinyMCEUploadHandler } from '@/utils/tinymceUploadHandler';

const ContentInput = ({ source, label }: { source: string; label: string }) => {
    const { setValue, watch } = useFormContext();
    const content = watch(source);
    const [tempImages, setTempImages] = useState<string[]>([]);

    const extractTempImages = (htmlContent: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const tempUrls: string[] = [];
        doc.querySelectorAll('img').forEach((img) => {
            const src = img.getAttribute('src');
            if (src && src.includes('/uploads/equipment/temp/') && !tempUrls.includes(src)) {
                tempUrls.push(src);
            }
        });
        return tempUrls;
    };

    const handleEditorChange = useCallback(
        (newContent: string) => {
            setValue(source, newContent, { shouldValidate: true, shouldDirty: true });
            setTempImages(extractTempImages(newContent));
        },
        [setValue, source]
    );

    useEffect(() => {
        setValue('tempImages', tempImages);
    }, [tempImages, setValue]);

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

const SlugInput = ({ source, label, ...rest }: { source: string; label: string; fullWidth?: boolean }) => {
    const { setValue, watch } = useFormContext();
    const title = watch('title');
    const slug = watch(source);
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (title && !isManual) setValue(source, transliterate(title));
    }, [title, slug, setValue, source, isManual]);

    return (
        <TextInput
            source={source}
            label={label}
            helperText="Автоматически генерируется из названия"
            onChange={() => setIsManual(true)}
            {...rest}
        />
    );
};

const EquipmentCreateToolbar = () => {
    const [create] = useCreate();
    const notify = useNotify();
    const redirect = useRedirect();
    const { handleSubmit } = useFormContext();

    const handleSave = handleSubmit(async (data) => {
        try {
            const tempImagesList = data.tempImages || [];
            let updatedContent = data.content;

            if (tempImagesList.length > 0) {
                tempImagesList.forEach((tempUrl: string) => {
                    const newUrl = tempUrl.replace('/uploads/equipment/temp/', `/uploads/equipment/${data.slug}/`);
                    updatedContent = updatedContent.replace(tempUrl, newUrl);
                });
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/move-images`,
                    { oldSlug: 'temp', newSlug: data.slug, entity: 'equipment' },
                    { withCredentials: true }
                );
                data.content = updatedContent;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { tempImages: _ti, ...equipmentData } = data;
            await create('equipment', { data: equipmentData });
            notify('Оборудование успешно создано');
            redirect('/admin#/equipment');
        } catch (error) {
            console.error('Error creating equipment:', error);
            notify('Ошибка при создании товара', { type: 'error' });
        }
    });

    return (
        <Toolbar>
            <SaveButton onClick={handleSave} />
        </Toolbar>
    );
};

export const EquipmentCreate = () => (
    <Create title="Создание товара" actions={<TopToolbar><ListButton /></TopToolbar>}>
        <Card className="p-6">
            <SimpleForm toolbar={<EquipmentCreateToolbar />}>
                <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                    <Typography variant="body2" color="text.secondary">
                        📷 Изображение товара можно загрузить после сохранения — в режиме редактирования.
                    </Typography>
                </Box>
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
                <BooleanInput source="isPublished" label="Опубликовать" defaultValue={false} />
                <TextInput source="metaTitle" label="Meta Title" fullWidth />
                <TextInput source="metaDescription" label="Meta Description" multiline rows={2} fullWidth />
            </SimpleForm>
        </Card>
    </Create>
);

export default EquipmentCreate;
