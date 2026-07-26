function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Unable to Fetch Repositories</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          🔄 Retry Request
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
