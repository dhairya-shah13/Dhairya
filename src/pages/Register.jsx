import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerUser } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function Register() {
  const { isAuthenticated } = useAuth()
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
    registerUser({ email: form.email.trim(), password: form.password })
      .then(() => {
        showToast('Registration successful. Please log in.')
        navigate('/login')
      })
      .catch((err) => {
        showToast(err.message || 'Registration failed', 'error')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <section className="page">
      <h2>Register</h2>
      <p>Create an account. The password is hashed with bcrypt on the server before it is stored.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          name="email"
          className="task-input"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <label className="auth-label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          name="password"
          className="task-input"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default Register
