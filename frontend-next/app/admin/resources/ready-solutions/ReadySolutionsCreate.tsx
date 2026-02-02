'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    SelectInput,
    NumberInput,
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
import { Card, Box, Typography, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { transliterate } from '@/utils/transliterate';
import { createTinyMCEUploadHandler } from '@/utils/tinymceUploadHandler';

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Program {
    id: number;
    fullName: string;
    shortName: string;
}

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
            if (src && src.includes('/uploads/ready-solutions/temp/') && !tempImageUrls.includes(src)) {
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
                    images_upload_handler: createTinyMCEUploadHandler('ready-solutions'),
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
            helperText="Автоматически генерируется из заголовка, но можно изменить"
            onChange={handleSlugChange}
            {...props}
        />
    );
};

const ImageGalleryInput = ({ source, label, ...props }: any) => {
    const { setValue, watch } = useFormContext();
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const uploadedImages: string[] = [];

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post(
                    `${SERVER_BASE_URL}/api/posts/upload-gallery-image`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true
                    }
                );
                // Сохраняем только относительный путь
                uploadedImages.push(response.data.url);
            } catch (error) {
                console.error('Error uploading gallery image:', error);
            }
        }

        const newImages = [...galleryImages, ...uploadedImages];
        setGalleryImages(newImages);
        setValue(source, newImages);
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = galleryImages.filter((_, index) => index !== indexToRemove);
        setGalleryImages(newImages);
        setValue(source, newImages);
    };

    useEffect(() => {
        setValue('galleryImages', galleryImages);
    }, [galleryImages, setValue]);

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                {label}
            </Typography>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryImageUpload}
                style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginBottom: '8px'
                }}
            />
            {galleryImages.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {galleryImages.map((img, idx) => (
                        <Box key={idx} sx={{ position: 'relative' }}>
                            <img
                                src={img.startsWith('http') ? img : `${SERVER_BASE_URL}${img}`}
                                alt="Preview"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                                onError={(e) => {
                                    console.error('Error loading image:', img);
                                    // Пробуем загрузить без домена
                                    const target = e.target as HTMLImageElement;
                                    if (target.src.includes('http')) {
                                        const url = new URL(target.src);
                                        target.src = `${SERVER_BASE_URL}${url.pathname}`;
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                ×
                            </button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

const ProgramCheckboxes = ({ source, label, ...props }: any) => {
    const { setValue } = useFormContext();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);

    useEffect(() => {
        axios
            .get(`${SERVER_BASE_URL}/api/posts/admin/programs`, {
                withCredentials: true
            })
            .then((response) => setPrograms(response.data))
            .catch((error) => console.error('Error fetching programs:', error));
    }, []);

    const handleProgramChange = (programId: number, checked: boolean) => {
        const newSelected = checked
            ? [...selectedPrograms, programId]
            : selectedPrograms.filter(id => id !== programId);

        setSelectedPrograms(newSelected);
        setValue(source, newSelected);
    };

    useEffect(() => {
        setValue('programIds', selectedPrograms);
    }, [selectedPrograms, setValue]);

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                {label}
            </Typography>
            <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, maxHeight: 200, overflow: 'auto' }}>
                <FormGroup>
                    {programs.map((program) => (
                        <FormControlLabel
                            key={program.id}
                            control={
                                <Checkbox
                                    checked={selectedPrograms.includes(program.id)}
                                    onChange={(e) => handleProgramChange(program.id, e.target.checked)}
                                />
                            }
                            label={`${program.fullName} (${program.shortName})`}
                        />
                    ))}
                </FormGroup>
            </Box>
        </Box>
    );
};

const ReadySolutionsCreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const ReadySolutionsCreateToolbar = () => {
    const [create] = useCreate();
    const notify = useNotify();
    const redirect = useRedirect();
    const { handleSubmit, watch } = useFormContext();

    const handleSave = handleSubmit(async (data) => {
        try {
            const tempImages = data.tempImages || [];
            const galleryImages = data.galleryImages || [];
            let updatedContent = data.fullDescription;

            // Если есть временные изображения в TinyMCE, перемещаем их
            if (tempImages.length > 0) {
                // Обновляем контент, заменяя пути к изображениям
                tempImages.forEach((tempUrl: string) => {
                    const newUrl = tempUrl.replace('/uploads/ready-solutions/temp/', `/uploads/ready-solutions/${data.slug}/`);
                    updatedContent = updatedContent.replace(tempUrl, newUrl);
                });

                // Перемещаем изображения на сервере
                await axios.post(
                    `${SERVER_BASE_URL}/api/posts/move-images`,
                    {
                        oldSlug: 'temp',
                        newSlug: data.slug,
                        entity: 'ready-solutions',
                    },
                    { withCredentials: true }
                );

                data.fullDescription = updatedContent;
            }

            // Обработка изображений галереи
            let movedGalleryImages = galleryImages;
            if (galleryImages.length > 0) {
                const response = await axios.post(
                    `${SERVER_BASE_URL}/api/posts/move-gallery-images`,
                    { images: galleryImages, slug: data.slug },
                    { withCredentials: true }
                );
                movedGalleryImages = response.data.images;
            }

            // Удаляем временные поля и подготавливаем данные для отправки
            const { tempImages: _, galleryImages: __, ...solutionData } = data;
            solutionData.images = movedGalleryImages;
            solutionData.price = solutionData.price ? parseFloat(solutionData.price) : null;

            await create('ready-solutions', { data: solutionData });
            notify('Готовое решение успешно создано');
            redirect('/admin#/ready-solutions');
        } catch (error) {
            console.error('Error creating solution:', error);
            notify('Ошибка при создании решения', { type: 'error' });
        }
    });

    return (
        <Toolbar>
            <SaveButton onClick={handleSave} />
        </Toolbar>
    );
};

export const ReadySolutionsCreate = () => (
    <Create title="Создание готового решения" actions={<ReadySolutionsCreateActions />}>
        <Card className="p-6">
            <SimpleForm toolbar={<ReadySolutionsCreateToolbar />}>
                <SelectInput
                    source="type"
                    label="Тип решения"
                    choices={[
                        { id: 'PROCESSING', name: 'Обработка' },
                        { id: 'PRINT_FORM', name: 'Печатная форма' },
                        { id: 'REPORT', name: 'Отчёт' },
                    ]}
                    validate={required()}
                    defaultValue="PROCESSING"
                    fullWidth
                />

                <BooleanInput source="freshSupport" label="Поддержка 1C:Fresh" />

                <TextInput
                    source="title"
                    label="Название"
                    validate={required()}
                    fullWidth
                />

                <SlugInput
                    source="slug"
                    label="Slug"
                    validate={required()}
                    fullWidth
                />

                <TextInput
                    source="shortDescription"
                    label="Краткое описание"
                    validate={required()}
                    fullWidth
                    multiline
                    rows={3}
                />

                <ContentInput
                    source="fullDescription"
                    label="Полное описание"
                    validate={required()}
                />

                <NumberInput
                    source="price"
                    label="Цена (оставьте пустым для 'Цена по запросу')"
                    min={0}
                    step={0.01}
                />

                <ProgramCheckboxes
                    source="programIds"
                    label="Программы"
                />

                <ImageGalleryInput
                    source="images"
                    label="Изображения для галереи"
                />

                <BooleanInput source="isPublished" label="Опубликовать" />

                <TextInput source="metaTitle" label="Meta Title" fullWidth />

                <TextInput
                    source="metaDescription"
                    label="Meta Description"
                    fullWidth
                    multiline
                    rows={3}
                />
            </SimpleForm>
        </Card>
    </Create>
);

export default ReadySolutionsCreate;
