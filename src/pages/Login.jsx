import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const showToast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    login(form.email.trim(), form.password)
      .then(() => {
        showToast('Login successful')
        navigate('/tasks')
      })
      .catch((err) => {
        showToast(err.message || 'Login failed', 'error')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <section className="page">
      <h2>Login</h2>
      <p>Sign in with your account to manage tasks. A JWT is stored in localStorage after a successful login.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          className="task-input"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <label className="auth-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          className="task-input"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="current-password"
        />

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}

export default Login
