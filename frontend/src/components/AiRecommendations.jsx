import { useEffect, useState } from 'react'

export default function AiRecommendations({ fetchFn, deps = [] }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchFn()
      .then((recs) => { if (!cancelled) setRecommendations(recs) })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return (
    <div className="ai-card">
      <div className="ai-card__header">
        <div className="ai-card__icon">
          <i className="bi bi-stars"></i>
        </div>
        <span className="ai-card__title">AI Recommendations</span>
      </div>

      {loading && (
        <div className="ai-card__loading">
          <div className="spinner-border spinner-border-sm text-secondary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          Generating recommendations…
        </div>
      )}

      {!loading && error && (
        <p className="ai-card__empty">
          <i className="bi bi-exclamation-circle me-2"></i>Recommendations unavailable.
        </p>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <p className="ai-card__empty">No recommendations generated.</p>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <ul className="ai-card__list">
          {recommendations.map((rec, i) => (
            <li key={i} className="ai-card__item">
              <i className="bi bi-arrow-right-circle-fill ai-card__item-icon"></i>
              <span className="ai-card__item-text">{rec}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
