import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <>
      {/* SEO-метатеги */}
      <Helmet>
        <title>Фирма 1С - Главная</title>
        <meta
          name="description"
          content="Профессиональные услуги 1С: ИТС, техподдержка, автоматизация и обучение."
        />
      </Helmet>

      <div className="min-h-screen bg-lightGray flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-darkGray mb-4">Добро пожаловать!</h1>
          <p className="text-darkGray">Это тестовая версия главной страницы для проверки хедера.</p>
        </div>
      </div>
    </>
  );
};

export default Home;