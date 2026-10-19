import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getHistory } from '../api/history'

function scoreColor(val) {
  if (val == null || isNaN(+val)) return '#9ca3af'
  if (+val >= 70) return '#16a34a'
  if (+val >= 40) return '#f59e0b'
  return '#dc2626'
}

function scoreBg(val) {
  if (val == null || isNaN(+val)) return '#f3f4f6'
  if (+val >= 70) return '#dcfce7'
  if (+val >= 40) return '#fef9c3'
  return '#fee2e2'
}

function MetricBadge({ value, suffix = '' }) {
  if (value == null) return <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>
  const n = +value
  const col = scoreColor(n)
  const bg = scoreBg(n)
  return (
    <span style={{
      display: 'inline-block', background: bg, color: col,
      fontWeight: 700, fontSize: '0.78rem', borderRadius: 8,
      padding: '3px 10px',
    }}>{isNaN(n) ? value : n % 1 === 0 ? n : n.toFixed(1)}{suffix}</span>
  )
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <i className="bi bi-arrow-down-up ms-1" style={{ opacity: 0.35, fontSize: '0.7rem' }}></i>
  return <i className={`bi bi-arrow-${sortDir === 'asc' ? 'up' : 'down'} ms-1`} style={{ fontSize: '0.7rem', color: '#4361ee' }}></i>
}

