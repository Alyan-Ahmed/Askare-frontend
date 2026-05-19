import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { Footer } from '../components/Footer'

const VALID_OTP = '123456'
const knownEmails = ['alyan.patient@gmail.com', 'dr.arsalan@gmail.com']

export default function ForgotPasswordPage() {
  const otpRefs = useRef([])
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  const handleOtpInput = (e, i) => {
    if (e.target.value.length === 1 && i < 5) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKey = (e, i) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const allEmails = () => {
    const tempUsers = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
    return [...knownEmails, ...tempUsers.map(u => u.email)]
  }

  const requestCode = () => {
    setError(''); setSuccess('')
    const em = email.trim().toLowerCase()
    if (!em) { setError('Please enter your email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError('Please enter a valid email address (e.g. name@example.com).'); return }
    if (!allEmails().includes(em)) { setError('No account found with this email address.'); return }
    setCodeSent(true)
    setSuccess('Verification code sent! Use code: 123456 for demo.')
    setTimeout(() => setSuccess(''), 5000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const em = email.trim().toLowerCase()
    if (!em) { setError('Please enter your email address.'); return }
    if (!allEmails().includes(em)) { setError('No account found with this email address.'); return }
    if (!codeSent) { setError('Please request a verification code first.'); return }
    const otp = otpRefs.current.map(r => r?.value || '').join('')
    if (otp.length < 6) { setError('Please enter the full 6-digit verification code.'); return }
    if (otp !== VALID_OTP) { setError('Invalid verification code. Please try again.'); return }
    setSuccess('Identity verified! Redirecting to reset password...')
    setTimeout(() => navigate('/reset-password', { state: { email: em } }), 1500)
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#f8fafb]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-xl mx-auto">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-4">
            <button className="text-[#49636f] hover:opacity-80 transition-opacity flex items-center justify-center p-2">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-6 pt-20 pb-12 min-h-screen">
        <div className="w-full max-w-[520px] space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-[3.5rem] font-medium leading-tight text-on-surface tracking-tight">Reset Access</h1>
            <p className="text-on-surface-variant body-lg max-w-[400px] mx-auto leading-relaxed">
              Confirm your identity to restore access to your clinical workspace.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_4px_24px_rgba(44,52,54,0.06)] border border-surface-container-high/40">
            <form className="space-y-10" onSubmit={handleSubmit}>
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
              <div className="space-y-4">
                <label className="block text-[0.75rem] font-semibold uppercase tracking-widest text-on-surface-variant px-1" htmlFor="email">1. Professional Email</label>
                <div className="relative">
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-5 py-4 text-on-surface placeholder:text-outline-variant/60 focus:ring-2 focus:ring-primary/20 transition-all text-base" id="email" placeholder="name@medical-center.com" required type="email" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-surface-container-high w-full"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <label className="block text-[0.75rem] font-semibold uppercase tracking-widest text-on-surface-variant">2. Verification Code</label>
                  <button className="text-[0.75rem] font-bold text-primary hover:underline uppercase tracking-wider" type="button" onClick={requestCode}>Request Code</button>
                </div>
                <div className="flex justify-between gap-2">
                  {[...Array(6)].map((_, i) => (
                    <input key={i} ref={el => otpRefs.current[i] = el}
                      className="w-full h-14 bg-surface-container-low border-none rounded-lg text-center text-xl font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                      inputMode="numeric" maxLength="1" pattern="[0-9]" type="text"
                      onInput={(e) => handleOtpInput(e, i)} onKeyDown={(e) => handleOtpKey(e, i)} />
                  ))}
                </div>
                <p className="text-[0.7rem] text-on-surface-variant text-center italic">The 6-digit secure key expires in 10:00 minutes.</p>
              </div>

              <button className="w-full text-on-primary font-semibold py-4 rounded-full shadow-lg shadow-primary/10 hover:opacity-95 active:scale-95 transition-all duration-200 text-lg flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #006977 0%, #005c68 100%)' }} type="submit">
                Verify &amp; Continue
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </button>
            </form>

            <div className="mt-8 text-center border-t border-surface-container-high/40 pt-6">
              <Link className="inline-flex items-center gap-2 text-primary font-semibold group hover:opacity-80 transition-opacity" to="/login">
                <span className="material-symbols-outlined text-[18px]">keyboard_backspace</span>
                <span className="relative">Back to Login<span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary/30 transition-all duration-300 group-hover:w-full"></span></span>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full border border-surface-container-high/30">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[0.75rem] font-semibold uppercase tracking-wider text-on-surface-variant">Clinical Identity Gateway</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
