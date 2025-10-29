import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTariffs() {
  console.log('🌱 Начинаем добавление тарифов IT-аутсорсинга...');

  // Тариф "Контроль"
  const tariff1 = await prisma.tariffPlan.create({
    data: {
      name: 'Тариф «Контроль»',
      subtitle: '(для малых организаций)',
      order: 1,
      isPublished: true,
      columns: [
        { id: 'col1', label: 'Наименование', type: 'text', align: 'center' },
        { id: 'col2', label: 'Кол-во ПК', type: 'number', align: 'center' },
        { id: 'col3', label: 'Стоимость на ПК*', type: 'price', align: 'center' },
        { id: 'col4', label: 'Кол-во часов', type: 'number', align: 'center' },
        { id: 'col5', label: 'Входящий мониторинг Zabbix', type: 'boolean', align: 'center' }
      ],
      rows: [
        { id: 'row1', col1: 'Рабочее место (ОС WINDOWS)', col2: '1', col3: '3100', col4: '2', col5: '+' },
        { id: 'row2', col1: 'Рабочее место (ОС WINDOWS)', col2: '2', col3: '3400', col4: '2', col5: '+' },
        { id: 'row3', col1: 'Рабочее место (ОС WINDOWS)', col2: '3', col3: '3700', col4: '2', col5: '+' }
      ],
      footnote: '* Цена указана в рублях за 1 месяц. Время расчета с 8 рабочих часов.'
    }
  });
  console.log(`✅ Создан тариф: ${tariff1.name}`);

  // Тариф "Стандарт"
  const tariff2 = await prisma.tariffPlan.create({
    data: {
      name: 'Тариф «Стандарт»',
      subtitle: '(подходит большинству организаций)',
      order: 2,
      isPublished: true,
      columns: [
        { id: 'col1', label: 'Наименование', type: 'text', align: 'center' },
        { id: 'col2', label: 'Кол-во', type: 'range', align: 'center' },
        { id: 'col3', label: 'Стоимость на ПК*', type: 'mixed', align: 'center' },
        { id: 'col4', label: 'Кол-во плановых выездов', type: 'mixed', align: 'center' },
        { id: 'col5', label: 'Кол-во аварийных выездов', type: 'mixed', align: 'center' }
      ],
      rows: [
        { id: 'row1', col1: 'Рабочее место (ОС WINDOWS)', col2: '4-5', col3: '1000', col4: '1', col5: '3' },
        { id: 'row2', col1: 'Рабочее место (ОС WINDOWS)', col2: '6-9', col3: '900', col4: '1', col5: '4' },
        { id: 'row3', col1: 'Рабочее место (ОС WINDOWS)', col2: '10-13', col3: '850', col4: '2', col5: '5' },
        { id: 'row4', col1: 'Рабочее место (ОС WINDOWS)', col2: '14-15', col3: '800', col4: '2', col5: '6' },
        { id: 'row5', col1: 'Рабочее место (ОС WINDOWS)', col2: '16-19', col3: '750', col4: '2', col5: '7' },
        { id: 'row6', col1: 'Рабочее место (ОС WINDOWS)', col2: '20-24', col3: '720', col4: '3', col5: '8' },
        { id: 'row7', col1: 'Рабочее место (ОС WINDOWS)', col2: '25-30', col3: '700', col4: '3', col5: '9' },
        { id: 'row8', col1: 'Рабочее место (ОС WINDOWS)', col2: 'От 30', col3: 'По договоренности', col4: 'По договоренности', col5: 'По договоренности' },
        { id: 'row9', col1: 'Серверное место (сервер на ОС WINDOWS)', col2: '1', col3: '5000', col4: '-', col5: '-' },
        { id: 'row10', col1: 'Серверное место (сервер на ОС LINUX)', col2: '1', col3: '7000', col4: '-', col5: '-' }
      ],
      footnote: '* Цена указана в рублях за 1 месяц. Время расчета с 8 рабочих часов.'
    }
  });
  console.log(`✅ Создан тариф: ${tariff2.name}`);

  // Тариф "Продвинутый"
  const tariff3 = await prisma.tariffPlan.create({
    data: {
      name: 'Тариф «Продвинутый»',
      subtitle: null,
      order: 3,
      isPublished: true,
      columns: [
        { id: 'col1', label: 'Наименование', type: 'text', align: 'center' },
        { id: 'col2', label: 'Кол-во', type: 'range', align: 'center' },
        { id: 'col3', label: 'Стоимость на ПК*', type: 'mixed', align: 'center' },
        { id: 'col4', label: 'Кол-во плановых выездов', type: 'mixed', align: 'center' },
        { id: 'col5', label: 'Кол-во аварийных выездов', type: 'mixed', align: 'center' }
      ],
      rows: [
        { id: 'row1', col1: 'Рабочее место (ОС WINDOWS)', col2: '4-5', col3: '1200', col4: '2', col5: '5' },
        { id: 'row2', col1: 'Рабочее место (ОС WINDOWS)', col2: '6-9', col3: '1100', col4: '2', col5: '6' },
        { id: 'row3', col1: 'Рабочее место (ОС WINDOWS)', col2: '10-13', col3: '1000', col4: '2', col5: '7' },
        { id: 'row4', col1: 'Рабочее место (ОС WINDOWS)', col2: '14-15', col3: '950', col4: '2', col5: '8' },
        { id: 'row5', col1: 'Рабочее место (ОС WINDOWS)', col2: '16-19', col3: '900', col4: '2', col5: '9' },
        { id: 'row6', col1: 'Рабочее место (ОС WINDOWS)', col2: '20-24', col3: '860', col4: '3', col5: '10' },
        { id: 'row7', col1: 'Рабочее место (ОС WINDOWS)', col2: '25-30', col3: '830', col4: '3', col5: '11' },
        { id: 'row8', col1: 'Рабочее место (ОС WINDOWS)', col2: 'От 30', col3: 'По договоренности', col4: 'По договоренности', col5: 'По договоренности' },
        { id: 'row9', col1: 'Серверное место (сервер на ОС WINDOWS)', col2: '1', col3: '6000', col4: '-', col5: '-' },
        { id: 'row10', col1: 'Серверное место (сервер на ОС LINUX)', col2: '1', col3: '8000', col4: '-', col5: '-' }
      ],
      footnote: '* Цена указана в рублях за 1 месяц. Время расчета с 4 рабочих часа.'
    }
  });
  console.log(`✅ Создан тариф: ${tariff3.name}`);

  console.log('🎉 Все тарифы успешно добавлены в базу данных!');
}

seedTariffs()
  .catch((e) => {
    console.error('❌ Ошибка при добавлении тарифов:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
