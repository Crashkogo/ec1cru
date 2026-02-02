import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

interface TestimonialData {
  id: number;
  companyName: string;
  content: string;
  slug: string;
  avatar?: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function getTestimonial(slug: string): Promise<TestimonialData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/testimonials/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const testimonial = await getTestimonial(slug);

  if (!testimonial) {
    return {
      title: 'Отзыв не найден - ООО «Инженер-центр»',
    };
  }

  return {
    title: `${testimonial.metaTitle || `Отзыв ${testimonial.companyName}`} - ООО «Инженер-центр»`,
    description: testimonial.metaDescription || testimonial.content.substring(0, 160),
  };
}

export default async function TestimonialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const testimonial = await getTestimonial(slug);

  if (!testimonial) {
    notFound();
  }

  const sanitizeHTML = (html: string) => html;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <div className="mb-8">
            <Link
              href="/otzyvy"
              className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все отзывы
            </Link>
          </div>

          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12 border-b border-modern-gray-200">
              {/* Иконка кавычек */}
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-modern-primary-600 opacity-20"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={`Логотип ${testimonial.companyName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-modern-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-modern-primary-100 to-modern-primary-200 flex items-center justify-center border-2 border-modern-primary-300">
                    <span className="text-modern-primary-700 font-semibold text-2xl">
                      {testimonial.companyName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-modern-gray-900">
                    {testimonial.companyName}
                  </h1>
                  <p className="text-modern-gray-500">Клиент</p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-modern-gray-900 prose-headings:font-semibold
                  prose-p:text-modern-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-modern-primary-600 prose-a:hover:text-modern-primary-700 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-modern-gray-900 prose-strong:font-semibold
                  prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700
                  prose-li:mb-2 prose-li:leading-relaxed
                  prose-blockquote:border-l-4 prose-blockquote:border-modern-primary-500 prose-blockquote:bg-modern-primary-50 prose-blockquote:rounded-r-lg prose-blockquote:p-6 prose-blockquote:my-6"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(testimonial.content) }}
              />
            </div>
          </article>

          <div className="mt-12 text-center">
            <Link
              href="/otzyvy"
              className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все отзывы
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
