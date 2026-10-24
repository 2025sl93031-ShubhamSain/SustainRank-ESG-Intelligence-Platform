import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getHistory } from '../api/history'

function scoreColor(val) {
  if (val == null || isNaN(+val)) return '#9ca3af'
  if (+val >= 70) return '#16a34a'
  if (+val >= 40) return '#f59e0b'
  return '#dc2626'
}

function scoreBg(val) {
  if (val == null || isNaN(+val)) return '#f3f4f6'
  if (+val >= 70) return '#dcfce7'
  if (+val >= 40) return '#fef9c3'
  return '#fee2e2'
}

function MetricBadge({ value, suffix = '' }) {
  if (value == null) return <span className="hp-metric-badge--null">—</span>
  const n = +value
  return (
    <span
      className="hp-metric-badge"
      style={{ background: scoreBg(n), color: scoreColor(n) }}
    >
      {isNaN(n) ? value : n % 1 === 0 ? n : n.toFixed(1)}{suffix}
    </span>
  )
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col)
    return <i className="bi bi-arrow-down-up ms-1 hp-sort-icon"></i>
  return <i className={`bi bi-arrow-${sortDir === 'asc' ? 'up' : 'down'} ms-1 hp-sort-icon--active`}></i>
}

export default function HistoryPage() {
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [metricFilters, setMetricFilters] = useState([])   // [{ col, label, min, max }]
  const [pendingCol, setPendingCol] = useState('')
  const [pendingMin, setPendingMin] = useState('')
  const [pendingMax, setPendingMax] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const METRIC_OPTS = [
    { col: 'carbon_emissions',    label: 'Carbon (tCO₂)' },
    { col: 'energy_consumption',  label: 'Energy (kWh)' },
    { col: 'waste_production',    label: 'Waste (kg)' },
    { col: 'eevta_score',         label: 'Social Score' },
    { col: 'cost_benefit',        label: 'Cost-Benefit (%)' },
    { col: 'sustainability_score',label: 'Sustainability' },
    { col: 'roi',                 label: 'ROI (%)' },
  ]

  function addMetricFilter() {
    if (!pendingCol) return
    const opt = METRIC_OPTS.find(o => o.col === pendingCol)
    setMetricFilters(prev => [
      ...prev.filter(f => f.col !== pendingCol),
      { col: pendingCol, label: opt.label, min: pendingMin, max: pendingMax },
    ])
    setPendingCol(''); setPendingMin(''); setPendingMax('')
  }

  function removeMetricFilter(col) {
    setMetricFilters(prev => prev.filter(f => f.col !== col))
  }

  const navigate = useNavigate()

  useEffect(() => {
    getHistory()
      .then((d) => setHistories(d.histories || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('asc') }
  }

  function clearFilters() {
    setDateFrom(''); setDateTo('')
    setMetricFilters([])
  }

  const activeFilterCount =
    (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) +
    metricFilters.length

  const filtered = histories.filter((h) => {
    if (dateFrom && new Date(h.created_at) < new Date(dateFrom)) return false
    if (dateTo) {
      const to = new Date(dateTo); to.setHours(23, 59, 59, 999)
      if (new Date(h.created_at) > to) return false
    }
    for (const { col, min, max } of metricFilters) {
      const v = +h[col]
      if (min !== '' && v < +min) return false
      if (max !== '' && v > +max) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortCol], vb = b[sortCol]
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : +va - +vb
    return sortDir === 'asc' ? cmp : -cmp
  })

  function exportCSV() {
    const headers = ['Date', 'Carbon (tCO₂)', 'Energy (kWh)', 'Waste (kg)', 'Social Score', 'Cost-Benefit', 'Sustainability', 'ROI (%)']
    const rows = sorted.map((h) => [
      new Date(h.created_at).toLocaleDateString(),
      h.carbon_emissions, h.energy_consumption, h.waste_production,
      h.eevta_score, h.cost_benefit, h.sustainability_score, h.roi,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sustainability_history.csv'
    a.click()
  }

  const latestSus = sorted[0]?.sustainability_score
  const avgSus = sorted.length
    ? (sorted.reduce((s, h) => s + (+h.sustainability_score || 0), 0) / sorted.length).toFixed(1)
    : null
  const avgRoi = sorted.length
    ? (sorted.reduce((s, h) => s + (+h.roi || 0), 0) / sorted.length).toFixed(1)
    : null

  const COLS = [
    { key: 'created_at',           label: 'Date' },
    { key: 'carbon_emissions',     label: 'Carbon (tCO₂)' },
    { key: 'energy_consumption',   label: 'Energy (kWh)' },
    { key: 'waste_production',     label: 'Waste (kg)' },
    { key: 'eevta_score',          label: 'Social Score' },
    { key: 'cost_benefit',         label: 'Cost-Benefit' },
    { key: 'sustainability_score', label: 'Sustainability' },
    { key: 'roi',                  label: 'ROI (%)' },
  ]

  return (
    <div className="hp-page">
      <Header />

      <div className="hp-inner">

        {/* ── Hero bar ── */}
        <div className="hp-hero">
          <div className="hp-hero__left">
            <div className="hp-hero__icon">
              <i className="bi bi-clock-history"></i>
            </div>
            <div>
              <h1 className="hp-hero__title">Calculation History</h1>
              <p className="hp-hero__subtitle">Track your sustainability progress over time</p>
            </div>
          </div>
          <div className="hp-hero__actions">
            {sorted.length > 0 && (
              <button onClick={exportCSV} className="hp-hero__btn--ghost">
                <i className="bi bi-download"></i> Export CSV
              </button>
            )}
            <button onClick={() => navigate('/dashboard')} className="hp-hero__btn--solid">
              <i className="bi bi-speedometer2"></i> Dashboard
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="hp-body">

          {/* ── Filter bar ── */}
          {!loading && histories.length > 0 && (
            <div className="hp-filters">
              <div
                className={`hp-filters__header${filtersOpen ? ' hp-filters__header--open' : ''}`}
                onClick={() => setFiltersOpen(v => !v)}
              >
                <div className="hp-filters__header-left">
                  <i className="bi bi-funnel-fill hp-filters__icon"></i>
                  <span className="hp-filters__label">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="hp-filters__badge">{activeFilterCount}</span>
                  )}
                </div>
                <div className="hp-filters__header-right">
                  {activeFilterCount > 0 && (
                    <button
                      className="hp-filters__clear-btn"
                      onClick={e => { e.stopPropagation(); clearFilters() }}
                    >
                      <i className="bi bi-x-circle"></i> Clear all
                    </button>
                  )}
                  <i className={`bi bi-chevron-${filtersOpen ? 'up' : 'down'} hp-filters__chevron`}></i>
                </div>
              </div>

              {filtersOpen && (
                <div className="hp-filters__body">

                  {/* Row 1 — date + score tier */}
                  <div className="hp-filters__field hp-filters__field--date">
                    <label className="hp-filters__field-label">Date From</label>
                    <input type="date" className="hp-filters__input"
                      value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                  </div>

                  <div className="hp-filters__field hp-filters__field--date">
                    <label className="hp-filters__field-label">Date To</label>
                    <input type="date" className="hp-filters__input"
                      value={dateTo} onChange={e => setDateTo(e.target.value)} />
                  </div>

                  {/* Row 2 — add metric filter */}
                  <div className="hp-filters__add-row">
                    <div className="hp-filters__add-label">
                      <i className="bi bi-plus-circle"></i> Add metric filter
                    </div>
                    <div className="hp-filters__add-controls">
                      <select
                        className="hp-filters__select"
                        value={pendingCol}
                        onChange={e => setPendingCol(e.target.value)}
                      >
                        <option value="">Select metric…</option>
                        {METRIC_OPTS.filter(o => !metricFilters.find(f => f.col === o.col)).map(o => (
                          <option key={o.col} value={o.col}>{o.label}</option>
                        ))}
                      </select>
                      <input type="number" placeholder="Min" className="hp-filters__input hp-filters__input--sm"
                        value={pendingMin} onChange={e => setPendingMin(e.target.value)}
                        disabled={!pendingCol} />
                      <span className="hp-filters__range-sep">–</span>
                      <input type="number" placeholder="Max" className="hp-filters__input hp-filters__input--sm"
                        value={pendingMax} onChange={e => setPendingMax(e.target.value)}
                        disabled={!pendingCol} />
                      <button
                        className="hp-filters__add-btn"
                        onClick={addMetricFilter}
                        disabled={!pendingCol || (pendingMin === '' && pendingMax === '')}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Active metric chips */}
                  {metricFilters.length > 0 && (
                    <div className="hp-filters__chips">
                      {metricFilters.map(f => (
                        <span key={f.col} className="hp-filters__chip">
                          <strong>{f.label}</strong>
                          {f.min !== '' && f.max !== '' && `: ${f.min} – ${f.max}`}
                          {f.min !== '' && f.max === '' && `: ≥ ${f.min}`}
                          {f.min === '' && f.max !== '' && `: ≤ ${f.max}`}
                          <button className="hp-filters__chip-remove" onClick={() => removeMetricFilter(f.col)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="hp-center">
              <div className="hp-spinner-wrap">
                <div className="spinner-border text-primary" role="status"></div>
                <p>Loading history…</p>
              </div>
            </div>

          ) : histories.length === 0 ? (
            <div className="hp-center">
              <div className="hp-empty">
                <div className="hp-empty__icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h3 className="hp-empty__title">No History Yet</h3>
                <p className="hp-empty__text">
                  Your sustainability calculations will appear here after you use our assessment tools. Start with a carbon or energy calculation.
                </p>
                <div className="hp-empty__links">
                  {[
                    { to: '/carbon',        icon: 'bi-fire',           label: 'Carbon' },
                    { to: '/energy',        icon: 'bi-lightning-fill',  label: 'Energy' },
                    { to: '/waste',         icon: 'bi-trash3-fill',     label: 'Waste' },
                    { to: '/sustainability', icon: 'bi-tree-fill',      label: 'Sustainability' },
                  ].map((item) => (
                    <Link key={item.to} to={item.to} className="hp-empty__link">
                      <i className={`bi ${item.icon}`}></i> {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          ) : sorted.length === 0 ? (
            <div className="hp-center">
              <div className="hp-no-results">
                <div className="hp-no-results__icon">
                  <i className="bi bi-funnel"></i>
                </div>
                <h3 className="hp-no-results__title">No Records Match</h3>
                <p className="hp-no-results__text">
                  No history entries match your current filters. Try adjusting the date range, score tier, or search term.
                </p>
                <button className="hp-no-results__btn" onClick={clearFilters}>
                  <i className="bi bi-x-circle"></i> Clear Filters
                </button>
              </div>
            </div>

          ) : (
            <>
              {/* ── Stat cards ── */}
              <div className="hp-stats">
                {[
                  { label: 'Total Records',     value: sorted.length,                                suffix: '',  icon: 'bi-list-ol',       color: '#4361ee',          bg: '#e0e7ff' },
                  { label: 'Latest Score',       value: latestSus != null ? (+latestSus).toFixed(0) : '—', suffix: '', icon: 'bi-star-fill', color: scoreColor(latestSus), bg: scoreBg(latestSus) },
                  { label: 'Avg Sustainability', value: avgSus ?? '—',                               suffix: '',  icon: 'bi-tree-fill',      color: scoreColor(avgSus),  bg: scoreBg(avgSus) },
                  { label: 'Avg ROI',            value: avgRoi ?? '—',                               suffix: '%', icon: 'bi-graph-up-arrow', color: scoreColor(avgRoi),  bg: scoreBg(avgRoi) },
                ].map((card) => (
                  <div key={card.label} className="hp-stat-card">
                    <div className="hp-stat-card__icon" style={{ background: card.bg }}>
                      <i className={`bi ${card.icon}`} style={{ color: card.color }}></i>
                    </div>
                    <div>
                      <div className="hp-stat-card__value">{card.value}{card.suffix}</div>
                      <div className="hp-stat-card__label">{card.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Table ── */}
              <div className="hp-table-card">
                <div className="hp-table-card__header">
                  <div className="hp-table-card__title">
                    {activeFilterCount > 0 ? 'Filtered Records' : 'All Records'}
                  </div>
                  <div className="hp-table-card__count">
                    {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'}
                  </div>
                </div>

                <div className="hp-table-scroll">
                  <table className="hp-table">
                    <thead>
                      <tr>
                        {COLS.map((col) => (
                          <th key={col.key} onClick={() => handleSort(col.key)}>
                            {col.label}
                            <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((h, idx) => {
                        const d = new Date(h.created_at)
                        return (
                          <tr key={idx} className="hp-table__row">
                            <td>
                              <div className="hp-table__date">
                                {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="hp-table__time">
                                {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td><span className="hp-table__val">{(+h.carbon_emissions).toFixed(2)}</span></td>
                            <td><span className="hp-table__val">{(+h.energy_consumption).toFixed(2)}</span></td>
                            <td><span className="hp-table__val">{(+h.waste_production).toFixed(2)}</span></td>
                            <td><span className="hp-table__val">{(+h.eevta_score).toFixed(0)}</span></td>
                            <td><MetricBadge value={h.cost_benefit} suffix="%" /></td>
                            <td><MetricBadge value={h.sustainability_score} /></td>
                            <td><MetricBadge value={h.roi} suffix="%" /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="hp-table-card__footer">
                  <span className="hp-table-card__footer-left">
                    Showing {sorted.length} of {histories.length} {histories.length === 1 ? 'record' : 'records'}
                    {activeFilterCount > 0 && <span className="hp-table-card__footer-filtered"> (filtered)</span>}
                  </span>
                  <div className="hp-table-card__legend">
                    <span className="hp-legend-dot hp-legend-dot--good"></span> ≥ 70 Good
                    <span className="hp-legend-dot hp-legend-dot--average"></span> ≥ 40 Average
                    <span className="hp-legend-dot hp-legend-dot--poor"></span> &lt; 40 Poor
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
