import { useState, useEffect } from 'react'

/**
 * DelayedFallback — prevents loading spinner flicker on fast connections
 * by delaying the fallback presentation by a configurable threshold (default 300ms).
 */
function DelayedFallback({ delay = 300, children }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!show) return null

  return children || (
    <div className="page-loading-fallback">
      <div className="loading-spinner"></div>
      <p>Loading page…</p>
    </div>
  )
}

export default DelayedFallback
