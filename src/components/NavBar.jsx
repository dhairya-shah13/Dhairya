import { useState } from 'react'

function NavBar() {
  const [active, setActive] = useState('Home')

  const sections = ['Home', 'About', 'Skills', 'Contact']

  return (
    <nav>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        padding: 0,
        margin: 0
      }}>
        {sections.map((section) => (
          <li
            key={section}
            style={{
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '25px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              background: active === section ? 'white' : 'rgba(255,255,255,0.1)',
              color: active === section ? '#667eea' : 'white'
            }}
            onClick={() => setActive(section)}
          >
            {section}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar