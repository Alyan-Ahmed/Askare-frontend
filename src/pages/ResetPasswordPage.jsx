import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { Footer } from '../components/Footer'

export default function ResetPasswordPage() {
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const checks = {
    len: newPass.length >= 8,
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPass),
    upper: /[A-Z]/.test(newPass),
    num: /[0-9]/.test(newPass),
  }
  const score = Object.values(checks).filter(Boolean).length
  const labels = ['Weak', 'Fair', 'Moderate', 'Strong']
  const matchError = confirmPass.length > 0 && confirmPass !== newPass

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Password updated successfully!')
    navigate('/login')
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#f8fafb]/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-screen-xl mx-auto">
          <Link to="/"><Logo /></Link>
          <button className="text-secondary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl z-10">
          {/* Left Side */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 pr-0 lg:pr-12">
            <div className="space-y-4">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Security Portal</span>
              <h1 className="text-[3.5rem] leading-[1.1] font-medium text-on-background tracking-tight">
                Securing your <span className="text-primary">clinical journey.</span>
              </h1>
              <p className="text-body-lg text-secondary leading-relaxed max-w-md">
                Please choose a password that reflects the importance of your healthcare data. We recommend using a unique combination of symbols and characters.
              </p>
            </div>
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">End-to-End Encryption</h3>
                  <p className="text-sm text-on-surface-variant">Your new credentials are hashed locally before transmission.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">HIPAA Compliant</h3>
                  <p className="text-sm text-on-surface-variant">Askare maintains the highest global medical data standards.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-7 flex items-center">
            <div className="w-full bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 border border-surface-container-high shadow-sm">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant px-1">New Password</label>
                  <div className="relative">
                    <input value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant transition-all" placeholder="Enter new password" type={showNew ? 'text' : 'password'} required />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" type="button" onClick={() => setShowNew(!showNew)}>
                      <span className="material-symbols-outlined">{showNew ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Strength Indicator */}
                <div className="p-5 bg-surface-container-low rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-on-surface">Password Strength</span>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3].map(i => (
                        <span key={i} className={`h-2 w-8 rounded-full ${i < score ? 'bg-primary' : 'bg-primary/20'}`}></span>
                      ))}
                      <span className="text-[10px] font-bold text-outline ml-2 uppercase tracking-tighter">{labels[Math.max(0, score - 1)] || 'Weak'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'len', label: '8+ Characters' },
                      { key: 'symbol', label: 'One symbol (@#$)' },
                      { key: 'upper', label: 'One uppercase' },
                      { key: 'num', label: 'One number' },
                    ].map(c => (
                      <div key={c.key} className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[16px] ${checks[c.key] ? 'text-primary' : 'text-outline-variant'}`} style={checks[c.key] ? { fontVariationSettings: "'FILL' 1" } : {}}>
                          {checks[c.key] ? 'check_circle' : 'circle'}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant px-1">Confirm New Password</label>
                  <div className="relative">
                    <input value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant transition-all" placeholder="Re-enter new password" type={showConfirm ? 'text' : 'password'} required />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                      <span className="material-symbols-outlined">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {matchError && <p className="text-xs text-error px-1 mt-1">Passwords do not match</p>}
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold py-4 rounded-xl hover:shadow-xl active:scale-95 transition-all duration-200 hover:brightness-110 shadow-md">Update Password</button>
                  <Link to="/login" className="block w-full mt-4 text-primary text-sm font-semibold hover:underline transition-all text-center">Back to Log In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-0"></div>
        <div className="absolute top-20 -right-20 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] -z-0"></div>
      </main>

      <Footer />
    </>
  )
}
