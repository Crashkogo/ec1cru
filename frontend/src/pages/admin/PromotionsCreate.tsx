import React, { useCallback, useEffect, useState } from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    DateTimeInput,
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
import { transliterate } from '../../utils/transliterate';
import { createTinyMCEUploadHandler } from '../../utils/tinymceUploadHandler';

const ContentInput = ({ source, label, ...props }: any) => {
    const { setValue, watch } = useFormContext();
    const content = watch(source);
    const [tempImages, setTempImages] = useState<string[]>([]);

    const extractTempImages = (htmlContent: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const images = doc.querySelectorAll('img');
        const tempImageUrls: string[] = [];

        images.forEach((img) => {
            const src = img.getAttribute('src');
            if (src && src.includes('/uploads/promotions/temp/') && !tempImageUrls.includes(src)) {
                tempImageUrls.push(src);
            }
        });

        return tempImageUrls;
    };

    const handleEditorChange = useCallback(
        (newContent: string) => {
            setValue(source, newContent, { shouldValidate: true });
            const tempUrls = extractTempImages(newContent);
            setTempImages(tempUrls);
        },
        [setValue, source]
    );

    // Сохраняем временные изображения в контексте формы
    useEffect(() => {
        setValue('tempImages', tempImages);
    }, [tempImages, setValue]);

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                {label}
            </Typography>
            <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                value={content || ''}
                onEditorChange={handleEditorChange}
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
                    images_upload_handler: createTinyMCEUploadHandler('promotions'),
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
        </Box>
    );
};

const SlugInput = ({ source, label, ...props }: any) => {
    const { setValue, watch } = useFormContext();
    const title = watch('title');
    const slug = watch(source);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    useEffect(() => {
        // Обновляем slug только если есть title и slug не был вручную отредактирован
        if (title && !isSlugManuallyEdited) {
            const generatedSlug = transliterate(title);
            setValue(source, generatedSlug);
        }
    }, [title, setValue, source, isSlugManuallyEdited]);

    const handleSlugChange = (value: string) => {
        setIsSlugManuallyEdited(true);
        setValue(source, value);
    };

    return (
        <TextInput
            source={source}
            label={label}
            helperText="Автоматически генерируется из названия, но можно изменить"
            onChange={handleSlugChange}
            {...props}
        />
    );
};

const PromotionsCreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const PromotionsCreateToolbar = () => {
    const [create] = useCreate();
    const notify = useNotify();
    const redirect = useRedirect();
    const { handleSubmit, watch } = useFormContext();

    const handleSave = handleSubmit(async (data) => {
        try {
            const tempImages = data.tempImages || [];
            let updatedContent = data.content;

            // Если есть временные изображения, перемещаем их
            if (tempImages.length > 0) {
                // Обновляем контент, заменяя пути к изображениям
                tempImages.forEach((tempUrl: string) => {
                    const newUrl = tempUrl.replace('/uploads/promotions/temp/', `/uploads/promotions/${data.slug}/`);
                    updatedContent = updatedContent.replace(tempUrl, newUrl);
                });

                // Перемещаем изображения на сервере
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/posts/move-images`,
                    {
                        oldSlug: 'temp',
                        newSlug: data.slug,
                        entity: 'promotions',
                    },
                    { withCredentials: true }
                );

                data.content = updatedContent;
            }

            // Удаляем tempImages из данных перед отправкой
            const { tempImages: _, ...promotionData } = data;

            await create('promotions', { data: promotionData });
            notify('Акция успешно создана');
            redirect('/admin/promotions');
        } catch (error) {
            console.error('Error creating promotion:', error);
            notify('Ошибка при создании акции', { type: 'error' });
        }
    });

    return (
        <Toolbar>
            <SaveButton onClick={handleSave} />
        </Toolbar>
    );
};

export const PromotionsCreate = () => (
    <Create title="Создание акции" actions={<PromotionsCreateActions />}>
        <Card className="p-6">
            <SimpleForm toolbar={<PromotionsCreateToolbar />}>
                <TextInput
                    source="title"
                    label="Название акции"
                    validate={required()}
                    fullWidth
                />

                <TextInput
                    source="shortDescription"
                    label="Краткое описание"
                    validate={required()}
                    multiline
                    rows={3}
                    fullWidth
                />

                <ContentInput
                    source="content"
                    label="Подробное описание"
                    validate={required()}
                />

                <DateTimeInput
                    source="startDate"
                    label="Дата и время начала акции"
                    validate={required()}
                />

                <DateTimeInput
                    source="endDate"
                    label="Дата и время окончания акции"
                    validate={required()}
                />

                <SlugInput
                    source="slug"
                    label="Slug"
                    validate={required()}
                    fullWidth
                />

                <BooleanInput
                    source="isPublished"
                    label="Опубликовать"
                    defaultValue={false}
                />

                <BooleanInput
                    source="isPinned"
                    label="Закреплён"
                    defaultValue={false}
                />

                <DateTimeInput
                    source="pinnedUntil"
                    label="Дата закрепа (конец дня)"
                    helperText="Пост будет закреплён до конца этого дня (23:59:59)"
                />

                <TextInput
                    source="metaTitle"
                    label="Meta Title"
                    fullWidth
                />

                <TextInput
                    source="metaDescription"
                    label="Meta Description"
                    multiline
                    rows={3}
                    fullWidth
                />
            </SimpleForm>
        </Card>
    </Create>
); 