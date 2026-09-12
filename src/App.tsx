import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { GithubTracker } from './components/GithubTracker'
import { LeetCodeTracker } from './components/LeetCodeTracker'
import { Badges } from './components/Badges'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Reveal } from './components/Reveal'

function App() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero is never wrapped in a reveal animation — it must be visible
            the instant the page paints, no exceptions. */}
        <Hero />
        <Reveal>
          <Skills />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <GithubTracker />
        </Reveal>
        <Reveal>
          <LeetCodeTracker />
        </Reveal>
        <Reveal>
          <Badges />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
    </>
  )
}

export default App