export default function HistoryPage() {
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const navigate = useNavigate()

  useEffect(() => {
    getHistory()
      .then((d) => setHistories(d.histories || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('asc') }
  }

  const sorted = [...histories].sort((a, b) => {
    const va = a[sortCol], vb = b[sortCol]
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : +va - +vb
    return sortDir === 'asc' ? cmp : -cmp
  })

  function exportCSV() {
    const headers = ['Date', 'Carbon (tCO₂)', 'Energy (kWh)', 'Waste (kg)', 'Social Score', 'Cost-Benefit', 'Sustainability', 'ROI (%)']
    const rows = sorted.map((h) => [
      new Date(h.created_at).toLocaleDateString(),
      h.carbon_emissions, h.energy_consumption, h.waste_production,
      h.eevta_score, h.cost_benefit, h.sustainability_score, h.roi,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sustainability_history.csv'
    a.click()
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const latestSus = sorted[0]?.sustainability_score
  const avgSus = sorted.length
    ? (sorted.reduce((s, h) => s + (+h.sustainability_score || 0), 0) / sorted.length).toFixed(1)
    : null
  const avgRoi = sorted.length
    ? (sorted.reduce((s, h) => s + (+h.roi || 0), 0) / sorted.length).toFixed(1)
    : null

  const COLS = [
    { key: 'created_at',          label: 'Date' },
    { key: 'carbon_emissions',    label: 'Carbon (tCO₂)' },
    { key: 'energy_consumption',  label: 'Energy (kWh)' },
    { key: 'waste_production',    label: 'Waste (kg)' },
    { key: 'eevta_score',         label: 'Social Score' },
    { key: 'cost_benefit',        label: 'Cost-Benefit' },
    { key: 'sustainability_score',label: 'Sustainability' },
    { key: 'roi',                 label: 'ROI (%)' },
  ]

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f1f5fb' }}>
      <Header />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '68px', overflow: 'hidden' }}>

        {/* ── Hero bar ── */}
        <div style={{
          background: 'linear-gradient(120deg, #0d1b4b 0%, #1565c0 60%, #1e88e5 100%)',
          padding: '28px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="bi bi-clock-history" style={{ color: '#fff', fontSize: '1.3rem' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: "'Raleway',sans-serif" }}>
                Calculation History
              </h1>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: 0, marginTop: 3 }}>
                Track your sustainability progress over time
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {sorted.length > 0 && (
              <button onClick={exportCSV} style={{
                padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <i className="bi bi-download"></i> Export CSV
              </button>
            )}
            <button onClick={() => navigate('/dashboard')} style={{
              padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem',
              background: 'rgba(255,255,255,0.95)', border: 'none',
              color: '#1565c0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <i className="bi bi-speedometer2"></i> Dashboard
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p style={{ color: '#9ca3af', marginTop: 12, fontSize: '0.88rem' }}>Loading history…</p>
              </div>
            </div>
          ) : sorted.length === 0 ? (

            /* ── Empty state ── */
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                background: '#fff', borderRadius: 20, padding: '56px 64px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9',
                textAlign: 'center', maxWidth: 480, width: '100%',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <i className="bi bi-clock-history" style={{ fontSize: '2rem', color: '#4361ee' }}></i>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: 10, fontFamily: "'Raleway',sans-serif" }}>
                  No History Yet
                </h3>
                <p style={{ fontSize: '0.87rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 28 }}>
                  Your sustainability calculations will appear here after you use our assessment tools. Start with a carbon or energy calculation.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { to: '/carbon',       icon: 'bi-fire',          label: 'Carbon' },
                    { to: '/energy',       icon: 'bi-lightning-fill', label: 'Energy' },
                    { to: '/waste',        icon: 'bi-trash3-fill',    label: 'Waste' },
                    { to: '/sustainability', icon: 'bi-tree-fill',    label: 'Sustainability' },
                  ].map((item) => (
                    <Link key={item.to} to={item.to} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 10,
                      background: 'linear-gradient(135deg, #4361ee, #3f37c9)',
                      color: '#fff', textDecoration: 'none',
                      fontWeight: 700, fontSize: '0.82rem',
                    }}>
                      <i className={`bi ${item.icon}`}></i> {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            <>
              {/* ── Stat cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  { label: 'Total Records', value: sorted.length, suffix: '', icon: 'bi-list-ol', color: '#4361ee', bg: '#e0e7ff' },
                  { label: 'Latest Score', value: latestSus != null ? (+latestSus).toFixed(0) : '—', suffix: '', icon: 'bi-star-fill', color: scoreColor(latestSus), bg: scoreBg(latestSus) },
                  { label: 'Avg Sustainability', value: avgSus ?? '—', suffix: '', icon: 'bi-tree-fill', color: scoreColor(avgSus), bg: scoreBg(avgSus) },
                  { label: 'Avg ROI', value: avgRoi ?? '—', suffix: '%', icon: 'bi-graph-up-arrow', color: scoreColor(avgRoi), bg: scoreBg(avgRoi) },
                ].map((card) => (
                  <div key={card.label} style={{
                    background: '#fff', borderRadius: 14, padding: '18px 20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <i className={`bi ${card.icon}`} style={{ color: card.color, fontSize: '1.1rem' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', fontFamily: "'Raleway',sans-serif", lineHeight: 1 }}>
                        {card.value}{card.suffix}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>
                        {card.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Table ── */}
              <div style={{
                background: '#fff', borderRadius: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 22px', borderBottom: '1px solid #f1f5f9',
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                    All Records
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                    {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'}
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {COLS.map((col) => (
                          <th key={col.key}
                            onClick={() => handleSort(col.key)}
                            style={{
                              padding: '11px 16px', textAlign: 'left', cursor: 'pointer',
                              fontWeight: 700, fontSize: '0.72rem', color: '#6b7280',
                              textTransform: 'uppercase', letterSpacing: '0.8px',
                              whiteSpace: 'nowrap', borderBottom: '1px solid #f1f5f9',
                              userSelect: 'none',
                            }}>
                            {col.label}
                            <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((h, idx) => {
                        const d = new Date(h.created_at)
                        return (
                          <tr key={idx} style={{
                            borderBottom: idx < sorted.length - 1 ? '1px solid #f8fafc' : 'none',
                            transition: 'background 0.15s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}
                          >
                            <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.84rem' }}>
                                {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>
                                {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontWeight: 600, color: '#374151' }}>{(+h.carbon_emissions).toFixed(2)}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontWeight: 600, color: '#374151' }}>{(+h.energy_consumption).toFixed(2)}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontWeight: 600, color: '#374151' }}>{(+h.waste_production).toFixed(2)}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontWeight: 600, color: '#374151' }}>{(+h.eevta_score).toFixed(0)}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <MetricBadge value={h.cost_benefit} suffix="%" />
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <MetricBadge value={h.sustainability_score} />
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <MetricBadge value={h.roi} suffix="%" />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{
                  padding: '13px 22px', borderTop: '1px solid #f1f5f9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f8fafc',
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    Showing all {sorted.length} {sorted.length === 1 ? 'record' : 'records'}
                  </span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: '#dcfce7', display: 'inline-block' }}></span> ≥ 70 Good
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: '#fef9c3', display: 'inline-block', marginLeft: 8 }}></span> ≥ 40 Average
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: '#fee2e2', display: 'inline-block', marginLeft: 8 }}></span> &lt; 40 Poor
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
