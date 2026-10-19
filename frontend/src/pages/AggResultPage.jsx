import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'

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
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f1f5fb' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, marginTop: '68px', overflow: 'hidden' }}>

        {/* ── LEFT: dark branded panel ── */}
        <div style={{
          width: '420px', flexShrink: 0,
          background: 'linear-gradient(160deg, #060c1e 0%, #0d1b4b 45%, #1565c0 100%)',
          display: 'flex', flexDirection: 'column',
          padding: '40px 36px', position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', bottom: -80, right: -80, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: 60, right: -40, pointerEvents: 'none' }} />

          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '4px 12px', width: 'fit-content', marginBottom: 20 }}>
            <i className="bi bi-check-circle-fill" style={{ color: '#4ade80', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px' }}>Results Ready</span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: "'Raleway',sans-serif", lineHeight: 1.2, marginBottom: 6 }}>
            {heading || 'Transforming Sustainability'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.5 }}>
            {sub_heading || 'Your composite sustainability assessment'}
          </p>

          {/* Main score ring */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ textAlign: 'center' }}>
              <ScoreRing value={sustainability_score} size={150} stroke={12} color={susColor} />
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: 8 }}>Sustainability Score</div>
            </div>
          </div>

          {/* E / S / G mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 'auto' }}>
            {[
              { label: 'E Score', value: environmental_score ?? '—', color: envColor, icon: 'bi-tree-fill' },
              { label: 'S Score', value: social_score ?? '—',        color: socColor, icon: 'bi-people-fill' },
              { label: 'G Score', value: governance_score ?? '—',    color: govColor, icon: 'bi-shield-check' },
            ].map((m) => (
              <div key={m.label} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '14px 16px', textAlign: 'center',
              }}>
                <i className={`bi ${m.icon}`} style={{ color: m.color, fontSize: '1rem', marginBottom: 6, display: 'block' }}></i>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: "'Raleway',sans-serif", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: details + actions ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Score breakdown cards */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Score Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metrics.map((m) => {
                const pct = Math.min(Math.max(parseFloat(m.value) || 0, 0), 100)
                return (
                  <div key={m.label} style={{
                    background: '#fff', borderRadius: 14, padding: '18px 22px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    border: '1px solid #f1f5f9',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`bi ${m.icon}`} style={{ color: m.color, fontSize: '1rem' }}></i>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>{m.label}</div>
                          <div style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{m.desc}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: m.color, fontFamily: "'Raleway',sans-serif" }}>{m.value}{m.suffix}</div>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: m.color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Insights */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Key Insights</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  background: '#fff', borderRadius: 12, padding: '12px 16px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                }}>
                  <i className={`bi ${ins.icon}`} style={{ color: ins.color, fontSize: '1rem', marginTop: 1, flexShrink: 0 }}></i>
                  <span style={{ fontSize: '0.83rem', color: '#374151', lineHeight: 1.5 }}>{ins.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 8 }}>
            <button
              onClick={() => navigate('/sustainability')}
              style={{
                flex: 1, padding: '13px 0', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem',
                background: '#fff', border: '1.5px solid #e2e8f0', color: '#374151',
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseOut={e => e.currentTarget.style.background = '#fff'}
            >
              <i className="bi bi-arrow-repeat me-2"></i>Recalculate
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                flex: 2, padding: '13px 0', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem',
                background: 'linear-gradient(135deg, #4361ee, #3f37c9)', border: 'none', color: '#fff',
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px',
                boxShadow: '0 4px 16px rgba(67,97,238,0.35)',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <i className="bi bi-speedometer2 me-2"></i>View Full Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
