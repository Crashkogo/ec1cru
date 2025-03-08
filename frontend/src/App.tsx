import React from 'react';

const App: React.FC = () => {
  return (
    <div className="bg-darkBg min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-yellowAccent">Tailwind CSS работает!</h1>
      <div className="bg-red-500 p-4 text-white">
        Проверка Tailwind
      </div>
      <div className="bg-green-500 p-4 text-white">Tailwind работает!</div>
    </div>
  );
};

export default App;