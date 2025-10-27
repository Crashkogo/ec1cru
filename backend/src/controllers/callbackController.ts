import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { EMAIL_CALL_OUT, EMAIL_PASS_OUT, EMAIL_CALL_IN } from '../config';

export const sendCallback = async (req: Request, res: Response) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Имя и телефон обязательны для заполнения' });
  }

  if (!EMAIL_CALL_OUT || !EMAIL_PASS_OUT || !EMAIL_CALL_IN) {
    console.error('Переменные окружения для отправки почты не настроены');
    return res.status(500).json({ message: 'Ошибка сервера: сервис временно недоступен' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.timeweb.ru',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL_CALL_OUT,
      pass: EMAIL_PASS_OUT,
    },
  });

  const mailOptions = {
    from: `"Заявки с сайта" <${EMAIL_CALL_OUT}>`,
    to: EMAIL_CALL_IN,
    subject: 'Заявка с сайта',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2 style="color: #1D4ED8;">Новая заявка на обратный звонок</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
        <p style="font-size: 12px; color: #64748B;">Это письмо было отправлено автоматически с вашего сайта.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Заявка успешно отправлена' });
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    res.status(500).json({ message: 'Произошла ошибка при отправке заявки' });
  }
};
