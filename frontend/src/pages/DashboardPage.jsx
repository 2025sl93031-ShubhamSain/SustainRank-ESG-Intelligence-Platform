import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import Header from '../components/Header'
import { getDashboardData } from '../api/dashboard'
import { useAuth } from '../context/AuthContext'
import AiRecommendations from '../components/AiRecommendations'
import { getDashboardRecommendations } from '../api/ai'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const SORT_LABELS = {
  sustainability_score: 'Sustainability',
  roi: 'ROI',
  cost_benefit: 'Cost-Benefit',
  composite_score: 'Composite',
}

function ChangeBadge({ val, unit = '%', inverse = false }) {
  if (val == null || val === 0) return (
    <span className="db-badge db-badge--neutral">0{unit}</span>
  )
  const positive = inverse ? val < 0 : val > 0
  const color = positive ? '#16a34a' : '#dc2626'
  const bg    = positive ? '#dcfce7' : '#fee2e2'
  const icon  = positive ? 'bi-arrow-up' : 'bi-arrow-down'
  return (
    <span className="db-badge" style={{ color, background: bg, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <i className={`bi ${icon}`} style={{ fontSize: '0.62rem' }} />
      {Math.abs(val)}{unit}
    </span>
  )
}

function RankBadge({ rank }) {
  if (rank === 1) return (
    <span className="db-rank-badge db-rank-badge--gold">
      <i className="bi bi-trophy-fill" style={{ fontSize: '0.72rem' }} /> 1
    </span>
  )
  if (rank === 2) return (
    <span className="db-rank-badge db-rank-badge--silver">
      <i className="bi bi-trophy-fill" style={{ fontSize: '0.72rem' }} /> 2
    </span>
  )
  if (rank === 3) return (
    <span className="db-rank-badge db-rank-badge--bronze">
      <i className="bi bi-trophy-fill" style={{ fontSize: '0.72rem' }} /> 3
    </span>
  )
  return <span className="db-rank-badge">{rank}</span>
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
      <div className="db-loading">
        <div className="db-loading__spinner" />
        <p className="db-loading__text">Loading dashboard…</p>
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
    <div className="db-page">
      <Header />

      {/* Hero banner */}
      <div className="db-hero">
        <div className="db-hero__deco-lg" />
        <div className="db-hero__deco-sm" />
        <div className="db-hero__inner">
          <div>
            <div className="db-hero__live-badge">
              <span className="db-hero__live-dot" />
              <span className="db-hero__live-text">Live</span>
            </div>
            <h1 className="db-hero__title">
              <i className="bi bi-speedometer2 db-hero__title-icon" />
              Performance Dashboard
            </h1>
            <p className="db-hero__subtitle">
              Monitor your ESG position and benchmark against industry peers
            </p>
          </div>
          {user && your_company && (
            <div className="db-hero__company-card">
              <div className="db-hero__company-icon">
                <i className="bi bi-building" />
              </div>
              <div>
                <div className="db-hero__company-label">Logged in as</div>
                <div className="db-hero__company-name">{your_company.company_name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page body */}
      <div className="db-body">

        {/* KPI Cards */}
        <div className="db-kpi-grid">
          {kpis.map((k) => (
            <div key={k.label} className="db-kpi-card" style={{ border: `1px solid ${k.border}`, borderTop: `4px solid ${k.color}` }}>
              <div className="db-kpi-card__top">
                <div className="db-kpi-card__icon-wrap" style={{ background: k.bg }}>
                  <i className={`bi ${k.icon} db-kpi-card__icon`} style={{ color: k.color }} />
                </div>
                {k.change}
              </div>
              <div className="db-kpi-card__value">{k.value}</div>
              <div className="db-kpi-card__label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="db-grid">

          {/* Left column: Rankings table + AI Recommendations */}
          <div className="db-col-left">

            {/* Rankings table */}
            <div className="db-panel">
              <div className="db-panel__header--space">
                <span className="db-panel__title">
                  <i className="bi bi-bar-chart-line-fill db-panel__accent" />
                  Competitive Rankings
                </span>
                <div className="db-sort-wrap">
                  <button className="db-sort-btn" onClick={() => setSortOpen(v => !v)}>
                    Sort: {SORT_LABELS[sortKey]}
                    <i className="bi bi-chevron-down" style={{ fontSize: '0.68rem' }} />
                  </button>
                  {sortOpen && (
                    <div className="db-sort-dropdown">
                      {Object.entries(SORT_LABELS).map(([k, v]) => (
                        <button
                          key={k}
                          className={`db-sort-option ${sortKey === k ? 'db-sort-option--active' : 'db-sort-option--idle'}`}
                          onClick={() => { setSortKey(k); setSortOpen(false) }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      {['RANK', 'COMPANY', 'INDUSTRY', 'ROI', 'SUSTAINABILITY', 'CBR', 'SOCIAL'].map(h => (
                        <th key={h} className={h === 'RANK' ? 'center' : ''}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRanking.map((co, i) => {
                      const isMe = co.user__username === user?.username
                      return (
                        <tr key={i} className={`db-table__row ${isMe ? 'db-table__row--me' : 'db-table__row--other'}`}>
                          <td className="center"><RankBadge rank={i + 1} /></td>
                          <td>
                            <div className="db-table__company-cell">
                              {isMe && <span className="db-table__company-bar" />}
                              <span className={`db-table__company-name ${isMe ? 'db-table__company-name--me' : 'db-table__company-name--other'}`}>
                                {co.company_name}
                                {isMe && <span className="db-table__you-badge">YOU</span>}
                              </span>
                            </div>
                          </td>
                          <td className="db-table__industry">{co.industry || '—'}</td>
                          <td className="db-table__roi">{co.roi != null ? `${(+co.roi).toFixed(1)}%` : '—'}</td>
                          <td>
                            <div className="db-table__sus-cell">
                              <div className="db-table__sus-bar-track">
                                <div className="db-table__sus-bar-fill" style={{ width: `${Math.min(co.sustainability_score ?? 0, 100)}%` }} />
                              </div>
                              <span>{co.sustainability_score ?? '—'}</span>
                            </div>
                          </td>
                          <td>{co.cost_benefit != null ? (+co.cost_benefit).toFixed(2) : '—'}</td>
                          <td>{co.eevta_score ?? '—'}</td>
                        </tr>
                      )
                    })}
                    {currentRanking.length === 0 && (
                      <tr><td colSpan={7} className="db-table__empty">No data available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Recommendations */}
            {your_company && (
              <AiRecommendations
                fetchFn={() => getDashboardRecommendations(
                  my_rank?.[sortKey] ?? 0,
                  (sorted_data?.[sortKey] || []).length,
                  +your_company.sustainability_score,
                  +your_company.environmental_score,
                  +your_company.eevta_score,
                  +your_company.governance_score,
                  your_company.industry || 'general',
                )}
                deps={[sortKey, your_company?.sustainability_score]}
              />
            )}
          </div>

          {/* Right column: Radar + Recent Changes pinned to bottom */}
          <div className="db-col-right">

            {/* Performance Radar */}
            <div className="db-panel">
              <div className="db-panel__header">
                <i className="bi bi-activity db-panel__accent" />
                <span className="db-panel__title-sm">Performance Radar</span>
              </div>
              <div className="db-panel__body">
                <div className="db-radar__chart-wrap">
                  <Radar data={radarChartData} options={radarOptions} />
                </div>
                {perfItems.length > 0 && (
                  <div className="db-radar__perf-list">
                    {perfItems.map(p => (
                      <div key={p.label}>
                        <div className="db-radar__perf-row">
                          <span className="db-radar__perf-label">{p.label}</span>
                          <span className={`db-radar__perf-value ${p.good ? 'db-radar__perf-value--good' : 'db-radar__perf-value--bad'}`}>
                            {p.yours.toFixed(1)}
                            <span className="db-radar__perf-avg"> / {p.avg.toFixed(1)} avg</span>
                          </span>
                        </div>
                        <div className="db-radar__bar-track">
                          <div className="db-radar__bar-fill" style={{ width: `${Math.min(p.yours, 100)}%`, background: p.fill }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Changes — margin-top: auto pushes it to bottom of right column */}
            <div className="db-panel db-changes">
              <div className="db-panel__header">
                <div className="db-changes__header">
                  <i className="bi bi-clock-history db-panel__accent" />
                  <span className="db-panel__title-sm">Recent Changes</span>
                </div>
                {last_update && (
                  <div className="db-changes__date">Last updated: {formatDate(last_update)}</div>
                )}
              </div>
              <div className="db-changes__body">
                {changeItems.map((c, i) => (
                  <div key={i} className="db-changes__item">
                    <div className="db-changes__item-left">
                      <div className="db-changes__item-icon" style={{ background: c.bg, color: c.color }}>
                        <i className={`bi ${c.icon}`} />
                      </div>
                      <div>
                        <div className="db-changes__item-title">{c.title}</div>
                        <div className="db-changes__item-sub">{c.sub}</div>
                      </div>
                    </div>
                    {c.badge}
                  </div>
                ))}
                {changeItems.length === 0 && (
                  <p className="db-changes__empty">Run a calculator to see changes</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
