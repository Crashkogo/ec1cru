import { Metadata } from 'next';
import {
  UsersIcon,
  TrophyIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'О компании — ООО «Инженер-центр», Волжский',
  description:
    'ООО «Инженер-центр» — более 30 лет автоматизации бизнеса в Волжском и Волгоградской области. Внедрение и сопровождение 1С, IT-аутсорсинг. 600+ клиентов, победитель «Партнёр года 1С:ИТС 2024».',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12">
              {/* Заголовок */}
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-modern-primary-700">
                ИНЖЕНЕР-ЦЕНТР
              </h1>

              {/* Секция 1: История и Видео */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16">
                {/* Текст истории */}
                <div className="lg:w-1/2 text-lg text-modern-gray-700 leading-relaxed space-y-4">
                  <p>
                    «Инженер-центр» — это более 30 лет автоматизации бизнеса. За плечами — более 50 успешных проектов
                    внедрения и 600+ довольных клиентов. От маленьких компаний до крупных корпораций.
                  </p>
                  <h2 className="text-2xl font-bold text-modern-primary-600 pt-2">Что мы делаем?</h2>
                  <p>Внедряем и сопровождаем 1С.</p>
                  <p>
                    Предоставляем IT-аутсорсинг — полностью берём на себя вашу IT-инфраструктуру. Серверы, сети,
                    компьютеры, защита, обновления, поддержка пользователей. Вы не отвлекаетесь на технику — мы решаем
                    все вопросы за вас.
                  </p>
                  <p>
                    Наша команда — это сертифицированные специалисты. Они постоянно повышают квалификацию, следят за
                    новейшими тенденциями и применяют лучшее на практике.
                  </p>
                  <p className="font-semibold text-modern-primary-700">
                    Наша цель: сделать IT незаметным. Чтобы вы занимались бизнесом, а всё остальное мы взяли на себя.
                  </p>
                </div>

                {/* Видео плеер */}
                <div className="lg:w-1/2 flex justify-center">
                  <video
                    className="w-full max-w-md rounded-lg shadow-modern-lg"
                    src="/videos/1cfranc_compwithhumanface.mp4"
                    controls
                    muted
                    autoPlay
                    loop
                    playsInline
                  >
                    Ваш браузер не поддерживает видео тег.
                  </video>
                </div>
              </div>

              {/* Секция 2: Иконки с достижениями */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {/* Блок 1 */}
                <div className="flex flex-col items-center text-center p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                  <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                    <UsersIcon className="h-12 w-12 text-modern-primary-600" />
                  </div>
                  <p className="text-lg font-semibold text-modern-gray-800 leading-relaxed">
                    600+ довольных клиентов
                  </p>
                </div>

                {/* Блок 2 */}
                <div className="flex flex-col items-center text-center p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                  <div className="mb-4 p-4 bg-modern-accent-100 rounded-full">
                    <TrophyIcon className="h-12 w-12 text-modern-accent-600" />
                  </div>
                  <p className="text-lg font-semibold text-modern-gray-800 leading-relaxed">
                    Победитель номинации «Прорыв года» премии «Партнёр года 1С:ИТС 2024»
                  </p>
                </div>

                {/* Блок 3 */}
                <div className="flex flex-col items-center text-center p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                  <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                    <ClockIcon className="h-12 w-12 text-modern-primary-600" />
                  </div>
                  <p className="text-lg font-semibold text-modern-gray-800 leading-relaxed">
                    30 лет опыта на рынке автоматизации бизнеса
                  </p>
                </div>
              </div>

              {/* Горизонтальная отсечка */}
              <div className="relative mb-16">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-modern-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-modern-white px-6 text-modern-gray-400 text-sm font-medium">
                    •••
                  </span>
                </div>
              </div>

              {/* Секция 3: Наша команда */}
              <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 mb-16">
                {/* Текст */}
                <div className="lg:w-1/2 text-lg text-modern-gray-700 leading-relaxed space-y-4">
                  <h2 className="text-3xl font-bold text-modern-primary-600">
                    Наша команда
                  </h2>
                  <p className="text-xl font-semibold text-modern-gray-800">
                    Команда, на которую можно положиться
                  </p>
                  <p>За нашей работой стоят люди. Живые, увлечённые, надёжные.</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-primary-500"></span>
                      <span>Разработчики, которые пишут код так, чтобы его не стыдно было показать коллегам.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-primary-500"></span>
                      <span>Консультанты, которые говорят с бизнесом на одном языке.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-primary-500"></span>
                      <span>Системные администраторы, которые держат всю IT-инфраструктуру в порядке — тихо, без паники, но с полным контролем.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-primary-500"></span>
                      <span>Специалисты техподдержки, которые не бросают трубку, пока проблема не решена.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-primary-500"></span>
                      <span>И преподаватели учебного центра, которые учат других так, как хотели бы, чтобы учили их.</span>
                    </li>
                  </ul>
                  <p>
                    У каждого из нас — официальные сертификаты 1С. Мы регулярно учимся, сдаём экзамены, перенимаем
                    лучшее у коллег. Потому что спокойствие клиента стоит того.
                  </p>
                  <p className="font-semibold text-modern-primary-700">
                    Мы — команда «Инженер-центра». И мы любим своё дело.
                  </p>
                </div>

                {/* Видео плеер */}
                <div className="lg:w-1/2 flex justify-center">
                  <video
                    className="w-full max-w-md rounded-lg shadow-modern-lg"
                    src="/videos/1cfranc_compwithhumanface.mp4"
                    controls
                    muted
                    autoPlay
                    loop
                    playsInline
                  >
                    Ваш браузер не поддерживает видео тег.
                  </video>
                </div>
              </div>

              {/* Горизонтальная отсечка */}
              <div className="relative mb-16">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-modern-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-modern-white px-6 text-modern-gray-400 text-sm font-medium">
                    •••
                  </span>
                </div>
              </div>

              {/* Секция 4: Карьера */}
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-modern-primary-600">
                  Карьера в нашей компании
                </h2>
                <div className="text-lg text-modern-gray-700 leading-relaxed space-y-4">
                  <p>
                    Мы всегда рады видеть в команде талантливых и амбициозных специалистов. Тех, кто хочет расти в IT
                    и не боится сложных задач.
                  </p>
                  <h3 className="text-xl font-semibold text-modern-gray-800 pt-2">Что мы предлагаем?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-accent-500"></span>
                      <span>Стабильную работу.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-accent-500"></span>
                      <span>Дружный коллектив, в котором не страшно спросить и не стыдно ошибиться.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-accent-500"></span>
                      <span>Возможности для профессионального роста — реальные, а не на словах.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-modern-accent-500"></span>
                      <span>Обучение за счёт компании, потому что мы верим: инвестиции в людей — лучшие инвестиции.</span>
                    </li>
                  </ul>
                  <p>
                    И ещё — менторскую поддержку. Мы не бросаем новичков в открытое море. Рядом есть тот, кто
                    направит, подскажет, поможет раскрыть потенциал.
                  </p>
                  <div className="mt-6 text-center">
                    <a
                      href="https://career-ec.ru/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-modern-primary-600 text-white font-semibold rounded-lg hover:bg-modern-primary-700 transition-colors duration-200 shadow-modern"
                    >
                      Смотреть вакансии
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
