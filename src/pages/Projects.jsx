import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Valid API URL to fetch public repositories for GitHub user dhairya-shah13
  const API_URL = 'https://api.github.com/users/dhairya-shah13/repos'

  const fetchRepos = () => {
    setLoading(true)
    setError(null)

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Unable to fetch repositories from GitHub API.`)
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data)
        } else {
          throw new Error('Unexpected response format from API')
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch repositories')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRepos()
  }, [])

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="page">
      <h2>GitHub Projects</h2>
      <p>
        Here are my public GitHub repositories dynamically fetched from the GitHub REST API.
      </p>

      {/* Conditionally render Loading State */}
      {loading && <Spinner />}

      {/* Conditionally render Error State */}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {/* Conditionally render Success State */}
      {!loading && !error && (
        <>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search repositories by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredRepos.length === 0 ? (
            <p className="no-results">No repositories found matching "{searchQuery}".</p>
          ) : (
            <ul className="repo-list">
              {filteredRepos.map((repo) => (
                <li key={repo.id} className="repo-item">
                  <div className="repo-header">
                    <h3 className="repo-title">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <span className="stars-badge" title="Star count">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="repo-description">{repo.description}</p>
                  )}
                  <div className="repo-footer-meta">
                    {repo.language && <span>📁 {repo.language}</span>}
                    <span>📅 Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default Projects
