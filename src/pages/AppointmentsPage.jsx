import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const apptSummaryData = {
  farooq: { doctor: 'Dr. Mariam Farooq', date: 'September 12, 2026', type: 'Pediatrics Consultation', typeIcon: 'child_care', notes: 'Routine pediatric check-up completed. Growth parameters within normal range. Vaccination schedule updated. Mild seasonal allergies noted — antihistamine prescribed for symptomatic relief.', medicines: [{ name: 'Cetirizine 5mg', dosage: 'Once daily (Evening)' }, { name: 'Saline Nasal Drops', dosage: 'As needed' }], followup: 'Next routine check-up in 6 months. Return immediately if fever persists more than 3 days.' },
  khalil: { doctor: 'Dr. Sarah Khalil', date: 'August 30, 2026', type: 'Cardiology Consultation', typeIcon: 'cardiology', notes: 'Patient did not attend the scheduled appointment. Rescheduling recommended for cardiac risk assessment follow-up.', medicines: [], followup: 'Please reschedule at your earliest convenience. Cardiac risk factors should be assessed within the next 2 weeks.' },
  raza: { doctor: 'Dr. Ahmed Raza', date: 'August 15, 2026', type: 'General Practice Visit', typeIcon: 'stethoscope', notes: 'Annual physical examination completed. Blood work ordered. BMI within healthy range. Blood pressure 122/78 mmHg — optimal. Cholesterol panel pending lab results.', medicines: [{ name: 'Multivitamin Complex', dosage: 'Once daily (With breakfast)' }, { name: 'Omega-3 Fish Oil 1000mg', dosage: 'Once daily (With meals)' }], followup: 'Return in 2 weeks for lab results review. Annual physical next year.' },
}

export default function AppointmentsPage() {
  const [modal, setModal] = useState(null)

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const handler = (e) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [modal])

  const data = modal ? apptSummaryData[modal] : null

  return (
    <div className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full">
      <header className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight text-on-surface font-headline mb-2">My Appointments</h1>
        <div className="w-16 h-1 bg-primary rounded-full"></div>
      </header>

      {/* Upcoming */}
      <section className="flex flex-col gap-6 mb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-on-surface flex items-center gap-3">
            Upcoming Appointments
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </h2>
          <Link to="/book-video-call" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Schedule New <span className="material-symbols-outlined text-lg">add</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { doc: 'Dr. Sarah Khalil', spec: 'Cardiology Specialist', date: 'October 24, 2026', time: '10:30 AM' },
            { doc: 'Dr. Ahmed Raza', spec: 'General Practitioner', date: 'October 28, 2026', time: '02:15 PM' },
          ].map((a, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-[1.5rem] border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-lg font-bold text-on-surface">{a.doc}</h3><p className="text-sm text-secondary font-medium">{a.spec}</p></div>
                <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold rounded-full tracking-wider uppercase">Confirmed</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant mb-6">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-lg">event</span><span className="text-sm font-medium">{a.date}</span></div>
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-lg">schedule</span><span className="text-sm font-medium">{a.time}</span></div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-surface-container-high text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all">Reschedule</button>
                <button className="px-4 py-2.5 text-tertiary text-sm font-semibold border-b border-transparent hover:border-tertiary transition-all">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-on-surface">Completed Appointments</h2>
        <div className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden border border-outline-variant/10 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                <tr><th className="px-6 py-4">Doctor Name</th><th className="px-6 py-4">Specialty</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  { doc: 'Dr. Mariam Farooq', spec: 'Pediatrics', date: 'Sept 12, 2026', status: 'Completed', statusIcon: 'check_circle', statusColor: 'text-primary', key: 'farooq', action: 'View Notes' },
                  { doc: 'Dr. Sarah Khalil', spec: 'Cardiology', date: 'Aug 30, 2026', status: 'Not Attended', statusIcon: 'cancel', statusColor: 'text-tertiary', key: 'khalil', action: 'Reschedule' },
                  { doc: 'Dr. Ahmed Raza', spec: 'General Practitioner', date: 'Aug 15, 2026', status: 'Completed', statusIcon: 'check_circle', statusColor: 'text-primary', key: 'raza', action: 'View Summary' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-6"><div className="font-bold text-on-surface">{r.doc}</div></td>
                    <td className="px-6 py-6 text-secondary font-medium">{r.spec}</td>
                    <td className="px-6 py-6 text-on-surface-variant">{r.date}</td>
                    <td className="px-6 py-6"><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${r.statusColor}`}><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>{r.statusIcon}</span>{r.status}</span></td>
                    <td className="px-6 py-6 text-right"><button onClick={() => setModal(r.key)} className="text-primary font-bold text-xs hover:underline uppercase tracking-wider">{r.action}</button></td>
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
    </div>
  )
}
