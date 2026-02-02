'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TariffColumn, TariffRow, ColumnType } from '@/types/tariff';

const COLUMN_TYPES: ColumnType[] = ['text', 'number', 'price', 'range', 'boolean', 'mixed'];

export const TariffTableEditor: React.FC = () => {
  const { setValue, watch } = useFormContext();

  const [columns, setColumns] = useState<TariffColumn[]>(
    watch('columns') || [{ id: 'col1', label: 'Колонка 1', type: 'text', align: 'center' }]
  );

  const [rows, setRows] = useState<TariffRow[]>(
    watch('rows') || [{ id: 'row1', col1: '' }]
  );

  // Синхронизация с формой
  useEffect(() => {
    setValue('columns', columns, { shouldDirty: true, shouldValidate: true });
  }, [columns, setValue]);

  useEffect(() => {
    setValue('rows', rows, { shouldDirty: true, shouldValidate: true });
  }, [rows, setValue]);

  // Управление колонками
  const addColumn = () => {
    const newColId = `col${columns.length + 1}`;
    setColumns([...columns, {
      id: newColId,
      label: `Колонка ${columns.length + 1}`,
      type: 'text',
      align: 'center'
    }]);

    // Добавить пустые ячейки в существующие строки
    setRows(rows.map(row => ({ ...row, [newColId]: '' })));
  };

  const removeColumn = (colId: string) => {
    if (columns.length === 1) {
      alert('Должна быть хотя бы одна колонка');
      return;
    }

    setColumns(columns.filter(col => col.id !== colId));
    setRows(rows.map(row => {
      const { [colId]: _, ...rest } = row;
      return rest as TariffRow;
    }));
  };

  const updateColumn = (colId: string, field: keyof TariffColumn, value: any) => {
    setColumns(columns.map(col =>
      col.id === colId ? { ...col, [field]: value } : col
    ));
  };

  // Управление строками
  const addRow = () => {
    const newRowId = `row${rows.length + 1}`;
    const newRow: TariffRow = { id: newRowId };
    columns.forEach(col => {
      newRow[col.id] = '';
    });
    setRows([...rows, newRow]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length === 1) {
      alert('Должна быть хотя бы одна строка');
      return;
    }
    setRows(rows.filter(row => row.id !== rowId));
  };

  const updateCell = (rowId: string, colId: string, value: string) => {
    setRows(rows.map(row =>
      row.id === rowId ? { ...row, [colId]: value } : row
    ));
  };

  const moveRow = (rowId: string, direction: 'up' | 'down') => {
    const index = rows.findIndex(r => r.id === rowId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === rows.length - 1)) {
      return;
    }

    const newRows = [...rows];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];
    setRows(newRows);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Редактор таблицы тарифа
      </Typography>

      {/* Управление колонками */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Настройка колонок
        </Typography>

        {columns.map((column, index) => (
          <Box key={column.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <TextField
              label="Заголовок"
              value={column.label}
              onChange={(e) => updateColumn(column.id, 'label', e.target.value)}
              size="small"
              sx={{ flex: 2 }}
            />

            <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
              <InputLabel>Тип</InputLabel>
              <Select
                value={column.type}
                label="Тип"
                onChange={(e) => updateColumn(column.id, 'type', e.target.value)}
              >
                {COLUMN_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
              <InputLabel>Выравнивание</InputLabel>
              <Select
                value={column.align || 'center'}
                label="Выравнивание"
                onChange={(e) => updateColumn(column.id, 'align', e.target.value)}
              >
                <MenuItem value="left">Слева</MenuItem>
                <MenuItem value="center">По центру</MenuItem>
                <MenuItem value="right">Справа</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              color="error"
              onClick={() => removeColumn(column.id)}
              disabled={columns.length === 1}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addColumn}
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
        >
          Добавить колонку
        </Button>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* Таблица с данными */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Данные таблицы
        </Typography>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 120, fontWeight: 600 }}>Действия</TableCell>
                {columns.map(col => (
                  <TableCell key={col.id} align={col.align || 'center'} sx={{ fontWeight: 600 }}>
                    {col.label}
                    <Typography variant="caption" display="block" color="text.secondary">
                      ({col.type})
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => moveRow(row.id, 'up')}
                        disabled={rowIndex === 0}
                        title="Переместить вверх"
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => moveRow(row.id, 'down')}
                        disabled={rowIndex === rows.length - 1}
                        title="Переместить вниз"
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1}
                        title="Удалить строку"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  {columns.map(col => (
                    <TableCell key={col.id} align={col.align || 'center'}>
                      <TextField
                        value={row[col.id] || ''}
                        onChange={(e) => updateCell(row.id, col.id, e.target.value)}
                        size="small"
                        fullWidth
                        placeholder={col.type === 'boolean' ? '+/-' : col.type}
                        variant="standard"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          startIcon={<AddIcon />}
          onClick={addRow}
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
        >
          Добавить строку
        </Button>
      </Paper>
    </Box>
  );
};
