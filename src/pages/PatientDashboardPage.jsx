import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const summaryData = {
  vance: { doctor: 'Dr. Julian Vance', date: 'September 12, 2025', illness: 'Mild Hypertension with elevated LDL cholesterol levels. Blood pressure readings averaging 138/88 mmHg over the past two weeks.', recommendations: 'Continue monitoring blood pressure twice daily. Maintain a low-sodium diet (less than 2,300mg sodium/day) and increase physical activity to at least 30 minutes of moderate exercise daily. Reduce stress through mindfulness and adequate sleep. Schedule a follow-up in 3 months for re-evaluation.', medicines: [{ name: 'Lisinopril 10mg', dosage: 'Once daily (Morning)' }, { name: 'Atorvastatin 20mg', dosage: 'Once daily (Before bed)' }, { name: 'Aspirin 75mg', dosage: 'Once daily (After lunch)' }], precautions: ['Avoid excessive salt and processed food intake', 'Monitor blood pressure at home twice daily and log readings', 'Limit caffeine to 1-2 cups per day', 'Avoid strenuous exercise without medical clearance', 'Report any dizziness, persistent headaches, or vision changes immediately'], type: 'Video Consultation', typeIcon: 'videocam' },
  patel: { doctor: 'Dr. Sarah Patel', date: 'July 4, 2025', illness: 'Routine ophthalmology examination. Mild dry eye syndrome noted with slight astigmatism in left eye.', recommendations: 'Use preservative-free artificial tears 3-4 times daily for dry eye relief. Consider blue-light filtering glasses for prolonged screen use. Follow the 20-20-20 rule. Annual comprehensive eye exams recommended.', medicines: [{ name: 'Systane Ultra Eye Drops', dosage: '3-4 times daily (As needed)' }, { name: 'Omega-3 Fish Oil 1000mg', dosage: 'Twice daily (With meals)' }], precautions: ['Avoid rubbing your eyes excessively', 'Reduce screen time to 6 hours maximum per day', 'Wear UV-protection sunglasses outdoors', 'Maintain adequate hydration (8+ glasses of water daily)', 'If vision blurs or worsens, seek immediate consultation'], type: 'In-Person Visit', typeIcon: 'location_on' },
  hypertension: { doctor: 'Dr. Arsalan Khan', date: 'Present — Ongoing', illness: 'Stage 1 Hypertension — Blood pressure consistently reading 140/90 mmHg. Active monitoring and lifestyle management plan in place.', recommendations: 'Maintain daily blood pressure log. Follow a DASH diet with reduced sodium intake. Engage in 30 minutes of moderate exercise 5 days per week.', medicines: [{ name: 'Amlodipine 5mg', dosage: 'Once daily (Morning)' }, { name: 'Losartan 50mg', dosage: 'Once daily (Evening)' }], precautions: ['Monitor blood pressure twice daily', 'Avoid high-sodium and processed foods', 'Do not skip medication doses', 'Report any chest pain, severe headache, or vision changes immediately', 'Attend quarterly check-ups for dose adjustments'], type: 'Active Management', typeIcon: 'monitor_heart' },
  amoxicillin: { doctor: 'Dr. Arsalan Khan', date: 'August 20, 2025', illness: 'Upper respiratory tract infection with secondary bacterial sinusitis.', recommendations: 'Complete the full 10-day antibiotic course even if symptoms improve. Rest adequately and increase fluid intake.', medicines: [{ name: 'Amoxicillin 500mg', dosage: 'Three times daily (Every 8 hours)' }, { name: 'Paracetamol 500mg', dosage: 'As needed for fever/pain (Max 4/day)' }, { name: 'Saline Nasal Spray', dosage: '2-3 sprays per nostril as needed' }], precautions: ['Complete the full antibiotic course', 'Avoid dairy products within 1 hour of taking antibiotics', 'Stay hydrated with at least 8 glasses of water daily', 'Avoid cold and dusty environments', 'Consult doctor if rash or allergic reaction occurs'], type: 'Prescription', typeIcon: 'medication' },
  prednisone: { doctor: 'Dr. Sarah Patel', date: 'May 12, 2025', illness: 'Severe allergic dermatitis with widespread urticaria.', recommendations: 'Follow the tapering schedule strictly. Monitor for signs of adrenal insufficiency.', medicines: [{ name: 'Prednisone 40mg (tapering)', dosage: 'Reducing by 5mg every 3 days' }, { name: 'Cetirizine 10mg', dosage: 'Once daily (Evening)' }, { name: 'Hydrocortisone Cream 1%', dosage: 'Apply to affected areas twice daily' }], precautions: ['Never stop prednisone abruptly', 'Watch for mood changes, insomnia, or increased appetite', 'Avoid contact with people who have infections', 'Take with food to reduce stomach irritation', 'Report any unusual swelling or weight gain'], type: 'Prescription', typeIcon: 'medication' },
  influenza: { doctor: 'Dr. Julian Vance', date: 'January 2025', illness: 'Seasonal Influenza (Type A) — High fever, body aches, sore throat, fatigue.', recommendations: 'Complete antiviral course within 48 hours. Bed rest for 5-7 days minimum.', medicines: [{ name: 'Oseltamivir (Tamiflu) 75mg', dosage: 'Twice daily for 5 days' }, { name: 'Ibuprofen 400mg', dosage: 'Every 6-8 hours as needed for fever' }, { name: 'Throat Lozenges', dosage: 'As needed for sore throat relief' }], precautions: ['Self-isolate for at least 5 days', 'Wash hands frequently', 'Stay hydrated', 'Avoid strenuous activity', 'Seek emergency care if breathing becomes difficult'], type: 'Urgent Care Visit', typeIcon: 'emergency' },
  vitamind: { doctor: 'Dr. Sarah Patel', date: 'November 2024', illness: 'Vitamin D Deficiency — Serum level at 12 ng/mL (severely deficient).', recommendations: 'High-dose Vitamin D3 supplementation for 8 weeks followed by maintenance dose.', medicines: [{ name: 'Vitamin D3 50,000 IU', dosage: 'Once weekly for 8 weeks' }, { name: 'Calcium 500mg + D3', dosage: 'Twice daily (With meals)' }], precautions: ['Take Vitamin D with a fatty meal for better absorption', 'Do not exceed recommended supplementation dose', 'Monitor for signs of hypercalcemia', 'Maintain regular outdoor activity', 'Follow up for blood level recheck in 3 months'], type: 'Lab Follow-Up', typeIcon: 'lab_profile' },
}

