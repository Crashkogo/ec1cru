import type { Metadata } from 'next';
import './globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import Notification from '@/components/ui/Notification';

export const metadata: Metadata = {
  title: 'Инженер-Центр — Услуги 1С в Волжском и Волгоградской области',
  description: 'Внедрение, сопровождение и обучение 1С в Волжском и Волгоградской области. IT-аутсорсинг, готовые решения для бизнеса. 30 лет опыта, 600+ клиентов.',
  keywords: ['1С', 'Волжский', 'Волгоградская область', 'внедрение 1С', 'сопровождение 1С', 'IT-аутсорсинг', 'обучение 1С'],
  openGraph: {
    title: 'Инженер-Центр — Услуги 1С в Волжском и Волгоградской области',
    description: 'Внедрение, сопровождение и обучение 1С в Волжском и Волгоградской области. IT-аутсорсинг, готовые решения для бизнеса.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Инженер-Центр',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ООО «Инженер-центр»',
  alternateName: 'Инженер-центр',
  description: 'Внедрение, сопровождение и обучение 1С. IT-аутсорсинг в Волжском и Волгоградской области.',
  url: 'https://ec-1c.ru',
  telephone: '+7-8443-300-801',
  email: 'mail@ec-1c.ru',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Карбышева, 76, БЦ Акрас-Центр, офис 825/827',
    addressLocality: 'Волжский',
    addressRegion: 'Волгоградская область',
    postalCode: '404120',
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.779538,
    longitude: 44.767027,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '17:30',
    },
  ],
  sameAs: [
    'https://2gis.ru/volzhsky/firm/70000001026573332',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <NotificationProvider>
          {children}
          <Notification />
        </NotificationProvider>
      </body>
    </html>
  );
}
