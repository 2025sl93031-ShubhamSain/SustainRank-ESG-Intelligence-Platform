import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ company_name: '', username: '', email: '', password1: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd1, setShowPwd1] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password1 !== form.password2) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    try {
      const res = await registerUser(form)
      if (res.success) {
        navigate('/login')
      } else {
        setError(res.error || 'Registration failed.')
      }
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 40px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: '0.9rem', color: '#0f172a', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter',sans-serif" }}>

      {/* Left — dark branded panel */}
      <div style={{
        width: '45%', flexShrink: 0,
        background: 'linear-gradient(160deg, #060c1e 0%, #0d1b4b 50%, #1565c0 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', bottom: -120, right: -120, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: 60, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(67,97,238,0.15)', top: 200, left: -40, pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg,#4361ee,#3f37c9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(67,97,238,0.4)',
          }}>
            <i className="bi bi-speedometer2" style={{ color: '#fff', fontSize: '1.3rem' }}></i>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', letterSpacing: '0.3px' }}>SustainRank</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>ESG Intelligence</div>
          </div>
        </div>

        {/* Main copy */}
        <div style={{ zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Join Today</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 16, fontFamily: "'Raleway',sans-serif" }}>
            Start Your<br />
            <span style={{ background: 'linear-gradient(90deg,#4361ee,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ESG Journey
            </span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 320 }}>
            Register your organisation and start tracking sustainability performance across all 17 UN SDG goals.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            {[
              { value: '17', label: 'SDG Goals' },
              { value: '4', label: 'ESG Pillars' },
              { value: '100', label: 'Score Scale' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', fontFamily: "'Raleway',sans-serif", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', zIndex: 1 }}>
          Powered by GHG Protocol · ISO 50001 · GRI 306 · SDG 8
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8fafc', padding: '48px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', fontFamily: "'Raleway',sans-serif", marginBottom: 8 }}>
              Create account
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Fill in your details to get started
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            }}>
              <i className="bi bi-exclamation-circle-fill" style={{ color: '#ef4444', fontSize: '0.9rem' }}></i>
              <span style={{ fontSize: '0.84rem', color: '#b91c1c' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Company Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Company Name
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-building" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}></i>
                <input
                  type="text" name="company_name" placeholder="Your organisation name"
                  value={form.company_name} onChange={handleChange} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4361ee'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-person" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}></i>
                <input
                  type="text" name="username" placeholder="Choose a username"
                  value={form.username} onChange={handleChange} required autoFocus
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4361ee'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}></i>
                <input
                  type="email" name="email" placeholder="you@company.com"
                  value={form.email} onChange={handleChange} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4361ee'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}></i>
                <input
                  type={showPwd1 ? 'text' : 'password'} name="password1" placeholder="Create a password"
                  value={form.password1} onChange={handleChange} required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#4361ee'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPwd1(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
                  <i className={`bi bi-eye${showPwd1 ? '-slash' : ''}`} style={{ fontSize: '1rem' }}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}></i>
                <input
                  type={showPwd2 ? 'text' : 'password'} name="password2" placeholder="Repeat your password"
                  value={form.password2} onChange={handleChange} required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#4361ee'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPwd2(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
                  <i className={`bi bi-eye${showPwd2 ? '-slash' : ''}`} style={{ fontSize: '1rem' }}></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg,#4361ee,#3f37c9)',
                border: 'none', borderRadius: 10, color: '#fff',
                fontSize: '0.92rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4, transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(67,97,238,0.35)',
                letterSpacing: '0.3px',
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading
                ? <><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}></i>Creating account…</>
                : <><i className="bi bi-person-check me-2"></i>Create Account</>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Already have an account?</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
          </div>

          {/* Login link */}
          <Link
            to="/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '12px',
              background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10,
              color: '#374151', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600,
              transition: 'all 0.2s', boxSizing: 'border-box',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#4361ee'; e.currentTarget.style.color = '#4361ee' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151' }}
          >
            <i className="bi bi-box-arrow-in-right"></i>
            Sign in instead
          </Link>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: 28 }}>
            By registering you agree to our sustainability data usage policy.
          </p>
        </div>
      </div>
    </div>
  )
}
