import { useState, useEffect, useCallback } from 'react'
import { api } from './api'
import Dashboard from './components/Dashboard'
import AvaliacoesPage from './components/AvaliacoesPage'
import CafeteriasPage from './components/CafeteriasPage'
import BebidasPage from './components/BebidasPage'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '✦' },
  { id: 'avaliacoes', label: 'Avaliações', icon: '☕' },
  { id: 'cafeterias', label: 'Cafeterias', icon: '🏡' },
  { id: 'bebidas', label: 'Bebidas', icon: '🌸' },
]

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [cafeterias, setCafeterias] = useState([])
  const [bebidas, setBebidas] = useState([])
  const [avaliacoes, setAvaliacoes] = useState([])

  const loadAll = useCallback(async () => {
    try {
      const [s, c, b, a] = await Promise.all([
        api.getStats(),
        api.getCafeterias(),
        api.getBebidas(),
        api.getAvaliacoes(),
      ])
      setStats(s)
      setCafeterias(c)
      setBebidas(b)
      setAvaliacoes(a)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  const pages = { dashboard: Dashboard, avaliacoes: AvaliacoesPage, cafeterias: CafeteriasPage, bebidas: BebidasPage }
  const PageComponent = pages[page]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--chocolate)',
        color: 'white',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(68,48,37,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>☕</span>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '0.01em', color: 'var(--misty-rose-true)' }}>
            Diário de Cafés
          </h1>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 4 }} className="desktop-nav">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              background: page === n.id ? 'var(--sakura)' : 'transparent',
              color: page === n.id ? 'var(--chocolate)' : 'rgba(255,255,255,0.8)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(v => !v)} style={{
          background: 'none', border: 'none', color: 'white', fontSize: 22,
          display: 'none',
        }} className="mobile-menu-btn">☰</button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(68,48,37,0.5)',
        }} onClick={() => setMenuOpen(false)}>
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 240, height: '100%',
            background: 'var(--chocolate)',
            padding: '80px 20px 24px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }} onClick={e => e.stopPropagation()}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false) }} style={{
                background: page === n.id ? 'var(--sakura)' : 'rgba(255,255,255,0.1)',
                color: page === n.id ? 'var(--chocolate)' : 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 15,
                textAlign: 'left',
                display: 'flex', gap: 10,
              }}>
                <span>{n.icon}</span> {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>

      {/* Page */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <PageComponent
          stats={stats}
          cafeterias={cafeterias}
          bebidas={bebidas}
          avaliacoes={avaliacoes}
          onRefresh={loadAll}
        />
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '16px',
        color: 'var(--text-light)',
        fontSize: 13,
        borderTop: '1px solid rgba(170,127,102,0.2)',
      }}>
        ☕ Diário de Cafés — Nicole Rodrigues · Projeto Integrador 2025
      </footer>
    </div>
  )
}
