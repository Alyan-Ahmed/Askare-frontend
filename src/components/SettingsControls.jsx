const COUNTRY_CODES = [
  { code: '+92', country: 'Pakistan' },
  { code: '+93', country: 'Afghanistan' },
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA / Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+974', country: 'Qatar' },
]

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
}) {
  const handleChange = (event) => {
    onChange(event.target.value.replace(/[^\d\s-]/g, ''))
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-bold text-outline uppercase tracking-wider">{label}</label>
      <div className="flex overflow-hidden rounded-xl bg-surface-container-low ring-1 ring-transparent focus-within:ring-2 focus-within:ring-primary/20">
        <select
          aria-label={`${label} country code`}
          className="w-[7.25rem] shrink-0 border-0 border-r border-outline-variant/20 bg-surface-container-high px-3 py-3 text-sm font-bold text-primary focus:ring-0"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
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
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
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
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings:'"FILL" 1'}}>shield</span>
        <p className="text-xs font-bold text-on-surface uppercase tracking-wider">Setup Authenticator</p>
      </div>
      <p className="text-xs text-secondary leading-relaxed">Scan the QR code below with <span className="font-semibold text-on-surface">Google Authenticator</span> or <span className="font-semibold text-on-surface">Authy</span>, then enter the 6-digit verification code.</p>
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
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface text-center text-xl font-bold tracking-[0.6em] focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              placeholder="• • • • • •"
              onKeyDown={(event) => { if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight|Delete/.test(event.key)) event.preventDefault() }}
            />
          </div>
          <div className="rounded-xl bg-surface-container-low/70 px-4 py-3 flex items-center gap-3 border border-outline-variant/10">
            <span className="material-symbols-outlined text-primary text-lg">key</span>
            <div>
              <p className="text-[9px] text-secondary font-semibold uppercase tracking-wider">Manual Setup Key</p>
              <p className="font-mono font-bold text-on-surface text-sm tracking-wider">ASKR-42HD-9Q2P</p>
            </div>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button">
            <span className="material-symbols-outlined text-base">verified</span>Verify Code
          </button>
        </div>
      </div>
    </div>
  )
}

export function SmsVerificationSetup({ code, onCodeChange, phone, onPhoneChange }) {
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
        placeholder="300 1234567"
      />
      <button className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button">
        <span className="material-symbols-outlined text-base">send</span>Send Verification Code
      </button>
    </div>
  )
}
