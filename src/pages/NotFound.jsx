import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page">
      <h2>404 - Page Not Found</h2>
      <p>
        Sorry, the page you are looking for does not exist. It may have been
        moved or the URL may be incorrect.
      </p>
      <p>
        <Link to="/">Go back to Home</Link>
      </p>
    </section>
  )
}

export default NotFound
