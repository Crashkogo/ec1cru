'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { transliterate } from '@/utils/transliterate';
import { createTinyMCEUploadHandler } from '@/utils/tinymceUploadHandler';

interface ContentInputProps {
    source: string;
    label: string;
}

const ContentInput = ({ source, label }: ContentInputProps) => {
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
            if (src && src.includes('/uploads/company-life/temp/') && !tempImageUrls.includes(src)) {
                tempImageUrls.push(src);
            }
        });

        return tempImageUrls;
    };

    const handleEditorChange = useCallback(
        (newContent: string) => {
            setValue(source, newContent, { shouldValidate: true, shouldDirty: true });
            const tempUrls = extractTempImages(newContent);
            setTempImages(tempUrls);
        },
        [setValue, source]
    );

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
                    images_upload_handler: createTinyMCEUploadHandler('company-life'),
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
        </Box>
    );
};

interface SlugInputProps {
    source: string;
    label: string;
    fullWidth?: boolean;
}

const SlugInput = ({ source, label, ...rest }: SlugInputProps) => {
    const { setValue, watch } = useFormContext();
    const title = watch('title');
    const slug = watch(source);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    useEffect(() => {
        if (title && !isSlugManuallyEdited ) {
            const generatedSlug = transliterate(title);
            setValue(source, generatedSlug);
        }
    }, [title, slug, setValue, source, isSlugManuallyEdited]);

    const handleSlugChange = (value: string) => {
        setIsSlugManuallyEdited(true);
        setValue(source, value);
    };

    return (
        <TextInput
            source={source}
            label={label}
            helperText="Автоматически генерируется из заголовка, но можно изменить"
            onChange={handleSlugChange}
            {...rest}
        />
    );
};

const CompanyLifeCreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const CompanyLifeCreateToolbar = () => {
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
                    const newUrl = tempUrl.replace('/uploads/company-life/temp/', `/uploads/company-life/${data.slug}/`);
                    updatedContent = updatedContent.replace(tempUrl, newUrl);
                });

                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/move-images`,
                    {
                        oldSlug: 'temp',
                        newSlug: data.slug,
                        entity: 'company-life',
                    },
                    { withCredentials: true }
                );

                data.content = updatedContent;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { tempImages: _tempImages, ...companyLifeData } = data;

            await create('company-life', { data: companyLifeData });
            notify('Пост успешно создан');
            redirect('/admin#/company-life');
        } catch (error) {
            console.error('Error creating company life post:', error);
            notify('Ошибка при создании поста', { type: 'error' });
        }
    });

    return (
        <Toolbar>
            <SaveButton onClick={handleSave} />
        </Toolbar>
    );
};

export const CompanyLifeCreate = () => (
    <Create title="Создание поста о жизни компании" actions={<CompanyLifeCreateActions />}>
        <Card className="p-6">
            <SimpleForm toolbar={<CompanyLifeCreateToolbar />}>
                <TextInput
                    source="title"
                    label="Заголовок"
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
                    label="Основное содержание"
                />

                <SlugInput
                    source="slug"
                    label="Slug"
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
