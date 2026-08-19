import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Filter = 'all' | 'ready' | 'work'

const ITEMS = [
  { id: 1, title: 'Общий анализ крови', date: '12 августа 2024', status: 'Готов' },
  { id: 2, title: 'Биохимия крови', date: '10 августа 2024', status: 'Готов' },
  { id: 3, title: 'Анализ мочи общий', date: '5 августа 2024', status: 'Готов' },
]

export default function AnalysisPage() {
  const nav = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')

  const items = ITEMS.filter((it) =>
    filter === 'all' ? true : filter === 'ready' ? it.status === 'Готов' : it.status === 'В работе',
  )

  return (
    <div className="page pageWide" style={{ paddingBottom: 96 }}>
      <div style={{ padding: '0 16px' }}>
        <div className="topBar">
          <button className="iconBtn" aria-label="Назад" onClick={() => nav(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="topBarTitle">Анализы и результаты</span>
          <span style={{ width: 40 }} />
        </div>
      </div>

      <div className="chipsRow">
        <button className={`chip ${filter === 'all' ? 'activeDark' : ''}`} onClick={() => setFilter('all')}>Все</button>
        <button className={`chip ${filter === 'ready' ? 'activeDark' : ''}`} onClick={() => setFilter('ready')}>Готовые</button>
        <button className={`chip ${filter === 'work' ? 'activeDark' : ''}`} onClick={() => setFilter('work')}>В работе</button>
      </div>

      <div style={{ padding: '0 16px' }}>
        {items.map((it) => (
          <div key={it.id} className="analysisCard">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div className="analysisTitle">{it.title}</div>
                <div className="analysisDate">{it.date}</div>
              </div>
              <span className={it.status === 'Готов' ? 'statusReady' : 'statusWork'}>{it.status}</span>
            </div>
            <button className="btnGhost" style={{ marginTop: 12 }}>
              Смотреть результат
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 19.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
        {items.length === 0 && <div className="empty">Нет результатов по выбранному фильтру</div>}
      </div>
    </div>
  )
}
