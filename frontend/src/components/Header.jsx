import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',        to: '/',           type: 'link' },
  { label: 'About',       href: '/#about',   type: 'anchor' },
  { label: 'Calculators', href: '/#services',type: 'anchor' },
  { label: 'SDG Goals',   href: '/#portfolio',type: 'anchor' },
  { label: 'Contact',     href: '/#contact', type: 'anchor' },
  { label: 'History',     to: '/history',    type: 'link' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  async function handleLogout() {
    setShowLogoutModal(true)
  }

  async function confirmLogout() {
    setShowLogoutModal(false)
    await logout()
    navigate('/login')
  }

  const isActive = (item) => {
    if (item.type === 'link') return location.pathname === item.to
    return false
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.3s',
        background: scrolled
          ? 'rgba(6,12,30,0.96)'
          : 'linear-gradient(180deg,rgba(6,12,30,0.95) 0%,rgba(6,12,30,0.6) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 28px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg,#4361ee,#3f37c9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(67,97,238,0.5)',
              flexShrink: 0,
            }}>
              <i className="bi bi-speedometer2" style={{ color: '#fff', fontSize: '1rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', letterSpacing: '0.2px', lineHeight: 1.1 }}>SustainRank</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.4px' }}>ESG Intelligence</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="d-none d-xl-flex">
            {NAV_LINKS.map(item => {
              const active = isActive(item)
              return item.type === 'link' ? (
                <Link
                  key={item.label}
                  to={item.to}
                  style={{
                    padding: '6px 14px', borderRadius: 7,
                    fontSize: '0.85rem', fontWeight: active ? 700 : 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    background: active ? 'rgba(67,97,238,0.25)' : 'transparent',
                    border: active ? '1px solid rgba(67,97,238,0.4)' : '1px solid transparent',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.07)' }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color='rgba(255,255,255,0.65)'; e.currentTarget.style.background='transparent' }}}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    padding: '6px 14px', borderRadius: 7,
                    fontSize: '0.85rem', fontWeight: 500,
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    background: 'transparent',
                    border: '1px solid transparent',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.65)'; e.currentTarget.style.background='transparent' }}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {user ? (
              <>
                {/* User chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '6px 12px',
                }} className="d-none d-xl-flex">
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: 'linear-gradient(135deg,#4361ee,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="bi bi-person-fill" style={{ color: '#fff', fontSize: '0.75rem' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{user.username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 8,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                    color: '#f87171', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.25)' }}
                  className="d-none d-xl-flex"
                >
                  <i className="bi bi-box-arrow-right" />
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }} className="d-none d-xl-flex">
                <Link to="/login" style={{
                  padding: '7px 16px', borderRadius: 8,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)', fontSize: '0.84rem', fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.18s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='rgba(255,255,255,0.8)' }}
                >
                  Sign In
                </Link>
                <Link to="/register" style={{
                  padding: '7px 16px', borderRadius: 8,
                  background: 'linear-gradient(135deg,#4361ee,#3f37c9)',
                  border: '1px solid transparent',
                  color: '#fff', fontSize: '0.84rem', fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(67,97,238,0.4)',
                }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="d-xl-none"
              style={{
                width: 38, height: 38, borderRadius: 8,
                background: mobileOpen ? 'rgba(67,97,238,0.25)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${mobileOpen ? 'rgba(67,97,238,0.4)' : 'rgba(255,255,255,0.12)'}`,
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}
              aria-label="Toggle navigation"
            >
              <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'}`} style={{ fontSize: '1.1rem' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
          background: 'rgba(6,12,30,0.98)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 20px 24px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }} className="d-xl-none">

          {NAV_LINKS.map(item => {
            const active = isActive(item)
            const style = {
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 9,
              fontSize: '0.9rem', fontWeight: active ? 700 : 500,
              color: active ? '#fff' : 'rgba(255,255,255,0.7)',
              background: active ? 'rgba(67,97,238,0.2)' : 'transparent',
              border: active ? '1px solid rgba(67,97,238,0.35)' : '1px solid transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            }
            return item.type === 'link' ? (
              <Link key={item.label} to={item.to} style={style}>{item.label}</Link>
            ) : (
              <a key={item.label} href={item.href} style={style}>{item.label}</a>
            )
          })}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
                <div style={{ width:30, height:30, borderRadius:7, background:'linear-gradient(135deg,#4361ee,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className="bi bi-person-fill" style={{ color:'#fff', fontSize:'0.8rem' }} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{user.username}</span>
              </div>
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 9,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
              }}>
                <i className="bi bi-box-arrow-right" /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <Link to="/login" style={{
                display: 'block', textAlign: 'center', padding: '11px',
                borderRadius: 9, border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                textDecoration: 'none', background: 'transparent',
              }}>Sign In</Link>
              <Link to="/register" style={{
                display: 'block', textAlign: 'center', padding: '11px',
                borderRadius: 9, border: 'none',
                background: 'linear-gradient(135deg,#4361ee,#3f37c9)',
                color: '#fff', fontSize: '0.9rem', fontWeight: 700,
                textDecoration: 'none', boxShadow: '0 3px 12px rgba(67,97,238,0.4)',
              }}>Register</Link>
            </div>
          )}
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: 64 }} />

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div style={{
            background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '32px 28px', width: 340,
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
            }}>
              <i className="bi bi-box-arrow-right" style={{ color: '#f87171', fontSize: '1.5rem' }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Log out of SustainRank?</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              You will be redirected to the login page.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, width: '100%' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 9,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1, padding: '10px', borderRadius: 9,
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                  color: '#f87171', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
