function ErrorMessage({ message, onRetry, title = 'Unable to Fetch Repositories' }) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
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