const listRows = [
  { date: 'PRESENT', cat: 'Health Journey', catIcon: 'monitor_heart', catColor: 'text-primary', desc: 'Hypertension Mgmt — Active management of blood pressure.', status: 'ACTIVE', statusCls: 'bg-primary-container/30 text-primary', key: 'hypertension', action: 'View Details' },
  { date: 'SEP 12, 2025', cat: 'Consultation', catIcon: 'history', catColor: 'text-primary', desc: 'Dr. Julian Vance — General Wellness Audit', status: 'COMPLETED', statusCls: 'bg-secondary-container text-on-secondary-container', key: 'vance', action: 'View Summary' },
  { date: 'JUL 04, 2025', cat: 'Consultation', catIcon: 'history', catColor: 'text-primary', desc: 'Dr. Sarah Patel — Ophthalmology Check', status: 'COMPLETED', statusCls: 'bg-secondary-container text-on-secondary-container', key: 'patel', action: 'View Summary' },
  { date: 'AUG 20, 2025', cat: 'Prescription', catIcon: 'medication', catColor: 'text-tertiary', desc: 'Amoxicillin 500mg — Course completed', status: 'COMPLETED', statusCls: 'bg-secondary-container text-on-secondary-container', key: 'amoxicillin', action: 'View Details' },
  { date: 'MAY 12, 2025', cat: 'Prescription', catIcon: 'medication', catColor: 'text-tertiary', desc: 'Prednisone Taper — Course ended', status: 'TAPERED', statusCls: 'bg-tertiary-container text-on-tertiary-container', key: 'prednisone', action: 'View Details' },
  { date: 'JAN 2025', cat: 'Health Journey', catIcon: 'timeline', catColor: 'text-primary', desc: 'Seasonal Influenza — Resolved with standard antiviral course.', status: 'RESOLVED', statusCls: 'bg-secondary-container text-on-secondary-container', key: 'influenza', action: 'View Details' },
  { date: 'NOV 2024', cat: 'Health Journey', catIcon: 'timeline', catColor: 'text-primary', desc: 'Vitamin D Deficiency — Baseline restored through supplements.', status: 'RESOLVED', statusCls: 'bg-secondary-container text-on-secondary-container', key: 'vitamind', action: 'View Details' },
]

