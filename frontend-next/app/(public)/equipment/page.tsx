import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const metadata: Metadata = {
  title: 'Оборудование — ООО «Инженер-центр»',
  description: 'Каталог оборудования от ООО «Инженер-центр» — компьютеры, серверы, сетевое и торговое оборудование.',
  keywords: ['оборудование', 'компьютеры', 'серверы', 'IT оборудование', 'инженер-центр'],
};

interface EquipmentItem {
  id: number;
  title: string;
  shortDescription: string;
  price: number | null;
  imageUrl: string | null;
  slug: string;
}

async function getEquipmentList(): Promise<EquipmentItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/equipment?limit=100`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function EquipmentPage() {
  const items = await getEquipmentList();

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-modern-primary-700">
                Оборудование
              </h1>

              {items.length === 0 ? (
                <p className="text-center text-modern-gray-500 py-20">
                  Каталог оборудования скоро появится.
                </p>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/equipment/${item.slug}`}
                      className="group flex flex-col sm:flex-row gap-0 bg-modern-gray-50 rounded-xl border border-modern-gray-200 hover:border-modern-primary-300 hover:shadow-modern-lg transition-all duration-300 overflow-hidden"
                    >
                      {/* Изображение слева */}
                      <div className="relative w-full sm:w-56 h-48 sm:h-auto flex-shrink-0 bg-modern-gray-100">
                        {item.imageUrl ? (
                          <Image
                            src={BACKEND_URL + item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 224px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-modern-gray-300 text-sm">
                            Нет фото
                          </div>
                        )}
                      </div>

                      {/* Информация справа */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-modern-gray-900 group-hover:text-modern-primary-700 transition-colors mb-2 leading-snug">
                            {item.title}
                          </h2>
                          <p className="text-sm text-modern-gray-600 leading-relaxed line-clamp-3">
                            {item.shortDescription}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          {item.price ? (
                            <span className="text-2xl font-bold text-modern-primary-700">
                              {Number(item.price).toLocaleString('ru-RU')} ₽
                            </span>
                          ) : (
                            <span className="text-modern-gray-400 text-sm italic">Цена по запросу</span>
                          )}
                          <span className="text-sm font-semibold text-modern-primary-600 group-hover:underline">
                            Подробнее →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
