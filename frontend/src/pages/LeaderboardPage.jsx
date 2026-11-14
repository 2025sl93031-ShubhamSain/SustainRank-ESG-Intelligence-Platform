import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getLeaderboard } from '../api/admin'
import { useAuth } from '../context/AuthContext'

function scoreColor(val) {
  if (val == null || isNaN(+val)) return '#9ca3af'
  if (+val >= 70) return '#4ade80'
  if (+val >= 40) return '#fbbf24'
  return '#f87171'
}

function TrendBadge({ trend, trendScore }) {
  if (trend === 'up') return (
    <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 3 }}>
      <i className="bi bi-arrow-up-short" />+{Math.abs(trendScore)}
    </span>
  )
  if (trend === 'down') return (
    <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 3 }}>
      <i className="bi bi-arrow-down-short" />-{Math.abs(trendScore)}
    </span>
  )
  return <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>—</span>
}

function RankBadge({ rank }) {
  const medals = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
  const color = medals[rank] || 'rgba(255,255,255,0.25)'
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: rank <= 3 ? `${color}22` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${rank <= 3 ? color : 'rgba(255,255,255,0.1)'}`,
      color, fontWeight: 800, fontSize: '0.85rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {rank}
    </div>
  )
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/', { replace: true })
      return
    }
    getLeaderboard()
      .then(setRows)
      .catch(() => setError('Failed to load leaderboard.'))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const cols = [
    { key: 'rank',                 label: 'Rank' },
    { key: 'username',             label: 'User' },
    { key: 'sustainability_score', label: 'Sustainability' },
    { key: 'environmental_score',  label: 'Environmental' },
    { key: 'social_score',         label: 'Social' },
    { key: 'carbon_emissions',     label: 'Carbon' },
    { key: 'energy_consumption',   label: 'Energy' },
    { key: 'waste_production',     label: 'Waste' },
    { key: 'roi',                  label: 'ROI' },
    { key: 'trend',                label: 'Trend' },
  ]

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#060c1e', padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg,#4361ee,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="bi bi-trophy-fill" style={{ color: '#fff', fontSize: '1.1rem' }} />
              </div>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                ESG Leaderboard
              </h1>
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem' }}>
              All users ranked by latest sustainability score — admin view only
            </p>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 80, fontSize: '1rem' }}>
              <i className="bi bi-arrow-repeat" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
              Loading leaderboard…
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: '16px 20px', color: '#f87171', fontSize: '0.9rem',
            }}>
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 80, fontSize: '1rem' }}>
              No data yet. Users must complete at least one assessment.
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {cols.map(c => (
                        <th key={c.key} style={{
                          padding: '14px 16px', textAlign: c.key === 'rank' ? 'center' : 'left',
                          color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.78rem',
                          textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                          background: 'rgba(255,255,255,0.02)',
                        }}>
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.username} style={{
                        borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        background: row.username === user?.username
                          ? 'rgba(67,97,238,0.08)'
                          : 'transparent',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = row.username === user?.username
                          ? 'rgba(67,97,238,0.14)' : 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = row.username === user?.username
                          ? 'rgba(67,97,238,0.08)' : 'transparent'}
                      >
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <RankBadge rank={row.rank} />
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 7,
                              background: 'linear-gradient(135deg,#4361ee,#8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <i className="bi bi-person-fill" style={{ color: '#fff', fontSize: '0.72rem' }} />
                            </div>
                            <span style={{ color: '#fff', fontWeight: 600 }}>{row.username}</span>
                            {row.username === user?.username && (
                              <span style={{
                                fontSize: '0.65rem', fontWeight: 700, color: '#4361ee',
                                background: 'rgba(67,97,238,0.15)', border: '1px solid rgba(67,97,238,0.3)',
                                borderRadius: 4, padding: '1px 6px', letterSpacing: '0.05em',
                              }}>YOU</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontWeight: 700, fontSize: '0.92rem',
                            color: scoreColor(row.sustainability_score),
                          }}>
                            {(+row.sustainability_score).toFixed(1)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                          {(+row.environmental_score).toFixed(1)}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                          {(+row.social_score).toFixed(1)}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                          {(+row.carbon_emissions).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                          {(+row.energy_consumption).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                          {(+row.waste_production).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                          {(+row.roi).toFixed(1)}%
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <TrendBadge trend={row.trend} trendScore={row.trend_score} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
