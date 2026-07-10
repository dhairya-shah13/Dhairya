import { useState } from 'react'
import Skills from './components/Skills';

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const skills = ['HTML','CSSS','JS','Gotelal']

  return (
    <div>
    <h1>My Portfolio</h1>
    <Skills skillList={skills} />
  </div>
  )
}

export default App
