import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calculateWaste } from '../api/calculators'

const STEPS = [
  { label: 'Waste Generated', sub: 'Monthly waste by type (kg)' },
  { label: 'Waste Diverted',  sub: 'Recycled and composted amounts' },
]

export default function WasteCalculatorPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    industry: 'general',
    swaste: '', owaste: '', ewaste: '', Hwaste: '',
    rcycwaste: '', composted: '',
  })

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await calculateWaste(values)
      navigate('/result', { state: { result: res, backPath: '/waste' } })
    } catch {
      setError('Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calc-waste-bg">
      <Header />
      <div className="calc-layout accent-waste">

        <aside className="calc-sidebar">
          <div>
            <div className="calc-sidebar-brand">
              <div className="calc-sidebar-icon"><i className="bi bi-recycle"></i></div>
              <div className="calc-sidebar-title">Waste Calculator</div>
              <div className="calc-sidebar-desc">GRI 306 waste diversion methodology — scored against sector benchmark.</div>
            </div>
            <ul className="calc-vsteps">
              {STEPS.map((s, i) => (
                <li key={i} className={`calc-vstep ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                  <div className="calc-vstep-circle">{i < step ? <i className="bi bi-check-lg"></i> : i + 1}</div>
                  <div className="calc-vstep-label">{s.label}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="calc-sidebar-footer">Step {step + 1} of {STEPS.length}</div>
        </aside>

        <div className="calc-form-panel">
          <div className="calc-form-inner">
            <div className="calc-step-title calc-step-active">{STEPS[step].label}</div>
            <div className="calc-step-sub">{STEPS[step].sub}</div>
            {error && <div className="calc-alert-info" style={{ background: '#fff0f0', borderColor: '#fecaca', color: '#dc2626' }}>{error}</div>}

            <form onSubmit={handleSubmit}>

              {step === 0 && (
                <div className="calc-step-active">
                  <div className="calc-field">
                    <label className="form-label">Industry / Sector</label>
                    <select className="form-control" name="industry" value={values.industry} onChange={handleChange}>
                      <option value="general">General</option>
                      <option value="education">Education</option>
                      <option value="it">IT / Software</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Solid Waste (kg/month)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Plastic, paper, glass, metal packaging</span>
                    <input type="number" className="form-control" name="swaste" placeholder="e.g. 200" value={values.swaste} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Organic Waste (kg/month)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Food scraps, garden / yard waste</span>
                    <input type="number" className="form-control" name="owaste" placeholder="e.g. 80" value={values.owaste} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">E-Waste (kg/month)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Computers, monitors, printers, phones</span>
                    <input type="number" className="form-control" name="ewaste" placeholder="e.g. 15" value={values.ewaste} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Hazardous Waste (kg/month)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Chemicals, batteries, fluorescent bulbs</span>
                    <input type="number" className="form-control" name="Hwaste" placeholder="e.g. 5" value={values.Hwaste} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-button-row"><span /><button type="button" className="calc-btn-next" onClick={() => setStep(1)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}

              {step === 1 && (
                <div className="calc-step-active">
                  <div className="calc-alert-info"><i className="bi bi-info-circle me-2"></i>Diversion rate = (recycled + composted) ÷ total waste. Higher is better.</div>
                  <div className="calc-field">
                    <label className="form-label">Recycled Waste (kg/month)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Waste sent to certified recyclers</span>
                    <input type="number" className="form-control" name="rcycwaste" placeholder="e.g. 120" value={values.rcycwaste} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Composted Waste (kg/month)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>On-site or third-party composting of organic waste</span>
                    <input type="number" className="form-control" name="composted" placeholder="e.g. 40" value={values.composted} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(0)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="submit" className="calc-btn-next" disabled={loading}>{loading ? 'Calculating…' : 'Calculate Waste Score'} <i className="bi bi-calculator"></i></button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
