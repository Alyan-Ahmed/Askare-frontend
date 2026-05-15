import { Link, useLocation } from 'react-router-dom'

const FALLBACK = {
  name: 'Dr. Sarah Ahmed', spec: 'Senior Cardiologist', price: 'PKR 5,000',
  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnBbWu-4lovd0oPNpSSQQwkrEWAO4--f0lbKzKREZia_hBOWp0ndQe4lBj7xIM7Fcy43L36epitW-znbDbr5bnzaO-lp340Lub_gBEJ2aicEXd0OthglEMyWC0xoJp_1UTXE7VwEsk_V7A5T-JmhYg8y-AwTsAegMNP__j6ic7vxOW3zNAqSilv54s7reEfDitomNkel5LuleMWe59rjV1rrZ3OuZD9hzr2FvYMDFzHU_QOvZdz0PqviMK_B8baFxYRELYPs_SccY',
}

export default function PaymentConfirmationPage() {
  const location = useLocation()
  const booking = location.state || {}
  const doc = booking.doctor || FALLBACK
  const bookDate = booking.date || 'Oct 24, 2026'
  const bookTime = booking.time || '10:00 AM'
  const txId = `#ASK-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <main className="flex-grow pt-16 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 rounded-full mb-6">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
          </div>
          <h1 className="text-5xl font-medium text-on-surface tracking-tight mb-4">Payment Successful</h1>
          <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed">Your appointment has been confirmed. A detailed summary has been sent to your registered email.</p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 border border-outline-variant/10 shadow-[0_12px_32px_rgba(44,52,54,0.04)] relative overflow-hidden reveal reveal-delay-1">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <span className="material-symbols-outlined text-[120px]">verified</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left */}
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-2">Doctor Details</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden">
                    <img alt={doc.name} className="w-full h-full object-cover object-top" src={doc.img} />
                  </div>
                  <div><h3 className="text-xl font-semibold text-on-surface">{doc.name}</h3><p className="text-secondary font-medium">{doc.spec}</p></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-2">Schedule</p>
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span><span className="text-lg">{bookDate}</span><span className="text-outline-variant mx-1">•</span><span className="text-lg">{bookTime}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-2">Service Type</p>
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-secondary">videocam</span><span className="text-lg">Video Consultation</span>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="space-y-8 md:border-l md:border-outline-variant/10 md:pl-12">
              <div>
                <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-2">Payment Method</p>
                <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">credit_card</span><span className="font-medium">Debit Card **** 4242</span></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#006977]"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-2">Transaction Details</p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-secondary">Transaction ID</span><span className="font-mono text-on-surface">{txId}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">Amount Paid</span><span className="font-bold text-primary text-xl">{doc.price}</span></div>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex items-center gap-2 text-on-tertiary-container bg-tertiary-container/20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-sm">info</span><p className="text-xs">A receipt has been saved to your clinical vault.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 reveal reveal-delay-2">
          <Link to="/patient-dashboard" className="bg-primary text-on-primary px-10 py-4 rounded-xl text-lg font-semibold shadow-[0_8px_20px_rgba(0,105,119,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full md:w-auto text-center">Go to Dashboard</Link>
          <button className="flex items-center justify-center gap-2 bg-surface-container-high text-primary px-10 py-4 rounded-xl text-lg font-semibold hover:bg-surface-container-highest transition-all duration-300 w-full md:w-auto">
            <span className="material-symbols-outlined">download</span>Download Receipt
          </button>
        </div>
        <div className="mt-16 text-center">
          <p className="text-secondary text-sm">Need help with your appointment? <Link className="text-primary font-semibold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" to="/contact">Contact Support</Link></p>
        </div>
      </div>
    </main>
  )
}
