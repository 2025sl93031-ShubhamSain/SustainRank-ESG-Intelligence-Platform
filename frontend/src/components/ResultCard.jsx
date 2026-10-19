import { useNavigate } from 'react-router-dom'

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
    heading, sub_heading, score, message, categories, suggestions,
    show_breakdown, consumption_breakdown, show_waste_breakdown, waste_breakdown,
    show_temp, country_average, world_average,
  } = result

  const scoreNum = parseFloat(score)
  const col      = scoreColor(scoreNum)
  const grad     = scoreGrad(scoreNum)

  const scoreLabel = !isNaN(scoreNum)
    ? scoreNum >= 80 ? 'Excellent' : scoreNum >= 50 ? 'Average' : 'Needs Work'
    : 'Score'

  return (
    <div style={{ display:'flex', width:'100%', height:'100%', overflow:'hidden' }}>

      {/* ── LEFT: dark score panel ── */}
      <div style={{
        width: '380px', flexShrink: 0,
        background: grad,
        display: 'flex', flexDirection: 'column',
        padding: '44px 36px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.07)', bottom:-80, right:-80, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)', top:40, right:-50, pointerEvents:'none' }} />

        {/* heading */}
        <div style={{ marginBottom: 32, position:'relative' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:6 }}>
            Result
          </div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:900, color:'#fff', fontFamily:"'Raleway',sans-serif", lineHeight:1.25, margin:'0 0 6px' }}>
            {heading}
          </h2>
          {sub_heading && (
            <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', margin:0, lineHeight:1.5 }}>{sub_heading}</p>
          )}
        </div>

        {/* score ring */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <ScoreRing score={score} />
        </div>

        {/* score label badge */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <span style={{
            display:'inline-block', background:'rgba(255,255,255,0.12)',
            border:'1px solid rgba(255,255,255,0.2)', borderRadius:20,
            padding:'4px 16px', fontSize:'0.72rem', fontWeight:800,
            color:'#fff', textTransform:'uppercase', letterSpacing:'1.2px',
          }}>{scoreLabel}</span>
        </div>

        {/* message */}
        {message && (
          <p style={{
            fontSize:'0.82rem', color:'rgba(255,255,255,0.65)', lineHeight:1.6,
            textAlign:'center', margin:'0 0 auto', background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px',
          }}>
            {message}
          </p>
        )}

        {/* comparison mini row */}
        {show_temp && (
          <div style={{ marginTop:'auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'India Average', value:`${country_average} t`, icon:'bi-globe-asia-australia' },
              { label:'World Target',  value:`${world_average} t`,   icon:'bi-bullseye' },
            ].map((item) => (
              <div key={item.label} style={{
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, padding:'12px', textAlign:'center',
              }}>
                <i className={`bi ${item.icon}`} style={{ color:'rgba(255,255,255,0.6)', fontSize:'1rem', marginBottom:4, display:'block' }}></i>
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#fff', fontFamily:"'Raleway',sans-serif" }}>{item.value}</div>
                <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.7px', marginTop:2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: details panel ── */}
      <div style={{ flex:1, background:'#f8fafc', overflow:'auto', padding:'36px 44px', display:'flex', flexDirection:'column', gap:22 }}>

        {/* Score Ranges */}
        {categories && Object.keys(categories).length > 0 && (
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:12 }}>Score Ranges</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {Object.entries(categories).map(([label, cat]) => {
                const s = CATEGORY_STYLES[cat.color] || CATEGORY_STYLES.info
                return (
                  <div key={label} style={{
                    flex:'1', minWidth:120, background:s.bg,
                    borderRadius:14, padding:'20px 16px', textAlign:'center',
                    border:`1px solid ${s.bg}`, minHeight:'80px',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  }}>
                    <div style={{ fontWeight:800, fontSize:'0.75rem', color:s.color, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>{label}</div>
                    <div style={{ fontSize:'0.82rem', color:s.color, opacity:0.85 }}>
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
            <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:12 }}>Consumption Breakdown</div>
            <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', border:'1px solid #f1f5f9' }}>
              {Object.entries(consumption_breakdown).map(([label, item], i, arr) => (
                <div key={item.id} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'13px 18px', borderBottom: i < arr.length-1 ? '1px solid #f8fafc' : 'none',
                }}>
                  <span style={{ fontSize:'0.87rem', color:'#374151', fontWeight:500 }}>{label}</span>
                  <span style={{ fontSize:'0.87rem', fontWeight:700, color:'#111827' }}>
                    {item.value} <span style={{ color:'#9ca3af', fontWeight:400, fontSize:'0.78rem' }}>{item.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waste Breakdown */}
        {show_waste_breakdown && waste_breakdown && (
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:12 }}>Waste Breakdown</div>
            <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', border:'1px solid #f1f5f9' }}>
              {Object.entries(waste_breakdown).map(([label, item], i, arr) => (
                <div key={item.id} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'13px 18px', borderBottom: i < arr.length-1 ? '1px solid #f8fafc' : 'none',
                }}>
                  <span style={{ fontSize:'0.87rem', color:'#374151', fontWeight:500 }}>{label}</span>
                  <span style={{ fontSize:'0.87rem', fontWeight:700, color:'#111827' }}>
                    {item.value} <span style={{ color:'#9ca3af', fontWeight:400, fontSize:'0.78rem' }}>{item.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {suggestions?.length > 0 && (
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:12 }}>Recommendations</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'flex-start', gap:10,
                  background:'#fff', border:'1px solid #f1f5f9',
                  borderRadius:12, padding:'12px 14px',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  <i className="bi bi-check-circle-fill" style={{ color:'#16a34a', fontSize:'0.95rem', marginTop:2, flexShrink:0 }}></i>
                  <span style={{ fontSize:'0.84rem', color:'#374151', lineHeight:1.55 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recalculate button pinned to bottom */}
        <div style={{ marginTop:'auto', paddingTop:8 }}>
          <button
            onClick={() => navigate(backPath || '/')}
            style={{
              width:'100%', padding:'13px 0', borderRadius:12,
              background:'linear-gradient(135deg,#4361ee,#3f37c9)',
              border:'none', color:'#fff', fontWeight:700, fontSize:'0.88rem',
              letterSpacing:'0.5px', cursor:'pointer', transition:'all 0.2s',
              boxShadow:'0 4px 16px rgba(67,97,238,0.35)',
            }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}
          >
            <i className="bi bi-arrow-repeat me-2"></i>Recalculate
          </button>
        </div>
      </div>
    </div>
  )
}
