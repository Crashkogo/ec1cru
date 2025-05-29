// src/pages/admin/ProgramSettings.tsx
import React, { useState } from 'react';
import { useDataProvider, useNotify, List, Datagrid, TextField, DateField } from 'react-admin';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

const programSchema = z.object({
  fullName: z.string().min(1, 'Полное название обязательно'),
  shortName: z.string().min(1, 'Краткое название обязательно'),
});

type ProgramFormInputs = z.infer<typeof programSchema>;

const ProgramSettings: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramFormInputs>({
    resolver: zodResolver(programSchema),
  });

  const onSubmit: SubmitHandler<ProgramFormInputs> = async (data) => {
    try {
      await dataProvider.create('programs', { data });
      notify('Программа успешно добавлена', { type: 'success' });
      reset();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating program:', error);
      notify('Ошибка при добавлении программы', { type: 'error' });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-darkGray dark:text-textBlue">
      <h2 className="text-2xl font-bold mb-4">Настройки программ</h2>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="mb-4 bg-accentSkyTransparent text-textBlue px-4 py-2 rounded-md hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm"
      >
        {isFormOpen ? 'Скрыть форму' : 'Добавить программу'}
      </button>
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Полное название</label>
                <input
                  {...register('fullName')}
                  className="w-full p-2 border border-grayAccent dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue dark:focus:ring-textBlue bg-white dark:bg-gray-700 text-darkGray dark:text-textBlue"
                  placeholder="Например, 1С:Бухгалтерия предприятия"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Краткое название</label>
                <input
                  {...register('shortName')}
                  className="w-full p-2 border border-grayAccent dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue dark:focus:ring-textBlue bg-white dark:bg-gray-700 text-darkGray dark:text-textBlue"
                  placeholder="Например, БП"
                />
                {errors.shortName && (
                  <p className="text-red-500 text-sm mt-1">{errors.shortName.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-primaryBlue text-textBlue px-4 py-2 rounded-md hover:bg-hoverBlue hover:text-textBlue transition-colors duration-300 shadow-sm"
              >
                Добавить программу
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <List resource="programs" title="Программы">
        <Datagrid className="bg-white dark:bg-gray-800 text-darkGray dark:text-textBlue">
          <TextField source="id" label="ID" />
          <TextField source="fullName" label="Полное название" />
          <TextField source="shortName" label="Краткое название" />
          <DateField source="createdAt" label="Дата создания" locales="ru-RU" />
        </Datagrid>
      </List>
    </div>
  );
};

export default ProgramSettings;