import Hero from './components/Hero.jsx'
import ConceptToggle from './components/ConceptToggle.jsx'
import ChatSection from './components/ChatSection.jsx'
import './styles/app.css'

export default function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Hero />
        <ConceptToggle />
        <ChatSection />
      </main>
    </div>
  )
}
