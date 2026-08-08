import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const apptSummaryData = {
  farooq: { doctor: 'Dr. Mariam Farooq', date: 'September 12, 2026', type: 'Pediatrics Consultation', typeIcon: 'child_care', notes: 'Routine pediatric check-up completed. Growth parameters within normal range. Vaccination schedule updated. Mild seasonal allergies noted — antihistamine prescribed for symptomatic relief.', medicines: [{ name: 'Cetirizine 5mg', dosage: 'Once daily (Evening)' }, { name: 'Saline Nasal Drops', dosage: 'As needed' }], followup: 'Next routine check-up in 6 months. Return immediately if fever persists more than 3 days.' },
  khalil: { doctor: 'Dr. Sarah Khalil', date: 'August 30, 2026', type: 'Cardiology Consultation', typeIcon: 'cardiology', notes: 'Patient did not attend the scheduled appointment. Rescheduling recommended for cardiac risk assessment follow-up.', medicines: [], followup: 'Please reschedule at your earliest convenience. Cardiac risk factors should be assessed within the next 2 weeks.' },
  raza: { doctor: 'Dr. Ahmed Raza', date: 'August 15, 2026', type: 'General Practice Visit', typeIcon: 'stethoscope', notes: 'Annual physical examination completed. Blood work ordered. BMI within healthy range. Blood pressure 122/78 mmHg — optimal. Cholesterol panel pending lab results.', medicines: [{ name: 'Multivitamin Complex', dosage: 'Once daily (With breakfast)' }, { name: 'Omega-3 Fish Oil 1000mg', dosage: 'Once daily (With meals)' }], followup: 'Return in 2 weeks for lab results review. Annual physical next year.' },
}

const initialUpcomingAppointments = [
  { id: 'khalil-upcoming', doc: 'Dr. Sarah Khalil', spec: 'Cardiology Specialist', date: 'October 24, 2026', time: '10:30 AM' },
  { id: 'raza-upcoming', doc: 'Dr. Ahmed Raza', spec: 'General Practitioner', date: 'October 28, 2026', time: '02:15 PM' },
]

