import { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Наша команда — ООО «Инженер-центр»',
  description:
    'Познакомьтесь с командой специалистов ООО «Инженер-центр» — менеджерами, консультантами и техническими экспертами в области автоматизации на 1С.',
};

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  section: string;
  photoUrl: string | null;
  sortOrder: number;
}

const SECTION_ORDER = [
  'MANAGERS',
  'CONSULTATION',
  'ITS',
  'IMPLEMENTATION',
  'TECH',
] as const;

const SECTION_LABELS: Record<string, string> = {
  MANAGERS:       'Менеджеры',
  CONSULTATION:   'Сектор Линия консультаций',
  ITS:            'Сектор ИТС',
  IMPLEMENTATION: 'Сектор Внедрения',
  TECH:           'Технический отдел',
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  '';

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/team-members?_start=0&_end=500&_sort=sortOrder&_order=asc`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function MemberCard({ member }: { member: TeamMember }) {
  const photoSrc = member.photoUrl ? BACKEND_URL + member.photoUrl : null;
  const initials =
    (member.firstName.charAt(0) + member.lastName.charAt(0)).toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-modern overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-modern-gray-100">
      {/* Фото */}
      <div className="relative w-full aspect-square bg-modern-gray-100">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={`${member.firstName} ${member.lastName}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-modern-primary-400 to-modern-primary-700">
            <span className="text-white text-4xl font-bold select-none">{initials}</span>
          </div>
        )}
      </div>
      {/* Текст */}
      <div className="p-4 text-center">
        <p className="font-semibold text-modern-gray-900 text-base leading-tight">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-sm text-modern-gray-500 mt-1">{member.position}</p>
      </div>
    </div>
  );
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  const grouped = SECTION_ORDER.reduce<Record<string, TeamMember[]>>((acc, key) => {
    acc[key] = members.filter((m) => m.section === key);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const hasAnyMembers = members.length > 0;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-modern-primary-700 mb-4">
            Наша команда
          </h1>
          <p className="text-lg text-modern-gray-600 max-w-2xl mx-auto">
            Профессионалы, которые помогают бизнесу работать эффективнее
          </p>
        </div>

        {!hasAnyMembers && (
          <p className="text-center text-modern-gray-500 py-20">
            Информация о команде скоро появится.
          </p>
        )}

        {/* Разделы */}
        {SECTION_ORDER.map((sectionKey) => {
          const sectionMembers = grouped[sectionKey];
          if (!sectionMembers || sectionMembers.length === 0) return null;
          return (
            <section key={sectionKey} className="mb-14">
              <h2 className="text-2xl font-semibold text-modern-gray-800 mb-6 pb-3 border-b border-modern-gray-200">
                {SECTION_LABELS[sectionKey]}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {sectionMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
