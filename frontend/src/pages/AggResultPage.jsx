import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import AiRecommendations from '../components/AiRecommendations'
import { getResultRecommendations } from '../api/ai'

function scoreColor(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '#4361ee'
  if (n >= 70) return '#16a34a'
  if (n >= 40) return '#f59e0b'
  return '#dc2626'
}

function ScoreRing({ value, suffix = '', size = 140, stroke = 10, color }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(Math.max(parseFloat(value) || 0, 0), 100)
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text
        x="50%" y="50%"
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: '#fff', fontFamily: "'Raleway',sans-serif", fontWeight: 900, fontSize: size * 0.22 }}
      >
        {value}{suffix}
      </text>
    </svg>
  )
}

export default function AggResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.result) {
    navigate('/sustainability')
    return null
  }

  const { sustainability_score, roi, cost_benefit, heading, sub_heading,
          environmental_score, social_score, governance_score, financial_roi } = state.result

  const susColor = scoreColor(sustainability_score)
  const roiColor = scoreColor(roi)
  const cbColor  = scoreColor(cost_benefit)
  const envColor = scoreColor(environmental_score)
  const socColor = scoreColor(social_score)
  const govColor = scoreColor(governance_score)

  const metrics = [
    { label: 'Environmental Score (E)', value: environmental_score, suffix: '', color: envColor, icon: 'bi-tree-fill',     desc: 'Carbon + Energy + Waste — 50% weight' },
    { label: 'Social Score (S)',        value: social_score,        suffix: '', color: socColor, icon: 'bi-people-fill',   desc: 'Workforce Development — SDG 8 Decent Work — 30% weight' },
    { label: 'Governance Score (G)',    value: governance_score,    suffix: '', color: govColor, icon: 'bi-shield-check',  desc: 'Financial health & sustainability investment — 20% weight' },
    { label: 'Return on Investment',    value: roi,                 suffix: '%', color: roiColor, icon: 'bi-graph-up-arrow', desc: 'Sustainability-adjusted blended ROI' },
    { label: 'Cost-Benefit Ratio',      value: cost_benefit,        suffix: '', color: cbColor,  icon: 'bi-cash-coin',     desc: 'Blended benefit per ₹ invested' },
  ]

  const insights = [
    { icon: 'bi-check-circle-fill', color: '#4ade80', text: sustainability_score >= 70 ? 'Strong ESG performance — you are in the top tier of sustainability leaders.' : sustainability_score >= 40 ? 'Developing ESG performance — targeted action on the lowest pillar will have the most impact.' : 'Significant ESG gaps identified. A structured E+S+G roadmap is recommended.' },
    { icon: 'bi-people-fill',       color: '#34d399', text: social_score != null ? `Workforce Development score: ${social_score}/100 — covers training, retention, benefits and gender equity.` : 'Run the Workforce Development calculator to generate your Social score.' },
    { icon: 'bi-bar-chart-fill',    color: '#60a5fa', text: roi > 0 ? `Sustainability-adjusted ROI: ${roi}% — includes carbon credit value, energy savings and waste avoidance.` : 'Consider investing in renewable energy and waste diversion to unlock sustainability ROI.' },
    { icon: 'bi-lightbulb-fill',    color: '#fbbf24', text: 'Use the dashboard to track your rank against peer institutions over time.' },
  ]

  return (
    <div className="result-page">
      <Header />

      <div className="result-page__body">

        {/* ── LEFT: dark branded panel ── */}
        <div className="result-panel">
          <div className="result-panel__deco-lg" />
          <div className="result-panel__deco-sm" />

          <div className="result-panel__badge">
            <i className="bi bi-check-circle-fill"></i>
            Results Ready
          </div>

          <h2 className="result-panel__heading">
            {heading || 'Transforming Sustainability'}
          </h2>
          <p className="result-panel__subheading">
            {sub_heading || 'Your composite sustainability assessment'}
          </p>

          <div className="result-panel__ring-wrap">
            <div>
              <ScoreRing value={sustainability_score} size={150} stroke={12} color={susColor} />
              <div className="result-panel__ring-label">Sustainability Score</div>
            </div>
          </div>

          <div className="result-panel__esg-grid">
            {[
              { label: 'E Score', value: environmental_score ?? '—', color: envColor, icon: 'bi-tree-fill' },
              { label: 'S Score', value: social_score ?? '—',        color: socColor, icon: 'bi-people-fill' },
              { label: 'G Score', value: governance_score ?? '—',    color: govColor, icon: 'bi-shield-check' },
            ].map((m) => (
              <div key={m.label} className="result-panel__esg-stat">
                <i className={`bi ${m.icon} result-panel__esg-stat-icon`} style={{ color: m.color }}></i>
                <div className="result-panel__esg-stat-value">{m.value}</div>
                <div className="result-panel__esg-stat-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: details + actions ── */}
        <div className="result-detail">

          {/* Score breakdown cards */}
          <div>
            <div className="result-section-label">Score Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metrics.map((m) => {
                const pct = Math.min(Math.max(parseFloat(m.value) || 0, 0), 100)
                return (
                  <div key={m.label} className="result-metric-card">
                    <div className="result-metric-card__row">
                      <div className="result-metric-card__left">
                        <div
                          className="result-metric-card__icon-wrap"
                          style={{ background: `${m.color}15` }}
                        >
                          <i className={`bi ${m.icon}`} style={{ color: m.color, fontSize: '1rem' }}></i>
                        </div>
                        <div>
                          <div className="result-metric-card__name">{m.label}</div>
                          <div className="result-metric-card__desc">{m.desc}</div>
                        </div>
                      </div>
                      <div className="result-metric-card__value" style={{ color: m.color }}>
                        {m.value}{m.suffix}
                      </div>
                    </div>
                    <div className="result-metric-card__bar-track">
                      <div
                        className="result-metric-card__bar-fill"
                        style={{ width: `${pct}%`, background: m.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Insights */}
          <div>
            <div className="result-section-label">Key Insights</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.map((ins, i) => (
                <div key={i} className="result-insight-item">
                  <i className={`bi ${ins.icon}`} style={{ color: ins.color, fontSize: '1rem', marginTop: 1, flexShrink: 0 }}></i>
                  <span className="result-insight-item__text">{ins.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <AiRecommendations
            fetchFn={() => getResultRecommendations('sustainability', sustainability_score, 'general', {
              environmental: environmental_score, social: social_score, governance: governance_score,
            })}
            deps={[sustainability_score]}
          />

          {/* Action buttons */}
          <div className="result-actions">
            <button className="btn-outline-secondary-result" onClick={() => navigate('/sustainability')}>
              <i className="bi bi-arrow-repeat me-2"></i>Recalculate
            </button>
            <button className="btn-primary-result" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-speedometer2 me-2"></i>View Full Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
