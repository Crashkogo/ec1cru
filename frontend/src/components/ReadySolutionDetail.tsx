// src/pages/ReadySolutionDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

interface Program {
  id: number;
  shortName: string;
}

interface ReadySolution {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  type: 'PROCESSING' | 'PRINT_FORM' | 'REPORT';
  freshSupport: boolean;
  programs: { program: Program }[];
  images: string[];
}

const SERVER_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReadySolutionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [solution, setSolution] = useState<ReadySolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/ready-solutions/${slug}`)
      .then((response) => {
        setSolution(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching solution:', error);
        setLoading(false);
      });
  }, [slug]);

  // Обработка кликов по стрелкам и клавишам
  const handleNextImage = () => {
    if (selectedImageIndex !== null && solution?.images) {
      setSelectedImageIndex((prev) =>
        prev === solution.images.length - 1 ? 0 : prev! + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && solution?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? solution.images.length - 1 : prev! - 1
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'Escape') setSelectedImageIndex(null);
  };

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const closeModal = () => setSelectedImageIndex(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Решение не найдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-darkBg mb-4">{solution.title}</h1>
        <p className="text-gray-500 mb-4">{solution.shortDescription}</p>

        {/* Галерея */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {solution.images.map((img, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer overflow-hidden rounded-md shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => setSelectedImageIndex(idx)}
            >
              <img
                src={`${SERVER_BASE_URL}${img}`}
                alt={`${solution.title} - ${idx + 1}`}
                className="w-[150px] h-[150px] object-cover rounded-md" // Фиксированный размер 150x150px
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Модальное окно для увеличенного изображения */}
        {selectedImageIndex !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn"
            onClick={closeModal} // Закрытие по клику на фон
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors duration-200 shadow-md"
            >
              <FaTimes size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition-colors duration-200 shadow-md"
            >
              <FaArrowLeft size={24} />
            </button>
            <img
              src={`${SERVER_BASE_URL}${solution.images[selectedImageIndex]}`}
              alt="Увеличенное изображение"
              className="max-w-[80%] max-h-[80%] object-cover rounded-md shadow-lg transform transition-transform duration-300 scale-100" // Обрезка в модальном окне
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition-colors duration-200 shadow-md"
            >
              <FaArrowRight size={24} />
            </button>
          </div>
        )}

        {/* Полное описание */}
        <div
          className="prose max-w-none text-gray-800 break-words mb-8"
          dangerouslySetInnerHTML={{ __html: solution.fullDescription }}
        />

        {/* Метаданные */}
        <div className="border-2 border-darkBg rounded-lg p-4">
          <div className="text-lg font-semibold text-darkBg mb-2">
            Цена: {solution.price.toLocaleString()} ₽
          </div>
          <div className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Тип: </span>
            {solution.type === 'PROCESSING'
              ? 'Обработка'
              : solution.type === 'PRINT_FORM'
              ? 'Печатная форма'
              : 'Отчёт'}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            <span className="font-medium">1C:Fresh: </span>
            {solution.freshSupport ? 'Да' : 'Нет'}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Программы: </span>
            {solution.programs.map((p) => p.program.shortName).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadySolutionDetail;