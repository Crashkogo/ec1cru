import React from 'react';

const WorkflowTimeline: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Знакомство',
      description: 'Обсуждаем ваши задачи и цели. Знакомимся, чтобы понять, сможем ли мы вам реально помочь',
    },
    {
      number: '2',
      title: 'Обследование',
      description: 'Проводим аудит ваших бизнес-процессов. Глубоко погружаемся в специфику и находим «узкие места». Формируем техническое задание на внедрение',
    },
    {
      number: '3',
      title: 'Подбор программных продуктов',
      description: 'Формируем итоговое предложение с перечнем необходимых программных продуктов и лицензий 1С',
    },
    {
      number: '4',
      title: 'Внедрение и доработка',
      description: 'Настраиваем систему под вас. Если нужно что-то уникальное — программируем индивидуальные модули',
    },
    {
      number: '5',
      title: 'Тестовая эксплуатация',
      description: 'Вы тестируете систему в «боевых» условиях, но без риска. Мы находимся рядом и оперативно помогаем',
    },
    {
      number: '6',
      title: 'Устранение замечаний и загрузка данных',
      description: 'Корректируем систему по результатам тестовой эксплуатации. Переносим остатки и исторические данные',
    },
    {
      number: '7',
      title: 'Ввод в промышленную эксплуатацию',
      description: 'Официальный запуск системы в полнофункциональном режиме работы для всех пользователей',
    },
    {
      number: '8',
      title: 'Сопровождение',
      description: 'Мы не бросаем вас после запуска. Обеспечиваем техподдержку, обновления, консультации и помогаем в развитии системы',
    },
  ];

  return (
    <section className="py-16 bg-modern-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 text-center mb-12">
          Как мы работаем
        </h2>

        {/* Desktop версия - все в один ряд */}
        <div className="hidden xl:block">
          <div className="relative">
            {/* Горизонтальная линия */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-modern-primary-300"></div>

            {/* Все 8 этапов в один ряд */}
            <div className="grid grid-cols-8 gap-3 relative">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  {/* Круг с номером - увеличенный */}
                  <div className="w-16 h-16 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-modern z-10 mb-4 relative">
                    {step.number}
                  </div>

                  {/* Заголовок - увеличенный шрифт */}
                  <h3 className="font-semibold text-modern-gray-900 mb-2 text-sm leading-tight min-h-[2.8rem] flex items-center">
                    {step.title}
                  </h3>

                  {/* Описание - увеличенный шрифт */}
                  <p className="text-xs text-modern-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet/Mobile версия - сетка */}
        <div className="xl:hidden">
          <div className="relative">
            {/* Горизонтальная линия для tablet */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-modern-primary-300 hidden md:block"></div>

            {/* Сетка этапов - адаптивная */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 relative">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  {/* Круг с номером */}
                  <div className="w-12 h-12 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-modern z-10 mb-4 relative">
                    {step.number}
                  </div>

                  {/* Заголовок */}
                  <h3 className="font-bold text-modern-gray-900 mb-2 text-sm min-h-[2.5rem] flex items-center">
                    {step.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-xs text-modern-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Декоративный разделитель */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-modern-primary-300 to-transparent"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-modern-primary-400"></div>
            <div className="w-3 h-3 rounded-full bg-modern-primary-500"></div>
            <div className="w-2 h-2 rounded-full bg-modern-primary-400"></div>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-modern-primary-300 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowTimeline;