const doctorAvailability = {
  'Dr. Mariam Farooq': [
    { date: 'October 25, 2026', time: '10:00 AM' },
    { date: 'October 27, 2026', time: '02:00 PM' },
    { date: 'October 30, 2026', time: '11:30 AM' },
  ],
  'Dr. Sarah Khalil': [
    { date: 'October 26, 2026', time: '09:00 AM' },
    { date: 'October 27, 2026', time: '10:30 AM' },
    { date: 'October 29, 2026', time: '04:00 PM' },
  ],
  'Dr. Ahmed Raza': [
    { date: 'October 29, 2026', time: '11:00 AM' },
    { date: 'October 30, 2026', time: '02:15 PM' },
    { date: 'November 2, 2026', time: '05:30 PM' },
  ],
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialUpcomingAppointments)
  const [modal, setModal] = useState(null)
  const [rescheduleModal, setRescheduleModal] = useState(null)
  const [cancelModal, setCancelModal] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [toast, setToast] = useState(null)
  const [isMissedReschedule, setIsMissedReschedule] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (modal || rescheduleModal || cancelModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const handler = (e) => {
      if (e.key === 'Escape') {
        setModal(null)
        setRescheduleModal(null)
        setCancelModal(null)
      }
    }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [modal, rescheduleModal, cancelModal])

  const data = modal ? apptSummaryData[modal] : null
  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000) }

  const openReschedule = (appointment) => {
    const slots = doctorAvailability[appointment.doc] || []
    setSelectedSlot(slots[0] || null)
    setRescheduleModal(appointment)
  }

  const confirmReschedule = () => {
    if (!rescheduleModal || !selectedSlot) return
    const docName = rescheduleModal.doc
    const isCompleted = rescheduleModal.id?.startsWith('completed-')
    if (isMissedReschedule || isCompleted) {
      setRescheduleModal(null)
      setIsMissedReschedule(false)
      navigate('/payment-details', { state: { doctor: { name: docName, spec: rescheduleModal.spec || 'Specialist', price: 'PKR 5,000' }, date: selectedSlot.date, time: selectedSlot.time, missedReschedule: isMissedReschedule } })
      return
    }
    setAppointments(prev => {
      const updated = prev.map(appt => (
        appt.id === rescheduleModal.id ? { ...appt, date: selectedSlot.date, time: selectedSlot.time } : appt
      ))
      if (updated.some(appt => appt.id === rescheduleModal.id)) return updated
      return [...updated, { ...rescheduleModal, date: selectedSlot.date, time: selectedSlot.time }]
    })
    setRescheduleModal(null)
    showToast('Appointment rescheduled successfully.')
  }

  const confirmCancel = () => {
    if (!cancelModal) return
    setAppointments(prev => prev.filter(appt => appt.id !== cancelModal.id))
    setCancelModal(null)
    showToast('Appointment cancelled. The payment is non-refundable.')
  }

  return (
    <div className="flex-1 px-4 md:px-12 py-6 md:py-10 max-w-7xl mx-auto w-full">
      <header className="mb-12 reveal">
        <h1 className="text-2xl md:text-4xl font-medium tracking-tight text-on-surface font-headline mb-2">My Appointments</h1>
        <div className="w-16 h-1 bg-primary rounded-full"></div>
      </header>

      {/* Upcoming */}
      <section className="flex flex-col gap-6 mb-16 reveal reveal-delay-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-on-surface flex items-center gap-3">
            Upcoming Appointments
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </h2>
          <Link to="/book-video-call" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Schedule New <span className="material-symbols-outlined text-lg">add</span>
          </Link>
        </div>
        {appointments.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-3">event_busy</span>
            <h3 className="text-lg font-bold text-on-surface">No upcoming meetings</h3>
            <p className="text-sm text-secondary mt-1">You do not have any scheduled appointments right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {appointments.map((a) => (
            <div key={a.id} className="bg-surface-container-lowest p-6 rounded-[1.5rem] border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-lg font-bold text-on-surface">{a.doc}</h3><p className="text-sm text-secondary font-medium">{a.spec}</p></div>
                <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold rounded-full tracking-wider uppercase">Confirmed</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant mb-6">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-lg">event</span><span className="text-sm font-medium">{a.date}</span></div>
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-lg">schedule</span><span className="text-sm font-medium">{a.time}</span></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => {setIsMissedReschedule(false);openReschedule(a)}} className="flex-1 py-2.5 bg-surface-container-high text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all">Reschedule</button>
                <button type="button" onClick={() => setCancelModal(a)} className="px-4 py-2.5 text-tertiary text-sm font-semibold border-b border-transparent hover:border-tertiary transition-all">Cancel</button>
              </div>
            </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      <section className="flex flex-col gap-6 reveal reveal-delay-2">
        <h2 className="text-xl font-semibold text-on-surface">Completed Appointments</h2>
        <div className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden border border-outline-variant/10 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                <tr><th className="px-6 py-4">Doctor Name</th><th className="px-6 py-4">Specialty</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  { doc: 'Dr. Mariam Farooq', spec: 'Pediatrics', date: 'Sept 12, 2026', status: 'Completed', statusIcon: 'check_circle', statusColor: 'text-primary', key: 'farooq' },
                  { doc: 'Dr. Sarah Khalil', spec: 'Cardiology', date: 'Aug 30, 2026', status: 'Not Attended', statusIcon: 'cancel', statusColor: 'text-tertiary', key: 'khalil' },
                  { doc: 'Dr. Ahmed Raza', spec: 'General Practitioner', date: 'Aug 15, 2026', status: 'Completed', statusIcon: 'check_circle', statusColor: 'text-primary', key: 'raza' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-6"><div className="font-bold text-on-surface">{r.doc}</div></td>
                    <td className="px-6 py-6 text-secondary font-medium">{r.spec}</td>
                    <td className="px-6 py-6 text-on-surface-variant">{r.date}</td>
                    <td className="px-6 py-6"><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${r.statusColor}`}><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>{r.statusIcon}</span>{r.status}</span></td>
                    <td className="px-6 py-6 text-right">
                      <button onClick={() => { setIsMissedReschedule(r.status === 'Not Attended'); openReschedule({ id: `completed-${r.key}`, doc: r.doc, spec: r.spec, date: r.date, time: '10:30 AM' }) }} className="text-primary font-bold text-xs hover:underline uppercase tracking-wider">Reschedule</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Summary Modal */}
      {data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}></div>
          <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary"><span className="material-symbols-outlined">{data.typeIcon}</span></div>
                <div><h3 className="font-bold text-on-surface">Consultation Summary</h3><p className="text-xs text-secondary">{data.type}</p></div>
              </div>
              <button onClick={() => setModal(null)} className="p-2 rounded-full hover:bg-surface-container-high text-secondary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Doctor</p><p className="text-sm font-medium text-on-surface">{data.doctor}</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Date</p><p className="text-sm text-on-surface">{data.date}</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Notes</p><p className="text-sm text-on-surface leading-relaxed">{data.notes}</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Prescribed Medications</p>
                <div className="space-y-2">
                  {data.medicines.length === 0 ? <p className="text-sm text-secondary italic">No medications prescribed</p> : data.medicines.map((m, i) => (<div key={i} className="flex items-center justify-between text-sm"><span className="text-on-surface font-medium">{m.name}</span><span className="text-secondary">{m.dosage}</span></div>))}
                </div>
              </div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Follow-up</p><p className="text-sm text-on-surface">{data.followup}</p></div>
            </div>
          </div>
        </div>
      )}
      {rescheduleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRescheduleModal(null)}></div>
          <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-on-surface">Reschedule Appointment</h3>
                <p className="text-xs text-secondary mt-1">{rescheduleModal.doc}</p>
              </div>
              <button type="button" onClick={() => setRescheduleModal(null)} className="p-2 rounded-full hover:bg-surface-container-high text-secondary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              {isMissedReschedule&&(
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 mt-0.5" style={{fontVariationSettings:'"FILL" 1'}}>warning</span>
                  <div><p className="text-sm font-bold text-red-700">Missed Appointment — Repayment Required</p><p className="text-xs text-red-600 mt-1">Since you did not attend this meeting, you will need to make a new payment to reschedule.</p></div>
                </div>
              )}
              <p className="text-sm text-on-surface-variant">Choose from the doctor's available slots.</p>
              <div className="space-y-2">
                {(doctorAvailability[rescheduleModal.doc] || []).map((slot) => (
                  <button
                    key={`${slot.date}-${slot.time}`}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/40 text-on-surface'}`}
                  >
                    <span className="block text-sm font-bold">{slot.date}</span>
                    <span className="text-xs text-secondary">{slot.time}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={confirmReschedule} className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${isMissedReschedule?'bg-error text-on-error hover:opacity-90':'bg-primary text-on-primary hover:bg-primary-dim'}`}>{isMissedReschedule?'Proceed to Payment':'Confirm & Pay'}</button>
            </div>
          </div>
        </div>
      )}
      {cancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelModal(null)}></div>
          <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 flex items-center justify-center text-tertiary"><span className="material-symbols-outlined">warning</span></div>
              <div><h3 className="font-bold text-on-surface">Cancel Appointment?</h3><p className="text-xs text-secondary">{cancelModal.doc}</p></div>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-sm text-on-surface-variant leading-relaxed">If you cancel this meeting, the payment you already made for the appointment will not be refunded.</p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setCancelModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all">Keep Appointment</button>
                <button type="button" onClick={confirmCancel} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-tertiary text-on-tertiary hover:opacity-90 transition-all">Cancel Appointment</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[110]">
          <div className="bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
