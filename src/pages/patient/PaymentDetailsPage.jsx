import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const FALLBACK = {
  name: 'Dr. Sarah Ahmed', spec: 'Senior Cardiologist', price: 'PKR 5,000',
  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByqOGyPGftclHQtyAp1Q-17KPD3p7Qyb1D5iaLF4OZCb7C9O5BPhY0mG5iBmAaXyDCao96gEM9RTebdDlfJOkW31hPzqzufgyoozbGBixe6NXmQ6i2VN3RdaDp03ucRrJaP-7x9JsYF10agqIaQgvH11mW7JCYxL-AbfpyBybPSsK91HSGWFcktOIVDcC3w2Sb8pQqO9V-Egb66Gk4DH2QCDmHchOhEWAz2qnlGVQdTR6gUQAhM02f8s-vu9_8ZfESJ_0dgYJ4rIY',
}

export default function PaymentDetailsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state || {}
  const doc = { ...FALLBACK, ...(booking.doctor || {}) }
  const bookDate = booking.date || 'Oct 24, 2026'
  const bookTime = booking.time || '10:00 AM'

  const [method, setMethod] = useState(null)
  const [payError, setPayError] = useState('')
  const cardRef = useRef(null)
  const expiryRef = useRef(null)
  const cvvRef = useRef(null)

  const formatCard = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 16) val = val.substring(0, 16)
    e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  const formatExpiry = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 2) {
      let mm = parseInt(val.slice(0, 2), 10)
      if (mm > 12) val = '12' + val.slice(2)
      if (mm === 0 && val.length >= 2) val = '01' + val.slice(2)
      e.target.value = val.slice(0, 2) + '/' + val.slice(2)
    } else e.target.value = val
  }
  const formatCvv = (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3) }
  const formatName = (e) => { e.target.value = e.target.value.replace(/[^a-zA-Z\s\-'\.]/g, '') }

  return (
    <main className="pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <header className="mb-16 max-w-3xl reveal">
        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Secure Checkout</span>
        <h1 className="text-5xl font-medium tracking-tight text-on-surface leading-tight">Complete your <span className="text-primary italic">Askare</span> session.</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8 reveal reveal-delay-1">
          {/* Booking Summary */}
          <section className="bg-surface-container-low rounded-xl p-8">
            {booking.missedReschedule && (
              <div className="mb-6 rounded-xl border border-error/20 bg-error-container/10 px-4 py-3 text-sm text-error flex items-start gap-3">
                <span className="material-symbols-outlined text-lg mt-0.5">warning</span>
                <span>This reschedule requires a new payment because the previous appointment was missed.</span>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
                  <img alt={doc.name} className="w-full h-full object-cover object-top" src={doc.img} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-on-surface">Video Consultation</h3>
                  <p className="text-secondary">{doc.name} • {doc.spec}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-label-md font-bold text-primary tracking-wider uppercase">{bookDate.toUpperCase()} AT {bookTime}<br /><span className="block mt-1">LIVE SESSION SCHEDULED</span></span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-label-md text-on-surface-variant uppercase tracking-widest mb-1">Total Fee</p>
                <p className="text-3xl font-bold text-primary">{doc.price}</p>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold tracking-tight">Payment Method</h2>
              <div className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-secondary uppercase tracking-widest">SSL Encrypted</div>
            </div>

            {/* Debit/Credit */}
            <div className={`bg-surface-container-low rounded-xl p-8 border cursor-pointer transition-colors ${method === 'debit' ? 'border-primary/30' : 'border-outline-variant/10'}`} onClick={() => setMethod('debit')}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center"><span className="material-symbols-outlined text-secondary">credit_card</span></div>
                <div><h4 className="font-bold text-lg text-on-surface">Debit / Credit Card</h4><p className="text-sm text-secondary">Securely pay with Visa, Mastercard, or UnionPay</p></div>
                <div className="ml-auto">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'debit' ? 'border-primary bg-primary' : 'border-outline-variant/30'}`}>
                    <div className={`w-2 h-2 rounded-full bg-white ${method === 'debit' ? '' : 'opacity-0'}`}></div>
                  </div>
                </div>
              </div>
              <div className={`space-y-4 pt-4 border-t border-outline-variant/10 overflow-hidden transition-all duration-400 ${method === 'debit' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pt-0 border-t-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Cardholder Name</label><input data-pay="name" className="w-full bg-white border border-outline-variant/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter name as on card" type="text" onInput={formatName} /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Card Number</label><div className="relative"><input ref={cardRef} onInput={formatCard} className="w-full bg-white border border-outline-variant/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pl-12" placeholder="0000 0000 0000 0000" type="text" maxLength="19" inputMode="numeric" /><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">credit_card</span></div></div>
                  <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Expiry Date (MM/YY)</label><input ref={expiryRef} onInput={formatExpiry} className="w-full bg-white border border-outline-variant/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="MM/YY" type="text" maxLength="5" inputMode="numeric" /></div>
                  <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">CVV</label><input ref={cvvRef} onInput={formatCvv} className="w-full bg-white border border-outline-variant/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="123" type="password" maxLength="3" inputMode="numeric" /></div>
                </div>
              </div>
            </div>

            {/* Crypto */}
            <div className={`bg-surface-container-low rounded-xl p-8 border cursor-pointer transition-colors ${method === 'crypto' ? 'border-primary/30' : 'border-outline-variant/10'}`} onClick={() => setMethod('crypto')}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center"><span className="material-symbols-outlined text-on-primary-container">currency_bitcoin</span></div>
                <div><h4 className="font-bold text-lg text-on-surface">Cryptocurrency</h4><p className="text-sm text-secondary">Pay with BTC, ETH, or USDT via secure gateway</p></div>
                <div className="ml-auto">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'crypto' ? 'border-primary bg-primary' : 'border-outline-variant/30'}`}>
                    <div className={`w-2 h-2 rounded-full bg-white ${method === 'crypto' ? '' : 'opacity-0'}`}></div>
                  </div>
                </div>
              </div>
              <div className={`space-y-6 pt-4 border-t border-outline-variant/10 overflow-hidden transition-all duration-400 ${method === 'crypto' ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pt-0 border-t-0'}`}>
                <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Select Currency</label>
                  <select className="w-full bg-white border border-outline-variant/20 rounded-lg p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer text-on-surface hover:shadow-sm transition-all"><option>Bitcoin (BTC)</option><option>Ethereum (ETH)</option><option>Tether (USDT)</option></select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center justify-center bg-white rounded-xl p-6 border border-dashed border-outline-variant/30">
                    <div className="w-32 h-32 bg-surface-container-low rounded-lg flex items-center justify-center mb-4"><span className="material-symbols-outlined text-5xl text-outline-variant/40">qr_code_2</span></div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Scan QR to Pay</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Wallet Address</label>
                    <div className="relative">
                      <input className="w-full bg-white border border-outline-variant/20 rounded-lg p-4 pr-12 focus:ring-2 focus:ring-primary/20 text-on-surface text-sm font-mono truncate" readOnly type="text" defaultValue="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-container-high rounded-md transition-colors text-primary"><span className="material-symbols-outlined text-xl">content_copy</span></button>
                    </div>
                    <p className="mt-3 text-[10px] text-on-surface-variant leading-relaxed">Only send BTC to this address. Sending other coins may result in permanent loss.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 reveal reveal-delay-2">
          <div className="sticky top-28 space-y-8">
            <div className="bg-surface-container-low rounded-xl p-8">
              <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Payment Summary</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between text-on-surface"><span className="opacity-70">Consultation Fee</span><span>{doc.price}</span></li>
                <li className="flex justify-between text-on-surface"><span className="opacity-70">Service Charge</span><span>PKR 0.00</span></li>
                <li className="flex justify-between text-on-surface"><span className="opacity-70">VAT (Clinical)</span><span>Included</span></li>
              </ul>
              <div className="pt-6 border-t border-outline-variant/20 mb-8">
                <div className="flex justify-between items-baseline"><span className="font-bold text-lg">Amount Payable</span><span className="text-3xl font-bold text-primary">{doc.price}</span></div>
              </div>
              {payError && <div className="bg-error-container/10 text-error border border-error/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-lg">error</span>{payError}</div>}
              <button onClick={() => {
                setPayError('')
                if (!method) { setPayError('Please select a payment method.'); return }
                if (method === 'debit') {
                  const name = document.querySelector('[data-pay="name"]')?.value?.trim()
                  const card = cardRef.current?.value?.replace(/\s/g,'')
                  const expiry = expiryRef.current?.value?.trim()
                  const cvv = cvvRef.current?.value?.trim()
                  if (!name) { setPayError('Please enter cardholder name.'); return }
                  if (/[0-9]/.test(name)) { setPayError('Cardholder name cannot contain numbers.'); return }
                  if (!card || card.length < 16) { setPayError('Please enter a valid 16-digit card number.'); return }
                  if (!expiry || expiry.length < 5) { setPayError('Please enter expiry date (MM/YY).'); return }
                  if (!cvv || cvv.length < 3) { setPayError('Please enter a 3-digit CVV.'); return }
                }
                navigate('/payment-confirmation', { state: { doctor: doc, date: bookDate, time: bookTime } })
              }} className="w-full bg-primary hover:bg-primary-dim text-on-primary py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>lock</span> Confirm &amp; Pay Securely
              </button>
              <p className="mt-6 text-center text-xs text-on-surface-variant leading-relaxed">By completing this payment, you agree to Askare's medical service agreement and privacy protocols.</p>
              <div className="mt-10 p-4 bg-surface-container-high rounded-lg flex gap-4">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <div className="text-xs leading-relaxed"><span className="font-bold block mb-1">HIPAA Compliant</span>Your data and financial information are protected by world-class encryption.</div>
              </div>
            </div>
            <div className="p-6 border border-outline-variant/10 rounded-xl">
              <h5 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-4">Need Assistance?</h5>
              <div className="space-y-3">
                <Link className="flex items-center gap-3 text-sm text-primary font-medium hover:underline" to="/contact"><span className="material-symbols-outlined text-base">support_agent</span>Contact Support</Link>
                <Link className="flex items-center gap-3 text-sm text-primary font-medium hover:underline" to="/contact"><span className="material-symbols-outlined text-base">help</span>Payment FAQ</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

