import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calculateEnergy } from '../api/calculators'

const STEPS = [
  { label: 'Organisation',  sub: 'Sector and headcount for intensity benchmarking' },
  { label: 'Electricity',   sub: 'Monthly electricity consumption and renewables' },
  { label: 'Fuel & Water',  sub: 'Vehicle fuel, heating and water usage' },
]

export default function EnergyCalculatorPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    industryType: 'general', employeeCount: '',
    monthlyElectricity: '', renewablePercentage: '',
    vehicleFuel: '', fuelType: 'petrol', heatingFuel: '', waterConsumption: '',
  })

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await calculateEnergy({
        ...values,
        num_employees: values.employeeCount,
        renewable_pct: values.renewablePercentage,
        industry: values.industryType,
      })
      navigate('/result', { state: { result: res, backPath: '/energy' } })
    } catch {
      setError('Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calc-energy-bg">
      <Header />
      <div className="calc-layout accent-energy">

        <aside className="calc-sidebar">
          <div>
            <div className="calc-sidebar-brand">
              <div className="calc-sidebar-icon"><i className="bi bi-lightning-charge"></i></div>
              <div className="calc-sidebar-title">Energy Calculator</div>
              <div className="calc-sidebar-desc">ISO 50001 energy intensity methodology — benchmarked against your sector.</div>
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
                    <select className="form-control" name="industryType" value={values.industryType} onChange={handleChange}>
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
                    <input type="number" className="form-control" name="employeeCount" placeholder="e.g. 150" value={values.employeeCount} onChange={handleChange} min="1" required />
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: 4, display: 'block' }}>Used to compute energy intensity (kWh/employee) vs sector benchmark.</span>
                  </div>
                  <div className="calc-button-row"><span /><button type="button" className="calc-btn-next" onClick={() => setStep(1)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}

              {step === 1 && (
                <div className="calc-step-active">
                  <div className="calc-field">
                    <label className="form-label">Monthly Electricity (kWh)</label>
                    <input type="number" className="form-control" name="monthlyElectricity" placeholder="e.g. 8000" value={values.monthlyElectricity} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Renewable Share (%)</label>
                    <input type="number" className="form-control" name="renewablePercentage" min="0" max="100" placeholder="0 – 100" value={values.renewablePercentage} onChange={handleChange} />
                    <span style={{ fontSize: '0.74rem', color: '#16a34a', marginTop: 4, display: 'block' }}>Counts as a 30% weight bonus in your energy score.</span>
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
                    <label className="form-label">Monthly Vehicle Fuel (litres)</label>
                    <input type="number" className="form-control" name="vehicleFuel" placeholder="e.g. 400" value={values.vehicleFuel} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Vehicle Fuel Type</label>
                    <select className="form-control" name="fuelType" value={values.fuelType} onChange={handleChange}>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="lpg">LPG</option>
                      <option value="other">Other / CNG</option>
                    </select>
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Heating Fuel — LPG (litres/month)</label>
                    <input type="number" className="form-control" name="heatingFuel" placeholder="e.g. 50" value={values.heatingFuel} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Water Consumption (m³/month)</label>
                    <input type="number" className="form-control" name="waterConsumption" placeholder="e.g. 30" value={values.waterConsumption} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(1)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="submit" className="calc-btn-next" disabled={loading}>{loading ? 'Calculating…' : 'Calculate Energy'} <i className="bi bi-calculator"></i></button>
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
