import { useNavigate } from 'react-router-dom'
import AiRecommendations from './AiRecommendations'
import { getResultRecommendations } from '../api/ai'

const CATEGORY_STYLES = {
  success: { bg: '#dcfce7', color: '#16a34a', bar: '#16a34a' },
  info:    { bg: '#dbeafe', color: '#2563eb', bar: '#2563eb' },
  warning: { bg: '#fef9c3', color: '#ca8a04', bar: '#f59e0b' },
  danger:  { bg: '#fee2e2', color: '#dc2626', bar: '#dc2626' },
}

function scoreColor(n) {
  if (isNaN(n)) return '#4361ee'
  if (n >= 80) return '#16a34a'
  if (n >= 50) return '#f59e0b'
  return '#dc2626'
}

function scoreGrad(n) {
  if (isNaN(n)) return 'linear-gradient(160deg,#1a237e,#4361ee)'
  if (n >= 80)  return 'linear-gradient(160deg,#052e16,#166534,#16a34a)'
  if (n >= 50)  return 'linear-gradient(160deg,#451a03,#92400e,#f59e0b)'
  return        'linear-gradient(160deg,#450a0a,#991b1b,#dc2626)'
}

function ScoreRing({ score, size = 160, stroke = 13 }) {
  const n   = parseFloat(score)
  const pct = isNaN(n) ? 0 : Math.min(Math.max(n, 0), 100)
  const r   = (size - stroke) / 2
  const c   = 2 * Math.PI * r
  const col = scoreColor(n)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
        strokeDasharray={`${(pct/100)*c} ${c}`} strokeLinecap="round" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ transform:'rotate(90deg)', transformOrigin:'50% 50%', fill:'#fff',
          fontFamily:"'Raleway',sans-serif", fontWeight:900, fontSize: size * 0.21 }}>
        {isNaN(n) ? score : n % 1 === 0 ? n : n.toFixed(1)}
      </text>
    </svg>
  )
}

export default function ResultCard({ result, backPath }) {
  const navigate = useNavigate()
  const {
    heading, sub_heading, score, message, categories,
    show_breakdown, consumption_breakdown, show_waste_breakdown, waste_breakdown,
    show_temp, country_average, world_average,
    type, industry,
  } = result

  const scoreNum = parseFloat(score)
  const grad     = scoreGrad(scoreNum)

  const scoreLabel = !isNaN(scoreNum)
    ? scoreNum >= 80 ? 'Excellent' : scoreNum >= 50 ? 'Average' : 'Needs Work'
    : 'Score'

  return (
    <div className="rc-layout">

      {/* ── LEFT: dark score panel ── */}
      <div className="rc-left" style={{ background: grad }}>
        <div className="rc-left__deco-lg" />
        <div className="rc-left__deco-sm" />

        <div className="rc-left__heading-wrap">
          <div className="rc-left__label">Result</div>
          <h2 className="rc-left__heading">{heading}</h2>
          {sub_heading && <p className="rc-left__subheading">{sub_heading}</p>}
        </div>

        <div className="rc-left__ring-wrap">
          <ScoreRing score={score} />
        </div>

        <div className="rc-left__badge-wrap">
          <span className="rc-left__score-badge">{scoreLabel}</span>
        </div>

        {message && <p className="rc-left__message">{message}</p>}

        {show_temp && (
          <div className="rc-left__comparison">
            {[
              { label: 'India Average', value: `${country_average} t`, icon: 'bi-globe-asia-australia' },
              { label: 'World Target',  value: `${world_average} t`,   icon: 'bi-bullseye' },
            ].map((item) => (
              <div key={item.label} className="rc-left__comparison-item">
                <i className={`bi ${item.icon} rc-left__comparison-icon`}></i>
                <div className="rc-left__comparison-value">{item.value}</div>
                <div className="rc-left__comparison-label">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: details panel ── */}
      <div className="rc-right">

        {/* Score Ranges */}
        {categories && Object.keys(categories).length > 0 && (
          <div>
            <div className="rc-section-label">Score Ranges</div>
            <div className="rc-category-grid">
              {Object.entries(categories).map(([label, cat]) => {
                const s = CATEGORY_STYLES[cat.color] || CATEGORY_STYLES.info
                return (
                  <div
                    key={label}
                    className="rc-category-item"
                    style={{ background: s.bg, border: `1px solid ${s.bg}` }}
                  >
                    <div className="rc-category-item__label" style={{ color: s.color }}>{label}</div>
                    <div className="rc-category-item__range" style={{ color: s.color }}>
                      {Array.isArray(cat.range) ? `${cat.range[0]} – ${cat.range[1]}` : cat.range}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Consumption Breakdown */}
        {show_breakdown && consumption_breakdown && (
          <div>
            <div className="rc-section-label">Consumption Breakdown</div>
            <div className="rc-breakdown-table">
              {Object.entries(consumption_breakdown).map(([label, item]) => (
                <div key={item.id} className="rc-breakdown-row">
                  <span className="rc-breakdown-row__label">{label}</span>
                  <span className="rc-breakdown-row__value">
                    {item.value} <span className="rc-breakdown-row__unit">{item.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waste Breakdown */}
        {show_waste_breakdown && waste_breakdown && (
          <div>
            <div className="rc-section-label">Waste Breakdown</div>
            <div className="rc-breakdown-table">
              {Object.entries(waste_breakdown).map(([label, item]) => (
                <div key={item.id} className="rc-breakdown-row">
                  <span className="rc-breakdown-row__label">{label}</span>
                  <span className="rc-breakdown-row__value">
                    {item.value} <span className="rc-breakdown-row__unit">{item.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <AiRecommendations
          fetchFn={() => getResultRecommendations(type || 'sustainability', parseFloat(score), industry || 'general')}
          deps={[score, type]}
        />

        {/* Recalculate button */}
        <div className="rc-recalc-wrap">
          <button className="btn-primary-rc" onClick={() => navigate(backPath || '/')}>
            <i className="bi bi-arrow-repeat me-2"></i>Recalculate
          </button>
        </div>
      </div>
    </div>
  )
}
