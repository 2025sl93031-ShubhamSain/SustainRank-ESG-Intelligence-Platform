import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calculateEevta } from '../api/calculators'

const STEPS = [
  { label: 'Workforce Size',  sub: 'Total headcount and training coverage' },
  { label: 'Flexibility',     sub: 'Remote work and flexible arrangements' },
  { label: 'Welfare',         sub: 'Benefits, financial wellness and support' },
  { label: 'People & Equity', sub: 'Retention, growth and diversity' },
]

export default function EevtaCalculatorPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    totalStudents: '',       // total employees
    techVocStudents: '',     // employees who received skill training
    distanceLearning: '',    // employees with remote/flexible work
    scholarshipStudents: '', // employees with health/welfare benefits
    financialAid: '',        // % with financial wellness / EAP
    gradRate: '',            // employee retention rate %
    employmentRate: '',      // internal promotion rate %
    femaleEnrolment: '',     // % female employees
    disabilityAccess: 'no',
  })

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await calculateEevta(values)
      navigate('/result', { state: { result: res, backPath: '/eevta' } })
    } catch {
      setError('Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calc-eevta-bg">
      <Header />
      <div className="calc-layout accent-eevta">

        <aside className="calc-sidebar">
          <div>
            <div className="calc-sidebar-brand">
              <div className="calc-sidebar-icon"><i className="bi bi-people-fill"></i></div>
              <div className="calc-sidebar-title">Workforce Development</div>
              <div className="calc-sidebar-desc">SDG 8 Decent Work — measures training, equity, retention and employee wellbeing.</div>
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
                    <label className="form-label">Total Employees</label>
                    <input type="number" className="form-control" name="totalStudents" placeholder="e.g. 250" value={values.totalStudents} onChange={handleChange} min="1" required />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Employees Who Received Skill Training (this year)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>SDG 8.5 target: ≥ 40% of workforce trained annually</span>
                    <input type="number" className="form-control" name="techVocStudents" placeholder="e.g. 100" value={values.techVocStudents} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-button-row"><span /><button type="button" className="calc-btn-next" onClick={() => setStep(1)}>Next <i className="bi bi-arrow-right"></i></button></div>
                </div>
              )}

              {step === 1 && (
                <div className="calc-step-active">
                  <div className="calc-field">
                    <label className="form-label">Employees with Remote / Flexible Work Options</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>SDG 8.5 — target: ≥ 20% of workforce</span>
                    <input type="number" className="form-control" name="distanceLearning" placeholder="e.g. 60" value={values.distanceLearning} onChange={handleChange} min="0" />
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
                    <label className="form-label">Employees with Health / Welfare Benefits</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>SDG 8.8 — target: ≥ 50% of workforce covered</span>
                    <input type="number" className="form-control" name="scholarshipStudents" placeholder="e.g. 150" value={values.scholarshipStudents} onChange={handleChange} min="0" />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Employees with Financial Wellness / EAP Programme (%)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>SDG 8.8 — target: ≥ 30%</span>
                    <input type="number" className="form-control" name="financialAid" min="0" max="100" placeholder="0 – 100" value={values.financialAid} onChange={handleChange} />
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
                    <label className="form-label">Employee Retention Rate (%)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>% of employees who stayed through the year</span>
                    <input type="number" className="form-control" name="gradRate" min="0" max="100" placeholder="0 – 100" value={values.gradRate} onChange={handleChange} />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Internal Promotion Rate (%)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>% of open roles filled by internal candidates</span>
                    <input type="number" className="form-control" name="employmentRate" min="0" max="100" placeholder="0 – 100" value={values.employmentRate} onChange={handleChange} />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Female Employees (%)</label>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'block', marginBottom: 6 }}>SDG 5.5 gender equity — scored highest at 50%</span>
                    <input type="number" className="form-control" name="femaleEnrolment" min="0" max="100" placeholder="0 – 100" value={values.femaleEnrolment} onChange={handleChange} />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Disability-inclusive workplace?</label>
                    <span style={{ fontSize: '0.74rem', color: '#16a34a', display: 'block', marginBottom: 6 }}>+5 bonus points</span>
                    <div className="calc-radio-group">
                      <label className="calc-radio-opt"><input type="radio" name="disabilityAccess" value="yes" checked={values.disabilityAccess === 'yes'} onChange={handleChange} /> Yes</label>
                      <label className="calc-radio-opt"><input type="radio" name="disabilityAccess" value="no" checked={values.disabilityAccess === 'no'} onChange={handleChange} /> No</label>
                    </div>
                  </div>
                  <div className="calc-button-row">
                    <button type="button" className="calc-btn-prev" onClick={() => setStep(2)}><i className="bi bi-arrow-left"></i> Previous</button>
                    <button type="submit" className="calc-btn-next" disabled={loading}>{loading ? 'Calculating…' : 'Calculate Social Score'} <i className="bi bi-calculator"></i></button>
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
