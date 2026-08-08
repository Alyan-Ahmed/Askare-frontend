import { useState } from 'react'

const COUNTRY_CODES = [
  { code: '+92', country: 'Pakistan', maxLen: 10 },
  { code: '+93', country: 'Afghanistan', maxLen: 9 },
  { code: '+91', country: 'India', maxLen: 10 },
  { code: '+1', country: 'USA / Canada', maxLen: 10 },
  { code: '+44', country: 'United Kingdom', maxLen: 10 },
  { code: '+971', country: 'United Arab Emirates', maxLen: 9 },
  { code: '+966', country: 'Saudi Arabia', maxLen: 9 },
  { code: '+974', country: 'Qatar', maxLen: 8 },
]

function getMaxLen(code) {
  const entry = COUNTRY_CODES.find(c => c.code === code)
  return entry ? entry.maxLen : 10
}

const allowedCodeKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End']

function handleNumericCodeKeyDown(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (!/^\d$/.test(event.key) && !allowedCodeKeys.includes(event.key)) event.preventDefault()
}

export function Toggle({ checked, onChange, size = 'lg' }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" type="checkbox" />
      <div className={`${size === 'lg' ? 'w-11 h-6' : 'w-9 h-5'} bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full ${size === 'lg' ? 'after:h-5 after:w-5' : 'after:h-4 after:w-4'} after:transition-all ${size === 'lg' ? 'peer-checked:bg-primary' : 'peer-checked:bg-primary/80'}`}></div>
    </label>
  )
}

export function PhoneNumberField({
  id,
  label = 'Phone Number',
  code,
  onCodeChange,
  value,
  onChange,
  placeholder = '300 1234567',
  digitsOnly = false,
  exactLength = false,
}) {
  const maxLen = getMaxLen(code)
  const displayedValue = digitsOnly ? value.replace(/\D/g, '').slice(0, maxLen) : value

  const handleChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, maxLen)
    if (digitsOnly) {
      onChange(digits)
      return
    }
    if (digits.length <= maxLen) {
      onChange(event.target.value.replace(/[^\d\s-]/g, ''))
    } else {
      // Trim to max length (digits only count)
      let result = ''
      let digitCount = 0
      for (const ch of event.target.value) {
        if (/\d/.test(ch)) {
          if (digitCount < maxLen) { result += ch; digitCount++ }
        } else if (/[\s-]/.test(ch)) {
          result += ch
        }
      }
      onChange(result)
    }
  }

  const handleCodeChange = (event) => {
    const nextCode = event.target.value
    const nextMaxLen = getMaxLen(nextCode)
    onCodeChange(nextCode)
    if (digitsOnly) onChange(displayedValue.slice(0, nextMaxLen))
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-bold text-outline uppercase tracking-wider">{label}</label>
      <div className="flex overflow-hidden rounded-xl bg-surface-container-low ring-1 ring-transparent focus-within:ring-2 focus-within:ring-primary/20">
        <select
          aria-label={`${label} country code`}
          className="w-[7.25rem] shrink-0 border-0 border-r border-outline-variant/20 bg-surface-container-high px-3 py-3 text-sm font-bold text-primary focus:ring-0"
          value={code}
          onChange={handleCodeChange}
        >
          {COUNTRY_CODES.map((item) => (
            <option key={item.code} value={item.code}>{item.code}</option>
          ))}
        </select>
        <input
          id={id}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-on-surface placeholder:text-outline focus:ring-0"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={displayedValue}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={digitsOnly ? maxLen : maxLen + 3}
        />
      </div>
      <p className="text-[10px] text-outline mt-1">{exactLength ? 'Use exactly' : 'Max'} {maxLen} digits for {COUNTRY_CODES.find(c => c.code === code)?.country || 'selected country'}</p>
    </div>
  )
}

export function SecurityMethodCard({ enabled, onEnabledChange, icon, title, description, children }) {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${enabled ? 'border-primary/30 shadow-md shadow-primary/5' : 'border-outline-variant/15'}`}>
      <div
        className={`flex items-center justify-between gap-4 p-5 cursor-pointer transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-primary/8 to-primary/3' : 'bg-surface-container-lowest hover:bg-surface-container-low/50'}`}
        onClick={() => onEnabledChange(!enabled)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${enabled ? 'bg-primary text-on-primary shadow-sm shadow-primary/30' : 'bg-surface-container-high text-secondary'}`}>
            <span className="material-symbols-outlined text-xl" style={enabled ? {fontVariationSettings: '"FILL" 1'} : {}}>{icon}</span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-on-surface">{title}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${enabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>{enabled ? 'Active' : 'Off'}</span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Toggle checked={enabled} onChange={onEnabledChange} size="sm" />
        </div>
      </div>
      {enabled && (
        <div className="border-t border-outline-variant/10 bg-surface-container-lowest px-6 pb-6 pt-5" style={{animation: 'fadeIn 0.3s ease'}}>
          {children}
        </div>
      )}
    </div>
  )
}

export function AuthenticatorSetup() {
  const [authCode, setAuthCode] = useState('')
  const [authStatus, setAuthStatus] = useState(null) // null | 'success' | 'error'
  const [authMessage, setAuthMessage] = useState('')
  const [authSuccessTick, setAuthSuccessTick] = useState(0)

  const acceptAuthCode = () => {
    setAuthSuccessTick(tick => tick + 1)
    setAuthStatus('success')
    setAuthMessage('Authenticator verified successfully!')
    setTimeout(() => { setAuthStatus(null); setAuthMessage('') }, 4000)
  }

  const handleAuthCodeChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 6)
    setAuthCode(digits)
    setAuthStatus(null)
    setAuthMessage('')
  }

  const handleVerify = () => {
    const digits = authCode.replace(/\D/g, '')
    if (digits.length !== 6) {
      setAuthStatus('error')
      setAuthMessage('Please enter a valid 6-digit code.')
      return
    }
    acceptAuthCode()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings:'"FILL" 1'}}>shield</span>
        <p className="text-xs font-bold text-on-surface uppercase tracking-wider">Setup Authenticator</p>
      </div>
      <p className="text-xs text-secondary leading-relaxed">Scan the QR code below with <span className="font-semibold text-on-surface">Google Authenticator</span>, then enter the 6-digit verification code.</p>
      <div className="flex flex-col sm:flex-row items-stretch gap-6">
        <div className="w-36 h-36 bg-white rounded-2xl border-2 border-dashed border-primary/20 p-3 flex flex-col items-center justify-center shrink-0 relative group mx-auto sm:mx-0">
          <svg viewBox="0 0 100 100" className="w-24 h-24"><rect width="100" height="100" fill="white"/><g fill="#006977"><rect x="10" y="10" width="8" height="8"/><rect x="18" y="10" width="8" height="8"/><rect x="26" y="10" width="8" height="8"/><rect x="10" y="18" width="8" height="8"/><rect x="26" y="18" width="8" height="8"/><rect x="10" y="26" width="8" height="8"/><rect x="18" y="26" width="8" height="8"/><rect x="26" y="26" width="8" height="8"/><rect x="42" y="10" width="8" height="8"/><rect x="50" y="18" width="8" height="8"/><rect x="42" y="26" width="8" height="8"/><rect x="66" y="10" width="8" height="8"/><rect x="74" y="10" width="8" height="8"/><rect x="82" y="10" width="8" height="8"/><rect x="66" y="18" width="8" height="8"/><rect x="82" y="18" width="8" height="8"/><rect x="66" y="26" width="8" height="8"/><rect x="74" y="26" width="8" height="8"/><rect x="82" y="26" width="8" height="8"/><rect x="10" y="42" width="8" height="8"/><rect x="26" y="42" width="8" height="8"/><rect x="42" y="42" width="8" height="8"/><rect x="58" y="42" width="8" height="8"/><rect x="74" y="42" width="8" height="8"/><rect x="18" y="50" width="8" height="8"/><rect x="34" y="50" width="8" height="8"/><rect x="50" y="50" width="8" height="8"/><rect x="66" y="50" width="8" height="8"/><rect x="82" y="50" width="8" height="8"/><rect x="10" y="66" width="8" height="8"/><rect x="18" y="66" width="8" height="8"/><rect x="26" y="66" width="8" height="8"/><rect x="42" y="66" width="8" height="8"/><rect x="58" y="66" width="8" height="8"/><rect x="74" y="66" width="8" height="8"/><rect x="10" y="74" width="8" height="8"/><rect x="26" y="74" width="8" height="8"/><rect x="50" y="74" width="8" height="8"/><rect x="66" y="74" width="8" height="8"/><rect x="82" y="74" width="8" height="8"/><rect x="10" y="82" width="8" height="8"/><rect x="18" y="82" width="8" height="8"/><rect x="26" y="82" width="8" height="8"/><rect x="42" y="82" width="8" height="8"/><rect x="58" y="82" width="8" height="8"/><rect x="74" y="82" width="8" height="8"/></g></svg>
          <p className="text-[9px] text-secondary mt-1 font-semibold">Scan with app</p>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Enter 6-digit Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className={`w-full bg-surface-container-low border rounded-xl px-4 py-3.5 text-on-surface text-center text-xl font-bold tracking-[0.6em] focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300 ${authStatus === 'error' ? 'border-error/50' : authStatus === 'success' ? 'border-green-500/50 scale-[1.02] shadow-lg shadow-green-500/10' : 'border-outline-variant/20'}`}
              placeholder="• • • • • •"
              value={authCode}
              onChange={handleAuthCodeChange}
              onKeyDown={handleNumericCodeKeyDown}
            />
          </div>
          {authMessage && (
            <div key={authStatus === 'success' ? authSuccessTick : 'auth-error'} className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${authStatus === 'success' ? 'bg-green-50 text-green-600 animate-slide-up' : 'bg-error-container/10 text-error'}`}>
              <span className="material-symbols-outlined text-sm" style={authStatus === 'success' ? {fontVariationSettings:'"FILL" 1'} : {}}>{authStatus === 'success' ? 'check_circle' : 'error'}</span>
              {authMessage}
            </div>
          )}
          <div className="rounded-xl bg-surface-container-low/70 px-4 py-3 flex items-center gap-3 border border-outline-variant/10">
            <span className="material-symbols-outlined text-primary text-lg">key</span>
            <div>
              <p className="text-[9px] text-secondary font-semibold uppercase tracking-wider">Manual Setup Key</p>
              <p className="font-mono font-bold text-on-surface text-sm tracking-wider">ASKR-42HD-9Q2P</p>
            </div>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button" onClick={handleVerify}>
            <span className="material-symbols-outlined text-base">verified</span>Verify Code
          </button>
        </div>
      </div>
    </div>
  )
}

