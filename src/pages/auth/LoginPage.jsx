import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function LoginPage() {
  const [authMode, setAuthMode] = useState('login')
  const [role, setRole] = useState('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [showPw3, setShowPw3] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const isLogin = authMode === 'login'

  const tryLogin = (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const em = email.trim().toLowerCase()
    const pw = password
    if (!em) { setError('Please enter your email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError('Please enter a valid email address (e.g. name@example.com).'); return }
    if (!pw) { setError('Please enter your password.'); return }
    if (em === 'admin@askare.health' && pw === 'Admin@2026') {
      login('admin', { name: 'Admin', email: em, uid: 'ASK-ADMIN' })
      navigate('/admin-dashboard')
      return
    }
    const tempUsers = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
    const found = tempUsers.find(u => u.email === em && u.password === pw)
    if (found) {
      login(found.role, found)
      navigate(found.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard')
      return
    }
    setError('Invalid email or password. Please try again.')
    setTimeout(() => setError(''), 4000)
  }

  const signupChecks = {
    len: signupPassword.length >= 8,
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword),
    upper: /[A-Z]/.test(signupPassword),
    num: /[0-9]/.test(signupPassword),
  }
  const signupScore = Object.values(signupChecks).filter(Boolean).length
  const signupLabels = ['Weak', 'Fair', 'Moderate', 'Strong']

  const trySignup = (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const name = fullName.trim()
    const em = signupEmail.trim().toLowerCase()
    const pw = signupPassword
    const cpw = signupConfirm
    if (!name) { setError('Please enter your full name.'); return }
    if (!/^[a-zA-Z\s.]+$/.test(name)) { setError('Name can only contain letters, spaces, and periods.'); return }
    if (!em) { setError('Please enter your email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError('Please enter a valid email address (e.g. name@example.com).'); return }
    if (!pw) { setError('Please create a password.'); return }
    if (!signupChecks.len) { setError('Password must be at least 8 characters long.'); return }
    if (!signupChecks.upper) { setError('Password must contain at least one uppercase letter.'); return }
    if (!signupChecks.num) { setError('Password must contain at least one number.'); return }
    if (!signupChecks.symbol) { setError('Password must contain at least one symbol (@#$).'); return }
    if (!cpw) { setError('Please confirm your password.'); return }
    if (pw !== cpw) { setError('Passwords do not match. Please re-enter.'); return }
    const existing = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
    if (existing.find(u => u.email === em)) {
      setError('An account with this email already exists. Please log in instead.'); return
    }
    const genId = () => { const all = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]'); const ids = all.map(u => u.uid).filter(Boolean); let id; do { id = 'ASK-' + String(Math.floor(10000 + Math.random() * 90000)) } while (ids.includes(id)); return id }
    existing.push({ name, email: em, password: pw, role, gender: '', avatar: '', uid: genId() })
    sessionStorage.setItem('askare_temp_users', JSON.stringify(existing))
    setSuccess('Account created successfully! Redirecting to login...')
    setFullName(''); setSignupEmail(''); setSignupPassword(''); setSignupConfirm('')
    setTimeout(() => { setAuthMode('login'); setSuccess('') }, 800)
  }

  const [sliding, setSliding] = useState(false)

  const switchTo = (mode) => {
    setError(''); setSuccess('')
    if (mode === 'signup') { setEmail(''); setPassword('') }
    else { setSignupEmail(''); setSignupPassword(''); setSignupConfirm(''); setFullName('') }
    setSliding(true)
    setAuthMode(mode)
    setTimeout(() => setSliding(false), 700)
  }

  /* ── Shared form fields rendered into both slots so content doesn't jump ── */
  const formContent = (
    <div className="flex flex-col justify-center px-8 md:px-12 py-10" style={{ minHeight: '840px', opacity: sliding ? 0 : 1, transition: 'opacity 0s ease', transitionDelay: sliding ? '0s' : '0s' }}>
      {/* Role Toggle (Signup Only) */}
      {authMode === 'signup' && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-surface-container-low rounded-full">
            <button className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${role === 'patient' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setRole('patient')}>
              <span className={`material-symbols-outlined text-[20px] ${role === 'patient' ? 'text-primary' : 'text-on-surface-variant'}`}>person</span> Patient
            </button>
            <button className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${role === 'doctor' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setRole('doctor')}>
              <span className={`material-symbols-outlined text-[20px] ${role === 'doctor' ? 'text-primary' : 'text-on-surface-variant'}`}>medical_services</span> Doctor
            </button>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-on-surface whitespace-nowrap">
          {isLogin ? 'Welcome' : (role === 'doctor' ? 'Provider Registration' : 'Join Askare')}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Login View */}
        {isLogin && (
          <form className="space-y-6" onSubmit={tryLogin}>
            {error && (
              <div className="bg-error-container/10 text-error border border-error/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="name@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Password</label>
                <Link className="text-xs font-semibold text-primary hover:text-primary-dim transition-colors" to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="••••••••" type={showPw ? 'text' : 'password'} />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPw(!showPw)}>
                  <span className="material-symbols-outlined text-xl">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 px-1">
              <input checked={remember} onChange={e => setRemember(e.target.checked)} className="w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary/20 transition-all cursor-pointer" id="remember" type="checkbox" />
              <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember this device for 30 days</label>
            </div>
            <div className="pt-4">
              <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] transition-all duration-300" type="submit">Sign In</button>
            </div>
          </form>
        )}

        {/* Sign Up View */}
        {!isLogin && (
          <form className="space-y-6" onSubmit={trySignup}>
            {error && (
              <div className="bg-error-container/10 text-error border border-error/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}
            {success && (
              <div className="bg-primary-container/20 text-primary border border-primary/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>{success}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Full Name</label>
              <input value={fullName} onChange={e => { const v = e.target.value; const cap = v.replace(/(^|[\s.])([a-z])/g, (m, p, c) => p + c.toUpperCase()); setFullName(cap) }} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder={role === 'doctor' ? 'Dr. John Doe' : 'John Doe'} type="text" />
              {fullName.length > 0 && !/^[a-zA-Z\s.]+$/.test(fullName) && (
                <p className="text-xs text-error px-1 mt-1">Name can only contain letters, spaces, and periods.</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">{role === 'doctor' ? 'Professional Email' : 'Email Address'}</label>
              <input value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="name@example.com" type="email" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Password</label>
                <div className="relative">
                  <input value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="••••••••" type={showPw2 ? 'text' : 'password'} />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPw2(!showPw2)}>
                    <span className="material-symbols-outlined text-xl">{showPw2 ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Confirm Password</label>
                <div className="relative">
                  <input value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="••••••••" type={showPw3 ? 'text' : 'password'} />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPw3(!showPw3)}>
                    <span className="material-symbols-outlined text-xl">{showPw3 ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>
            {signupPassword.length > 0 && (
              <div className="p-5 bg-surface-container-low rounded-xl space-y-4 border border-outline-variant/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-on-surface">Password Strength</span>
                  <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full transition-all duration-500 ${signupScore === 0 ? 'bg-gray-200 text-gray-500' : signupScore === 1 ? 'bg-red-100 text-red-600' : signupScore === 2 ? 'bg-orange-100 text-orange-600' : signupScore === 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                    {signupScore === 0 ? 'Too Weak' : signupLabels[signupScore - 1]}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ease-out ${signupScore === 1 ? 'bg-red-500' : signupScore === 2 ? 'bg-orange-500' : signupScore === 3 ? 'bg-yellow-500' : signupScore === 4 ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: `${signupScore * 25}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'len', label: '8+ Characters' },
                    { key: 'upper', label: 'Uppercase letter' },
                    { key: 'num', label: 'Number (0-9)' },
                    { key: 'symbol', label: 'Symbol (!@#$)' },
                  ].map(c => (
                    <div key={c.key} className={`flex items-center gap-2 transition-all duration-300 ${signupChecks[c.key] ? 'opacity-100' : 'opacity-50'}`}>
                      <span className={`material-symbols-outlined text-base transition-all duration-300 ${signupChecks[c.key] ? 'text-green-500 scale-110' : 'text-gray-400 scale-100'}`} style={signupChecks[c.key] ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {signupChecks[c.key] ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`text-xs font-medium transition-colors duration-300 ${signupChecks[c.key] ? 'text-on-surface' : 'text-on-surface-variant'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {signupConfirm.length > 0 && signupPassword !== signupConfirm && (
              <p className="text-xs text-error px-1 -mt-4">Passwords do not match.</p>
            )}
            {signupEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim()) && (
              <p className="text-xs text-error px-1 -mt-4">Please enter a valid email address (e.g. name@example.com).</p>
            )}
            <div className="pt-4">
              <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 whitespace-nowrap" type="submit">Create Account</button>
            </div>
          </form>
        )}
      </div>

      {/* Social Auth */}
      <div className="mt-10 relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/10"></div></div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-4 bg-surface-container-lowest text-outline">Social Authentication</span></div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/20 rounded-xl hover:bg-surface-container-low transition-colors duration-300">
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm font-medium text-on-surface">Google</span>
        </button>
      </div>

      {/* Footer Link */}
      <p className="mt-10 text-center text-sm text-on-surface-variant">
        {isLogin ? 'New to Askare?' : 'Already have an account?'}
        <a onClick={(e) => { e.preventDefault(); switchTo(isLogin ? 'signup' : 'login') }} className="text-primary font-bold hover:underline ml-1 cursor-pointer" href="#">
          {isLogin ? 'Create an account' : 'Sign in instead'}
        </a>
      </p>
    </div>
  )

  const brandingContent = (
    <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden h-full" style={{ background: 'linear-gradient(145deg, #006977 0%, #004d57 50%, #00363d 100%)', filter: sliding ? 'blur(6px)' : 'blur(0px)', transition: 'filter 0.3s ease' }}>
      <div className="relative z-10 space-y-10">
        <div>
          <div className="flex items-center gap-2 mb-6">
            {/* Use the same Logo component with white styling for the dark panel */}
            <span className="[&_span]:!text-white [&_svg_path]:!stroke-[#8be9f6]"><Logo /></span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white leading-tight mb-4">
            {isLogin ? (
              <>Your clinical journey, <br /><span className="text-[#8be9f6] italic">refined and simplified.</span></>
            ) : (
              <>Join the future of<br /><span className="text-[#8be9f6] italic">digital healthcare.</span></>
            )}
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            {isLogin
              ? 'Experience a healthcare portal designed with Askare. Access your records, book calls, and manage your health with absolute clarity.'
              : 'Create your account and connect with verified specialists. Secure video consultations, AI-powered diagnostics, and comprehensive health records — all in one place.'
            }
          </p>
        </div>
        <div className="space-y-5">
          {[
            { icon: 'encrypted', title: 'Secure & Private', desc: 'End-to-end encryption for all medical data.' },
            { icon: 'videocam', title: 'Video Consultations', desc: 'Connect with specialists from home.' },
            { icon: 'neurology', title: 'AI Diagnostics', desc: 'Intelligent symptom analysis & triage.' },
          ].map(f => (
            <div key={f.icon} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[#8be9f6] text-lg">{f.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                <p className="text-white/40 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Background decorations */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />
    </div>
  )

  return (
    <>
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
        <div className="w-full max-w-6xl">
          {/* Main Container — fixed height so it doesn't resize on mode switch */}
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(44,52,54,0.08)] ring-1 ring-outline-variant/5 bg-surface-container-lowest" style={{ minHeight: '840px' }}>

            {/* ─── Image / Branding Panel (slides between left and right) ─── */}
            <div
              className="hidden lg:block absolute top-0 bottom-0 w-1/2 z-10"
              style={{
                left: isLogin ? '50%' : '0%',
                transition: 'left 0.65s cubic-bezier(0.4, 0, 0.15, 1)',
              }}
            >
              {brandingContent}
            </div>

            {/* ─── Form Panel (slides between left and right) ─── */}
            <div
              className="relative lg:w-1/2"
              style={{
                marginLeft: isLogin ? '0' : '50%',
                transition: 'margin-left 0.65s cubic-bezier(0.4, 0, 0.15, 1)',
              }}
            >
              {formContent}
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="mt-8 flex justify-center gap-8 text-xs font-medium text-on-surface-variant/60 lg:hidden">
            <Link className="hover:text-primary transition-colors" to="/privacy-policy">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" to="/terms-of-use">Terms of Service</Link>
            <a className="hover:text-primary transition-colors" href="#">Patient Security</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f0f4f6] border-t border-surface-container-high">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-sm">
              <div className="mb-3"><Logo size="footer" /></div>
              <p className="text-sm text-[#49636f] leading-relaxed">Redefining cognitive healthcare in Karachi through intelligent AI diagnostics and verified professional care.</p>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-8">
              <Link className="text-sm font-medium text-[#49636f] hover:text-[#006977] transition-colors" to="/privacy-policy">Privacy Policy</Link>
              <Link className="text-sm font-medium text-[#49636f] hover:text-[#006977] transition-colors" to="/terms-of-use">Terms of Use</Link>
              <Link className="text-sm font-medium text-[#49636f] hover:text-[#006977] transition-colors" to="/about">About Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
