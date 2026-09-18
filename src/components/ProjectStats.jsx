import { useMemo } from 'react'

/**
 * ProjectStats — Supplementary heavy component lazy-loaded on demand
 * inside the Projects page to demonstrate component-level code splitting.
 */
function ProjectStats({ repos = [] }) {
  const stats = useMemo(() => {
    if (!repos.length) return null

    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
    const languages = {}
    repos.forEach((r) => {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1
      }
    })

    const topLanguage = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]

    return {
      totalRepos: repos.length,
      totalStars,
      topLanguage: topLanguage ? `${topLanguage[0]} (${topLanguage[1]})` : 'N/A',
      uniqueLanguages: Object.keys(languages).length,
    }
  }, [repos])

  if (!stats) return null

  return (
    <div className="project-stats-card">
      <h3>📊 Repository Insights (Lazy-Loaded Component)</h3>
      <div className="project-stats-grid">
        <div className="stat-box">
          <span className="stat-number">{stats.totalRepos}</span>
          <span className="stat-label">Total Repos</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">⭐ {stats.totalStars}</span>
          <span className="stat-label">Total Stars</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.uniqueLanguages}</span>
          <span className="stat-label">Languages</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.topLanguage}</span>
          <span className="stat-label">Top Language</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectStats
