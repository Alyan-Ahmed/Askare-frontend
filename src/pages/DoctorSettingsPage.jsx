import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { user, updateUser, deleteAccount, deactivateAccount } = useAuth()
  const navigate = useNavigate()
  const [twoFA, setTwoFA] = useState(true)
  const [authApp, setAuthApp] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [urgentAlerts, setUrgentAlerts] = useState(false)
  const [showPwCurrent, setShowPwCurrent] = useState(false)
  const [showPwNew, setShowPwNew] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null)
  const [toast, setToast] = useState(null)

  // Editable fields
  const [editName, setEditName] = useState(user?.name || '')
  const [editEmail, setEditEmail] = useState(user?.email || '')
  const [editPhone, setEditPhone] = useState('')
  const [editSpecialty, setEditSpecialty] = useState('')
  const [editExperience, setEditExperience] = useState('')
  const [editBio, setEditBio] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [saveError, setSaveError] = useState('')
  const [specialtySearch, setSpecialtySearch] = useState('')
  const [specialtyOpen, setSpecialtyOpen] = useState(false)

  const profileAvatar = user?.avatar || ''

  useEffect(() => {
    if (confirmModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const handler = (e) => { if (e.key === 'Escape') { setConfirmModal(null); setSpecialtyOpen(false) } }
    const clickOut = (e) => { if (!e.target.closest('[data-specialty]')) setSpecialtyOpen(false) }
    document.addEventListener('keydown', handler)
    document.addEventListener('click', clickOut)
    return () => { document.removeEventListener('keydown', handler); document.removeEventListener('click', clickOut); document.body.style.overflow = '' }
  }, [confirmModal])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const pwChecks = {
    len: newPw.length >= 8,
    upper: /[A-Z]/.test(newPw),
    num: /[0-9]/.test(newPw),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPw),
  }
  const pwScore = Object.values(pwChecks).filter(Boolean).length

  const handleSave = () => {
    setSaveError('')
    if (!editName.trim()) { setSaveError('Name cannot be empty.'); return }
    if (!/^[a-zA-Z\s.]+$/.test(editName.trim())) { setSaveError('Name can only contain letters, spaces, and periods.'); return }
    if (!editEmail.trim()) { setSaveError('Email cannot be empty.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) { setSaveError('Please enter a valid email address.'); return }
    if (newPw) {
      if (!currentPw) { setSaveError('Please enter your current password.'); return }
      // Verify current password against stored password
      const tempUsers = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
      const storedUser = tempUsers.find(u => u.email === user?.email)
      if (storedUser && storedUser.password !== currentPw) { setSaveError('Current password is incorrect.'); return }
      if (!pwChecks.len || !pwChecks.upper || !pwChecks.num || !pwChecks.symbol) { setSaveError('New password does not meet all strength requirements.'); return }
    }
    // Update email/name/password in sessionStorage
    const tempUsers = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
    const idx = tempUsers.findIndex(u => u.email === user?.email)
    if (idx >= 0) {
      tempUsers[idx].name = editName.trim()
      tempUsers[idx].email = editEmail.trim()
      if (newPw && currentPw) { tempUsers[idx].password = newPw }
      sessionStorage.setItem('askare_temp_users', JSON.stringify(tempUsers))
    }
    updateUser({ name: editName.trim(), email: editEmail.trim() })
    setCurrentPw(''); setNewPw('')
    showToast('Settings saved successfully!')
  }

  const handleConfirm = () => {
    const action = confirmModal
    setConfirmModal(null)
    if (action === 'deactivate') {
      showToast('Account deactivated. You can log in again anytime.')
      setTimeout(() => { deactivateAccount(); navigate('/login') }, 1500)
    } else if (action === 'delete') {
      showToast('Account deleted permanently.')
      setTimeout(() => { deleteAccount(); navigate('/login') }, 1500)
    }
  }

  return (
    <main className="mb-16 flex-grow container max-w-3xl mx-auto px-6 lg:px-8 pt-24">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 reveal">
        <div><h1 className="text-3xl font-semibold text-primary tracking-tight">Account Settings</h1><p className="text-on-surface-variant mt-1">Manage your professional identity and security preferences.</p></div>
        <div className="flex gap-3">
          <button className="bg-surface-container-low text-on-surface-variant px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/20" onClick={() => window.location.reload()}>Discard</button>
          <button className="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95" onClick={handleSave}>Save</button>
        </div>
      </header>

      {saveError && (
        <div className="bg-error-container/10 text-error border border-error/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-lg">error</span>{saveError}
        </div>
      )}

      <div className="space-y-12 reveal reveal-delay-1">
        {/* Account Details */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Account Details</h2>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-surface-container">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
                  {profileAvatar ? <img alt="Profile" className="w-full h-full object-cover" src={profileAvatar} /> : <span className="material-symbols-outlined text-primary text-3xl">person</span>}
                </div>
              </div>
              <div><p className="text-lg font-bold">{editName || 'Your Name'}</p><p className="text-sm text-on-surface-variant">{editEmail || 'your@email.com'}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Full Name</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="text" value={editName} onChange={e => setEditName(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Professional Email</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Phone Number</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Enter phone number" /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Unique ID</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed font-mono tracking-wider" type="text" value={user?.uid || 'Not assigned'} readOnly disabled /></div>
            </div>
          </div>
        </section>

        {/* Professional Profile */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Professional Profile</h2>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 relative" data-specialty><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Medical Specialty</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 pr-10" type="text" value={editSpecialty || ''} placeholder="Search specialty..." onChange={e => { setEditSpecialty(e.target.value); setSpecialtySearch(e.target.value); setSpecialtyOpen(true) }} onFocus={() => setSpecialtyOpen(true)} />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">search</span>
                </div>
                {specialtyOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 z-50 max-h-56 overflow-y-auto py-1">
                    {['Allergist','Anesthesiologist','Cardiologist','Dermatologist','Emergency Medicine','Endocrinologist','ENT Specialist','Family Medicine','Gastroenterologist','General Practitioner','General Surgeon','Geriatrician','Gynecologist','Hematologist','Hepatologist','Immunologist','Infectious Disease','Internal Medicine','Nephrologist','Neurologist','Neurosurgeon','Obstetrician','Oncologist','Ophthalmologist','Oral Surgeon','Orthopedic Surgeon','Pathologist','Pediatrician','Physiatrist','Plastic Surgeon','Podiatrist','Psychiatrist','Pulmonologist','Radiologist','Rheumatologist','Sports Medicine','Urologist','Vascular Surgeon','Other'].filter(s => s.toLowerCase().includes((specialtySearch || '').toLowerCase())).map(s => (
                      <button key={s} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${editSpecialty === s ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`} onClick={() => { setEditSpecialty(s); setSpecialtyOpen(false); setSpecialtySearch('') }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Years of Experience</label><input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" type="number" min="0" max="60" value={editExperience} onChange={e => setEditExperience(e.target.value)} placeholder="e.g. 10" /></div>
            </div>
            <div className="space-y-1.5"><label className="text-[11px] font-bold text-outline uppercase tracking-wider">Professional Bio</label><textarea className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" rows="4" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Write a brief professional bio..." /></div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-outline">Security</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 divide-y divide-surface-container">
            <div className="p-8 space-y-4">
              <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">lock_reset</span>Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Current Password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} type={showPwCurrent ? 'text' : 'password'} />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPwCurrent(!showPwCurrent)}><span className="material-symbols-outlined text-xl">{showPwCurrent ? 'visibility_off' : 'visibility'}</span></button>
                </div>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20" placeholder="New Password" value={newPw} onChange={e => setNewPw(e.target.value)} type={showPwNew ? 'text' : 'password'} />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPwNew(!showPwNew)}><span className="material-symbols-outlined text-xl">{showPwNew ? 'visibility_off' : 'visibility'}</span></button>
                </div>
              </div>
              {newPw.length > 0 && (
                <div className="p-4 bg-surface-container-low rounded-xl space-y-3 border border-outline-variant/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface">Password Strength</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full transition-all duration-500 ${pwScore === 0 ? 'bg-gray-200 text-gray-500' : pwScore === 1 ? 'bg-red-100 text-red-600' : pwScore === 2 ? 'bg-orange-100 text-orange-600' : pwScore === 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                      {pwScore === 0 ? 'Too Weak' : ['Weak','Fair','Moderate','Strong'][pwScore - 1]}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pwScore === 1 ? 'bg-red-500' : pwScore === 2 ? 'bg-orange-500' : pwScore === 3 ? 'bg-yellow-500' : pwScore === 4 ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: `${pwScore * 25}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ key: 'len', label: '8+ Chars' }, { key: 'upper', label: 'Uppercase' }, { key: 'num', label: 'Number' }, { key: 'symbol', label: 'Symbol' }].map(c => (
                      <div key={c.key} className={`flex items-center gap-1.5 transition-all ${pwChecks[c.key] ? 'opacity-100' : 'opacity-50'}`}>
                        <span className={`material-symbols-outlined text-sm ${pwChecks[c.key] ? 'text-green-500' : 'text-gray-400'}`} style={pwChecks[c.key] ? { fontVariationSettings: "'FILL' 1" } : {}}>{pwChecks[c.key] ? 'check_circle' : 'radio_button_unchecked'}</span>
                        <span className="text-[10px]">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-start space-x-4"><div className="mt-1"><span className="material-symbols-outlined text-primary">security</span></div><div><p className="font-bold">Two-Factor Authentication</p><p className="text-sm text-on-surface-variant">Secure your account with an extra layer of protection.</p></div></div>
              <Toggle checked={twoFA} onChange={setTwoFA} />
            </div>
            <div className={`px-8 pb-6 space-y-3 border-t border-surface-container pt-4 transition-all duration-300 ${!twoFA ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              {/* Authenticator App */}
              <div className="rounded-xl border border-outline-variant/15 overflow-hidden">
                <div className="flex items-center justify-between p-4 pl-8 cursor-pointer hover:bg-surface-container-low/50 transition-colors" onClick={()=>setAuthApp(!authApp)}>
                  <div className="flex items-center space-x-4"><span className="material-symbols-outlined text-secondary text-xl">phone_iphone</span><div><p className="text-sm font-bold">Authenticator App</p><p className="text-[11px] text-secondary">Use Google Authenticator or Authy.</p></div></div>
                  <div className="flex items-center gap-3">
                    <div onClick={e=>e.stopPropagation()}><Toggle checked={authApp} onChange={setAuthApp} size="sm" /></div>
                    <span className={`material-symbols-outlined text-sm text-secondary transition-transform ${authApp?'rotate-180':''}`}>expand_more</span>
                  </div>
                </div>
                {authApp&&(
                  <div className="px-8 pb-4 pt-2 bg-surface-container-low/30 border-t border-outline-variant/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-base">verified</span><span className="text-on-surface font-medium">Status: <span className="text-green-600 font-bold">Active</span></span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-secondary text-base">smartphone</span><span className="text-on-surface-variant">Linked Device: Personal Phone</span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-secondary text-base">schedule</span><span className="text-on-surface-variant">Last verified: 2 hours ago</span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-secondary text-base">key</span><span className="text-on-surface-variant">Backup codes: 8 remaining</span></div>
                    <button className="text-xs font-bold text-primary hover:underline mt-1">Regenerate Backup Codes →</button>
                  </div>
                )}
              </div>
              {/* SMS Verification */}
              <div className="rounded-xl border border-outline-variant/15 overflow-hidden">
                <div className="flex items-center justify-between p-4 pl-8 cursor-pointer hover:bg-surface-container-low/50 transition-colors" onClick={()=>setSmsEnabled(!smsEnabled)}>
                  <div className="flex items-center space-x-4"><span className="material-symbols-outlined text-secondary text-xl">sms</span><div><p className="text-sm font-bold">SMS Verification</p><p className="text-[11px] text-secondary">Receive a code via text message.</p></div></div>
                  <div className="flex items-center gap-3">
                    <div onClick={e=>e.stopPropagation()}><Toggle checked={smsEnabled} onChange={setSmsEnabled} size="sm" /></div>
                    <span className={`material-symbols-outlined text-sm text-secondary transition-transform ${smsEnabled?'rotate-180':''}`}>expand_more</span>
                  </div>
                </div>
                {smsEnabled&&(
                  <div className="px-8 pb-4 pt-2 bg-surface-container-low/30 border-t border-outline-variant/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-base">verified</span><span className="text-on-surface font-medium">Status: <span className="text-green-600 font-bold">Active</span></span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-secondary text-base">call</span><span className="text-on-surface-variant">Phone: +92 3XX XXXXXXX</span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-secondary text-base">schedule</span><span className="text-on-surface-variant">Last SMS sent: Today at 09:15 AM</span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-secondary text-base">info</span><span className="text-on-surface-variant">Standard messaging rates may apply</span></div>
                    <button className="text-xs font-bold text-primary hover:underline mt-1">Update Phone Number →</button>
                  </div>
                )}
              </div>
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
          <div className="bg-error-container/10 border border-error/20 rounded-2xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h3 className="font-bold text-tertiary flex items-center gap-2"><span className="material-symbols-outlined">pause_circle</span>Deactivate Account</h3><p className="text-sm text-secondary mt-1">Temporarily disable your account. You can reactivate anytime.</p></div>
              <button className="text-tertiary font-bold text-sm px-6 py-2 border border-tertiary/30 rounded-xl hover:bg-tertiary/5 transition-all" onClick={() => setConfirmModal('deactivate')}>Deactivate</button>
            </div>
            <div className="border-t border-error/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h3 className="font-bold text-error flex items-center gap-2"><span className="material-symbols-outlined">warning</span>Delete Account Permanently</h3><p className="text-sm text-secondary mt-1">Permanently delete your profile and all data. This cannot be undone.</p></div>
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
            <p className="text-sm text-on-surface-variant mb-6">{confirmModal === 'deactivate' ? 'You can reactivate your account at any time by logging in again.' : 'All your data will be permanently erased. This cannot be undone.'}</p>
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
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span><span>{toast}</span>
          </div>
        </div>
      )}
    </main>
  )
}
