export type ColumnType = 'text' | 'number' | 'price' | 'range' | 'boolean' | 'mixed';

export interface TariffColumn {
  id: string;           // "col1", "col2", ...
  label: string;        // "Наименование", "Кол-во ПК"
  type: ColumnType;
  align?: 'left' | 'center' | 'right';
}

export interface TariffRow {
  id: string;
  [key: string]: string | number;
}

export interface TariffPlan {
  id: number;
  name: string;
  subtitle?: string | null;
  columns: TariffColumn[];
  rows: TariffRow[];
  footnote?: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ИТС Тарифный план (для 1С:ИТС)
export interface ItsTariffRow {
  text: string;
  color: string;
  isBold: boolean;
}

export interface ItsTariffPlan {
  id: number;
  title: string;
  rows: ItsTariffRow[];
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
