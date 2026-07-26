function Spinner() {
  return (
    <div className="spinner-container" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <p className="spinner-text">Loading repositories...</p>
    </div>
  )
}

export default Spinner
