// БЕЗОПАСНОСТЬ: Кастомный обработчик загрузки изображений для TinyMCE
// Использует credentials: 'include' для отправки HttpOnly cookies с JWT токеном

/**
 * Создает обработчик загрузки изображений для TinyMCE
 * @param entity - тип сущности (news, events, etc.)
 * @returns Promise-based upload handler
 */
export const createTinyMCEUploadHandler = (entity: string) => {
  return (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      const xhr = new XMLHttpRequest();

      // ВАЖНО: withCredentials = true для отправки HttpOnly cookies
      xhr.withCredentials = true;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject('HTTP Error: ' + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location !== 'string') {
          reject('Invalid JSON: ' + xhr.responseText);
          return;
        }

        // Возвращаем полный URL для корректного отображения в TinyMCE
        const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${json.location}`;
        resolve(fullUrl);
      };

      xhr.onerror = () => {
        reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
      };

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/posts/upload-image?entity=${entity}`);
      xhr.send(formData);
    });
  };
};
