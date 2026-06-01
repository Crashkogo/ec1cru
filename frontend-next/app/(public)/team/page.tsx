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

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/team-members?_start=0&_end=500`,
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
    <div className="w-48 bg-white rounded-xl shadow-modern border border-modern-gray-100 flex flex-col items-center text-center p-4 hover:shadow-modern-lg hover:-translate-y-1 transition-all duration-300">
      {/* Квадратное фото 96×96px */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 mb-3">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={`${member.firstName} ${member.lastName}`}
            fill
            className="object-cover object-top"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-modern-primary-400 to-modern-primary-700">
            <span className="text-white text-2xl font-bold select-none">{initials}</span>
          </div>
        )}
      </div>
      {/* Текст */}
      <p className="font-semibold text-modern-gray-900 text-base leading-snug">
        {member.firstName} {member.lastName}
      </p>
      <p className="text-sm text-modern-gray-500 mt-1 leading-snug">{member.position}</p>
    </div>
  );
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  const grouped = SECTION_ORDER.reduce<Record<string, TeamMember[]>>((acc, key) => {
    acc[key] = members
      .filter((m) => m.section === key)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const hasAnyMembers = members.length > 0;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12">
              {/* Заголовок */}
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-modern-primary-700">
                Наша команда
              </h1>

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
                    <h2 className="text-2xl font-semibold text-modern-gray-800 mb-6 pb-3 border-b border-modern-gray-200 text-center">
                      {SECTION_LABELS[sectionKey]}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                      {sectionMembers.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
