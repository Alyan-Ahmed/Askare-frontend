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
    <div className={`rounded-xl border overflow-hidden transition-all ${enabled ? 'border-primary/25 bg-primary/5' : 'border-outline-variant/15 bg-surface-container-lowest'}`}>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${enabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-on-surface">{title}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${enabled ? 'bg-primary-container/70 text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>{enabled ? 'On' : 'Off'}</span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">{description}</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={onEnabledChange} size="sm" />
      </div>
      {enabled && (
        <div className="border-t border-outline-variant/10 bg-surface-container-lowest/80 px-5 pb-5 pt-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}

export function AuthenticatorSetup() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-secondary">Scan the QR code with Google Authenticator or Authy, then enter the 6-digit code.</p>
      <div className="flex flex-col sm:flex-row items-stretch gap-5">
        <div className="w-32 h-32 bg-white rounded-xl border border-outline-variant/20 p-3 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '5rem', lineHeight: 1 }}>qr_code_2</span>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-center text-lg font-bold tracking-[0.5em] focus:ring-2 focus:ring-primary/20"
              placeholder="000000"
              onKeyDown={(event) => { if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight|Delete/.test(event.key)) event.preventDefault() }}
            />
          </div>
          <div className="rounded-lg bg-surface-container-low px-3 py-2 text-[11px] text-secondary">
            Setup key: <span className="font-mono font-bold text-on-surface">ASKR-42HD-9Q2P</span>
          </div>
          <button className="w-full py-2.5 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all" type="button">Verify Code</button>
        </div>
      </div>
    </div>
  )
}

export function SmsVerificationSetup({ code, onCodeChange, phone, onPhoneChange }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-secondary">Choose a country code and enter the rest of the mobile number to receive SMS verification codes.</p>
      <PhoneNumberField
        id="sms-verification-phone"
        label="Mobile Number"
        code={code}
        onCodeChange={onCodeChange}
        value={phone}
        onChange={onPhoneChange}
        placeholder="300 1234567"
      />
      <button className="w-full py-2.5 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-all" type="button">Send Verification Code</button>
    </div>
  )
}
