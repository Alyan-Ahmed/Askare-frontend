import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Toggle({ checked, onChange, size = 'lg' }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" type="checkbox" />
      <div className={`${size === 'lg' ? 'w-11 h-6' : 'w-9 h-5'} bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full ${size === 'lg' ? 'after:h-5 after:w-5' : 'after:h-4 after:w-4'} after:transition-all ${size === 'lg' ? 'peer-checked:bg-primary' : 'peer-checked:bg-primary/80'}`}></div>
    </label>
  )
}

export default function DoctorSettingsPage() {
  const [twoFA, setTwoFA] = useState(true)
  const [authApp, setAuthApp] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [urgentAlerts, setUrgentAlerts] = useState(false)
  const [showPwNew, setShowPwNew] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const [deactivateModal, setDeactivateModal] = useState(false)
  const [toast, setToast] = useState(null)
  const { user } = useAuth()
  const profileName = user?.name || 'Dr. Arsalan Khan'
  const profileEmail = user?.email || 'dr.arsalan@askare.com'
  const profileAvatar = user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjjHmze-FPbpcsPti5gE9P6DmTWdj7N_V9NOsOwt2sGMXJiFOE0OuiMVrdsq_lsC5GrV3RjgcT80enDRKSfiQ_9oDOx4Jd0RELfP9PwU5r9t0WNsS4sCCiPtdEn7jcbfow-3oUoUt3LJNpvWa5wc6zABuVTDxD5_9K7jtcoP6Ulf2rH7VfKy0vrJZT8bMrtJDI6-dWqhsFZGtmZ4iiUxjGNOxOpy9DSk2Kq1WWaWu7BvsxElA4Vp_enUn2ZHwfVID-y-ToYzyE7w'

  useEffect(() => {
    if (deactivateModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const handler = (e) => { if (e.key === 'Escape') setDeactivateModal(false) }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [deactivateModal])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  return (
    <main className="mb-16 flex-grow container max-w-3xl mx-auto px-6 lg:px-8 pt-24">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 reveal">
        <div><h1 className="text-3xl font-semibold text-primary tracking-tight">Account Settings</h1><p className="text-on-surface-variant mt-1">Manage your professional identity and security preferences.</p></div>
        <div className="flex gap-3">
          <button className="bg-surface-container-low text-on-surface-variant px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/20" onClick={() => window.location.reload()}>Discard</button>
          <button className="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95" onClick={() => showToast('Settings saved successfully!')}>Save</button>
        </div>
      </header>

      <div className="space-y-12 reveal reveal-delay-1">
        {/* Account Details */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Account Details</h2>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-surface-container">
              <div className="relative shrink-0">
                <img alt={`${profileName} profile`} className="w-20 h-20 rounded-full object-cover" src={profileAvatar} />
                <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-on-primary rounded-full shadow-lg border-2 border-surface-container-lowest"><span className="material-symbols-outlined text-xs">edit</span></button>
              </div>
              <div><p className="text-lg font-bold">{profileName}</p><p className="text-sm text-on-surface-variant">Verified Healthcare Practitioner</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Full Name</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="text" defaultValue={profileName} /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Professional Email</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="email" defaultValue={profileEmail} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Phone Number</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="tel" defaultValue="+1 (555) 012-3456" /></div>
            </div>
          </div>
        </section>

        {/* Professional Profile */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Professional Profile</h2>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Medical Specialty</label><select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20"><option>Cognitive Specialist</option><option>Neurologist</option><option>Psychiatrist</option><option>Geriatric Care</option></select></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Years of Experience</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="number" defaultValue="12" /></div>
            </div>
            <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Clinical ID / License Number</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="text" defaultValue="MED-88219-NY" /></div>
            <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Professional Bio</label><textarea className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" rows="4" defaultValue="Board-certified neurologist specializing in cognitive disorders and early-stage geriatric care. Committed to delivering personalized concierge healthcare that prioritizes patient dignity and clinical precision." /></div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Security</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 divide-y divide-surface-container">
            <div className="p-8 space-y-4">
              <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">lock_reset</span>Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20" placeholder="New Password" type={showPwNew ? 'text' : 'password'} /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPwNew(!showPwNew)}><span className="material-symbols-outlined text-xl">{showPwNew ? 'visibility_off' : 'visibility'}</span></button></div>
                <div className="relative"><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Confirm Password" type={showPwConfirm ? 'text' : 'password'} /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPwConfirm(!showPwConfirm)}><span className="material-symbols-outlined text-xl">{showPwConfirm ? 'visibility_off' : 'visibility'}</span></button></div>
              </div>
            </div>
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-start space-x-4"><div className="mt-1"><span className="material-symbols-outlined text-primary">security</span></div><div><p className="font-bold">Two-Factor Authentication</p><p className="text-sm text-on-surface-variant">Secure your account with an extra layer of protection.</p></div></div>
              <Toggle checked={twoFA} onChange={setTwoFA} />
            </div>
            <div className={`px-8 pb-6 space-y-4 border-t border-surface-container pt-4 transition-all duration-300 ${!twoFA ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              <div className="flex items-center justify-between opacity-80 pl-8">
                <div className="flex items-center space-x-4"><span className="material-symbols-outlined text-secondary text-xl">phone_iphone</span><div><p className="text-sm font-bold">Authenticator App</p><p className="text-[11px] text-secondary">Use Google Authenticator or Authy.</p></div></div>
                <Toggle checked={authApp} onChange={setAuthApp} size="sm" />
              </div>
              {authApp && (
                <div className="pl-12 pb-4 space-y-4">
                  <div className="bg-surface-container-low p-6 rounded-xl max-w-md">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Scan QR Code</p>
                    <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-outline-variant/20 mb-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full"><rect fill="#000" x="10" y="10" width="25" height="25" rx="2"/><rect fill="#fff" x="14" y="14" width="17" height="17" rx="1"/><rect fill="#000" x="17" y="17" width="11" height="11" rx="1"/><rect fill="#000" x="65" y="10" width="25" height="25" rx="2"/><rect fill="#fff" x="69" y="14" width="17" height="17" rx="1"/><rect fill="#000" x="72" y="17" width="11" height="11" rx="1"/><rect fill="#000" x="10" y="65" width="25" height="25" rx="2"/><rect fill="#fff" x="14" y="69" width="17" height="17" rx="1"/><rect fill="#000" x="17" y="72" width="11" height="11" rx="1"/><rect fill="#000" x="40" y="10" width="5" height="5"/><rect fill="#000" x="50" y="10" width="5" height="5"/><rect fill="#000" x="40" y="40" width="5" height="5"/><rect fill="#000" x="50" y="45" width="5" height="5"/><rect fill="#000" x="70" y="55" width="5" height="5"/><rect fill="#000" x="80" y="50" width="5" height="5"/><rect fill="#000" x="75" y="65" width="5" height="5"/><rect fill="#000" x="65" y="75" width="5" height="5"/><rect fill="#000" x="85" y="70" width="5" height="5"/><rect fill="#000" x="80" y="85" width="5" height="5"/></svg>
                    </div>
                    <p className="text-xs text-center text-secondary mb-3">Scan this QR code with your authentication app</p>
                    <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Or enter key manually</label><div className="flex gap-2"><input className="flex-1 bg-surface-container border-none rounded-lg px-3 py-2 text-xs text-on-surface font-mono" defaultValue="ASKR-7X9K-M4PQ-2R8N" readOnly /><button className="text-xs font-bold text-primary px-3 py-2 bg-primary-container/20 rounded-lg hover:bg-primary-container/40">Copy</button></div></div>
                    <div className="mt-4 space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Verification Code</label><div className="flex gap-2"><input className="flex-1 bg-surface-container border-none rounded-lg px-3 py-2 text-sm text-on-surface text-center tracking-[0.5em] font-mono" placeholder="000000" maxLength="6" /><button className="text-xs font-bold text-on-primary bg-primary px-4 py-2 rounded-lg hover:bg-primary-dim">Verify</button></div></div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between opacity-80 pl-8">
                <div className="flex items-center space-x-4"><span className="material-symbols-outlined text-secondary text-xl">sms</span><div><p className="text-sm font-bold">SMS Verification</p><p className="text-[11px] text-secondary">Receive a code via text message.</p></div></div>
                <Toggle checked={smsEnabled} onChange={setSmsEnabled} size="sm" />
              </div>
              {smsEnabled && (
                <div className="pl-12 pb-4 space-y-4">
                  <div className="bg-surface-container-low p-6 rounded-xl max-w-md">
                    <div className="space-y-4">
                      <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Phone Number</label><div className="flex gap-3"><select className="w-[75px] shrink-0 bg-surface-container border-none rounded-lg px-2 py-2 text-xs text-on-surface"><option>+92</option><option>+1</option><option>+44</option></select><input className="flex-1 bg-surface-container border-none rounded-lg px-3 py-2 text-sm text-on-surface" placeholder="300 1234567" defaultValue="300 1234567" /></div></div>
                      <button className="w-full text-xs font-bold text-on-primary bg-primary px-4 py-2.5 rounded-lg hover:bg-primary-dim">Send Verification Code</button>
                      <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Enter Code</label><div className="flex gap-2 justify-center">{[0,1,2].map(i => <input key={i} className="w-10 h-10 bg-surface-container border-none rounded-lg text-center text-lg font-mono" maxLength="1" />)}<span className="flex items-center text-outline">-</span>{[3,4,5].map(i => <input key={i} className="w-10 h-10 bg-surface-container border-none rounded-lg text-center text-lg font-mono" maxLength="1" />)}</div><p className="text-[10px] text-secondary text-center mt-2">Didn't receive? <button className="text-primary font-bold">Resend Code</button></p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Preferences</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden divide-y divide-surface-container">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined text-sm">mail</span></div><div><p className="font-bold">Email Notifications</p><p className="text-xs text-on-surface-variant">Receive patient reports and platform updates via email.</p></div></div>
              <Toggle checked={emailNotif} onChange={setEmailNotif} />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary"><span className="material-symbols-outlined text-sm">notifications_active</span></div><div><p className="font-bold">Urgent Patient Alerts</p><p className="text-xs text-on-surface-variant">Direct mobile push notifications for critical patient metrics.</p></div></div>
              <Toggle checked={urgentAlerts} onChange={setUrgentAlerts} />
            </div>

          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-8">
          <div className="bg-tertiary/5 border border-tertiary/10 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left"><h3 className="font-bold text-tertiary flex items-center justify-center md:justify-start gap-2"><span className="material-symbols-outlined">warning</span>Deactivate Account</h3><p className="text-sm text-on-tertiary-fixed-variant mt-1">Once deactivated, you will no longer have access to the Askare clinical portal.</p></div>
            <button className="px-6 py-2.5 bg-tertiary text-on-tertiary text-sm font-bold rounded-xl hover:bg-tertiary-dim transition-all" onClick={() => setDeactivateModal(true)}>Request Deactivation</button>
          </div>
        </section>
      </div>

      {/* Deactivate Modal */}
      {deactivateModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setDeactivateModal(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-tertiary-container/30"><span className="material-symbols-outlined text-2xl text-tertiary">warning</span></div>
              <div><h2 className="text-lg font-bold text-on-surface">Deactivate Account?</h2><p className="text-sm text-secondary">Your account will be temporarily disabled.</p></div>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">You can reactivate your account at any time by contacting support. All patient data will be securely preserved.</p>
            <div className="flex gap-3 justify-end">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 transition-all" onClick={() => setDeactivateModal(false)}>Cancel</button>
              <button className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-tertiary text-on-tertiary hover:opacity-90 transition-all" onClick={() => { setDeactivateModal(false); showToast('Account deactivation request submitted.') }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[90]">
          <div className="bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span><span>{toast}</span>
          </div>
        </div>
      )}
    </main>
  )
}
