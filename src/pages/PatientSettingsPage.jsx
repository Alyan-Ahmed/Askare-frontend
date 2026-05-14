import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function PatientSettingsPage() {
  const [twoFA, setTwoFA] = useState(true)
  const [authApp, setAuthApp] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [privacy, setPrivacy] = useState('Limited')
  const [showPwCurrent, setShowPwCurrent] = useState(false)
  const [showPwNew, setShowPwNew] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null) // 'deactivate' | 'delete' | null
  const [toast, setToast] = useState(null)
  const { user } = useAuth()
  const profileName = user?.name || 'Alyan Ahmed'
  const profileEmail = user?.email || 'alyan.patient@askare.com'
  const profileAvatar = user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAox2cELp727nc8F0QqlouZa__6ZAv4-XcyEzgKe10NFebkQZ6zwt1AVi5A40vtPQlgILrsZO4LEBhgNSHYHes6nqyU_4kjT4LRk4umkaWEpp9o_VpetLVnbbB9Zd2jNVNrpUvg_5U6PulVe0fwMTqmJQ8iB76aIZ86NAX_D7f-WEhXXum1-y8GdUP44sNRoZKGW9TEuwIYHcU_HCp90mV_Ha_VHzhFzOMyeHQw2z7EjJ1H95UUmUeqoJLIy7TscjeCBzVcGXi2ZYY'

  useEffect(() => {
    if (confirmModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const handler = (e) => { if (e.key === 'Escape') setConfirmModal(null) }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [confirmModal])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const handleConfirm = () => {
    setConfirmModal(null)
    showToast(confirmModal === 'deactivate' ? 'Account deactivated. You can reactivate by logging in.' : 'Account deletion request submitted.')
  }

  return (
    <main className="flex-grow pt-32 pb-20 px-6 max-w-3xl mx-auto w-full">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">Settings</h1>
          <p className="text-secondary mt-1">Manage your account and preferences.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-low text-on-surface-variant px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/20" onClick={() => window.location.reload()}>Discard</button>
          <button className="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95" onClick={() => showToast('Settings saved successfully!')}>Save</button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Account */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Account Details</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-8 space-y-6">
            <div className="flex items-center space-x-6 pb-6 border-b border-surface-container">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img alt={`${profileName} profile`} className="w-full h-full object-cover" src={profileAvatar} />
                </div>
                <button className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-surface-container-lowest"><span className="material-symbols-outlined text-xs">edit</span></button>
              </div>
              <div><p className="text-lg font-bold">{profileName}</p><p className="text-sm text-secondary">Verified Healthcare Practitioner</p></div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Full Name</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="text" defaultValue={profileName} /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Email Address</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="email" defaultValue={profileEmail} /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Phone Number</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="tel" defaultValue="+92 300 1234567" /></div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Security</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 divide-y divide-surface-container">
            {/* Change Password */}
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">lock_reset</span>Change Password</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Current Password" type={showPwCurrent ? 'text' : 'password'} />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPwCurrent(!showPwCurrent)}><span className="material-symbols-outlined text-xl">{showPwCurrent ? 'visibility_off' : 'visibility'}</span></button>
                </div>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20" placeholder="New Password" type={showPwNew ? 'text' : 'password'} />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPwNew(!showPwNew)}><span className="material-symbols-outlined text-xl">{showPwNew ? 'visibility_off' : 'visibility'}</span></button>
                </div>
              </div>
            </div>

            {/* 2FA Toggle */}
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="mt-1"><span className="material-symbols-outlined text-primary">security</span></div>
                <div><p className="font-bold">Two-Factor Authentication</p><p className="text-sm text-secondary">Enhance security with a secondary verification method.</p></div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* 2FA Options */}
            <div className={`px-8 pb-6 space-y-4 border-t border-surface-container pt-4 ${!twoFA ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              {/* Auth App */}
              <div className="flex items-center justify-between pl-8">
                <div className="flex items-center space-x-4">
                  <span className="material-symbols-outlined text-secondary text-xl">phone_iphone</span>
                  <div><p className="text-sm font-bold">Authenticator App</p><p className="text-[11px] text-secondary">Use Google Authenticator or Authy.</p></div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={authApp} onChange={(e) => setAuthApp(e.target.checked)} className="sr-only peer" type="checkbox" />
                  <div className="w-9 h-5 bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/80"></div>
                </label>
              </div>
              {authApp && (
                <div className="pl-12 pb-4 space-y-4">
                  <div className="bg-surface-container-low p-6 rounded-xl max-w-md">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Scan QR Code</p>
                    <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-outline-variant/20 mb-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full"><rect fill="#000" x="10" y="10" width="25" height="25" rx="2"/><rect fill="#fff" x="14" y="14" width="17" height="17" rx="1"/><rect fill="#000" x="17" y="17" width="11" height="11" rx="1"/><rect fill="#000" x="65" y="10" width="25" height="25" rx="2"/><rect fill="#fff" x="69" y="14" width="17" height="17" rx="1"/><rect fill="#000" x="72" y="17" width="11" height="11" rx="1"/><rect fill="#000" x="10" y="65" width="25" height="25" rx="2"/><rect fill="#fff" x="14" y="69" width="17" height="17" rx="1"/><rect fill="#000" x="17" y="72" width="11" height="11" rx="1"/><rect fill="#000" x="40" y="10" width="5" height="5"/><rect fill="#000" x="50" y="10" width="5" height="5"/><rect fill="#000" x="40" y="40" width="5" height="5"/><rect fill="#000" x="50" y="45" width="5" height="5"/><rect fill="#000" x="70" y="55" width="5" height="5"/><rect fill="#000" x="80" y="50" width="5" height="5"/><rect fill="#000" x="75" y="65" width="5" height="5"/><rect fill="#000" x="65" y="75" width="5" height="5"/><rect fill="#000" x="85" y="70" width="5" height="5"/><rect fill="#000" x="80" y="85" width="5" height="5"/></svg>
                    </div>
                    <p className="text-xs text-center text-secondary mb-3">Scan this QR code with your authentication app</p>
                    <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Or enter key manually</label><div className="flex gap-2"><input className="flex-1 bg-surface-container border-none rounded-lg px-3 py-2 text-xs text-on-surface font-mono" defaultValue="ASKR-P8SC-K2MX-7N4Q" readOnly /><button className="text-xs font-bold text-primary px-3 py-2 bg-primary-container/20 rounded-lg hover:bg-primary-container/40">Copy</button></div></div>
                    <div className="mt-4 space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Verification Code</label><div className="flex gap-2"><input className="flex-1 bg-surface-container border-none rounded-lg px-3 py-2 text-sm text-on-surface text-center tracking-[0.5em] font-mono" placeholder="000000" maxLength="6" /><button className="text-xs font-bold text-on-primary bg-primary px-4 py-2 rounded-lg hover:bg-primary-dim">Verify</button></div></div>
                  </div>
                </div>
              )}

              {/* SMS */}
              <div className="flex items-center justify-between pl-8">
                <div className="flex items-center space-x-4">
                  <span className="material-symbols-outlined text-secondary text-xl">sms</span>
                  <div><p className="text-sm font-bold">SMS Verification</p><p className="text-[11px] text-secondary">Receive a code via text message.</p></div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} className="sr-only peer" type="checkbox" />
                  <div className="w-9 h-5 bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/80"></div>
                </label>
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
              <div className="flex items-center space-x-4"><span className="material-symbols-outlined text-secondary">alternate_email</span><div><p className="font-bold">Email Alerts</p><p className="text-xs text-secondary">Daily summaries and critical alerts.</p></div></div>
              <input checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox" />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4"><span className="material-symbols-outlined text-secondary">sms</span><div><p className="font-bold">SMS Notifications</p><p className="text-xs text-secondary">Urgent appointment changes.</p></div></div>
              <input checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox" />
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4 min-w-0 flex-1"><span className="material-symbols-outlined text-secondary shrink-0">visibility</span><div className="min-w-0"><p className="font-bold">Data Privacy</p><p className="text-xs text-secondary">Clinical research sharing visibility.</p></div></div>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} className="bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/20 text-on-surface shrink-0 min-w-[100px]"><option>Private</option><option>Limited</option><option>Open</option></select>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-8">
          <div className="bg-error-container/10 border border-error/20 rounded-2xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h3 className="font-bold text-tertiary flex items-center gap-2"><span className="material-symbols-outlined">pause_circle</span>Deactivate Account</h3><p className="text-sm text-secondary mt-1">Temporarily disable your account. You can reactivate anytime.</p></div>
              <button className="text-tertiary font-bold text-sm px-6 py-2 border border-tertiary/30 rounded-xl hover:bg-tertiary/5 transition-all" onClick={() => setConfirmModal('deactivate')}>Deactivate</button>
            </div>
            <div className="border-t border-error/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h3 className="font-bold text-error flex items-center gap-2"><span className="material-symbols-outlined">warning</span>Delete Account Permanently</h3><p className="text-sm text-secondary mt-1">Permanently delete your profile and medical history. This action cannot be undone.</p></div>
              <button className="text-error font-bold text-sm px-6 py-2 border border-error/30 rounded-xl hover:bg-error/5 transition-all" onClick={() => setConfirmModal('delete')}>Delete Account</button>
            </div>
          </div>
        </section>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setConfirmModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmModal === 'deactivate' ? 'bg-tertiary-container/30' : 'bg-error-container/20'}`}>
                <span className={`material-symbols-outlined text-2xl ${confirmModal === 'deactivate' ? 'text-tertiary' : 'text-error'}`}>{confirmModal === 'deactivate' ? 'pause_circle' : 'delete_forever'}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">{confirmModal === 'deactivate' ? 'Deactivate Account?' : 'Delete Account Permanently?'}</h2>
                <p className="text-sm text-secondary">{confirmModal === 'deactivate' ? 'Your account will be temporarily disabled.' : 'This action is irreversible.'}</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">{confirmModal === 'deactivate' ? 'You can reactivate your account at any time by logging in again. Your data will be preserved during deactivation.' : 'All your medical records, consultation history, prescriptions, and personal data will be permanently erased. This cannot be undone.'}</p>
            <div className="flex gap-3 justify-end">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 transition-all" onClick={() => setConfirmModal(null)}>Cancel</button>
              <button className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${confirmModal === 'deactivate' ? 'bg-tertiary text-on-tertiary hover:opacity-90' : 'bg-error text-on-error hover:opacity-90'}`} onClick={handleConfirm}>{confirmModal === 'deactivate' ? 'Deactivate' : 'Delete Forever'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[90]">
          <div className="bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </main>
  )
}
