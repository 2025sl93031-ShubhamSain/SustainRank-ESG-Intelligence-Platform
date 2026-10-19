import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSdgData } from '../api/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SDG_COLORS = {
  1:'#e5243b',2:'#dda63a',3:'#4c9f38',4:'#c5192d',5:'#ff3a21',6:'#26bde2',
  7:'#fcc30b',8:'#a21942',9:'#fd6925',10:'#dd1367',11:'#fd9d24',12:'#bf8b2e',
  13:'#3f7e44',14:'#0a97d9',15:'#56c02b',16:'#00689d',17:'#19486a',
}

const SDG_DATA_FALLBACK = {
  1:{ title:'No Poverty', description:'End poverty in all its forms everywhere.', link:'https://sdgs.un.org/goals/goal1' },
  2:{ title:'Zero Hunger', description:'End hunger, achieve food security and improved nutrition.', link:'https://sdgs.un.org/goals/goal2' },
  3:{ title:'Good Health and Well-Being', description:'Ensure healthy lives and promote well-being for all.', link:'https://sdgs.un.org/goals/goal3' },
  4:{ title:'Quality Education', description:'Ensure inclusive and equitable quality education.', link:'https://sdgs.un.org/goals/goal4' },
  5:{ title:'Gender Equality', description:'Achieve gender equality and empower all women and girls.', link:'https://sdgs.un.org/goals/goal5' },
  6:{ title:'Clean Water and Sanitation', description:'Ensure availability and sustainable management of water.', link:'https://sdgs.un.org/goals/goal6' },
  7:{ title:'Affordable and Clean Energy', description:'Ensure access to affordable, reliable, sustainable energy.', link:'https://sdgs.un.org/goals/goal7' },
  8:{ title:'Decent Work and Economic Growth', description:'Promote sustained, inclusive and sustainable economic growth.', link:'https://sdgs.un.org/goals/goal8' },
  9:{ title:'Industry, Innovation and Infrastructure', description:'Build resilient infrastructure, promote inclusive industrialization.', link:'https://sdgs.un.org/goals/goal9' },
  10:{ title:'Reduced Inequalities', description:'Reduce inequality within and among countries.', link:'https://sdgs.un.org/goals/goal10' },
  11:{ title:'Sustainable Cities and Communities', description:'Make cities and human settlements inclusive and sustainable.', link:'https://sdgs.un.org/goals/goal11' },
  12:{ title:'Responsible Consumption and Production', description:'Ensure sustainable consumption and production patterns.', link:'https://sdgs.un.org/goals/goal12' },
  13:{ title:'Climate Action', description:'Take urgent action to combat climate change and its impacts.', link:'https://sdgs.un.org/goals/goal13' },
  14:{ title:'Life Below Water', description:'Conserve and sustainably use the oceans, seas and marine resources.', link:'https://sdgs.un.org/goals/goal14' },
  15:{ title:'Life on Land', description:'Protect, restore and promote sustainable use of terrestrial ecosystems.', link:'https://sdgs.un.org/goals/goal15' },
  16:{ title:'Peace, Justice and Strong Institutions', description:'Promote peaceful and inclusive societies for sustainable development.', link:'https://sdgs.un.org/goals/goal16' },
  17:{ title:'Partnerships for the Goals', description:'Strengthen the means of implementation and revitalize partnerships.', link:'https://sdgs.un.org/goals/goal17' },
}

