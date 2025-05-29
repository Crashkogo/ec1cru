import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import UserFormToolbar from './UserFormToolbar';

export const UserCreate = () => (
  <Create>
    <SimpleForm toolbar={<UserFormToolbar />}>
      <TextInput source="name" label="Имя" />
      <TextInput source="password" type="password" label="Пароль" />
      <SelectInput
        source="role"
        label="Роль"
        choices={[
          { id: 'ADMIN', name: 'Администратор' },
          { id: 'MODERATOR', name: 'Модератор' },
          { id: 'EVENTORG', name: 'Организатор событий' },
          { id: 'CLINE', name: 'Клиент' },
          { id: 'ITS', name: 'ИТC-сектор' },
          { id: 'DEVDEP', name: 'Разработчик' },
        ]}
      />
    </SimpleForm>
  </Create>
);