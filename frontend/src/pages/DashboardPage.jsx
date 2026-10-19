import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import Header from '../components/Header'
import { getDashboardData } from '../api/dashboard'
import { useAuth } from '../context/AuthContext'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const SORT_LABELS = {
  sustainability_score: 'Sustainability',
  roi: 'ROI',
  cost_benefit: 'Cost-Benefit',
  composite_score: 'Composite',
}

function ChangeBadge({ val, unit = '%', inverse = false }) {
  if (val == null || val === 0) return (
    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', borderRadius: 6, padding: '2px 8px' }}>
      0{unit}
    </span>
  )
  const positive = inverse ? val < 0 : val > 0
  const color = positive ? '#16a34a' : '#dc2626'
  const bg = positive ? '#dcfce7' : '#fee2e2'
  const icon = positive ? 'bi-arrow-up' : 'bi-arrow-down'
  return (
    <span style={{ fontSize: '0.7rem', fontWeight: 700, color, background: bg, borderRadius: 6, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <i className={`bi ${icon}`} style={{ fontSize: '0.62rem' }} />
      {Math.abs(val)}{unit}
    </span>
  )
}

function RankBadge({ rank }) {
  if (rank === 1) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontWeight: 800, fontSize: '0.8rem', borderRadius: 8, padding: '4px 10px', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}>
      <i className="bi bi-trophy-fill" style={{ fontSize: '0.72rem' }} /> 1
    </span>
  )
  if (rank === 2) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#94a3b8,#64748b)', color: '#fff', fontWeight: 800, fontSize: '0.8rem', borderRadius: 8, padding: '4px 10px', boxShadow: '0 2px 6px rgba(100,116,139,0.3)' }}>
      <i className="bi bi-trophy-fill" style={{ fontSize: '0.72rem' }} /> 2
    </span>
  )
  if (rank === 3) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#cd7c3b,#b45309)', color: '#fff', fontWeight: 800, fontSize: '0.8rem', borderRadius: 8, padding: '4px 10px', boxShadow: '0 2px 6px rgba(180,83,9,0.25)' }}>
      <i className="bi bi-trophy-fill" style={{ fontSize: '0.72rem' }} /> 3
    </span>
  )
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '0.82rem', borderRadius: 7 }}>
      {rank}
    </span>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState('sustainability_score')
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#4361ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading dashboard…</p>
      </div>
    </>
  )

  if (!data) return null

  const {
    your_company, industry_stats, radar_labels, radar_your_data, radar_industry_data,
    sorted_data, my_rank, roi_change, sus_change, cost_change,
    energy_change, waste_change, last_update,
  } = data

  const radarChartData = {
    labels: radar_labels,
    datasets: [
      {
        label: 'Your Company',
        data: radar_your_data,
        backgroundColor: 'rgba(67,97,238,0.12)',
        borderColor: '#4361ee',
        borderWidth: 2,
        pointBackgroundColor: '#4361ee',
        pointRadius: 4,
      },
      {
        label: 'Industry Avg',
        data: radar_industry_data,
        backgroundColor: 'rgba(100,116,139,0.06)',
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        pointBackgroundColor: '#94a3b8',
        pointRadius: 3,
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: '#475569', font: { size: 11 }, boxWidth: 20 } } },
    scales: {
      r: {
        angleLines: { color: '#e2e8f0' },
        grid: { color: '#e2e8f0' },
        pointLabels: { color: '#475569', font: { size: 10 } },
        ticks: { color: '#94a3b8', backdropColor: 'transparent', font: { size: 9 } },
        suggestedMin: 0, suggestedMax: 100,
      },
    },
  }

  const currentRanking = sorted_data?.[sortKey] || []

  const kpis = [
    {
      color: '#4361ee', bg: '#eff2ff', border: '#c7d2fe',
      icon: 'bi-graph-up-arrow',
      value: your_company ? `${(+your_company.roi).toFixed(1)}%` : '—',
      label: 'ROI',
      change: <ChangeBadge val={roi_change} unit="%" />,
    },
    {
      color: '#10b981', bg: '#d1fae5', border: '#6ee7b7',
      icon: 'bi-tree',
      value: your_company ? (+your_company.sustainability_score).toFixed(1) : '—',
      label: 'SUSTAINABILITY',
      change: <ChangeBadge val={sus_change} unit=" pts" />,
    },
    {
      color: '#f59e0b', bg: '#fef3c7', border: '#fcd34d',
      icon: 'bi-cash-coin',
      value: your_company ? (+your_company.cost_benefit).toFixed(2) : '—',
      label: 'COST-BENEFIT',
      change: <ChangeBadge val={cost_change} unit="%" />,
    },
    {
      color: '#06b6d4', bg: '#cffafe', border: '#67e8f9',
      icon: 'bi-trophy',
      value: my_rank?.[sortKey] ? `#${my_rank[sortKey]}` : '—',
      label: 'YOUR RANK',
      change: null,
    },
  ]

  const perfItems = your_company && industry_stats ? [
    {
      label: 'ROI',
      yours: +your_company.roi,
      avg: +industry_stats.avg_roi,
      fill: 'linear-gradient(90deg,#4361ee,#818cf8)',
      good: +your_company.roi >= +industry_stats.avg_roi,
    },
    {
      label: 'Sustainability',
      yours: +your_company.sustainability_score,
      avg: +industry_stats.avg_sustainability,
      fill: 'linear-gradient(90deg,#10b981,#34d399)',
      good: +your_company.sustainability_score >= +industry_stats.avg_sustainability,
    },
    {
      label: 'Carbon Score',
      yours: +your_company.carbon_score,
      avg: +industry_stats.avg_carbon,
      fill: 'linear-gradient(90deg,#ef4444,#f87171)',
      good: +your_company.carbon_score >= +industry_stats.avg_carbon,
    },
  ] : []

  const changeItems = your_company ? [
    {
      icon: 'bi-tree',
      color: sus_change > 0 ? '#16a34a' : sus_change < 0 ? '#dc2626' : '#64748b',
      bg: sus_change > 0 ? '#dcfce7' : sus_change < 0 ? '#fee2e2' : '#f1f5f9',
      title: 'Sustainability Score',
      sub: sus_change > 0 ? `+${sus_change} pts since last run` : sus_change < 0 ? `${sus_change} pts since last run` : 'No change since last run',
      badge: <ChangeBadge val={sus_change} unit=" pts" />,
    },
    {
      icon: 'bi-lightning-charge',
      color: energy_change <= 0 ? '#16a34a' : '#dc2626',
      bg: energy_change <= 0 ? '#dcfce7' : '#fee2e2',
      title: 'Energy Consumption',
      sub: energy_change > 0 ? `Up ${energy_change}% since last run` : energy_change < 0 ? `Down ${Math.abs(energy_change)}% since last run` : 'No change since last run',
      badge: <ChangeBadge val={energy_change} unit="%" inverse />,
    },
    {
      icon: 'bi-recycle',
      color: waste_change <= 0 ? '#16a34a' : '#d97706',
      bg: waste_change <= 0 ? '#dcfce7' : '#fef3c7',
      title: 'Waste Production',
      sub: waste_change > 0 ? `Up ${waste_change}% since last run` : waste_change < 0 ? `Reduced ${Math.abs(waste_change)}% since last run` : 'No change since last run',
      badge: <ChangeBadge val={waste_change} unit="%" inverse />,
    },
    {
      icon: 'bi-cash-coin',
      color: cost_change > 0 ? '#16a34a' : cost_change < 0 ? '#dc2626' : '#64748b',
      bg: cost_change > 0 ? '#dcfce7' : cost_change < 0 ? '#fee2e2' : '#f1f5f9',
      title: 'Cost-Benefit Ratio',
      sub: cost_change > 0 ? `+${cost_change}% since last run` : cost_change < 0 ? `${cost_change}% since last run` : 'No change since last run',
      badge: <ChangeBadge val={cost_change} unit="%" />,
    },
  ] : []

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter',sans-serif" }}>
      <Header />

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#1d4ed8 100%)',
        padding: '36px 0 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', top: -200, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', bottom: -60, left: '30%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '100%', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 20, padding: '3px 12px', marginBottom: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Live</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', fontFamily: "'Raleway',sans-serif", margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="bi bi-speedometer2" style={{ color: '#818cf8' }} />
              Performance Dashboard
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>
              Monitor your ESG position and benchmark against industry peers
            </p>
          </div>
          {user && your_company && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 20px', backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#4361ee,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-building" style={{ color: '#fff', fontSize: '1.1rem' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Logged in as</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{your_company.company_name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page body — full width */}
      <div style={{ padding: '28px 32px 56px' }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {kpis.map((k) => (
            <div key={k.label} style={{
              background: '#fff',
              border: `1px solid ${k.border}`,
              borderTop: `4px solid ${k.color}`,
              borderRadius: 14,
              padding: '20px 22px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`bi ${k.icon}`} style={{ color: k.color, fontSize: '1.05rem' }} />
                </div>
                {k.change}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', fontFamily: "'Raleway',sans-serif", lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: 6 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid — full width, table takes all remaining space */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, alignItems: 'start' }}>

          {/* Rankings table */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-bar-chart-line-fill" style={{ color: '#4361ee' }} />
                Competitive Rankings
              </span>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setSortOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#eff2ff', border: '1.5px solid #c7d2fe',
                    borderRadius: 8, padding: '6px 14px', color: '#4361ee',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Sort: {SORT_LABELS[sortKey]} <i className="bi bi-chevron-down" style={{ fontSize: '0.68rem' }} />
                </button>
                {sortOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '110%', zIndex: 200,
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: 10, overflow: 'hidden', minWidth: 170,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}>
                    {Object.entries(SORT_LABELS).map(([k, v]) => (
                      <button key={k} onClick={() => { setSortKey(k); setSortOpen(false) }} style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 16px',
                        background: sortKey === k ? '#eff2ff' : 'transparent',
                        border: 'none',
                        color: sortKey === k ? '#4361ee' : '#374151',
                        fontSize: '0.85rem', fontWeight: sortKey === k ? 700 : 400, cursor: 'pointer',
                      }}>
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['RANK', 'COMPANY', 'INDUSTRY', 'ROI', 'SUSTAINABILITY', 'CBR', 'SOCIAL'].map(h => (
                      <th key={h} style={{
                        padding: '10px 18px', fontSize: '0.65rem', fontWeight: 700,
                        color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px',
                        textAlign: h === 'RANK' ? 'center' : 'left',
                        borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRanking.map((co, i) => {
                    const isMe = co.user__username === user?.username
                    return (
                      <tr key={i} style={{
                        borderBottom: '1px solid #f8fafc',
                        background: isMe ? '#eff2ff' : 'transparent',
                        transition: 'background 0.14s',
                      }}
                        onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = '#f8fafc' }}
                        onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = 'transparent' }}
                      >
                        <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                          <RankBadge rank={i + 1} />
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {isMe && <span style={{ width: 3, height: 20, background: '#4361ee', borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />}
                            <span style={{ fontSize: '0.88rem', fontWeight: isMe ? 700 : 500, color: isMe ? '#1e40af' : '#1e293b' }}>
                              {co.company_name}
                              {isMe && (
                                <span style={{ marginLeft: 8, fontSize: '0.62rem', fontWeight: 700, color: '#4361ee', background: '#e0e7ff', borderRadius: 4, padding: '1px 6px' }}>
                                  YOU
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          {co.industry || '—'}
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
                          {co.roi != null ? `${(+co.roi).toFixed(1)}%` : '—'}
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 64, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                              <div style={{ width: `${Math.min(co.sustainability_score ?? 0, 100)}%`, height: '100%', background: 'linear-gradient(90deg,#4361ee,#818cf8)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{co.sustainability_score ?? '—'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: '0.85rem', color: '#374151' }}>
                          {co.cost_benefit != null ? (+co.cost_benefit).toFixed(2) : '—'}
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: '0.85rem', color: '#374151' }}>
                          {co.eevta_score ?? '—'}
                        </td>
                      </tr>
                    )
                  })}
                  {currentRanking.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '0.88rem' }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Radar */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fafbfc', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-activity" style={{ color: '#4361ee' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Performance Radar</span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ height: 230 }}>
                  <Radar data={radarChartData} options={radarOptions} />
                </div>
                {perfItems.length > 0 && (
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {perfItems.map(p => (
                      <div key={p.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{p.label}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: p.good ? '#16a34a' : '#dc2626' }}>
                            {p.yours.toFixed(1)}
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}> / {p.avg.toFixed(1)} avg</span>
                          </span>
                        </div>
                        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(p.yours, 100)}%`, height: '100%', background: p.fill, borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Changes */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <i className="bi bi-clock-history" style={{ color: '#4361ee' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Recent Changes</span>
                </div>
                {last_update && (
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: 22 }}>
                    Last updated: {formatDate(last_update)}
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {changeItems.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 10,
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${c.icon}`} style={{ color: c.color, fontSize: '0.88rem' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>{c.title}</div>
                        <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginTop: 1 }}>{c.sub}</div>
                      </div>
                    </div>
                    {c.badge}
                  </div>
                ))}
                {changeItems.length === 0 && (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '8px 4px' }}>Run a calculator to see changes</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
