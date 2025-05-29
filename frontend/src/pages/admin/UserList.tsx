import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

export const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Имя" />
      <TextField source="role" label="Роль" />
      <EditButton label="Редактировать" />
      <DeleteButton label="Удалить" />
    </Datagrid>
  </List>
);