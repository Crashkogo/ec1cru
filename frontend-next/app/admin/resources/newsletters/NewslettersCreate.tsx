'use client';

import { useCallback } from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    required,
    SaveButton,
    Toolbar,
    ListButton,
    TopToolbar,
} from 'react-admin';
import { Editor } from '@tinymce/tinymce-react';
import { useFormContext } from 'react-hook-form';
import { Card, Box, Typography } from '@mui/material';
import { createTinyMCEUploadHandler } from '@/utils/tinymceUploadHandler';

const RichTextInput = ({ source, label, ...props }: any) => {
    const { setValue, watch } = useFormContext();
    const content = watch(source);

    const handleEditorChange = useCallback(
        (newContent: string) => {
            setValue(source, newContent, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            });
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
                    images_upload_handler: createTinyMCEUploadHandler('newsletters'),
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

const NewslettersCreateToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

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
