import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface EquipmentData {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  price: number | null;
  imageUrl: string | null;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function getEquipmentItem(slug: string): Promise<EquipmentData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/equipment/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipmentItem(slug);
  if (!item) return { title: 'Товар не найден — ООО «Инженер-центр»' };
  return {
    title: `${item.metaTitle || item.title} — ООО «Инженер-центр»`,
    description: item.metaDescription || item.shortDescription,
  };
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getEquipmentItem(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12">

              {/* Навигация назад */}
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 text-sm text-modern-gray-500 hover:text-modern-primary-600 mb-8 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Назад к каталогу
              </Link>

              {/* Верхний блок: фото + инфо */}
              <div className="flex flex-col lg:flex-row gap-10 mb-12">
                {/* Изображение */}
                <div className="relative w-full lg:w-96 h-72 lg:h-80 rounded-xl overflow-hidden bg-modern-gray-100 flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={BACKEND_URL + item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 384px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-modern-gray-300 text-sm">
                      Нет изображения
                    </div>
                  )}
                </div>

                {/* Информация */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-modern-gray-900 mb-4 leading-tight">
                      {item.title}
                    </h1>
                    <p className="text-modern-gray-600 text-base leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="mt-8">
                    {item.price ? (
                      <p className="text-4xl font-bold text-modern-primary-700 mb-6">
                        {Number(item.price).toLocaleString('ru-RU')} ₽
                      </p>
                    ) : (
                      <p className="text-xl text-modern-gray-400 italic mb-6">Цена по запросу</p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <a
                        href="tel:+78443300801"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors font-semibold"
                      >
                        <PhoneIcon className="w-5 h-5" />
                        8 (8443) 300-801
                      </a>
                      <a
                        href="mailto:mail@ec-1c.ru"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-modern-white text-modern-primary-700 border-2 border-modern-primary-600 rounded-xl hover:bg-modern-primary-50 transition-colors font-semibold"
                      >
                        <EnvelopeIcon className="w-5 h-5" />
                        mail@ec-1c.ru
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Разделитель */}
              {item.content && (
                <>
                  <div className="border-t-2 border-modern-primary-100 mb-10" />
                  {/* Полное описание */}
                  <div
                    className="prose prose-lg max-w-none text-modern-gray-700
                      prose-headings:text-modern-gray-900
                      prose-a:text-modern-primary-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-modern-gray-900
                      prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </>
              )}

            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
