// src/pages/Home/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="bg-darkBg min-h-screen text-whiteText">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-yellowAccent">Главная страница</h1>
        <p className="mt-4">Добро пожаловать!</p>
      </div>
    </div>
  );
};

export default Home;