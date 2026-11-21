import { useState, useRef } from 'react'
import { analyseReport } from '../api/auth'
import Header from '../components/Header'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import './ReportAnalysisPage.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)


const INDICATOR_LABELS = {
  carbon_emissions_tco2e:        'Carbon Emissions (tCO₂e)',
  carbon_score:                  'Carbon Score',
  energy_consumption_kwh:        'Energy Consumption (kWh)',
  renewable_pct:                 'Renewable Energy (%)',
  waste_tonnes:                  'Waste Generated (tonnes)',
  recycling_rate_pct:            'Recycling Rate (%)',
  num_employees:                 'Employees',
  revenue:                       'Revenue',
  water_consumption_kl:          'Water Consumption (kL)',
  scope1_emissions:              'Scope 1 Emissions',
  scope2_emissions:              'Scope 2 Emissions',
  scope3_emissions:              'Scope 3 Emissions',
  training_hours_per_employee:   'Training Hours / Employee',
  gender_ratio_pct:              'Gender Ratio (%)',
  board_independence_pct:        'Board Independence (%)',
  energy_intensity:              'Energy Intensity',
}

const STATUS_CONFIG = {
  match:          { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Match' },
  mismatch:       { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Mismatch' },
  missing:        { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: 'Not in report' },
  extracted_only: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Report only' },
}

const CHART_EXCLUDE = new Set(['revenue', 'num_employees'])

function benchmarkColor(status) {
  if (status === 'above') return '#16a34a'
  if (status === 'below') return '#dc2626'
  return '#d97706'
}

export default function ReportAnalysisPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  function handleFile(f) {
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Only PDF files are supported.'); return }
    if (f.size > 20 * 1024 * 1024) { setError('File must be under 20 MB.'); return }
    setError(''); setFile(f); setResult(null)
  }

  function handleDrop(e) {
    e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0])
  }

  function downloadReport(r) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 16

    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, pageW, 28, 'F')
    doc.setFontSize(16); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
    doc.text('SustainRank', margin, 12)
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
    doc.text('ESG Intelligence Platform', margin, 18)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageW - margin, 12, { align: 'right' })
    doc.text(`Report Type: ${r.reportType}`, pageW - margin, 18, { align: 'right' })

    let y = 36
    doc.setFontSize(18); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
    doc.text('ESG Report Analysis', margin, y); y += 7
    doc.setDrawColor(67,97,238); doc.setLineWidth(0.8)
    doc.line(margin, y, pageW - margin, y); y += 8

    const metricCount = Object.keys(r.extractedMetrics).length
    const badges = [
      { label: 'Metrics Extracted', value: metricCount,                bg: [239,246,255], fg: [37,99,235] },
      { label: 'Completeness',      value: `${r.completenessScore}%`,  bg: [240,253,244], fg: [22,163,74] },
      { label: 'Missing Indicators',value: r.missingIndicators?.length ?? 0, bg: [255,251,235], fg: [217,119,6] },
    ]
    const badgeW = (pageW - margin * 2 - 8) / 3
    badges.forEach((b, i) => {
      const bx = margin + i * (badgeW + 4)
      doc.setFillColor(...b.bg)
      doc.roundedRect(bx, y, badgeW, 14, 2, 2, 'F')
      doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.setTextColor(...b.fg)
      doc.text(String(b.value), bx + badgeW / 2, y + 7, { align: 'center' })
      doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(100,116,139)
      doc.text(b.label, bx + badgeW / 2, y + 12, { align: 'center' })
    })
    y += 22

    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
    doc.text('Extracted Metrics & Benchmarks', margin, y); y += 5

    autoTable(doc, {
      startY: y, margin: { left: margin, right: margin },
      head: [['Metric', 'Value', 'Industry Avg', 'Status', 'Percentile']],
      body: Object.entries(r.extractedMetrics).map(([k, v]) => {
        const bm = r.benchmarks?.[k]
        return [
          INDICATOR_LABELS[k] || k,
          Number(v).toLocaleString(),
          bm ? Number(bm.industryAvg).toLocaleString() : '—',
          bm ? (bm.status === 'above' ? '▲ Above' : bm.status === 'below' ? '▼ Below' : '● On par') : '—',
          bm?.percentile ?? '—',
        ]
      }),
      headStyles: { fillColor: [15,23,42], textColor: [255,255,255], fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [55,65,81] },
      alternateRowStyles: { fillColor: [248,250,252] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 52 }, 1: { halign: 'right' }, 2: { halign: 'right' } },
      theme: 'grid',
    })
    y = doc.lastAutoTable.finalY + 10

    if (r.aiInsights && r.aiInsights.length > 0) {
      if (y + 10 > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20 }
      doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(15,23,42)
      doc.text('AI Insights', margin, y); y += 6
      r.aiInsights.forEach((ins, idx) => {
        const text = ins.replace(/^[-•]\s*/, '')
        const lines = doc.splitTextToSize(`${idx + 1}. ${text}`, pageW - margin * 2 - 8)
        const blockH = lines.length * 5 + 8
        if (y + blockH > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20 }
        doc.setFillColor(250,245,255); doc.setDrawColor(233,213,255); doc.setLineWidth(0.3)
        doc.roundedRect(margin, y, pageW - margin * 2, blockH, 2, 2, 'FD')
        doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(55,65,81)
        doc.text(lines, margin + 4, y + 5); y += blockH + 4
      })
    }

    const pageCount = doc.internal.getNumberOfPages()
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p)
      const ph = doc.internal.pageSize.getHeight()
      doc.setFillColor(248,250,252); doc.rect(0, ph - 10, pageW, 10, 'F')
      doc.setFontSize(7); doc.setTextColor(148,163,184)
      doc.text('SustainRank — Confidential ESG Report', margin, ph - 4)
      doc.text(`Page ${p} of ${pageCount}`, pageW - margin, ph - 4, { align: 'right' })
    }

    doc.save(`esg-report-analysis-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  async function handleAnalyse() {
    if (!file) return
    setLoading(true); setError('')
    const data = await analyseReport(file)
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setResult(data)
  }

  // Build chart data — exclude revenue/employees (scale incompatible)
  function buildChartData(r) {
    const keys = Object.keys(r.benchmarks || {}).filter(k => !CHART_EXCLUDE.has(k))
    return {
      labels: keys.map(k => INDICATOR_LABELS[k] || k),
      datasets: [
        {
          label: 'Your Value',
          data: keys.map(k => Number(r.extractedMetrics[k])),
          backgroundColor: keys.map(k => {
            const s = r.benchmarks[k]?.status
            return s === 'above' ? 'rgba(22,163,74,0.75)' : s === 'below' ? 'rgba(220,38,38,0.75)' : 'rgba(217,119,6,0.75)'
          }),
          borderRadius: 4,
        },
        {
          label: 'Industry Average',
          data: keys.map(k => r.benchmarks[k]?.industryAvg ?? 0),
          backgroundColor: 'rgba(100,116,139,0.3)',
          borderColor: 'rgba(100,116,139,0.7)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }
  }

  return (
    <div className="rap-page">
      <Header />
      <div className="rap-body">
        <div className="rap-container">

          {/* Page header */}
          <div className="rap-page-header">
            <div className="rap-page-header-row">
              <div className="rap-title-row">
                <div className="rap-icon">
                  <i className="bi bi-file-earmark-bar-graph"></i>
                </div>
                <h1 className="rap-title">ESG Report Analysis</h1>
              </div>
            </div>
            <p className="rap-subtitle">
              Upload your annual report, sustainability report, or BRSR to automatically extract ESG metrics, benchmark against industry averages, and get AI-powered insights.
            </p>
          </div>

          {/* Upload card */}
          <div className="rap-card">
            <div
              className={`rap-dropzone${dragging ? ' dragging' : file ? ' has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              <i className={`bi ${file ? 'bi-file-earmark-check-fill has-file' : 'bi-cloud-upload'} rap-dropzone-icon`}></i>
              {file ? (
                <>
                  <div className="rap-file-name">{file.name}</div>
                  <div className="rap-file-meta">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</div>
                </>
              ) : (
                <>
                  <div className="rap-dropzone-title">Drop your PDF here or click to browse</div>
                  <div className="rap-dropzone-hint">Supports: Annual Report, Sustainability Report, BRSR · Max 20 MB</div>
                </>
              )}
            </div>

            {error && (
              <div className="rap-error">
                <i className="bi bi-exclamation-circle-fill"></i>{error}
              </div>
            )}

            {file && (
              <div className="rap-actions">
                <button className="rap-analyse-btn" onClick={handleAnalyse} disabled={loading}>
                  {loading
                    ? <><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}></i>Analysing…</>
                    : <><i className="bi bi-search me-2"></i>Analyse Report</>}
                </button>
                <button className="rap-clear-btn" onClick={() => { setFile(null); setResult(null); setError('') }}>
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="rap-results">

              <div className="rap-badges-row">
                <span className="rap-report-type-badge">{result.reportType}</span>
                <span className="rap-metrics-count">{Object.keys(result.extractedMetrics).length} metrics extracted</span>
                <button className="rap-download-btn" onClick={() => downloadReport(result)}>
                  <i className="bi bi-download me-2"></i>Download Report
                </button>
              </div>

              {/* Report completeness */}
              {result.completenessScore != null && (
                <div className="rap-card">
                  <h3 className="rap-card-title"><i className="bi bi-clipboard-check"></i>Report Completeness</h3>
                  <div className="rap-completeness-header">
                    <span className="rap-completeness-fraction">
                      {result.foundIndicators?.length ?? 0} / 15 standard ESG indicators found
                    </span>
                    <span className="rap-completeness-pct">{result.completenessScore}%</span>
                  </div>
                  <div className="rap-completeness-track">
                    <div
                      className="rap-completeness-fill"
                      style={{
                        width: `${result.completenessScore}%`,
                        background: result.completenessScore >= 70 ? '#16a34a'
                          : result.completenessScore >= 40 ? '#d97706'
                          : '#dc2626',
                      }}
                    />
                  </div>
                  {result.missingIndicators?.length > 0 && (
                    <div className="rap-completeness-missing">
                      <span className="rap-completeness-missing-label">Missing indicators:</span>
                      <div className="rap-completeness-chips">
                        {result.missingIndicators.map(ind => (
                          <span key={ind} className="rap-completeness-chip">
                            {INDICATOR_LABELS[ind] || ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Extracted metrics grid with benchmark coloring */}
              {Object.keys(result.extractedMetrics).length > 0 && (
                <div className="rap-card">
                  <h3 className="rap-card-title"><i className="bi bi-bar-chart-line"></i>Extracted Metrics</h3>
                  <div className="rap-metrics-grid">
                    {Object.entries(result.extractedMetrics).map(([k, v]) => {
                      const bm = result.benchmarks?.[k]
                      const borderColor = bm ? benchmarkColor(bm.status) : '#e2e8f0'
                      return (
                        <div
                          key={k}
                          className="rap-metric-card"
                          style={{ borderLeft: `3px solid ${borderColor}` }}
                        >
                          <div className="rap-metric-label">{INDICATOR_LABELS[k] || k}</div>
                          <div className="rap-metric-value">{Number(v).toLocaleString()}</div>
                          {bm && (
                            <div className="rap-benchmark-line">
                              <span className="rap-benchmark-status" style={{ color: benchmarkColor(bm.status) }}>
                                {bm.status === 'above' ? '▲ Above' : bm.status === 'below' ? '▼ Below' : '● On par'}
                              </span>
                              <span className="rap-benchmark-avg">avg {Number(bm.industryAvg).toLocaleString()}</span>
                              <span className="rap-benchmark-percentile">{bm.percentile}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Benchmark bar chart */}
              {result.benchmarks && Object.keys(result.benchmarks).filter(k => !CHART_EXCLUDE.has(k)).length > 0 && (
                <div className="rap-card">
                  <h3 className="rap-card-title"><i className="bi bi-bar-chart-fill"></i>Metrics vs Industry Average</h3>
                  <p className="rap-chart-note">Revenue and employee count excluded from chart (different scale). Green = above average, Red = below average.</p>
                  <div className="rap-chart-wrap">
                    <Bar
                      data={buildChartData(result)}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: {
                            callbacks: {
                              afterLabel: (ctx) => {
                                const keys = Object.keys(result.benchmarks).filter(k => !CHART_EXCLUDE.has(k))
                                const bm = result.benchmarks[keys[ctx.dataIndex]]
                                return bm ? `${bm.percentile} · ${bm.industry}` : ''
                              },
                            },
                          },
                        },
                        scales: { x: { beginAtZero: true } },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {result.aiInsights && result.aiInsights.length > 0 && (
                <div className="rap-card">
                  <h3 className="rap-card-title purple"><i className="bi bi-stars"></i>AI Insights</h3>
                  <ul className="rap-insights-list">
                    {result.aiInsights.map((ins, i) => (
                      <li key={i} className="rap-insight-item">
                        <i className="bi bi-lightbulb-fill"></i>
                        <span>{ins.replace(/^[-•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  )
}
