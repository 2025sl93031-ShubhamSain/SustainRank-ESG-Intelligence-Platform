import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { calculateCarbon, calculateEnergy, calculateWaste, calculateEevta, calculateSustainability } from '../api/calculators'

const STEPS = [
  { id: 'org',      label: 'Organisation', icon: 'bi-building' },
  { id: 'carbon',   label: 'Carbon',       icon: 'bi-fire' },
  { id: 'energy',   label: 'Energy',       icon: 'bi-lightning-fill' },
  { id: 'waste',    label: 'Waste',        icon: 'bi-trash3-fill' },
  { id: 'social',   label: 'Social',       icon: 'bi-people-fill' },
  { id: 'finance',  label: 'Financial',    icon: 'bi-graph-up-arrow' },
]

const INDUSTRIES = [
  'General','Agriculture','Construction','Education','Energy',
  'Finance','Healthcare','Hospitality','Manufacturing','Retail',
  'Technology','Transportation','Waste Management','Other',
]

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
        {label}
        {hint && <span style={{ fontSize: '0.73rem', fontWeight: 400, color: '#9ca3af', marginLeft: 8 }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid #e5e7eb', fontSize: '0.88rem', color: '#111827',
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

function Input({ value, onChange, type = 'number', placeholder, min = '0' }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} min={min}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = '#4361ee'}
      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange} style={inputStyle}
      onFocus={e => e.target.style.borderColor = '#4361ee'}
      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Grid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>{children}</div>
}

