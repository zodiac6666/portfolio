// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'

// Layout
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'

// Sections (public site)
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Projects } from './components/sections/Projects'
import { Contact } from './components/sections/Contact'

// Admin pages
import { Login } from './pages/admin/Login'
import { Messages } from './pages/admin/Messages'
import { AdminLayout } from './pages/admin/AdminLayout'

/** Public portfolio — all sections on one page */
function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<HomePage />} />

      {/* Admin area */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      {/* Fallback — send everything else home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
