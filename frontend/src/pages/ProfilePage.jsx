import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCompanyProfile, updateCompanyProfile, changePassword } from '../api/auth'

const INDUSTRIES = [
  'General', 'Agriculture', 'Construction', 'Education', 'Energy',
  'Finance', 'Healthcare', 'Hospitality', 'Manufacturing', 'Retail',
  'Technology', 'Transportation', 'Waste Management', 'Other',
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  const [form, setForm] = useState({ companyName: '', industry: '', numEmployees: '' })
  const [account, setAccount] = useState({ username: '', email: '' })

  useEffect(() => {
    getCompanyProfile()
      .then(d => {
        setForm({
          companyName: d.companyName || '',
          industry: d.industry || 'General',
          numEmployees: d.numEmployees || '',
        })
        setAccount({ username: d.username || '', email: d.email || '' })
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setSaved(false)
    setError('')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.companyName.trim()) return setError('Company name is required.')
    if (!form.numEmployees || +form.numEmployees < 1) return setError('Number of employees must be at least 1.')
    setSaving(true)
    setError('')
    try {
      const updated = await updateCompanyProfile({
        companyName: form.companyName.trim(),
        industry: form.industry,
        numEmployees: +form.numEmployees,
      })
      setForm({
        companyName: updated.companyName || '',
        industry: updated.industry || 'General',
        numEmployees: updated.numEmployees || '',
      })
      setSaved(true)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (!pwForm.currentPassword) return setPwError('Current password is required.')
    if (pwForm.newPassword.length < 8) return setPwError('New password must be at least 8 characters.')
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('Passwords do not match.')
    setPwSaving(true)
    setPwError('')
    const result = await changePassword(pwForm)
    if (result.success) {
      setPwSaved(true)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setPwError(result.error || 'Failed to change password.')
    }
    setPwSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5fb' }}>
      <Header />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 24px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(120deg, #0d1b4b 0%, #1565c0 60%, #1e88e5 100%)',
          borderRadius: 18, padding: '28px 32px',
          display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className="bi bi-building" style={{ color: '#fff', fontSize: '1.4rem' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: "'Raleway',sans-serif" }}>
              Company Profile
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '3px 0 0' }}>
              This information is used in your sustainability calculations
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div className="spinner-border text-primary" role="status" />
            <p style={{ color: '#9ca3af', marginTop: 14, fontSize: '0.88rem' }}>Loading profile…</p>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Company Info card */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 20 }}>
                Company Information
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Company name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={e => set('companyName', e.target.value)}
                    placeholder="Your company name"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1.5px solid #e5e7eb', fontSize: '0.88rem', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#4361ee'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* Industry */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Industry
                  </label>
                  <select
                    value={form.industry}
                    onChange={e => set('industry', e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1.5px solid #e5e7eb', fontSize: '0.88rem', color: '#111827',
                      outline: 'none', boxSizing: 'border-box', background: '#fff',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#4361ee'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                {/* Employees */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Number of Employees
                    <span style={{ fontSize: '0.74rem', fontWeight: 400, color: '#9ca3af', marginLeft: 6 }}>
                      used in carbon intensity calculations
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.numEmployees}
                    onChange={e => set('numEmployees', e.target.value)}
                    placeholder="e.g. 250"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1.5px solid #e5e7eb', fontSize: '0.88rem', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#4361ee'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '5px 0 0' }}>
                    Changing this won't retroactively change past history records.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info card (read-only) */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 20 }}>
                Account Information
                <span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>
                  (read-only)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {[
                  { label: 'Username', value: account.username, icon: 'bi-person-fill' },
                  { label: 'Email', value: account.email, icon: 'bi-envelope-fill' },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 10,
                      background: '#f8fafc', border: '1.5px solid #f1f5f9',
                      fontSize: '0.88rem', color: '#6b7280',
                    }}>
                      <i className={`bi ${field.icon}`} style={{ color: '#9ca3af', fontSize: '0.85rem' }} />
                      {field.value || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password card */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 20 }}>
                Change Password
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { key: 'currentPassword', label: 'Current Password',  show: showPw.current,  toggle: () => setShowPw(s => ({ ...s, current: !s.current })) },
                  { key: 'newPassword',     label: 'New Password',      show: showPw.new,     toggle: () => setShowPw(s => ({ ...s, new: !s.new })) },
                  { key: 'confirmPassword', label: 'Confirm New Password', show: showPw.confirm, toggle: () => setShowPw(s => ({ ...s, confirm: !s.confirm })) },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={pwForm[field.key]}
                        onChange={e => { setPwForm(f => ({ ...f, [field.key]: e.target.value })); setPwSaved(false); setPwError('') }}
                        placeholder="••••••••"
                        style={{
                          width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10,
                          border: '1.5px solid #e5e7eb', fontSize: '0.88rem', color: '#111827',
                          outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#4361ee'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        type="button"
                        onClick={field.toggle}
                        style={{
                          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                        }}
                      >
                        <i className={`bi ${field.show ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '0.95rem' }} />
                      </button>
                    </div>
                    {field.key === 'newPassword' && (
                      <p style={{ fontSize: '0.74rem', color: '#9ca3af', margin: '4px 0 0' }}>
                        Minimum 8 characters
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {pwError && (
                <div style={{
                  marginTop: 16, padding: '11px 14px', borderRadius: 10,
                  background: '#fee2e2', border: '1px solid #fca5a5',
                  color: '#dc2626', fontSize: '0.84rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <i className="bi bi-exclamation-triangle-fill" />
                  {pwError}
                </div>
              )}

              {pwSaved && (
                <div style={{
                  marginTop: 16, padding: '11px 14px', borderRadius: 10,
                  background: '#dcfce7', border: '1px solid #86efac',
                  color: '#16a34a', fontSize: '0.84rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <i className="bi bi-check-circle-fill" />
                  Password changed successfully.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={pwSaving}
                  style={{
                    padding: '10px 28px', borderRadius: 10,
                    background: pwSaving ? '#93c5fd' : 'linear-gradient(135deg,#4361ee,#3f37c9)',
                    border: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700,
                    cursor: pwSaving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: pwSaving ? 'none' : '0 3px 12px rgba(67,97,238,0.35)',
                  }}
                >
                  {pwSaving ? (
                    <><span className="spinner-border spinner-border-sm" role="status" /> Updating…</>
                  ) : (
                    <><i className="bi bi-shield-lock" /> Update Password</>
                  )}
                </button>
              </div>
            </div>

            {/* Error / success for company info */}
            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: 10,
                background: '#fee2e2', border: '1px solid #fca5a5',
                color: '#dc2626', fontSize: '0.84rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <i className="bi bi-exclamation-triangle-fill" />
                {error}
              </div>
            )}

            {saved && (
              <div style={{
                padding: '12px 16px', borderRadius: 10,
                background: '#dcfce7', border: '1px solid #86efac',
                color: '#16a34a', fontSize: '0.84rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <i className="bi bi-check-circle-fill" />
                Profile saved successfully.
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: '10px 22px', borderRadius: 10,
                  background: '#fff', border: '1.5px solid #e5e7eb',
                  color: '#374151', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '10px 28px', borderRadius: 10,
                  background: saving ? '#93c5fd' : 'linear-gradient(135deg,#4361ee,#3f37c9)',
                  border: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: saving ? 'none' : '0 3px 12px rgba(67,97,238,0.35)',
                }}
              >
                {saving ? (
                  <><span className="spinner-border spinner-border-sm" role="status" /> Saving…</>
                ) : (
                  <><i className="bi bi-check2" /> Save Changes</>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
