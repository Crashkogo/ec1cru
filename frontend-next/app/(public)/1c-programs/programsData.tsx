import { IconType } from 'react-icons';
import {
  FaArchive,
  FaBoxes,
  FaBriefcase,
  FaBuilding,
  FaCalculator,
  FaCashRegister,
  FaChartBar,
  FaChartPie,
  FaCity,
  FaDatabase,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaFileSignature,
  FaHandHoldingHeart,
  FaHardHat,
  FaIndustry,
  FaLandmark,
  FaLaptop,
  FaMoneyCheckAlt,
  FaNetworkWired,
  FaRegFolderOpen,
  FaRegObjectGroup,
  FaRocket,
  FaSearchDollar,
  FaShoppingCart,
  FaSitemap,
  FaStore,
  FaUniversity,
  FaUserClock,
  FaUsers,
  FaUsersCog,
  FaUserTag,
  FaUserTie,
  FaWarehouse
} from 'react-icons/fa';
import { GiClothes, GiGardeningShears } from 'react-icons/gi';

export interface Program {
  id: string;
  title: string;
  description: string;
  categories: string[];
  url: string;
  icon: IconType;
}

// Категории для фильтров
const allCategories = [
  { id: 'Корпорации и холдинги', label: 'Корпорации и холдинги' },
  { id: 'Для среднего бизнеса', label: 'Для среднего бизнеса' },
  { id: 'Предприниматели и малый бизнес', label: 'Предприниматели и малый бизнес' },
  { id: 'Государственные и муниципальные учреждения', label: 'Государственные и муниципальные учреждения' },
  { id: 'Некоммерческие организации', label: 'Некоммерческие организации' },
  { id: 'Управление производством', label: 'Управление производством' },
  { id: 'Управление торговлей', label: 'Управление торговлей' },
  { id: 'Управление финансами', label: 'Управление финансами' },
  { id: 'Документооборот', label: 'Документооборот' },
  { id: 'Зарплата и управление персоналом', label: 'Зарплата и управление персоналом' },
  { id: 'Бухгалтерский и налоговый учёт', label: 'Бухгалтерский и налоговый учёт' },
  { id: 'Учет и отчетность по МСФО', label: 'Учет и отчетность по МСФО' },
];

export const categoriesRow1 = [
  { id: 'all', label: 'Все программы' },
  ...allCategories.filter(c => [
    'Корпорации и холдинги',
    'Для среднего бизнеса',
    'Предприниматели и малый бизнес',
    'Государственные и муниципальные учреждения',
    'Некоммерческие организации'
  ].includes(c.id))
];

export const categoriesRow2 = allCategories.filter(c => ![
  'Корпорации и холдинги',
  'Для среднего бизнеса',
  'Предприниматели и малый бизнес',
  'Государственные и муниципальные учреждения',
  'Некоммерческие организации'
].includes(c.id));

export const getCategoryColors = (category: string): { bg: string; text: string; border: string } => {
  const colors = [
    { bg: 'from-blue-100 to-blue-200', text: 'text-blue-600', border: 'border-blue-200' },
    { bg: 'from-modern-primary-100 to-modern-primary-200', text: 'text-modern-primary-600', border: 'border-modern-primary-200' },
    { bg: 'from-emerald-100 to-emerald-200', text: 'text-emerald-600', border: 'border-emerald-200' },
    { bg: 'from-orange-100 to-orange-200', text: 'text-orange-600', border: 'border-orange-200' },
    { bg: 'from-purple-100 to-purple-200', text: 'text-purple-600', border: 'border-purple-200' },
    { bg: 'from-modern-accent-100 to-modern-accent-200', text: 'text-modern-accent-600', border: 'border-modern-accent-200' },
  ];
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length] || colors[0];
};

