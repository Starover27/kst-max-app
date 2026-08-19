import { useState } from 'react'
import clinicFallback from '../../assets/clinic.jpg'

interface ClinicBranch {
  id: string
  name: string
  subtitle: string
  address: string
  photo: string
  ratingYandex: string
  rating2Gis: string
  links: {
    yandex: string
    gis: string
    site: string
  }
}

const CLINIC_BRANCHES: ClinicBranch[] = [
  {
    id: 'sheronova-6',
    name: 'Взрослое отделение',
    subtitle: 'ЖК «Дендрарий»',
    address: 'г. Хабаровск, ул. Шеронова, 6',
    photo: 'https://kst27.ru/images/photo-clinika/p1dl48c2pqfj5126gf90educut14.jpg',
    ratingYandex: '4.8',
    rating2Gis: '4.7',
    links: {
      yandex: 'https://yandex.ru/maps/org/klinika_sovremennykh_tekhnologiy/1271609106/reviews/',
      gis: 'https://2gis.ru/khabarovsk/branches/4926348963352079/firm/4926340373581893/135.087468%2C48.467898/tab/reviews?m=135.08727%2C48.468637%2F16',
      site: 'https://kst27.ru/index.php/otzyvy',
    },
  },
  {
    id: 'sheronova-8',
    name: 'Центр здорового ребёнка и детское отделение',
    subtitle: '1 и 2 этажи (ЖК «Дендрарий»)',
    address: 'г. Хабаровск, ул. Шеронова, 8 корпус 3',
    photo: 'https://kst27.ru/images/photo-clinika/p1dl48c2pp13vv2k01nnoovc1visu.jpg',
    ratingYandex: '4.9',
    rating2Gis: '4.8',
    links: {
      yandex: 'https://yandex.ru/maps/org/klinika_sovremennykh_tekhnologiy/1179471923/reviews/',
      gis: 'https://2gis.ru/khabarovsk/branches/4926348963352079/firm/70000001029160719/135.08727%2C48.468637/tab/reviews?m=135.08727%2C48.468637%2F16',
      site: 'https://kst27.ru/index.php/otzyvy',
    },
  },
  {
    id: 'rudneva-17',
    name: 'Многопрофильная клиника',
    subtitle: 'Северный микрорайон, ост. «Победа»',
    address: 'г. Хабаровск, ул. Руднева, 17',
    photo: 'https://kst27.ru/images/photo-clinika/13.jpeg',
    ratingYandex: '4.8',
    rating2Gis: '4.6',
    links: {
      yandex: 'https://yandex.ru/maps/org/klinika_sovremennykh_tekhnologiy/218086208940/reviews/',
      gis: 'https://2gis.ru/khabarovsk/branches/4926348963352079/firm/4926340373418351/135.034898%2C48.558207/tab/reviews?m=135.034898%2C48.558207%2F16',
      site: 'https://kst27.ru/index.php/otzyvy',
    },
  },
]

interface ReviewsModalProps {
  onClose: () => void
}

export function ReviewsModal({ onClose }: ReviewsModalProps) {
  const [selectedBranch, setSelectedBranch] = useState<ClinicBranch | null>(null)

  const handleOpenLink = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    const webApp = (window as unknown as { WebApp?: { openLink?: (url: string) => void } })?.WebApp
    if (webApp && typeof webApp.openLink === 'function') {
      e.preventDefault()
      webApp.openLink(url)
    }
    // Если не в WebApp, браузер штатно переходит по href с target="_blank"
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" style={{ maxWidth: 460, padding: 0 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {selectedBranch && (
              <button
                className="iconBtn"
                style={{ width: 32, height: 32 }}
                onClick={() => setSelectedBranch(null)}
                aria-label="Назад к филиалам"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
              {selectedBranch ? 'Выберите площадку' : 'Оставить отзыв'}
            </h3>
          </div>
          <button className="iconBtn" style={{ width: 32, height: 32 }} onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', maxHeight: '75vh', overflowY: 'auto' }}>
          {!selectedBranch ? (
            <div>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--muted)' }}>
                Выберите филиал клиники, в котором вы проходили приём:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {CLINIC_BRANCHES.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBranch(b)}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 16,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'var(--surface)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div style={{ height: 120, width: '100%', position: 'relative', background: '#e5e7eb' }}>
                      <img
                        src={b.photo}
                        alt={b.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = clinicFallback
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '3px 8px',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        ⭐ Яндекс {b.ratingYandex} · 2ГИС {b.rating2Gis}
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{b.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--red, #e11d48)', fontWeight: 600, marginTop: 2 }}>
                        {b.subtitle}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{b.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Selected Branch Summary Card */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  background: '#f9fafb',
                  borderRadius: 14,
                  padding: 12,
                  marginBottom: 18,
                  border: '1px solid var(--border)',
                }}
              >
                <img
                  src={selectedBranch.photo}
                  alt={selectedBranch.name}
                  style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flex: 'none' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = clinicFallback
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedBranch.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{selectedBranch.address}</div>
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                Где вы хотите оставить отзыв?
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* 2GIS */}
                <a
                  href={selectedBranch.links.gis}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenLink(e, selectedBranch.links.gis)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    textDecoration: 'none',
                    color: 'inherit',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#16a34a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      flex: 'none',
                    }}
                  >
                    2ГИС
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Отзыв в 2ГИС</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Рейтинг филиала: ⭐ {selectedBranch.rating2Gis}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Yandex Maps */}
                <a
                  href={selectedBranch.links.yandex}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenLink(e, selectedBranch.links.yandex)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    textDecoration: 'none',
                    color: 'inherit',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#fc3f1d',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 16,
                      flex: 'none',
                    }}
                  >
                    Я
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Яндекс Карты</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Рейтинг филиала: ⭐ {selectedBranch.ratingYandex}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Clinic Website */}
                <a
                  href={selectedBranch.links.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenLink(e, selectedBranch.links.site)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    textDecoration: 'none',
                    color: 'inherit',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--red, #e11d48)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.8" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#fff" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Сайт клиники (kst27.ru)</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Официальная форма отзыва руководству</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