export default function PatientDashboardPage() {
  const [archiveView, setArchiveView] = useState('timeline')
  const [modal, setModal] = useState(null)
  const [rescheduleModal, setRescheduleModal] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [rescheduleError, setRescheduleError] = useState('')
  const [toast, setToast] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('Today, Oct 14')
  const [appointmentTime, setAppointmentTime] = useState('02:30 PM')
  const [viewKey, setViewKey] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.name || 'Alyan Ahmed'

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const handler = (e) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [modal])

  const data = modal ? summaryData[modal] : null

  const handleViewChange = (view) => {
    if (view !== archiveView) {
      setArchiveView(view)
      setViewKey(k => k + 1)
    }
  }

  return (
    <div className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full">
      {/* Welcome */}
      <section className="mb-12 reveal">
        <h2 className="text-5xl font-medium text-on-surface tracking-tight mb-2">Good morning, {displayName}.</h2>
        <p className="text-secondary text-lg font-light">Your clinical overview is balanced today. You have one upcoming consultation.</p>
      </section>

      {/* Top Grid */}
      <div className="grid grid-cols-12 gap-8 mb-16">
        {/* Hero Card */}
        <div className="col-span-12 lg:col-span-7 bg-primary rounded-[2rem] p-8 text-on-primary flex flex-col md:flex-row justify-between relative overflow-hidden group reveal">
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 bg-primary-dim/40 px-3 py-1 rounded-full mb-6">
              <span className="health-pulse"></span>
              <span className="text-xs font-semibold tracking-wider uppercase">Next Appointment</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">Dr. Aris Thorne</h3>
            <p className="text-primary-container text-lg mb-8">Senior Cardiologist • Clinical Lead</p>
            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">calendar_today</span><span className="font-medium">{appointmentDate}</span></div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">schedule</span><span className="font-medium">{appointmentTime}</span></div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/video-call?role=patient&doctor=Dr.%20Aris%20Thorne" className="relative z-20 bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 no-underline" style={{filter:'none', opacity:1, backdropFilter:'none', WebkitBackdropFilter:'none', transform:'translateZ(0)', willChange:'auto'}}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1', filter:'none', opacity:1 }}>videocam</span> Join Video Call
              </Link>
              <button onClick={()=>{setRescheduleModal(true);setRescheduleDate('');setRescheduleTime('');setRescheduleError('')}} className="bg-white/20 text-white border border-white/30 px-6 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-white/30 transition-all active:scale-95 backdrop-blur-sm">
                Reschedule
              </button>
            </div>
          </div>
          <div className="hidden md:flex absolute right-[-2rem] bottom-[-2.5rem] w-[22rem] h-[22rem] items-center justify-center opacity-20 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: '20rem', lineHeight: 1 }}>stethoscope</span>
          </div>
        </div>

        {/* Right Stack */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8 reveal reveal-delay-2">
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] border-l-4 border-primary">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-outline uppercase tracking-widest">Active Diagnosis</p>
              <span className="material-symbols-outlined text-primary/40">monitor_heart</span>
            </div>
            <h4 className="text-xl font-bold text-on-surface mb-2">Mild Hypertension</h4>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-xs font-bold">STABILIZING</span>
              <p className="text-sm text-secondary">BP Trend: 128/84 mmHg</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] border-l-4 border-tertiary">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-outline uppercase tracking-widest">Next Dosage</p>
              <span className="material-symbols-outlined text-tertiary/40">medication</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-tertiary-container/30 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: '"FILL" 1' }}>pill</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface leading-tight">Lisinopril 10mg</h4>
                <p className="text-sm text-secondary font-medium">Scheduled for 18:00 (Evening)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Archive */}
      <section className="mt-16 reveal">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-on-surface">Clinical Archive</h3>
          <div className="flex gap-2">
            <button onClick={() => handleViewChange('timeline')} className={`px-4 py-2 rounded-full text-sm transition-all ${archiveView === 'timeline' ? 'bg-surface-container-high text-primary font-bold' : 'text-secondary font-medium hover:bg-surface-container'}`}>Timeline View</button>
            <button onClick={() => handleViewChange('list')} className={`px-4 py-2 rounded-full text-sm transition-all ${archiveView === 'list' ? 'bg-surface-container-high text-primary font-bold' : 'text-secondary font-medium hover:bg-surface-container'}`}>List View</button>
          </div>
        </div>

        {/* Timeline View */}
        {archiveView === 'timeline' && (
          <div key={`timeline-${viewKey}`} className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{animation: 'archiveFadeIn 0.4s ease-out'}}>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-primary">history</span><h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Consultation History</h4></div>
              <div className="space-y-4">
                {[{ date: 'SEP 12, 2025', doc: 'Dr. Julian Vance', desc: 'General Wellness Audit', key: 'vance' }, { date: 'JUL 04, 2025', doc: 'Dr. Sarah Patel', desc: 'Ophthalmology Check', key: 'patel' }].map(c => (
                  <div key={c.key} className="p-5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors group">
                    <p className="text-xs text-secondary font-bold mb-1">{c.date}</p>
                    <p className="font-bold text-on-surface">{c.doc}</p>
                    <p className="text-sm text-secondary mb-3">{c.desc}</p>
                    <button onClick={() => setModal(c.key)} className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">VIEW SUMMARY <span className="material-symbols-outlined text-xs">arrow_forward</span></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-primary">medical_services</span><h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Prescription Archive</h4></div>
              <div className="space-y-4">
                <div className="p-5 bg-surface-container-low rounded-xl border-l-4 border-secondary-fixed"><div className="flex justify-between items-start mb-2"><h5 className="font-bold text-on-surface">Amoxicillin 500mg</h5><span className="text-[10px] font-bold px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded">COMPLETED</span></div><p className="text-xs text-secondary">Course ended Aug 20, 2025</p></div>
                <div className="p-5 bg-surface-container-low rounded-xl border-l-4 border-tertiary-fixed-dim"><div className="flex justify-between items-start mb-2"><h5 className="font-bold text-on-surface">Prednisone Taper</h5><span className="text-[10px] font-bold px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded">TAPERED</span></div><p className="text-xs text-secondary">Course ended May 12, 2025</p></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-primary">timeline</span><h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Health Journey</h4></div>
              <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
                {[{ date: 'PRESENT', color: 'bg-primary', dateColor: 'text-primary', title: 'Hypertension Mgmt', desc: 'Active management of blood pressure.' }, { date: 'JAN 2025', color: 'bg-outline', dateColor: 'text-secondary', title: 'Seasonal Influenza', desc: 'Resolved with standard antiviral course.' }, { date: 'NOV 2024', color: 'bg-outline', dateColor: 'text-secondary', title: 'Vitamin D Deficiency', desc: 'Baseline restored through supplements.' }].map((t, i) => (
                  <div key={i} className="relative"><div className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ${t.color} ring-4 ring-background`}></div><p className={`text-xs font-bold ${t.dateColor} mb-1`}>{t.date}</p><h5 className="font-bold text-on-surface">{t.title}</h5><p className="text-xs text-secondary">{t.desc}</p></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {archiveView === 'list' && (
          <div key={`list-${viewKey}`} className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden border border-outline-variant/10 shadow-sm" style={{animation: 'archiveFadeIn 0.4s ease-out'}}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                  <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {listRows.map((r, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-5 text-xs font-bold text-secondary">{r.date}</td>
                      <td className="px-6 py-5"><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${r.catColor}`}><span className="material-symbols-outlined text-sm">{r.catIcon}</span>{r.cat}</span></td>
                      <td className="px-6 py-5 font-medium text-on-surface">{r.desc}</td>
                      <td className="px-6 py-5"><span className={`px-2 py-1 ${r.statusCls} text-[10px] font-bold rounded`}>{r.status}</span></td>
                      <td className="px-6 py-5 text-right"><button onClick={() => setModal(r.key)} className="text-primary font-bold text-xs hover:underline uppercase tracking-wider">{r.action}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Reschedule Modal */}
      {rescheduleModal&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={()=>setRescheduleModal(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl z-10 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-start">
              <div><h3 className="font-bold text-on-surface">Reschedule Appointment</h3><p className="text-xs text-secondary mt-1">Dr. Aris Thorne</p></div>
              <button type="button" onClick={()=>setRescheduleModal(false)} className="p-2 rounded-full hover:bg-surface-container-high text-secondary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface-variant">Choose from the doctor's available slots.</p>
              <div className="space-y-2">
                {[
                  { date: 'October 20, 2026', time: '09:00 AM' },
                  { date: 'October 22, 2026', time: '02:30 PM' },
                  { date: 'October 25, 2026', time: '11:00 AM' },
                ].map((slot) => (
                  <button
                    key={`${slot.date}-${slot.time}`}
                    type="button"
                    onClick={()=>{setRescheduleDate(slot.date);setRescheduleTime(slot.time)}}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${rescheduleDate===slot.date && rescheduleTime===slot.time ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/40 text-on-surface'}`}
                  >
                    <span className="block text-sm font-bold">{slot.date}</span>
                    <span className="text-xs text-secondary">{slot.time}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={()=>{
                if(!rescheduleDate||!rescheduleTime){setRescheduleError('Please select a time slot.');return}

                // Format date for display (e.g. "Oct 20")
                const dateObj = new Date(rescheduleDate)
                const monthShort = dateObj.toLocaleString('en-US', { month: 'short' })
                const day = dateObj.getDate()
                setAppointmentDate(`${monthShort} ${day}, ${dateObj.getFullYear()}`)
                setAppointmentTime(rescheduleTime)

                setRescheduleModal(false)
                setToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime}`)
                setTimeout(()=>setToast(''),4000)
              }} className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">Confirm Reschedule</button>
              {rescheduleError&&<p className="text-xs text-error font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{rescheduleError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {data && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div><h2 className="text-xl font-bold text-on-surface">{data.doctor}</h2><p className="text-sm text-secondary">{data.date}</p></div>
                <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors" onClick={() => setModal(null)}><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-5"><div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-tertiary text-lg">coronavirus</span><h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Diagnosis / Illness</h4></div><p className="text-sm text-on-surface font-medium">{data.illness}</p></div>
                <div className="bg-surface-container-low rounded-xl p-5"><div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-primary text-lg">stethoscope</span><h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Doctor's Recommendations</h4></div><p className="text-sm text-on-surface">{data.recommendations}</p></div>
                <div className="bg-surface-container-low rounded-xl p-5"><div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>medication</span><h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Prescribed Medicines</h4></div><div className="space-y-2">{data.medicines.map((m, i) => (<div key={i} className="flex items-center justify-between text-sm"><span className="text-on-surface font-medium">{m.name}</span><span className="text-secondary">{m.dosage}</span></div>))}</div></div>
                <div className="bg-tertiary-container/10 rounded-xl p-5 border border-tertiary/10"><div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-tertiary text-lg">warning</span><h4 className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container">Precautions</h4></div><ul className="text-sm text-on-surface space-y-2">{data.precautions.map((p, i) => (<li key={i} className="flex items-start gap-2"><span className="text-tertiary mt-0.5">•</span>{p}</li>))}</ul></div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10"><div className="flex items-center gap-2 text-sm text-secondary"><span className="material-symbols-outlined text-lg">{data.typeIcon}</span><span>{data.type}</span></div><span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-wider">Completed</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast&&(
        <div className="fixed bottom-8 right-8 z-[90]">
          <div className="bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm">
            <span className="material-symbols-outlined" style={{fontVariationSettings:'"FILL" 1'}}>check_circle</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* View transition animation */}
      <style>{`
        @keyframes archiveFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
