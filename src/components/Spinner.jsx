function Spinner({ text = 'Loading repositories...' }) {
  return (
    <div className="spinner-container" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <p className="spinner-text">{text}</p>
    </div>
  )
}

export default Spinner