export function SmsVerificationSetup({ code, onCodeChange, phone, onPhoneChange }) {
  const [smsSent, setSmsSent] = useState(false)
  const [smsCode, setSmsCode] = useState('')
  const [smsStatus, setSmsStatus] = useState(null) // null | 'success' | 'error'
  const [smsMessage, setSmsMessage] = useState('')
  const [smsSuccessTick, setSmsSuccessTick] = useState(0)

  const handleSendCode = () => {
    const digits = phone.replace(/\D/g, '')
    const maxLen = getMaxLen(code)
    if (digits.length !== maxLen) {
      setSmsStatus('error')
      setSmsMessage(`Please enter exactly ${maxLen} digits for this country.`)
      setTimeout(() => { setSmsStatus(null); setSmsMessage('') }, 4000)
      return
    }
    setSmsSent(true)
    setSmsStatus('success')
    setSmsMessage(`Verification code sent to ${code} ${digits}`)
    setTimeout(() => { setSmsStatus(null); setSmsMessage('') }, 4000)
  }

  const acceptSmsCode = () => {
    setSmsSuccessTick(tick => tick + 1)
    setSmsStatus('success')
    setSmsMessage('Phone number verified successfully!')
    setTimeout(() => { setSmsStatus(null); setSmsMessage('') }, 4000)
  }

  const handleSmsCodeChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 6)
    setSmsCode(digits)
    setSmsStatus(null)
    setSmsMessage('')
  }

  const handleVerifySms = () => {
    const digits = smsCode.replace(/\D/g, '')
    if (digits.length !== 6) {
      setSmsStatus('error')
      setSmsMessage('Please enter the 6-digit code sent to your phone.')
      setTimeout(() => { setSmsStatus(null); setSmsMessage('') }, 4000)
      return
    }
    acceptSmsCode()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings:'"FILL" 1'}}>sms</span>
        <p className="text-xs font-bold text-on-surface uppercase tracking-wider">SMS Verification</p>
      </div>
      <p className="text-xs text-secondary leading-relaxed">Enter your mobile number below. We'll send a verification code via SMS to confirm your identity.</p>
      <PhoneNumberField
        id="sms-verification-phone"
        label="Mobile Number"
        code={code}
        onCodeChange={onCodeChange}
        value={phone}
        onChange={onPhoneChange}
        placeholder="3001234567"
        digitsOnly
        exactLength
      />
      {!smsSent ? (
        <button className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button" onClick={handleSendCode}>
          <span className="material-symbols-outlined text-base">send</span>Send Verification Code
        </button>
      ) : (
        <div className="space-y-4" style={{animation: 'fadeIn 0.3s ease'}}>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Enter 6-digit SMS Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className={`w-full bg-surface-container-low border rounded-xl px-4 py-3.5 text-on-surface text-center text-xl font-bold tracking-[0.6em] focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300 ${smsStatus === 'error' ? 'border-error/50' : smsStatus === 'success' ? 'border-green-500/50 scale-[1.02] shadow-lg shadow-green-500/10' : 'border-outline-variant/20'}`}
              placeholder="• • • • • •"
              value={smsCode}
              onChange={handleSmsCodeChange}
              onKeyDown={handleNumericCodeKeyDown}
            />
          </div>
          {smsMessage && (
            <div key={smsStatus === 'success' ? smsSuccessTick : 'sms-error'} className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${smsStatus === 'success' ? 'bg-green-50 text-green-600 animate-slide-up' : 'bg-error-container/10 text-error'}`}>
              <span className="material-symbols-outlined text-sm" style={smsStatus === 'success' ? {fontVariationSettings:'"FILL" 1'} : {}}>{smsStatus === 'success' ? 'check_circle' : 'error'}</span>
              {smsMessage}
            </div>
          )}
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button" onClick={handleVerifySms}>
              <span className="material-symbols-outlined text-base">verified</span>Verify Code
            </button>
            <button className="px-4 py-3 rounded-xl font-bold text-sm bg-surface-container-low text-primary border border-outline-variant/20 hover:bg-surface-container-high transition-all" type="button" onClick={handleSendCode}>
              Resend
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
