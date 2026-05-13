import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const fakeAccounts = {
  patient: { email: 'sarah.chen@askare.com', password: 'patient123' },
  doctor: { email: 'dr.arsalan@askare.com', password: 'doctor123' },
}

export default function LoginPage() {
  const [authMode, setAuthMode] = useState('login')
  const [role, setRole] = useState('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [showPw3, setShowPw3] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const tryLogin = (e) => {
    e.preventDefault()
    const em = email.trim().toLowerCase()
    const pw = password
    if (em === fakeAccounts.patient.email && pw === fakeAccounts.patient.password) {
      login('patient')
      navigate('/patient-dashboard')
      return
    }
    if (em === fakeAccounts.doctor.email && pw === fakeAccounts.doctor.password) {
      login('doctor')
      navigate('/doctor-dashboard')
      return
    }
    setError('Invalid email or password. Please try again.')
    setTimeout(() => setError(''), 4000)
  }

  return (
    <>
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="hidden lg:flex flex-col justify-center space-y-12 pr-12 border-r border-outline-variant/10">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Logo />
              </div>
              <h1 className="text-5xl font-medium tracking-tight text-on-surface leading-tight">
                Your clinical journey, <br />
                <span className="text-primary italic">refined and simplified.</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed max-w-md">
                Experience a healthcare portal designed with Askare. Access your records, book calls, and manage your health with absolute clarity.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">encrypted</span>
                </div>
                <div>
                  <h3 className="text-title-md font-semibold text-on-surface">Secure &amp; Private</h3>
                  <p className="text-body-lg text-on-surface-variant">End-to-end encryption for all your medical data and consultations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">video_chat</span>
                </div>
                <div>
                  <h3 className="text-title-md font-semibold text-on-surface">Virtual Care</h3>
                  <p className="text-body-lg text-on-surface-variant">Connect with top-tier specialists from the comfort of your home.</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm">
              <img alt="Clinical environment" className="w-full h-full object-cover grayscale-[20%] opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4fQD6KbN1XntDBSqMw3obOhs2NRSTfpyoo72LA4PH_AzXvZCvTJmUbrFAkSp-YX3q6M9cY0cV9sVSg3EFGOoAnElgNiYL8DQ0qt7gc_NmOzrrIKJfZI1pq0oTVMbbKSjT4_FJWISQBBPiFb2M0SknZh8OCIeACemHCzzc6SewAppslUNbqFS9P82IFEi7uVM4aIV2SXBKxdw66oGvmDuj1jFE4rMDtWeERFtcUo7ftkxYBkiUeqmqnVuqH43xL40LRk5VwAeu88E" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="flex flex-col justify-center">
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_12px_32px_rgba(44,52,54,0.04)] ring-1 ring-outline-variant/5">
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

              <div className="flex justify-between items-center mb-10 gap-4">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-on-surface whitespace-nowrap">
                  {authMode === 'login' ? 'Welcome' : (role === 'doctor' ? 'Provider Registration' : 'Join Askare')}
                </h2>
                <div className="flex p-1 bg-surface-container-low rounded-full shrink-0">
                  <button className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${authMode === 'login' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setAuthMode('login')}>Login</button>
                  <button className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${authMode === 'signup' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setAuthMode('signup')}>Sign Up</button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Login View */}
                {authMode === 'login' && (
                  <form className="space-y-6" onSubmit={tryLogin}>
                    {error && (
                      <div className="bg-error-container/10 text-error border border-error/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>{error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">{role === 'doctor' ? 'Professional Email' : 'Email Address'}</label>
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
                {authMode === 'signup' && (
                  <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">{role === 'doctor' ? 'Full Name & Degree' : 'Full Name'}</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder={role === 'doctor' ? 'Dr. John Doe, MD' : 'John Doe'} type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">{role === 'doctor' ? 'Professional Email' : 'Email Address'}</label>
                      <input className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="name@example.com" type="email" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Password</label>
                        <div className="relative">
                          <input className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="••••••••" type={showPw2 ? 'text' : 'password'} />
                          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPw2(!showPw2)}>
                            <span className="material-symbols-outlined text-xl">{showPw2 ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Confirm Password</label>
                        <div className="relative">
                          <input className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline" placeholder="••••••••" type={showPw3 ? 'text' : 'password'} />
                          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPw3(!showPw3)}>
                            <span className="material-symbols-outlined text-xl">{showPw3 ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
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
                {authMode === 'login' ? 'New to Askare?' : 'Already have an account?'}
                <a onClick={(e) => { e.preventDefault(); setAuthMode(authMode === 'login' ? 'signup' : 'login') }} className="text-primary font-bold hover:underline ml-1 cursor-pointer" href="#">
                  {authMode === 'login' ? 'Create an account' : 'Sign in instead'}
                </a>
              </p>
            </div>
            {/* Mobile Footer */}
            <div className="mt-8 flex justify-center gap-8 text-xs font-medium text-on-surface-variant/60 lg:hidden">
              <Link className="hover:text-primary transition-colors" to="/privacy-policy">Privacy Policy</Link>
              <Link className="hover:text-primary transition-colors" to="/terms-of-use">Terms of Service</Link>
              <a className="hover:text-primary transition-colors" href="#">Patient Security</a>
            </div>
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
