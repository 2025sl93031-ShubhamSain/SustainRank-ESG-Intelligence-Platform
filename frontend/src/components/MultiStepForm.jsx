import { useState } from 'react'

export default function MultiStepForm({ steps, onSubmit, initialValues = {}, loading = false }) {
  const [current, setCurrent] = useState(0)
  const [values, setValues] = useState(initialValues)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
  }

  function next() { setCurrent((c) => Math.min(c + 1, steps.length - 1)) }
  function prev() { setCurrent((c) => Math.max(c - 1, 0)) }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(values)
  }

  const step = steps[current]

  return (
    <div>
      {/* Stepper */}
      <ul className="form-stepper">
        {steps.map((s, i) => (
          <li
            key={i}
            className={`form-stepper-list ${i === current ? 'form-stepper-active' : i < current ? 'form-stepper-completed' : ''}`}
          >
            <div className="form-stepper-circle">
              {i < current ? <i className="bi bi-check-lg"></i> : i + 1}
            </div>
            <div className="label text-muted">{s.title}</div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="mb-4">{step.title}</h5>
            {step.fields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label fw-medium">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className="form-select"
                    name={field.name}
                    value={values[field.name] ?? ''}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Select...</option>
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="d-flex gap-4">
                    {field.options.map((o) => (
                      <div className="form-check" key={o.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={field.name}
                          id={`${field.name}-${o.value}`}
                          value={o.value}
                          checked={values[field.name] === o.value}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor={`${field.name}-${o.value}`}>
                          {o.label}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    className="form-control"
                    type={field.type || 'text'}
                    name={field.name}
                    placeholder={field.placeholder || ''}
                    value={values[field.name] ?? ''}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    required={field.required}
                  />
                )}
                {field.hint && <div className="form-text text-muted">{field.hint}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          {current > 0 ? (
            <button type="button" className="btn btn-outline-secondary" onClick={prev}>
              <i className="bi bi-arrow-left me-1"></i>Previous
            </button>
          ) : <span />}
          {current < steps.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={next}>
              Next<i className="bi bi-arrow-right ms-1"></i>
            </button>
          ) : (
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Calculating...</>
              ) : (
                <><i className="bi bi-calculator me-1"></i>Calculate</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