const SERVICES = [
  { to:'/carbon',       icon:'bi-cloud-haze2-fill',   color:'#4361ee', bg:'rgba(67,97,238,0.08)',   title:'Carbon Emission',              desc:'Calculate your GHG footprint across Scope 1, 2 & 3 emission sources using the GHG Protocol.' },
  { to:'/energy',       icon:'bi-lightning-charge-fill', color:'#f59e0b', bg:'rgba(245,158,11,0.08)', title:'Energy Consumption',           desc:'Benchmark electricity, gas and fuel usage against ISO 50001 sector standards.' },
  { to:'/waste',        icon:'bi-recycle',             color:'#10b981', bg:'rgba(16,185,129,0.08)', title:'Waste Management',             desc:'Track diversion rates, recycling and circular economy performance per GRI 306.' },
  { to:'/eevta',        icon:'bi-people-fill',         color:'#8b5cf6', bg:'rgba(139,92,246,0.08)', title:'Workforce Development',        desc:'Score training coverage, retention, benefits and diversity aligned to SDG 8.' },
  { to:'/sustainability',icon:'bi-clipboard2-data-fill',color:'#ef4444', bg:'rgba(239,68,68,0.08)',  title:'Sustainability Score',         desc:'Unified ESG composite: Environmental 50% · Social 30% · Governance 20%.' },
  { to:'/dashboard',    icon:'bi-bar-chart-line-fill', color:'#06b6d4', bg:'rgba(6,182,212,0.08)',  title:'ESG Scoreboard',               desc:'Peer ranking, radar chart, ROI analysis and sector-level benchmarking.' },
]

const FEATURES = [
  {
    icon:'bi-cloud-haze2-fill', color:'#4361ee',
    title:'Carbon Emission Reduction',
    headline:'Measure & cut your GHG footprint',
    body:'Track Scope 1-3 emissions, benchmark against sector averages, and model the impact of decarbonisation levers — renewable energy, fleet electrification, and green procurement.',
    points:['Grid emission factor: 0.82 kgCO₂e/kWh (India)','Flight & fuel emission factors per GHG Protocol','Sector carbon benchmark comparison'],
  },
  {
    icon:'bi-lightning-charge-fill', color:'#f59e0b',
    title:'Energy Efficiency',
    headline:'Optimise consumption across every site',
    body:'Monitor electricity, gas and LPG usage per employee against ISO 50001 benchmarks. Identify over-consuming sites, model renewable integration and project cost savings.',
    points:['Industry-specific energy benchmarks','Renewable energy mix tracking','kWh/employee normalisation'],
  },
  {
    icon:'bi-recycle', color:'#10b981',
    title:'Waste & Circular Economy',
    headline:'Drive diversion and cut disposal costs',
    body:'Log total waste, segregation rates, and recycling volumes. Score your performance against GRI 306 thresholds and identify pathways to zero-waste operations.',
    points:['Landfill vs recycled waste split','Sector diversion rate benchmarks','Circular economy opportunity sizing'],
  },
  {
    icon:'bi-people-fill', color:'#8b5cf6',
    title:'Workforce Development',
    headline:'Invest in people, score SDG 8 compliance',
    body:'Quantify social sustainability through training hours per employee, attrition rates, gender diversity, disability inclusion, and employee welfare programme coverage.',
    points:['Training coverage & upskilling hours','Retention rate vs industry average','Gender equity & disability inclusion index'],
  },
]