// Данные программ с категориями и иконками
export const programs: Program[] = [
  {
    id: '1c-korporaciya',
    title: '1С:Корпорация',
    description: 'Комплекс интегрируемых решений для автоматизации крупных предприятий, групп компаний и холдингов.',
    categories: ['Корпорации и холдинги', 'Управление финансами', 'Учет и отчетность по МСФО'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaBuilding
  },
  {
    id: '1c-upravlenie-holdingom-8',
    title: '1С:Управление холдингом 8',
    description: 'Комплексное решение для управления эффективностью холдинга.',
    categories: ['Корпорации и холдинги', 'Управление финансами', 'Учет и отчетность по МСФО'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaSitemap
  },
  {
    id: '1c-erp-upravlenie-holdingom',
    title: '1С:ERP. Управление холдингом',
    description: 'Управление ресурсами предприятий и эффективностью холдинга в одном продукте.',
    categories: ['Корпорации и холдинги', 'Для среднего бизнеса', 'Управление производством', 'Управление торговлей', 'Управление финансами', 'Учет и отчетность по МСФО'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaNetworkWired
  },
  {
    id: '1c-erp-upravlenie-predpriyatiem',
    title: '1С:ERP Управление предприятием',
    description: 'Комплексная автоматизация бизнес-процессов для эффективного управления предприятием.',
    categories: ['Корпорации и холдинги', 'Для среднего бизнеса', 'Управление производством', 'Управление торговлей', 'Управление финансами', 'Учет и отчетность по МСФО'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaIndustry
  },
  {
    id: '1c-kompleksnaya-avtomatizaciya',
    title: '1С:Комплексная автоматизация',
    description: 'Бухгалтерия, торговля, склад, производство, зарплата, кадры в единой информационной базе.',
    categories: ['Для среднего бизнеса', 'Управление производством', 'Управление торговлей'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaRegObjectGroup
  },
  {
    id: '1c-upravlenie-torgovley-8',
    title: '1С:Управление торговлей 8',
    description: 'Продажи, закупки, склад, товары, финансы. Оперативный и управленческий учет, анализ и планирование торговых операций.',
    categories: ['Для среднего бизнеса', 'Управление торговлей'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaShoppingCart
  },
  {
    id: '1c-upravlenie-nashey-firmoy',
    title: '1С:Управление нашей фирмой',
    description: 'Готовое решение для торговых, производственных и сервисных компаний малого бизнеса.',
    categories: ['Предприниматели и малый бизнес', 'Управление производством', 'Управление торговлей'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaBriefcase
  },
  {
    id: '1c-buhgalteriya-8',
    title: '1С:Бухгалтерия 8',
    description: 'Самая популярная бухгалтерская программа.',
    categories: ['Для среднего бизнеса', 'Предприниматели и малый бизнес', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaCalculator
  },
  {
    id: '1c-buhgalteriya-korp-msfo',
    title: '1С:Бухгалтерия КОРП МСФО',
    description: 'Учет по РСБУ и МСФО для предприятий, не имеющих дочерних обществ.',
    categories: ['Корпорации и холдинги', 'Управление финансами', 'Бухгалтерский и налоговый учёт', 'Учет и отчетность по МСФО'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaFileInvoiceDollar
  },
  {
    id: '1c-nalogovyy-monitoring',
    title: '1С:Налоговый мониторинг',
    description: 'Программа для ведения бухгалтерского, налогового учета и учета по МСФО.',
    categories: ['Корпорации и холдинги', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaSearchDollar
  },
  {
    id: '1c-buhgalteriya-nekommercheskoy-organizacii-8-nko',
    title: '1С:Бухгалтерия некоммерческой организации 8 (НКО)',
    description: 'Автоматизация бухгалтерского и налогового учета для НКО.',
    categories: ['Некоммерческие организации', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaHandHoldingHeart
  },
  {
    id: '1c-uproshchenka-8',
    title: '1С:Упрощенка 8',
    description: 'Автоматизация учета и подготовка отчетности для небольших организаций и предпринимателей на УСН.',
    categories: ['Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaFileInvoice
  },
  {
    id: '1c-zarplata-i-upravlenie-personalom-8',
    title: '1С:Зарплата и управление персоналом 8',
    description: 'Учет труда, расчет зарплаты и отчислений в соответствии с законодательством.',
    categories: ['Для среднего бизнеса', 'Зарплата и управление персоналом'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaUsers
  },
  {
    id: '1c-dogovory',
    title: '1С:Договоры',
    description: 'Удобный помощник по договорной работе. Быстрая подготовка и поиск документов, контроль сроков.',
    categories: ['Предприниматели и малый бизнес', 'Документооборот'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaFileSignature
  },
  {
    id: '1c-dokumentooborot-gosudarstvennogo-uchrezhdeniya-8',
    title: '1С:Документооборот государственного учреждения 8',
    description: 'Электронный документооборот в соответствии с нормативами и стандартами делопроизводства.',
    categories: ['Государственные и муниципальные учреждения', 'Документооборот'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaLandmark
  },
  {
    id: '1c-uchet-obrashcheniy',
    title: '1С:Учет обращений',
    description: 'Учет обращений граждан и организаций, отчетность по результатам рассмотрения обращений.',
    categories: ['Государственные и муниципальные учреждения', 'Документооборот'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaUserClock
  },
  {
    id: '1c-dokumentooborot-8',
    title: '1С:Документооборот 8',
    description: 'Современная ECM-система. Эффективная организация совместной работы сотрудников с документами.',
    categories: ['Корпорации и холдинги', 'Для среднего бизнеса', 'Документооборот'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaRegFolderOpen
  },
  {
    id: '1c-buhgalteriya-gosudarstvennogo-uchrezhdeniya-8',
    title: '1С:Бухгалтерия государственного учреждения 8',
    description: 'Автоматизация бухгалтерского учета государственных и муниципальных учреждений.',
    categories: ['Государственные и муниципальные учреждения', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaUniversity
  },
  {
    id: '1c-zarplata-i-kadry-gosudarstvennogo-uchrezhdeniya-8',
    title: '1С:Зарплата и кадры государственного учреждения 8',
    description: 'Кадровый документооборот, расчет зарплаты и отчислений в соответствии с законодательством.',
    categories: ['Государственные и муниципальные учреждения', 'Зарплата и управление персоналом'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaUsersCog
  },
  {
    id: '1c-byudzhetnaya-otchetnost-8',
    title: '1С:Бюджетная отчетность 8',
    description: 'Программа для автоматизации сбора, проверки, консолидации и анализа бюджетной отчетности.',
    categories: ['Государственные и муниципальные учреждения', 'Управление финансами', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaChartPie
  },
  {
    id: '1c-svod-otchetov-8',
    title: '1С:Свод отчетов 8',
    description: 'Программа для автоматизации сбора, проверки, консолидации и анализа бюджетной отчетности.',
    categories: ['Государственные и муниципальные учреждения', 'Управление финансами', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaChartBar
  },
  {
    id: '1c-gosudarstvennye-i-municipalnye-zakupki-8',
    title: '1С:Государственные и муниципальные закупки 8',
    description: 'Автоматизация планирования, подготовки и проведения закупок.',
    categories: ['Государственные и муниципальные учреждения'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaLandmark
  },
  {
    id: '1c-byudzhet-municipalnogo-obrazovaniya-8',
    title: '1С:Бюджет муниципального образования 8',
    description: 'Автоматизация работы по планированию и исполнению бюджетов муниципальных образований.',
    categories: ['Государственные и муниципальные учреждения', 'Управление финансами'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaCity
  },
  {
    id: '1c-veshchevoe-dovolstvie-8',
    title: '1С:Вещевое довольствие 8',
    description: 'Автоматизация оперативного учета предметов форменной одежды и служебного обмундирования.',
    categories: ['Государственные и муниципальные учреждения'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: GiClothes
  },
  {
    id: '1c-platezhnye-dokumenty-8',
    title: '1С:Платежные документы 8',
    description: 'Программа для подготовки, печати и хранения основных бухгалтерских документов.',
    categories: [],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaMoneyCheckAlt
  },
  {
    id: '1c-nalogoplatelshchik-8',
    title: '1С:Налогоплательщик 8',
    description: 'Программа для подготовки и представления отчетности в государственные органы.',
    categories: [],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaUserTag
  },
  {
    id: '1c-elektronnoe-obuchenie',
    title: '1С:Электронное обучение',
    description: 'Система дистанционного обучения на платформе «1С:Предприятие 8».',
    categories: ['Зарплата и управление персоналом'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaLaptop
  },
  {
    id: '1c-biznesstart',
    title: '1С:БизнесСтарт',
    description: 'Облачная автоматизация бизнеса для начинающих предпринимателей.',
    categories: ['Предприниматели и малый бизнес', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaRocket
  },
  {
    id: '1c-kassa',
    title: '1С:Касса',
    description: '«Облачный» сервис для удобной работы с онлайн-кассой, ведения простого товароучета.',
    categories: ['Управление торговлей'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaCashRegister
  },
  {
    id: '1c-sadovod',
    title: '1С:Садовод',
    description: 'Автоматизация подготовки и сдачи отчетности для садовых и огородных некоммерческих товариществ.',
    categories: ['Некоммерческие организации', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: GiGardeningShears
  },
  {
    id: '1c-zarplata-i-upravlenie-personalom-korp',
    title: '1С:Зарплата и управление персоналом КОРП',
    description: 'Расширенные возможности кадрового учета и расчета заработной платы.',
    categories: ['Корпорации и холдинги', 'Для среднего бизнеса', 'Зарплата и управление персоналом'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaUserTie
  },
  {
    id: '1c-rabochee-mesto-kassira',
    title: '1С:Рабочее место кассира',
    description: 'Универсальное, удобное и современное рабочее место кассира.',
    categories: ['Предприниматели и малый бизнес', 'Управление торговлей'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaHardHat
  },
  {
    id: '1c-garazhi',
    title: '1С:Гаражи',
    description: 'Решение для подготовки и сдачи отчетности в гаражно-строительных кооперативах (ГСК).',
    categories: ['Некоммерческие организации', 'Бухгалтерский и налоговый учёт'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaWarehouse
  },
  {
    id: '1c-roznica',
    title: '1С:Розница',
    description: 'Универсальное решение для управления розничной торговлей.',
    categories: ['Предприниматели и малый бизнес', 'Управление торговлей'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaStore
  },
  {
    id: '1c-arhiv',
    title: '1С:Архив',
    description: 'Универсальная система долговременного хранения бумажных и электронных документов.',
    categories: ['Документооборот'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaArchive
  },
  {
    id: '1c-dokumentooborot-holdinga',
    title: '1С:Документооборот холдинга',
    description: 'Продукт для крупных компаний с разветвленной филиальной структурой.',
    categories: ['Документооборот'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaBoxes
  },
  {
    id: '1c-mdm-korp',
    title: '1С:MDM КОРП',
    description: 'Управление корпоративными мастер-данными крупных предприятий и холдинговых структур.',
    categories: ['Корпорации и холдинги', 'Для среднего бизнеса', 'Государственные и муниципальные учреждения'],
    url: 'https://v8.1c.ru/vse-programmy-1c/',
    icon: FaDatabase
  }
];
