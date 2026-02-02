'use client';

import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';

interface CallbackFormData {
  name: string;
  phone: string;
}

export const useCallbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const submitCallback = async (data: CallbackFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/callback`, data);
      showNotification('С вами свяжется первый освободившийся специалист', 'success');
      setIsSubmitting(false);
      return true; // Indicate success
    } catch (error) {
      console.error('Error submitting callback form:', error);
      showNotification('Ошибка при отправке заявки. Попробуйте позже.', 'error');
      setIsSubmitting(false);
      return false; // Indicate failure
    }
  };

  return { isSubmitting, submitCallback };
};