export default function IndexPage() {
  const [sdgData, setSdgData] = useState(SDG_DATA_FALLBACK)
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredService, setHoveredService] = useState(null)
  const [hoveredSdg, setHoveredSdg] = useState(null)

  useEffect(() => {
    getSdgData()
      .then(data => { if (data.sdg_data && Object.keys(data.sdg_data).length > 0) setSdgData(data.sdg_data) })
      .catch(() => {})
  }, [])

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:'#f8fafc', minHeight:'100vh' }}>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background:'linear-gradient(160deg,#060c1e 0%,#0d1b4b 55%,#1565c0 100%)',
        paddingTop:140, paddingBottom:100,
        position:'relative', overflow:'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)', top:-200, right:-200, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:'rgba(67,97,238,0.12)', bottom:-80, left:-80, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)', top:80, left:'40%', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 32px', position:'relative', zIndex:1 }}>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:24, padding:'6px 18px', marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
            <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4ade80', textTransform:'uppercase', letterSpacing:'1.4px' }}>ESG Intelligence Platform</span>
          </div>

          <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.4rem)', fontWeight:900, color:'#fff', lineHeight:1.12, marginBottom:20, fontFamily:"'Raleway',sans-serif", maxWidth:680 }}>
            Innovate. Sustain.<br />
            <span style={{ background:'linear-gradient(90deg,#4361ee,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Make Impact.
            </span>
          </h1>
          <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,0.55)', lineHeight:1.75, maxWidth:540, marginBottom:40 }}>
            Benchmark your organisation's sustainability performance across carbon, energy, waste and social metrics — aligned to all 17 UN SDGs.
          </p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <a href="#services" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'linear-gradient(135deg,#4361ee,#3f37c9)',
              color:'#fff', padding:'14px 28px', borderRadius:10, textDecoration:'none',
              fontWeight:700, fontSize:'0.92rem', boxShadow:'0 4px 20px rgba(67,97,238,0.45)',
              letterSpacing:'0.3px',
            }}>
              <i className="bi bi-rocket-takeoff-fill" />
              Get Started
            </a>
            <a href="#about" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)',
              color:'#fff', padding:'14px 28px', borderRadius:10, textDecoration:'none',
              fontWeight:600, fontSize:'0.92rem',
            }}>
              <i className="bi bi-info-circle" />
              Learn More
            </a>
          </div>

          {/* Hero stats */}
          <div style={{ display:'flex', gap:40, marginTop:60, flexWrap:'wrap' }}>
            {[
              { value:'17', label:'SDG Goals Covered' },
              { value:'4', label:'ESG Pillars Tracked' },
              { value:'100', label:'Point Score Scale' },
              { value:'6', label:'Calculators' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize:'2rem', fontWeight:900, color:'#fff', fontFamily:"'Raleway',sans-serif", lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginTop:5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding:'96px 32px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(67,97,238,0.08)', borderRadius:24, padding:'5px 16px', marginBottom:20 }}>
                <i className="bi bi-info-circle-fill" style={{ color:'#4361ee', fontSize:'0.8rem' }} />
                <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4361ee', textTransform:'uppercase', letterSpacing:'1.2px' }}>About</span>
              </div>
              <h2 style={{ fontSize:'2rem', fontWeight:900, color:'#0f172a', lineHeight:1.2, marginBottom:20, fontFamily:"'Raleway',sans-serif" }}>
                Sustainable Ranking<br />System for Organisations
              </h2>
              <p style={{ fontSize:'0.95rem', color:'#475569', lineHeight:1.8, marginBottom:20 }}>
                Our platform evaluates organisations based on contributions toward the <strong>Sustainable Development Goals (SDGs)</strong>, analysing KPIs across environmental, social, economic, and governance aspects.
              </p>
              <p style={{ fontSize:'0.95rem', color:'#475569', lineHeight:1.8, marginBottom:28 }}>
                The ranking system fosters healthy competition, encourages organisations to enhance their sustainability efforts, and provides valuable insights for investors, policymakers and stakeholders.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { icon:'bi-bar-chart-fill', color:'#4361ee', text:'Carbon footprint, renewable energy use and resource efficiency assessment' },
                  { icon:'bi-people-fill',    color:'#8b5cf6', text:'CSR initiatives, ethical labour practices and social impact scoring' },
                  { icon:'bi-trophy-fill',    color:'#f59e0b', text:'Unified SDG-aligned ranking with composite sustainability score' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:item.color+'1a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <i className={`bi ${item.icon}`} style={{ color:item.color, fontSize:'0.9rem' }} />
                    </div>
                    <p style={{ fontSize:'0.88rem', color:'#374151', lineHeight:1.6, margin:0, paddingTop:8 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { icon:'bi-shield-check-fill', color:'#4361ee', bg:'rgba(67,97,238,0.06)', title:'GHG Protocol', sub:'Carbon accounting standard' },
                { icon:'bi-lightning-fill',    color:'#f59e0b', bg:'rgba(245,158,11,0.06)', title:'ISO 50001',    sub:'Energy management' },
                { icon:'bi-recycle',           color:'#10b981', bg:'rgba(16,185,129,0.06)', title:'GRI 306',      sub:'Waste disclosures' },
                { icon:'bi-briefcase-fill',    color:'#8b5cf6', bg:'rgba(139,92,246,0.06)', title:'SDG 8',        sub:'Decent work & growth' },
              ].map((card, i) => (
                <div key={i} style={{ background:card.bg, border:`1px solid ${card.color}22`, borderRadius:16, padding:'28px 22px' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:card.color+'1a', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <i className={`bi ${card.icon}`} style={{ color:card.color, fontSize:'1.2rem' }} />
                  </div>
                  <div style={{ fontSize:'0.92rem', fontWeight:700, color:'#0f172a', marginBottom:4 }}>{card.title}</div>
                  <div style={{ fontSize:'0.75rem', color:'#64748b' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding:'96px 32px', background:'#f8fafc' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(67,97,238,0.08)', borderRadius:24, padding:'5px 16px', marginBottom:16 }}>
              <i className="bi bi-grid-fill" style={{ color:'#4361ee', fontSize:'0.8rem' }} />
              <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4361ee', textTransform:'uppercase', letterSpacing:'1.2px' }}>Calculators</span>
            </div>
            <h2 style={{ fontSize:'2rem', fontWeight:900, color:'#0f172a', fontFamily:"'Raleway',sans-serif", marginBottom:12 }}>Key Sustainability Calculators</h2>
            <p style={{ fontSize:'0.95rem', color:'#64748b', maxWidth:520, margin:'0 auto' }}>Six tools aligned to international ESG frameworks — measure, benchmark and improve.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {SERVICES.map((s, i) => (
              <Link
                key={i} to={s.to}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  background:'#fff', border:`1.5px solid ${hoveredService === i ? s.color : '#e2e8f0'}`,
                  borderRadius:16, padding:'28px 24px', textDecoration:'none',
                  transition:'all 0.2s', display:'block',
                  transform: hoveredService === i ? 'translateY(-4px)' : 'none',
                  boxShadow: hoveredService === i ? `0 12px 32px ${s.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ width:48, height:48, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <i className={`bi ${s.icon}`} style={{ color:s.color, fontSize:'1.3rem' }} />
                </div>
                <div style={{ fontSize:'0.98rem', fontWeight:700, color:'#0f172a', marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:'0.82rem', color:'#64748b', lineHeight:1.65 }}>{s.desc}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:18, color:s.color, fontSize:'0.8rem', fontWeight:600 }}>
                  Open calculator <i className="bi bi-arrow-right" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES TABS ────────────────────────────────────────────────── */}
      <section id="features" style={{ padding:'96px 32px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(67,97,238,0.08)', borderRadius:24, padding:'5px 16px', marginBottom:16 }}>
              <i className="bi bi-stars" style={{ color:'#4361ee', fontSize:'0.8rem' }} />
              <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4361ee', textTransform:'uppercase', letterSpacing:'1.2px' }}>Features</span>
            </div>
            <h2 style={{ fontSize:'2rem', fontWeight:900, color:'#0f172a', fontFamily:"'Raleway',sans-serif" }}>ESG Measurement Framework</h2>
          </div>

          {/* Tab row */}
          <div style={{ display:'flex', gap:8, marginBottom:40, flexWrap:'wrap', justifyContent:'center' }}>
            {FEATURES.map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveFeature(i)}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'10px 20px', borderRadius:10, border:'1.5px solid',
                  borderColor: activeFeature === i ? f.color : '#e2e8f0',
                  background: activeFeature === i ? f.color+'14' : '#fff',
                  color: activeFeature === i ? f.color : '#64748b',
                  fontWeight:600, fontSize:'0.85rem', cursor:'pointer',
                  transition:'all 0.18s',
                }}
              >
                <i className={`bi ${f.icon}`} />
                {f.title}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: activeFeature === i ? 'grid' : 'none', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
              <div>
                <h3 style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a', fontFamily:"'Raleway',sans-serif", marginBottom:12 }}>{f.headline}</h3>
                <p style={{ fontSize:'0.92rem', color:'#475569', lineHeight:1.8, marginBottom:24 }}>{f.body}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {f.points.map((p, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:24, height:24, borderRadius:6, background:f.color+'1a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className="bi bi-check2" style={{ color:f.color, fontSize:'0.85rem', fontWeight:900 }} />
                      </div>
                      <span style={{ fontSize:'0.86rem', color:'#374151' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <Link to={SERVICES[i].to} style={{
                  display:'inline-flex', alignItems:'center', gap:8, marginTop:28,
                  background:`linear-gradient(135deg,${f.color},${f.color}cc)`,
                  color:'#fff', padding:'12px 24px', borderRadius:10, textDecoration:'none',
                  fontWeight:700, fontSize:'0.88rem', boxShadow:`0 4px 16px ${f.color}44`,
                }}>
                  <i className={`bi ${f.icon}`} /> Open Calculator
                </Link>
              </div>

              <div style={{
                background:`linear-gradient(135deg,${f.color}0d,${f.color}1a)`,
                border:`1px solid ${f.color}33`, borderRadius:20,
                display:'flex', alignItems:'center', justifyContent:'center',
                minHeight:280,
              }}>
                <i className={`bi ${f.icon}`} style={{ fontSize:'6rem', color:f.color, opacity:0.5 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SDG GOALS ────────────────────────────────────────────────────── */}
      <section id="portfolio" style={{ padding:'96px 32px', background:'#f8fafc' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(67,97,238,0.08)', borderRadius:24, padding:'5px 16px', marginBottom:16 }}>
              <i className="bi bi-globe2" style={{ color:'#4361ee', fontSize:'0.8rem' }} />
              <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4361ee', textTransform:'uppercase', letterSpacing:'1.2px' }}>UN Agenda 2030</span>
            </div>
            <h2 style={{ fontSize:'2rem', fontWeight:900, color:'#0f172a', fontFamily:"'Raleway',sans-serif", marginBottom:12 }}>Sustainable Development Goals</h2>
            <p style={{ fontSize:'0.95rem', color:'#64748b', maxWidth:520, margin:'0 auto' }}>All 17 SDGs that form the backbone of our ranking methodology.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14 }}>
            {Object.entries(sdgData).map(([num, sdg]) => {
              const color = SDG_COLORS[parseInt(num)] || '#4361ee'
              const hovered = hoveredSdg === num
              return (
                <a
                  key={num}
                  href={sdg.link}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHoveredSdg(num)}
                  onMouseLeave={() => setHoveredSdg(null)}
                  style={{
                    background: hovered ? color : '#fff',
                    border:`2px solid ${hovered ? color : '#e2e8f0'}`,
                    borderRadius:14, padding:'20px 16px', textDecoration:'none',
                    transition:'all 0.2s', display:'block',
                    transform: hovered ? 'translateY(-3px)' : 'none',
                    boxShadow: hovered ? `0 8px 24px ${color}33` : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{
                    width:36, height:36, borderRadius:8,
                    background: hovered ? 'rgba(255,255,255,0.2)' : color+'18',
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12,
                    fontSize:'0.9rem', fontWeight:900,
                    color: hovered ? '#fff' : color,
                    fontFamily:"'Raleway',sans-serif",
                  }}>
                    {num}
                  </div>
                  <div style={{ fontSize:'0.82rem', fontWeight:700, color: hovered ? '#fff' : '#0f172a', lineHeight:1.35, marginBottom:6 }}>{sdg.title}</div>
                  <div style={{ fontSize:'0.72rem', color: hovered ? 'rgba(255,255,255,0.75)' : '#94a3b8', lineHeight:1.5 }}>{sdg.description}</div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding:'96px 32px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(67,97,238,0.08)', borderRadius:24, padding:'5px 16px', marginBottom:16 }}>
              <i className="bi bi-envelope-fill" style={{ color:'#4361ee', fontSize:'0.8rem' }} />
              <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4361ee', textTransform:'uppercase', letterSpacing:'1.2px' }}>Contact</span>
            </div>
            <h2 style={{ fontSize:'2rem', fontWeight:900, color:'#0f172a', fontFamily:"'Raleway',sans-serif", marginBottom:12 }}>Get In Touch</h2>
            <p style={{ fontSize:'0.95rem', color:'#64748b' }}>Reach out with questions, partnership enquiries or feedback.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:40 }}>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { icon:'bi-geo-alt-fill', color:'#4361ee', title:'Address', value:'10th Street, Mumbai, India' },
                { icon:'bi-telephone-fill', color:'#10b981', title:'Call Us', value:'+1 5589 55488 55' },
                { icon:'bi-envelope-fill', color:'#f59e0b', title:'Email Us', value:'info@sustainrank.com' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:16, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'18px 20px' }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:item.color+'14', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <i className={`bi ${item.icon}`} style={{ color:item.color, fontSize:'1rem' }} />
                  </div>
                  <div>
                    <div style={{ fontSize:'0.72rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.8px' }}>{item.title}</div>
                    <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#0f172a', marginTop:2 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:16, padding:'32px 28px' }}>
              <form onSubmit={e => e.preventDefault()} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[
                    { placeholder:'Your Name', type:'text', icon:'bi-person' },
                    { placeholder:'Your Email', type:'email', icon:'bi-envelope' },
                  ].map((f, i) => (
                    <div key={i} style={{ position:'relative' }}>
                      <i className={`bi ${f.icon}`} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', fontSize:'0.95rem' }} />
                      <input type={f.type} placeholder={f.placeholder}
                        style={{ width:'100%', padding:'11px 14px 11px 38px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:'0.88rem', color:'#0f172a', background:'#fff', outline:'none', boxSizing:'border-box' }}
                        onFocus={e => e.target.style.borderColor='#4361ee'}
                        onBlur={e => e.target.style.borderColor='#e2e8f0'}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ position:'relative' }}>
                  <i className="bi bi-chat-text" style={{ position:'absolute', left:14, top:13, color:'#94a3b8', fontSize:'0.95rem' }} />
                  <input type="text" placeholder="Subject"
                    style={{ width:'100%', padding:'11px 14px 11px 38px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:'0.88rem', color:'#0f172a', background:'#fff', outline:'none', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor='#4361ee'}
                    onBlur={e => e.target.style.borderColor='#e2e8f0'}
                  />
                </div>
                <textarea placeholder="Your message…" rows={4}
                  style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:'0.88rem', color:'#0f172a', background:'#fff', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:"'Inter',sans-serif" }}
                  onFocus={e => e.target.style.borderColor='#4361ee'}
                  onBlur={e => e.target.style.borderColor='#e2e8f0'}
                />
                <button type="submit" style={{
                  padding:'12px', background:'linear-gradient(135deg,#4361ee,#3f37c9)',
                  border:'none', borderRadius:9, color:'#fff',
                  fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
                  boxShadow:'0 4px 16px rgba(67,97,238,0.35)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                }}>
                  <i className="bi bi-send-fill" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCROLL TOP ───────────────────────────────────────────────────── */}
      <a
        href="#"
        style={{
          position:'fixed', bottom:28, right:28, width:44, height:44, borderRadius:10,
          background:'linear-gradient(135deg,#4361ee,#3f37c9)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', textDecoration:'none', boxShadow:'0 4px 16px rgba(67,97,238,0.4)',
          zIndex:999,
        }}
      >
        <i className="bi bi-arrow-up-short" style={{ fontSize:'1.4rem' }} />
      </a>

      <Footer showFull={true} />
    </div>
  )
}
