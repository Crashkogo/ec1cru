import React, { useCallback, useEffect, useState } from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
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

const RichTextInput = ({ source, label, ...props }: any) => {
    const { setValue, watch } = useFormContext();
    const content = watch(source);

    const handleEditorChange = useCallback(
        (newContent: string) => {
            setValue(source, newContent, { shouldValidate: true });
        },
        [setValue, source]
    );

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
                    images_upload_url: `${import.meta.env.VITE_API_URL}/api/posts/upload-image?entity=newsletters`,
                    images_upload_base_path: `${import.meta.env.VITE_API_URL}`,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
        </Box>
    );
};

const NewslettersCreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const NewslettersCreateToolbar = () => {
    const [create] = useCreate();
    const notify = useNotify();
    const redirect = useRedirect();
    const { handleSubmit } = useFormContext();

    const handleSave = handleSubmit(async (data) => {
        try {
            await create('newsletters', { data });
            notify('Шаблон рассылки успешно создан');
            redirect('/admin/newsletters');
        } catch (error) {
            console.error('Error creating newsletter:', error);
            notify('Ошибка при создании шаблона рассылки', { type: 'error' });
        }
    });

    return (
        <Toolbar>
            <SaveButton onClick={handleSave} />
        </Toolbar>
    );
};

export const NewslettersCreate = () => (
    <Create title="Создание шаблона рассылки" actions={<NewslettersCreateActions />}>
        <Card className="p-6">
            <SimpleForm toolbar={<NewslettersCreateToolbar />}>
                <TextInput
                    source="title"
                    label="Название шаблона"
                    validate={[required()]}
                    fullWidth
                />
                <RichTextInput
                    source="htmlContent"
                    label="HTML-контент письма"
                    validate={[required()]}
                />
            </SimpleForm>
        </Card>
    </Create>
); 