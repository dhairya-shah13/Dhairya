import Header from './components/Header'
import About from './components/About'
import Skills from './components/Skills'
import Footer from './components/Footer'
import './App.css'

function App() {
  const studentName = "DHAIRYA :D"
  const skillList = [
    "JavaScript", 
    "React", 
    "HTML/CSS", 
    "Node.js", 
    "Git & GitHub",
    "Python",
    "Database Management"
  ]

  return (
    <div className="app">
      <Header name={studentName} />
      <About />
      <Skills skillList={skillList} />
      <Footer />
    </div>
  )
}

export default App