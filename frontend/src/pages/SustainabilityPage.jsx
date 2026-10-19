import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calculateSustainability } from '../api/calculators'
import { getProfile } from '../api/auth'

const STEPS = [
  { label: 'Carbon', sub: 'Industry and carbon emissions data' },
  { label: 'Energy', sub: 'Total energy usage in kWh' },
  { label: 'Waste', sub: 'Total waste produced in kg' },
  { label: 'Social Score', sub: 'Workforce Development Score (0–100)' },
  { label: 'Revenue', sub: 'Revenue and operational costs' },
  { label: 'Investment', sub: 'Total investment amount' },
]

export default function SustainabilityPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    industry: '', carbon: '', energy: '', waste: '',
    evtaa: '', revenue: '', cost: '', inv: '',
  })

  useEffect(() => {
    getProfile()
      .then((data) => {
        setValues((v) => ({
          ...v,
          carbon: data.carbon_value ?? '',
          energy: data.energy_value ?? '',
          waste: data.waste_value ?? '',
          evtaa: data.evtaa_value ?? '',
        }))
      })
      .catch(() => {})
  }, [])

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await calculateSustainability(values)
      navigate('/result/sustainability', { state: { result: res } })
    } catch {
      setError('Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calc-sus-bg">
      <Header />
      <div className="calc-layout accent-sus">

        <aside className="calc-sidebar">
          <div>
            <div className="calc-sidebar-brand">
              <div className="calc-sidebar-icon"><i className="bi bi-globe-americas"></i></div>
              <div className="calc-sidebar-title">Transforming Sustainability</div>
              <div className="calc-sidebar-desc">Complete all steps to calculate your final composite sustainability score.</div>
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

            {step === 0 && (
              <div className="calc-alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Values from your individual calculators are pre-filled. You can override them.
              </div>
            )}

            {error && <div className="calc-alert-info" style={{ background: '#fff0f0', borderColor: '#fecaca', color: '#dc2626' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {step === 0 && (
                <div className="calc-step-active">
                  <div className="calc-field"><label className="form-label">Industry</label><input type="text" className="form-control" name="industry" placeholder="e.g. Consumer Goods" value={values.industry} onChange={handleChange} /></div>
                  <div className="calc-field"><label className="form-label">Total Carbon Emissions (tons CO₂)</label><input type="number" className="form-control" name="carbon" placeholder="Enter tons of CO₂" value={values.carbon} onChange={handleChange} min="0" /></div>
                  <div className="calc-button-row"><span /><button type="button" className="calc-btn-next" onClick={() => setStep(1)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}
              {step === 1 && (
                <div className="calc-step-active">
                  <div className="calc-field"><label className="form-label">Total Energy Usage (kWh)</label><input type="number" className="form-control" name="energy" placeholder="Enter kWh" value={values.energy} onChange={handleChange} min="0" /></div>
                  <div className="calc-button-row"><button type="button" className="calc-btn-prev" onClick={() => setStep(0)}><i className="bi bi-arrow-left"></i> Previous</button><button type="button" className="calc-btn-next" onClick={() => setStep(2)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}
              {step === 2 && (
                <div className="calc-step-active">
                  <div className="calc-field"><label className="form-label">Total Waste Produced (kg)</label><input type="number" className="form-control" name="waste" placeholder="Enter kg" value={values.waste} onChange={handleChange} min="0" /></div>
                  <div className="calc-button-row"><button type="button" className="calc-btn-prev" onClick={() => setStep(1)}><i className="bi bi-arrow-left"></i> Previous</button><button type="button" className="calc-btn-next" onClick={() => setStep(3)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}
              {step === 3 && (
                <div className="calc-step-active">
                  <div className="calc-field"><label className="form-label">Workforce Development Score (0–100)</label><input type="number" className="form-control" name="evtaa" placeholder="0" value={values.evtaa} onChange={handleChange} min="0" max="100" /></div>
                  <div className="calc-button-row"><button type="button" className="calc-btn-prev" onClick={() => setStep(2)}><i className="bi bi-arrow-left"></i> Previous</button><button type="button" className="calc-btn-next" onClick={() => setStep(4)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}
              {step === 4 && (
                <div className="calc-step-active">
                  <div className="calc-field"><label className="form-label">Total Revenue ($)</label><input type="number" className="form-control" name="revenue" placeholder="Enter annual revenue" value={values.revenue} onChange={handleChange} min="0" /></div>
                  <div className="calc-field"><label className="form-label">Total Costs ($)</label><input type="number" className="form-control" name="cost" placeholder="Enter annual costs" value={values.cost} onChange={handleChange} min="0" /></div>
                  <div className="calc-button-row"><button type="button" className="calc-btn-prev" onClick={() => setStep(3)}><i className="bi bi-arrow-left"></i> Previous</button><button type="button" className="calc-btn-next" onClick={() => setStep(5)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}
              {step === 5 && (
                <div className="calc-step-active">
                  <div className="calc-field"><label className="form-label">Total Investment Cost ($)</label><input type="number" className="form-control" name="inv" placeholder="Enter investment amount" value={values.inv} onChange={handleChange} min="0" /></div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(4)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="submit" className="calc-btn-next" disabled={loading}>{loading ? 'Calculating…' : 'Calculate Score'} <i className="bi bi-calculator"></i></button>
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
