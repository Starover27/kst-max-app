import { useNavigate } from 'react-router-dom'

const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const IconBack = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" {...stroke} />
  </svg>
)

const IconArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconTax = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 3h7l4 4v14H7z" {...stroke} />
    <path d="M14 3v4h4" {...stroke} />
    <path d="M10 12h4M10 15h4" {...stroke} />
    <path d="M10 18h1.5" {...stroke} />
  </svg>
)

const IconDoc = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...stroke} />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" {...stroke} />
  </svg>
)

const IconShield = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...stroke} />
  </svg>
)

const IconDownload = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function DocumentsPage() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      {/* Top Bar */}
      <div className="topBar">
        <button className="iconBtn" aria-label="Назад" onClick={() => navigate(-1)}>
          {IconBack}
        </button>
        <span className="topBarTitle">Документы</span>
        <span style={{ width: 40 }} />
      </div>

      {/* Hero Banner: Tax Deduction */}
      <div
        className="taxHero"
        style={{
          margin: '0 0 16px',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fff 100%)',
          border: '1.5px solid var(--red-light, #FBEAEA)',
        }}
        onClick={() => navigate('/profile/tax-deduction')}
      >
        <div className="taxHeroIcon" style={{ color: 'var(--red, #e11d48)' }}>
          {IconTax}
        </div>
        <div className="taxHeroContent">
          <div className="taxHeroTitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Справка для налогового вычета</span>
            <span style={{ color: 'var(--red, #e11d48)', display: 'inline-flex' }}>{IconArrow}</span>
          </div>
          <div className="taxHeroDesc">
            Закажите справку об оплате медицинских услуг для возврата 13% НДФЛ через ФНС или Госуслуги.
          </div>
        </div>
      </div>

      {/* Main documents list */}
      <div className="profileMenu" style={{ margin: 0, padding: '4px 16px' }}>
        <div style={{ padding: '12px 2px 8px', fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Медицинские документы
        </div>

        <button className="menuRow" onClick={() => navigate('/profile/tax-deduction')}>
          <span style={{ color: 'var(--red, #e11d48)', display: 'inline-flex' }}>{IconTax}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>Заказ справки для налоговой</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Оформление вычета за 2022–2025 гг.</div>
          </div>
          <span className="arrow">{IconArrow}</span>
        </button>

        <button className="menuRow" onClick={() => navigate('/analysis')}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{IconDoc}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>Результаты анализов и выписки</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Лабораторные исследования и заключения</div>
          </div>
          <span className="arrow">{IconArrow}</span>
        </button>

        <div style={{ padding: '18px 2px 8px', fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Договоры и соглашения
        </div>

        <div className="menuRow" style={{ cursor: 'pointer' }} onClick={() => alert('Договор на оказание медицинских услуг зарегистрирован в системе клиники.')}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{IconDoc}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>Договор на медицинские услуги</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Типовой договор пациента № КСТ-2024</div>
          </div>
          <span style={{ color: 'var(--muted)', display: 'inline-flex' }}>{IconDownload}</span>
        </div>

        <div className="menuRow" style={{ cursor: 'pointer' }} onClick={() => alert('Согласие на обработку персональных данных подписано.')}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{IconShield}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>Согласие на обработку данных</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>ФЗ № 152 «О персональных данных»</div>
          </div>
          <span style={{ color: 'var(--muted)', display: 'inline-flex' }}>{IconDownload}</span>
        </div>

        <div className="menuRow" style={{ cursor: 'pointer' }} onClick={() => alert('Лицензия Л041-01189-27/00361284 на осуществление медицинской деятельности.')}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{IconShield}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>Лицензия клиники</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Регистрационный номер и реквизиты</div>
          </div>
          <span style={{ color: 'var(--muted)', display: 'inline-flex' }}>{IconDownload}</span>
        </div>
      </div>
    </div>
  )
}
