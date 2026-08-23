import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const location = useLocation()
  const currentPath = location.pathname
  const { isAuthenticated, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    ...(isAuthenticated ? [{ path: '/tasks', label: 'Tasks' }] : []),
    { path: '/contact', label: 'Contact' },
    ...(!isAuthenticated
      ? [
          { path: '/login', label: 'Login' },
          { path: '/register', label: 'Register' },
        ]
      : []),
  ]

  return (
    <nav className="navbar">
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {isAuthenticated && (
          <li>
            <button type="button" className="nav-link nav-logout" onClick={logout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default NavBar
