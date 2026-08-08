import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../common/Logo'
import NotificationPanel from '../common/NotificationPanel'
import ProfileDropdown from '../common/ProfileDropdown'
import { useAuth } from '../../context/AuthContext'

const patientLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const doctorLinks = [
  { to: '/about?role=doctor', label: 'About Us' },
  { to: '/contact?role=doctor', label: 'Contact' },
]

function MobileMenu({ links, open, onClose }) {
  return (
    <div id="mobileMenuWrapper" className={`mobile-menu-wrapper ${open ? 'open' : ''}`}>
      <div className="mobile-menu">
        {links.map((link) => (
          <Link
            key={link.to}
            className="flex items-center gap-3 px-4 py-3 text-on-surface hover:text-primary hover:bg-surface-container-low rounded-xl font-manrope text-sm font-medium transition-all"
            to={link.to}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function PublicHeader({ showNotifications = true }) {
  const { user } = useAuth()
  const [showNotifs, setShowNotifs] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const notifRef = useRef(null)
  const location = useLocation()
  const isDoctorView = new URLSearchParams(location.search).get('role') === 'doctor' || user?.role === 'doctor'
  const links = isDoctorView ? doctorLinks : patientLinks
  const profileRole = isDoctorView ? 'doctor' : user?.role

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (!e.target.closest('#hamburgerBtn') && !e.target.closest('#mobileMenuWrapper')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-header border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              id="hamburgerBtn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="hamburger-btn md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#e3e9eb] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
            >
              <span className="material-symbols-outlined text-[#006977]">{menuOpen ? 'close' : 'menu'}</span>
            </button>
            <Logo />
          </div>
          <nav id="desktopNav" className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.to} className="font-medium text-on-surface hover:text-primary transition-colors" to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {!user ? (
              <Link to="/login" className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary-dim transition-all shadow-sm cursor-pointer">
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                {showNotifications && (
                  <div className="relative" ref={notifRef}>
                    <button
                      className="p-2 rounded-full hover:bg-surface-container-high text-secondary transition-colors cursor-pointer"
                      onClick={() => setShowNotifs(!showNotifs)}
                      type="button"
                    >
                      <span className="material-symbols-outlined">notifications</span>
                      <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                    </button>
                    <NotificationPanel role={profileRole} show={showNotifs} onClose={() => setShowNotifs(false)} />
                  </div>
                )}
                <ProfileDropdown role={profileRole} />
              </div>
            )}
          </div>
        </div>
      </header>
      <MobileMenu links={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

const AI_MODELS = [
  {
    name: 'CognitiveScreen v3.2',
    description: 'Specialized in cognitive decline screening (recommended)',
  },
  {
    name: 'NeuroAssess v2.0',
    description: 'General neurological symptom analysis',
  },
  {
    name: 'MentalWell v1.5',
    description: 'Mental health and wellbeing assessment',
  },
]

const OUTPUT_PREFS = [
  { id: 'confidenceScores', label: 'Show Confidence Scores', description: 'Display AI certainty levels', defaultChecked: true },
  { id: 'medicalReferences', label: 'Include Medical References', description: 'Cite relevant medical literature', defaultChecked: true },
  { id: 'simplifiedLanguage', label: 'Simplified Language', description: 'Use patient-friendly terminology', defaultChecked: false },
]

const AI_SETTINGS_STORAGE_KEY = 'askare_ai_settings'

const DEFAULT_AI_SETTINGS = {
  model: AI_MODELS[0].name,
  outputPreferences: OUTPUT_PREFS.reduce((acc, pref) => ({ ...acc, [pref.id]: pref.defaultChecked }), {}),
  language: 'English',
}

function loadAISettings() {
  if (typeof window === 'undefined') return DEFAULT_AI_SETTINGS
  try {
    const saved = window.localStorage.getItem(AI_SETTINGS_STORAGE_KEY)
    if (!saved) return DEFAULT_AI_SETTINGS
    const parsed = JSON.parse(saved)
    return {
      ...DEFAULT_AI_SETTINGS,
      ...parsed,
      outputPreferences: {
        ...DEFAULT_AI_SETTINGS.outputPreferences,
        ...(parsed.outputPreferences || {}),
      },
    }
  } catch {
    return DEFAULT_AI_SETTINGS
  }
}

function AISettingsModal({ settings, onClose, onSave }) {
  const [draft, setDraft] = useState(settings)

  const setOutputPreference = (id, checked) => {
    setDraft(prev => ({
      ...prev,
      outputPreferences: {
        ...prev.outputPreferences,
        [id]: checked,
      },
    }))
  }

  const saveSettings = () => {
    onSave(draft)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2rem] w-full max-w-lg mx-4 shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#acb3b6]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006977] flex items-center justify-center text-white">
              <span className="material-symbols-outlined">tune</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">AI Settings</h2>
              <p className="text-xs text-[#49636f]">Configure diagnostic engine behavior</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#e3e9eb] text-[#49636f]" type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#757c7e]">Diagnostic Model</label>
            <div className="space-y-2">
              {AI_MODELS.map((option) => (
                <label
                  key={option.name}
                  className={`flex items-center gap-4 p-4 bg-[#f0f4f6] rounded-xl cursor-pointer border-2 transition-colors ${draft.model === option.name ? 'border-[#006977]' : 'border-transparent hover:border-[#006977]/20'}`}
                >
                  <input
                    type="radio"
                    name="ai-model"
                    checked={draft.model === option.name}
                    onChange={() => setDraft(prev => ({ ...prev, model: option.name }))}
                    className="text-[#006977] focus:ring-[#006977]"
                  />
                  <div>
                    <p className="font-semibold text-sm text-on-surface">{option.name}</p>
                    <p className="text-xs text-[#49636f]">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#757c7e]">Output Preferences</label>
            <div className="bg-[#f0f4f6] rounded-xl divide-y divide-[#acb3b6]/10">
              {OUTPUT_PREFS.map((pref) => (
                <label key={pref.label} className="p-4 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{pref.label}</p>
                    <p className="text-xs text-[#49636f]">{pref.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(draft.outputPreferences[pref.id])}
                    onChange={(e) => setOutputPreference(pref.id, e.target.checked)}
                    className="w-5 h-5 rounded text-[#006977] focus:ring-[#006977]"
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#757c7e]">Preferred Language</label>
            <select
              value={draft.language}
              onChange={(e) => setDraft(prev => ({ ...prev, language: e.target.value }))}
              className="w-full bg-[#f0f4f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006977]/20 text-on-surface"
            >
              <option>English</option>
              <option>Urdu</option>
              <option>Sindhi</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-[#acb3b6]/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-[#49636f] font-semibold text-sm rounded-xl hover:bg-[#e3e9eb]" type="button">Cancel</button>
          <button onClick={saveSettings} className="px-6 py-2.5 bg-[#006977] text-white font-semibold text-sm rounded-xl hover:bg-[#005c68]" type="button">Save Settings</button>
        </div>
      </div>
    </div>
  )
}

export function PortalHeader({ role = 'patient', variant = 'portal', showAISettings = false, sidebarBreakpoint = 'md' }) {
  const [showNotifs, setShowNotifs] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false)
  const [aiSettings, setAiSettings] = useState(loadAISettings)
  const notifRef = useRef(null)
  const links = role === 'doctor' ? doctorLinks : patientLinks
  const hasSidebar = variant !== 'settings' && variant !== 'fixed'

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (!e.target.closest('#mobileMenuWrapper')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const sidebar = document.getElementById('sidebar')
    if (!sidebar) return
    sidebar.classList.toggle('sidebar-open', sidebarOpen)
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      sidebar.classList.remove('sidebar-open')
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!aiSettingsOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const handler = (e) => { if (e.key === 'Escape') setAiSettingsOpen(false) }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handler)
    }
  }, [aiSettingsOpen])

  const closeMobileLayers = () => {
    setSidebarOpen(false)
    setMenuOpen(false)
  }

  const saveAISettings = (settings) => {
    setAiSettings(settings)
    window.localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    setAiSettingsOpen(false)
  }

  const inner = (
    <>
      <div className="flex items-center gap-3">
        {hasSidebar && (
          <button
            id="hamburgerBtn"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            className={`hamburger-btn ${sidebarBreakpoint === 'lg' ? 'lg:hidden' : 'md:hidden'} flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#e3e9eb] transition-colors`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            type="button"
          >
            <span className="material-symbols-outlined text-[#006977]">{sidebarOpen ? 'close' : 'menu'}</span>
          </button>
        )}
        <Logo />
      </div>
      <nav className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <Link key={link.to} className="font-medium text-base text-on-surface hover:text-primary transition-colors" to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        {showAISettings && (
          <button id="ai-settings-btn" className="p-2 rounded-full hover:bg-surface-container-high text-secondary transition-colors" title="AI Settings" onClick={() => setAiSettingsOpen(true)} type="button">
            <span className="material-symbols-outlined">tune</span>
          </button>
        )}
        <div className="relative" ref={notifRef}>
          <button
            className="p-2 rounded-full hover:bg-surface-container-high text-secondary transition-colors cursor-pointer"
            onClick={() => setShowNotifs(!showNotifs)}
            type="button"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <NotificationPanel role={role} show={showNotifs} onClose={() => setShowNotifs(false)} />
        </div>
        <ProfileDropdown role={role} />
      </div>
    </>
  )

  const mobileLayers = (
    <>
      <div className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeMobileLayers}></div>
      <MobileMenu links={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )

  const aiSettingsModal = showAISettings && aiSettingsOpen ? <AISettingsModal settings={aiSettings} onClose={() => setAiSettingsOpen(false)} onSave={saveAISettings} /> : null

  if (variant === 'settings' || variant === 'fixed') {
    return (
      <>
        <header className="fixed top-0 w-full z-50 glass-header border-b border-outline-variant/10">
          <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">{inner}</div>
        </header>
        {mobileLayers}
        {aiSettingsModal}
      </>
    )
  }

  return (
    <>
      <header className="bg-[#f8fafb]/80 dark:bg-slate-950/80 backdrop-blur-md text-[#006977] font-manrope text-sm flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40 border-b border-outline-variant/10">
        {inner}
      </header>
      {mobileLayers}
      {aiSettingsModal}
    </>
  )
}
