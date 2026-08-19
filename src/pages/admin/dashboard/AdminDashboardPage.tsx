import Page from '../../../shared/ui/Page';

// Моковые данные для KPI
const mockKpiData = {
  totalUsers: 1234,
  appointmentsToday: 42,
  appointmentsUpcoming: 156,
  totalDoctors: 28,
  totalAnalyses: 3201,
  medregStatus: 'Connected',
};

// Моковые данные для последних событий
const mockEvents = [
  { id: 1, user: 'Иванов И.И.', doctor: 'Петрова А.С.', date: '2023-10-26 10:00', type: 'Запись' },
  { id: 2, user: 'Сидоров П.М.', doctor: 'Козлов В.Н.', date: '2023-10-26 09:30', type: 'Отмена' },
  { id: 3, user: 'Кузнецова Е.А.', doctor: 'Волкова Д.К.', date: '2023-10-25 15:45', type: 'Анализ' },
  { id: 4, user: 'Морозов Л.О.', doctor: 'Смирнова Р.Т.', date: '2023-10-25 14:15', type: 'Запись' },
  { id: 5, user: 'Волкова Д.К.', doctor: 'Козлов В.Н.', date: '2023-10-25 11:00', type: 'Профиль' },
];

// Компонент для отдельной KPI карточки
const KpiCard = ({ title, value, subtitle, style }: { title: string; value: string | number; subtitle?: string; style?: React.CSSProperties }) => (
  <div style={{
    background: 'var(--color-surface)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: '120px', // Минимальная ширина для карточек
    ...style, // Распространяем дополнительный стиль
  }}>
    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-accent)', lineHeight: 'var(--line-height-heading)' }}>{value}</h3>
    <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-base)' }}>{title}</p>
    {subtitle && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-base)' }}>{subtitle}</p>}
  </div>
);

// Компонент для отдельного события
const EventItem = ({ event }: { event: typeof mockEvents[0] }) => (
  <div style={{
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 'var(--line-height-base)' }}>{event.user} - {event.doctor}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-base)' }}>{event.type}</div>
    </div>
    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-base)' }}>{event.date}</div>
  </div>
);

export default function AdminDashboardPage() {
  // Убираю состояния и useEffect, использую моки напрямую
  // const [kpiData, setKpiData] = useState(mockKpiData);
  // const [events, setEvents] = useState(mockEvents);

  // В реальном приложении здесь будет useEffect для загрузки данных с сервера
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const kpi = await fetchKpiData();
  //     const events = await fetchRecentEvents();
  //     setKpiData(kpi);
  //     setEvents(events);
  //   };
  //   fetchData();
  // }, []);

  return (
    <Page>
      <main style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', width: '100%', fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
        <h1 style={{ padding: '0 1.5rem 1rem 1.5rem', margin: 0, borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-h1)', fontWeight: 700, lineHeight: 'var(--line-height-heading)' }}>Dashboard</h1>

        <section style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <KpiCard title="Пользователи" value={mockKpiData.totalUsers} />
          <KpiCard title="Записи сегодня" value={mockKpiData.appointmentsToday} />
          <KpiCard title="Записи на ближайшие дни" value={mockKpiData.appointmentsUpcoming} />
          <KpiCard title="Врачи" value={mockKpiData.totalDoctors} />
          <KpiCard title="Анализы" value={mockKpiData.totalAnalyses} />
          <KpiCard
            title="Статус MedReg"
            value={mockKpiData.medregStatus}
            subtitle={mockKpiData.medregStatus === 'Connected' ? 'OK' : 'Error'}
            style={{ background: mockKpiData.medregStatus === 'Connected' ? 'color-mix(in srgb, var(--color-success), transparent 90%)' : 'color-mix(in srgb, var(--color-error), transparent 90%)' }}
          />
        </section>

        <section style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: 'var(--font-size-h2)', fontWeight: 700, lineHeight: 'var(--line-height-heading)' }}>Последние события</h2>
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}>
            {mockEvents.length > 0 ? (
              mockEvents.map(event => <EventItem key={event.id} event={event} />)
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-base)' }}>Событий нет</div>
            )}
          </div>
        </section>
      </main>
    </Page>
  );
}