export default function AssessmentWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // ── form state ──────────────────────────────────────────────────────────────
  const [org, setOrg] = useState({ industry: 'General', num_employees: '' })

  const [carbon, setCarbon] = useState({
    elec: '', renewable_pct: '', gas: '', vefeul: '', machine: '',
    flights_short: '', flights_long: '', transexp: '',
    newspaper: 'no', alumtin: 'no',
  })

  const [energy, setEnergy] = useState({
    monthlyElectricity: '', renewablePercentage: '',
    vehicleFuel: '', fuelType: 'petrol', heatingFuel: '', waterConsumption: '',
  })

  const [waste, setWaste] = useState({
    swaste: '', owaste: '', ewaste: '', hwaste: '', rcycwaste: '', composted: '',
  })

  const [social, setSocial] = useState({
    totalStudents: '', techVocStudents: '', distanceLearning: '',
    scholarshipStudents: '', financialAid: '', gradRate: '',
    employmentRate: '', femaleEnrolment: '', disabilityAccess: 'yes',
  })

  const [finance, setFinance] = useState({ revenue: '', cost: '', inv: '' })

  // ── helpers ─────────────────────────────────────────────────────────────────
  const c = (setter) => (field) => (e) => {
    setter(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }
  const setC = c(setCarbon)
  const setE = c(setEnergy)
  const setW = c(setWaste)
  const setS = c(setSocial)
  const setF = c(setFinance)
  const setO = c(setOrg)

  function validate() {
    if (step === 0 && !org.num_employees) return 'Number of employees is required.'
    if (step === 1 && !carbon.elec) return 'Monthly electricity is required.'
    if (step === 2 && !energy.monthlyElectricity) return 'Monthly electricity usage is required.'
    if (step === 3 && !waste.swaste) return 'Solid waste amount is required.'
    if (step === 4 && !social.totalStudents) return 'Total workforce size is required.'
    if (step === 5) {
      if (!finance.revenue) return 'Annual revenue is required.'
      if (!finance.cost) return 'Operational cost is required.'
      if (!finance.inv) return 'Sustainability investment is required.'
    }
    return null
  }

  function isStepComplete(i) {
    if (i === 0) return !!org.num_employees
    if (i === 1) return !!carbon.elec
    if (i === 2) return !!energy.monthlyElectricity
    if (i === 3) return !!waste.swaste
    if (i === 4) return !!social.totalStudents
    if (i === 5) return !!finance.revenue && !!finance.cost && !!finance.inv
    return false
  }

  function handleNext() {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSubmitting(true)

    try {
      // 1. Carbon
      const carbonRes = await calculateCarbon({
        industry: org.industry,
        num_employees: org.num_employees,
        elec: carbon.elec,
        renewable_pct: carbon.renewable_pct || '0',
        gas: carbon.gas || '0',
        vefeul: carbon.vefeul || '0',
        machine: carbon.machine || '0',
        'flights-4-less': carbon.flights_short || '0',
        'flights-4-more': carbon.flights_long || '0',
        transexp: carbon.transexp || '0',
        newspaperOptionsRadios: carbon.newspaper,
        alumtinOptionsRadios: carbon.alumtin,
      })

      // 2. Energy
      const energyRes = await calculateEnergy({
        industry: org.industry,
        num_employees: org.num_employees,
        monthlyElectricity: energy.monthlyElectricity,
        renewable_pct: energy.renewablePercentage || '0',
        vehicleFuel: energy.vehicleFuel || '0',
        fuelType: energy.fuelType,
        heatingFuel: energy.heatingFuel || '0',
        waterConsumption: energy.waterConsumption || '0',
      })

      // 3. Waste
      const wasteRes = await calculateWaste({
        industry: org.industry,
        swaste: waste.swaste,
        owaste: waste.owaste || '0',
        ewaste: waste.ewaste || '0',
        Hwaste: waste.hwaste || '0',
        rcycwaste: waste.rcycwaste || '0',
        composted: waste.composted || '0',
      })

      // 4. EEVTA / Social
      const eevtaRes = await calculateEevta({
        totalStudents: social.totalStudents,
        techVocStudents: social.techVocStudents || '0',
        distanceLearning: social.distanceLearning || '0',
        scholarshipStudents: social.scholarshipStudents || '0',
        financialAid: social.financialAid || '0',
        gradRate: social.gradRate || '0',
        employmentRate: social.employmentRate || '0',
        femaleEnrolment: social.femaleEnrolment || '0',
        disabilityAccess: social.disabilityAccess,
      })

      // 5. Sustainability — use results from above
      const carbonVal = carbonRes?.carbon_score ?? carbonRes?.result ?? 0
      const energyVal = energyRes?.energy_total ?? energyRes?.result ?? 0
      const wasteVal  = wasteRes?.total_waste ?? wasteRes?.result ?? 0
      const eevtaVal  = eevtaRes?.eevta_score ?? eevtaRes?.result ?? 0

      const sustainRes = await calculateSustainability({
        industry: org.industry,
        carbon: String(carbonVal),
        energy: String(energyVal),
        waste:  String(wasteVal),
        evtaa:  String(eevtaVal),
        revenue: finance.revenue,
        cost:    finance.cost,
        inv:     finance.inv,
        num_employees: org.num_employees,
      })

      navigate('/result/sustainability', { state: { result: sustainRes, industry: org.industry } })
    } catch (e) {
      setError('Something went wrong. Please check your inputs and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── step content — called as a function, not a component, to preserve focus ──
  function renderStep() {
    switch (step) {
      case 0: return (
        <>
          <Field label="Industry">
            <Select value={org.industry} onChange={e => { setOrg(p => ({ ...p, industry: e.target.value })); setError('') }} options={INDUSTRIES} />
          </Field>
          <Field label="Number of Employees" hint="used in intensity calculations">
            <Input value={org.num_employees} onChange={setO('num_employees')} min="1" placeholder="e.g. 250" />
          </Field>
        </>
      )

      case 1: return (
        <>
          <Grid>
            <Field label="Monthly Electricity (kWh)">
              <Input value={carbon.elec} onChange={setC('elec')} placeholder="e.g. 5000" />
            </Field>
            <Field label="Renewable Energy (%)" hint="optional">
              <Input value={carbon.renewable_pct} onChange={setC('renewable_pct')} placeholder="e.g. 20" />
            </Field>
            <Field label="Natural Gas (kWh)" hint="optional">
              <Input value={carbon.gas} onChange={setC('gas')} placeholder="e.g. 2000" />
            </Field>
            <Field label="Vehicle Fuel (litres)" hint="optional">
              <Input value={carbon.vefeul} onChange={setC('vefeul')} placeholder="e.g. 500" />
            </Field>
            <Field label="Machinery Fuel (litres)" hint="optional">
              <Input value={carbon.machine} onChange={setC('machine')} placeholder="e.g. 100" />
            </Field>
            <Field label="Business Travel Expenses (£)" hint="optional">
              <Input value={carbon.transexp} onChange={setC('transexp')} placeholder="e.g. 1000" />
            </Field>
            <Field label="Short-haul Flights (no. passengers)" hint="optional">
              <Input value={carbon.flights_short} onChange={setC('flights_short')} placeholder="e.g. 10" />
            </Field>
            <Field label="Long-haul Flights (no. passengers)" hint="optional">
              <Input value={carbon.flights_long} onChange={setC('flights_long')} placeholder="e.g. 5" />
            </Field>
          </Grid>
          <Grid>
            <Field label="Paper / Newspaper recycling?">
              <Select value={carbon.newspaper} onChange={setC('newspaper')} options={['yes', 'no']} />
            </Field>
            <Field label="Aluminium / Tin recycling?">
              <Select value={carbon.alumtin} onChange={setC('alumtin')} options={['yes', 'no']} />
            </Field>
          </Grid>
        </>
      )

      case 2: return (
        <Grid>
          <Field label="Monthly Electricity (kWh)">
            <Input value={energy.monthlyElectricity} onChange={setE('monthlyElectricity')} placeholder="e.g. 5000" />
          </Field>
          <Field label="Renewable Energy (%)" hint="optional">
            <Input value={energy.renewablePercentage} onChange={setE('renewablePercentage')} placeholder="e.g. 20" />
          </Field>
          <Field label="Vehicle Fuel (litres/month)" hint="optional">
            <Input value={energy.vehicleFuel} onChange={setE('vehicleFuel')} placeholder="e.g. 300" />
          </Field>
          <Field label="Fuel Type">
            <Select value={energy.fuelType} onChange={setE('fuelType')} options={['petrol','diesel','lpg','other']} />
          </Field>
          <Field label="Heating Fuel (kWh)" hint="optional">
            <Input value={energy.heatingFuel} onChange={setE('heatingFuel')} placeholder="e.g. 1000" />
          </Field>
          <Field label="Water Consumption (m³/month)" hint="optional">
            <Input value={energy.waterConsumption} onChange={setE('waterConsumption')} placeholder="e.g. 50" />
          </Field>
        </Grid>
      )

      case 3: return (
        <Grid>
          <Field label="Solid Waste (kg/month)">
            <Input value={waste.swaste} onChange={setW('swaste')} placeholder="e.g. 500" />
          </Field>
          <Field label="Organic Waste (kg/month)" hint="optional">
            <Input value={waste.owaste} onChange={setW('owaste')} placeholder="e.g. 100" />
          </Field>
          <Field label="Electronic Waste (kg/month)" hint="optional">
            <Input value={waste.ewaste} onChange={setW('ewaste')} placeholder="e.g. 20" />
          </Field>
          <Field label="Hazardous Waste (kg/month)" hint="optional">
            <Input value={waste.hwaste} onChange={setW('hwaste')} placeholder="e.g. 10" />
          </Field>
          <Field label="Recycled Waste (kg/month)" hint="optional">
            <Input value={waste.rcycwaste} onChange={setW('rcycwaste')} placeholder="e.g. 200" />
          </Field>
          <Field label="Composted Waste (kg/month)" hint="optional">
            <Input value={waste.composted} onChange={setW('composted')} placeholder="e.g. 50" />
          </Field>
        </Grid>
      )

      case 4: return (
        <Grid>
          <Field label="Total Workforce Size">
            <Input value={social.totalStudents} onChange={setS('totalStudents')} placeholder="e.g. 250" />
          </Field>
          <Field label="Tech/Vocational Staff" hint="optional">
            <Input value={social.techVocStudents} onChange={setS('techVocStudents')} placeholder="e.g. 50" />
          </Field>
          <Field label="Remote / Distance Workers" hint="optional">
            <Input value={social.distanceLearning} onChange={setS('distanceLearning')} placeholder="e.g. 30" />
          </Field>
          <Field label="Scholarship / Sponsored Staff" hint="optional">
            <Input value={social.scholarshipStudents} onChange={setS('scholarshipStudents')} placeholder="e.g. 10" />
          </Field>
          <Field label="Staff on Financial Aid" hint="optional">
            <Input value={social.financialAid} onChange={setS('financialAid')} placeholder="e.g. 5" />
          </Field>
          <Field label="Graduation / Completion Rate (%)" hint="optional">
            <Input value={social.gradRate} onChange={setS('gradRate')} placeholder="e.g. 85" />
          </Field>
          <Field label="Employment Rate (%)" hint="optional">
            <Input value={social.employmentRate} onChange={setS('employmentRate')} placeholder="e.g. 90" />
          </Field>
          <Field label="Female Enrolment (%)" hint="optional">
            <Input value={social.femaleEnrolment} onChange={setS('femaleEnrolment')} placeholder="e.g. 45" />
          </Field>
          <Field label="Disability Access?">
            <Select value={social.disabilityAccess} onChange={setS('disabilityAccess')} options={['yes','no']} />
          </Field>
        </Grid>
      )

      case 5: return (
        <Grid>
          <Field label="Annual Revenue (£)">
            <Input value={finance.revenue} onChange={setF('revenue')} placeholder="e.g. 1000000" />
          </Field>
          <Field label="Operational Cost (£)">
            <Input value={finance.cost} onChange={setF('cost')} placeholder="e.g. 800000" />
          </Field>
          <Field label="Sustainability Investment (£)" hint="green initiatives, training etc.">
            <Input value={finance.inv} onChange={setF('inv')} placeholder="e.g. 50000" />
          </Field>
        </Grid>
      )

      default: return null
    }
  }

  const progress = Math.round((step / (STEPS.length - 1)) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5fb' }}>
      <Header />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '36px 24px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(120deg,#0d1b4b 0%,#1565c0 60%,#1e88e5 100%)',
          borderRadius: 18, padding: '28px 32px', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-clipboard2-data-fill" style={{ color: '#fff', fontSize: '1.4rem' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: "'Raleway',sans-serif" }}>
              Full ESG Assessment
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '3px 0 0' }}>
              Complete all 6 steps to get your composite sustainability score
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            {STEPS.map((s, i) => {
              const done = i !== step && isStepComplete(i)
              const incomplete = i !== step && i < step && !isStepComplete(i)
              const active = i === step
              return (
                <div key={s.id}
                  onClick={() => { setError(''); setStep(i) }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: done ? '#16a34a' : incomplete ? '#f59e0b' : active ? '#4361ee' : '#f1f5f9',
                    border: `2px solid ${done ? '#16a34a' : incomplete ? '#f59e0b' : active ? '#4361ee' : '#e5e7eb'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {done
                      ? <i className="bi bi-check2" style={{ color: '#fff', fontSize: '0.9rem' }} />
                      : incomplete
                        ? <i className="bi bi-exclamation" style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }} />
                        : <i className={`bi ${s.icon}`} style={{ color: active ? '#fff' : '#9ca3af', fontSize: '0.85rem' }} />
                    }
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: active ? 700 : 500, marginTop: 5,
                    color: done ? '#16a34a' : incomplete ? '#f59e0b' : active ? '#4361ee' : '#9ca3af',
                    textAlign: 'center',
                  }}>{s.label}</span>
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4 }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg,#4361ee,#1e88e5)',
              width: `${progress}%`, transition: 'width 0.3s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Step {step + 1} of {STEPS.length}</span>
            <span style={{ fontSize: '0.72rem', color: '#4361ee', fontWeight: 700 }}>{progress}% complete</span>
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '28px 32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`bi ${STEPS[step].icon}`} style={{ color: '#4361ee', fontSize: '1rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', fontFamily: "'Raleway',sans-serif" }}>
                {STEPS[step].label}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                {step === 0 && 'Basic company information'}
                {step === 1 && 'Carbon emissions sources'}
                {step === 2 && 'Energy consumption details'}
                {step === 3 && 'Waste generation and diversion'}
                {step === 4 && 'Social and workforce metrics'}
                {step === 5 && 'Financial data for ROI calculation'}
              </div>
            </div>
          </div>

          {renderStep()}

          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: 10, marginTop: 8,
              background: '#fee2e2', border: '1px solid #fca5a5',
              color: '#dc2626', fontSize: '0.84rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="bi bi-exclamation-triangle-fill" />{error}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => { setError(''); setStep(s => s - 1) }}
            disabled={step === 0}
            style={{
              padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem',
              background: step === 0 ? '#f9fafb' : '#fff',
              border: '1.5px solid #e5e7eb',
              color: step === 0 ? '#d1d5db' : '#374151',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <i className="bi bi-arrow-left" /> Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={handleNext} style={{
              padding: '10px 28px', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem',
              background: 'linear-gradient(135deg,#4361ee,#3f37c9)', border: 'none',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 3px 12px rgba(67,97,238,0.35)',
            }}>
              Next <i className="bi bi-arrow-right" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{
              padding: '10px 32px', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem',
              background: submitting ? '#93c5fd' : 'linear-gradient(135deg,#16a34a,#15803d)',
              border: 'none', color: '#fff',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: submitting ? 'none' : '0 3px 12px rgba(22,163,74,0.35)',
            }}>
              {submitting
                ? <><span className="spinner-border spinner-border-sm" role="status" /> Calculating…</>
                : <><i className="bi bi-calculator" /> Get My ESG Score</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
