// src/pages/admin/Settings.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from 'react-admin';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';

// Схема валидации для формы создания/редактирования программы
const programSchema = z.object({
  fullName: z.string().min(1, 'Полное название обязательно'),
  shortName: z.string().min(1, 'Краткое название обязательно'),
});

// Компонент для отображения списка программ
export const ProgramList = () => (
  <List title="Настройки программ" className="bg-white rounded-lg shadow-md p-6">
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" className="text-darkGray" />
      <TextField source="fullName" label="Полное название" className="text-darkGray" />
      <TextField source="shortName" label="Краткое название" className="text-darkGray" />
      <DateField source="createdAt" label="Дата создания" locales="ru-RU" className="text-darkGray" />
    </Datagrid>
  </List>
);

// Компонент для создания новой программы
export const ProgramCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // Явно указываем тип FieldValues для совместимости с react-hook-form
  const validateProgram = zodResolver<FieldValues>(programSchema);

  const onSuccess = () => {
    notify('Программа успешно создана', { type: 'success' });
    redirect('/programs');
  };

  return (
    <Create
      title="Добавить программу"
      mutationOptions={{ onSuccess }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <SimpleForm resolver={validateProgram} mode="onBlur">
        <TextInput
          source="fullName"
          label="Полное название"
          placeholder="Например, 1С:Бухгалтерия предприятия"
          className="w-full p-2 border border-grayAccent rounded focus:outline-none focus:ring-2 focus:ring-primaryBlue"
          validate={(value: string) => (value ? undefined : 'Полное название обязательно')}
        />
        <TextInput
          source="shortName"
          label="Краткое название"
          placeholder="Например, БП"
          className="w-full p-2 border border-grayAccent rounded focus:outline-none focus:ring-2 focus:ring-primaryBlue"
          validate={(value: string) => (value ? undefined : 'Краткое название обязательно')}
        />
        <button
          type="submit"
          className="w-full p-2 bg-primaryBlue text-textBlue rounded hover:bg-hoverBlue transition-all duration-200"
        >
          Добавить программу
        </button>
      </SimpleForm>
    </Create>
  );
};

// Компонент для редактирования программы
export const ProgramEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // Явно указываем тип FieldValues для совместимости с react-hook-form
  const validateProgram = zodResolver<FieldValues>(programSchema);

  const onSuccess = () => {
    notify('Программа успешно обновлена', { type: 'success' });
    redirect('/programs');
  };

  return (
    <Edit
      title="Редактировать программу"
      mutationOptions={{ onSuccess }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <SimpleForm resolver={validateProgram} mode="onBlur">
        <TextInput
          source="fullName"
          label="Полное название"
          placeholder="Например, 1С:Бухгалтерия предприятия"
          className="w-full p-2 border border-grayAccent rounded focus:outline-none focus:ring-2 focus:ring-primaryBlue"
          validate={(value: string) => (value ? undefined : 'Полное название обязательно')}
        />
        <TextInput
          source="shortName"
          label="Краткое название"
          placeholder="Например, БП"
          className="w-full p-2 border border-grayAccent rounded focus:outline-none focus:ring-2 focus:ring-primaryBlue"
          validate={(value: string) => (value ? undefined : 'Краткое название обязательно')}
        />
        <button
          type="submit"
          className="w-full p-2 bg-primaryBlue text-textBlue rounded hover:bg-hoverBlue transition-all duration-200"
        >
          Сохранить изменения
        </button>
      </SimpleForm>
    </Edit>
  );
};