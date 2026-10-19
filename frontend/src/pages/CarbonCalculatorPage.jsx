import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calculateCarbon } from '../api/calculators'

const STEPS = [
  { label: 'Organisation',  sub: 'Sector and headcount for intensity benchmarking' },
  { label: 'Energy & Fuel', sub: 'Scope 1 & 2 — monthly consumption figures' },
  { label: 'Travel',        sub: 'Scope 3 — business flights and commuting' },
  { label: 'Recycling',     sub: 'Offsets from recycling programmes' },
]

export default function CarbonCalculatorPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    industry: 'general', emnum: '',
    elec: '', renewable_pct: '', gas: '', vefeul: '', machine: '',
    'flights-4-less': '', 'flights-4-more': '', transexp: '',
    newspaperOptionsRadios: 'no', alumtinOptionsRadios: 'no',
  })

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await calculateCarbon({ ...values, num_employees: values.emnum })
      navigate('/result', { state: { result: res, backPath: '/carbon' } })
    } catch {
      setError('Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calc-carbon-bg">
      <Header />
      <div className="calc-layout accent-carbon">

        <aside className="calc-sidebar">
          <div>
            <div className="calc-sidebar-brand">
              <div className="calc-sidebar-icon"><i className="bi bi-cloud-haze2"></i></div>
              <div className="calc-sidebar-title">Carbon Calculator</div>
              <div className="calc-sidebar-desc">GHG Protocol Scope 1+2+3 — benchmarked against your sector average.</div>
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
                    <label className="form-label">Number of Employees</label>
                    <input type="number" className="form-control" name="emnum" placeholder="e.g. 150" value={values.emnum} onChange={handleChange} min="1" required />
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: 4, display: 'block' }}>Used to calculate carbon intensity per employee and benchmark against sector peers.</span>
                  </div>
                  <div className="calc-button-row"><span /><button type="button" className="calc-btn-next" onClick={() => setStep(1)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}

              {step === 1 && (
                <div className="calc-step-active">
                  <div className="calc-alert-info"><i className="bi bi-info-circle me-2"></i>Enter monthly figures. India grid factor: 0.82 kgCO₂e/kWh.</div>
                  <div className="calc-field">
                    <label className="form-label">Electricity (kWh/month)</label>
                    <input type="number" className="form-control" name="elec" placeholder="e.g. 5000" value={values.elec} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Renewable Share of Electricity (%)</label>
                    <input type="number" className="form-control" name="renewable_pct" placeholder="0 – 100" min="0" max="100" value={values.renewable_pct} onChange={handleChange} />
                    <span style={{ fontSize: '0.74rem', color: '#16a34a', marginTop: 4, display: 'block' }}>Each % of renewables reduces your Scope 2 emissions proportionally.</span>
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Natural Gas (m³/month)</label>
                    <input type="number" className="form-control" name="gas" placeholder="e.g. 200" value={values.gas} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Vehicle Fuel (litres/month)</label>
                    <input type="number" className="form-control" name="vefeul" placeholder="e.g. 300" value={values.vefeul} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Machinery / Generator Diesel (litres/month)</label>
                    <input type="number" className="form-control" name="machine" placeholder="e.g. 100" value={values.machine} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(0)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="button" className="calc-btn-next" onClick={() => setStep(2)}>Next <i className="bi bi-arrow-right"></i></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="calc-step-active">
                  <div className="calc-field">
                    <label className="form-label">Short-haul Flights (under 4 hrs) — trips/year</label>
                    <input type="number" className="form-control" name="flights-4-less" placeholder="e.g. 10" value={values['flights-4-less']} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Long-haul Flights (4+ hrs) — passenger-hours/year</label>
                    <input type="number" className="form-control" name="flights-4-more" placeholder="e.g. 40" value={values['flights-4-more']} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Staff Commute by Train / Public Transport (km/month)</label>
                    <input type="number" className="form-control" name="transexp" placeholder="e.g. 500" value={values.transexp} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(1)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="button" className="calc-btn-next" onClick={() => setStep(3)}>Next <i className="bi bi-arrow-right"></i></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="calc-step-active">
                  <div className="calc-field">
                    <label className="form-label">Do you recycle newspaper / paper?</label>
                    <div className="calc-radio-group">
                      <label className="calc-radio-opt"><input type="radio" name="newspaperOptionsRadios" value="yes" checked={values.newspaperOptionsRadios === 'yes'} onChange={handleChange} /> Yes</label>
                      <label className="calc-radio-opt"><input type="radio" name="newspaperOptionsRadios" value="no" checked={values.newspaperOptionsRadios === 'no'} onChange={handleChange} /> No</label>
                    </div>
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Do you recycle aluminium / tin?</label>
                    <div className="calc-radio-group">
                      <label className="calc-radio-opt"><input type="radio" name="alumtinOptionsRadios" value="yes" checked={values.alumtinOptionsRadios === 'yes'} onChange={handleChange} /> Yes</label>
                      <label className="calc-radio-opt"><input type="radio" name="alumtinOptionsRadios" value="no" checked={values.alumtinOptionsRadios === 'no'} onChange={handleChange} /> No</label>
                    </div>
                  </div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(2)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="submit" className="calc-btn-next" disabled={loading}>{loading ? 'Calculating…' : 'Calculate Footprint'} <i className="bi bi-calculator"></i></button>
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
