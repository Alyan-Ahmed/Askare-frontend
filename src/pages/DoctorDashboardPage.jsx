import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const tomorrowStr = () => { const d = new Date(); d.setDate(d.getDate()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

const initialAgenda = [
  {
    id: 'sarah-jenkins',
    patient: 'Mrs. Sarah Jenkins',
    time: '09:00 AM',
    date: todayStr(),
    badge: 'Video Consultation',
    badgeClass: 'bg-primary/10 text-primary',
    description: 'Video Consultation | Online',
    joinLabel: 'Join Video Call',
    videoTo: '/video-call?role=doctor&patient=Sarah%20Jenkins',
    slots: ['01:30 PM', '03:00 PM', '05:15 PM'],
  },
  {
    id: 'david-ahmed',
    patient: 'Mr. David Ahmed',
    time: '10:30 AM',
    date: todayStr(),
    badge: 'Video Consultation',
    badgeClass: 'bg-primary/10 text-primary',
    description: 'Video Consultation | Online',
    joinLabel: 'Join Video Call',
    videoTo: '/video-call?role=doctor&patient=David%20Ahmed',
    slots: ['02:15 PM', '04:00 PM', '06:30 PM'],
  },
]

export default function DoctorDashboardPage() {
  const [agenda, setAgenda] = useState(initialAgenda)
  const [rescheduleItem, setRescheduleItem] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [toast, setToast] = useState('')
  const { user } = useAuth()
  const displayName = user?.name || 'Dr. Arsalan Khan'

  const [requests, setRequests] = useState([
    { id: 'ayesha', name: 'Ayesha Gillani', time: 'Today, 4:00 PM', schedTime: '04:00 PM', schedDate: todayStr(), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtgVqtpoxuwZPcPtyRCurlpOWa5ZbVBDhnT87pQnDoBjbIXbHpU0fIUAjJEB6CVxbFPuVov_U-7f-s4R5_HiiVkSBgS5j-jrPD5GMgG2OgolJhRBka_ohz-LBoiCT1GLYdGbSrl_G2EuoPfeUbdKkVMCI4RC5hNzGIC4B2kLGg8FuPqmB313lXYeyrGPvqu09tGfeoiq7PmoOqo1nEc5JR9ecg7_ARrthJiyMptJ6IV8AIK4ru08DEGDPaplCJGWHm6ZyAufKSRI8' },
    { id: 'haris', name: 'Haris Vohra', time: 'Tomorrow, 9:00 AM', schedTime: '09:00 AM', schedDate: tomorrowStr(), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYy0fu43U11KW0wcTYp4ZvUYs_yE3SWPavj75hGM4ZYZIKeTZ4RG1315tCcje282qekzwFiljsbEZf98A-QdsMVhcGEkn8wwkrJZSV1pJ0OqhcUafjdZwO78r_HdcBLtJv_59DTW_c5gdv4ghV008-FaXh6XhVVmqvTEsaX4R6klCRv12QcTCzhK8zckWklxGeVGTrfFO41zNFFvgjNvjRNgqOB1SophZLoXnGfmD944WeV88Z9A3m1Rw0tNtrD7MDJ0c6-57etHA' },
  ])
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // Accept: only add to today's agenda if appointment is for today; otherwise it just goes to MySchedule via shared state
  const acceptRequest = (req) => {
    // Add to agenda (which covers all dates; today's view will filter)
    const newAppointment = {
      id: req.id,
      patient: req.name,
      time: req.schedTime,
      date: req.schedDate,
      badge: 'Video Consultation',
      badgeClass: 'bg-primary/10 text-primary',
      description: 'Video Consultation | Online',
      joinLabel: 'Join Video Call',
      videoTo: `/video-call?role=doctor&patient=${encodeURIComponent(req.name)}`,
      slots: ['01:00 PM', '03:30 PM', '05:00 PM'],
    }
    setAgenda(prev => [...prev, newAppointment])
    setRequests(prev => prev.filter(r => r.id !== req.id))
    // Sync to sessionStorage so MySchedulePage can read accepted appointments
    const scheduleSync = JSON.parse(sessionStorage.getItem('askare_schedule_sync') || '[]')
    scheduleSync.push({ time: req.schedTime, date: req.schedDate, name: req.name, type: 'Consultation', location: 'Online', status: 'Confirmed', color: 'bg-primary-fixed-dim', purpose: 'Accepted from dashboard', notes: `Booking accepted: ${req.time}` })
    sessionStorage.setItem('askare_schedule_sync', JSON.stringify(scheduleSync))
    showToast(`Accepted: ${req.name} added to your schedule`)
  }

  const confirmReject = () => {
    if (!rejectModal) return
    setRequests(prev => prev.filter(r => r.id !== rejectModal.id))
    setRejectModal(null)
    setRejectReason('')
    showToast(`Rejected: ${rejectModal.name}'s request`)
  }

  const openReschedule = (item) => {
    setRescheduleItem(item)
    setSelectedTime(item.slots[0])
    setRescheduleDate('')
  }

  const confirmReschedule = () => {
    if (!rescheduleItem || !selectedTime || !rescheduleDate) return
    // Update the item's date and time, set status to Pending (needs patient confirmation)
    setAgenda(prev => prev.map(item =>
      item.id === rescheduleItem.id ? { ...item, time: selectedTime, date: rescheduleDate, badge: 'Pending', badgeClass: 'bg-surface-container-high text-on-surface-variant' } : item
    ))
    setRescheduleItem(null)
    showToast(`${rescheduleItem.patient} rescheduled to ${rescheduleDate} at ${selectedTime} — Pending patient confirmation`)
  }

  // Filter agenda to show only today's items, sorted by time (AM first)
  const today = todayStr()
  const parseTimeToMinutes = (timeStr) => {
    const [clock, meridiem] = timeStr.split(' ')
    let [h, m] = clock.split(':').map(Number)
    if (meridiem === 'PM' && h !== 12) h += 12
    if (meridiem === 'AM' && h === 12) h = 0
    return h * 60 + m
  }
  const todayAgenda = agenda.filter(item => item.date === today).sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      {/* Header Welcome */}
      <header className="mb-12 reveal">
        <h1 className="text-4xl font-medium text-on-background tracking-tight mb-2">Welcome back, <span className="font-extrabold text-primary">{displayName}</span></h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">Your clinical agenda is ready. You have {todayAgenda.length} consultation{todayAgenda.length !== 1 ? 's' : ''} scheduled for today and {requests.length} pending booking request{requests.length !== 1 ? 's' : ''}.</p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Stats */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-5 gap-6 mb-4 reveal">
          {[
            { label: 'Patients Today', value: String(todayAgenda.length), icon: 'trending_up', sub: 'Active schedule', subColor: 'text-secondary' },
            { label: 'Pending Reports', value: '08', icon: 'error', sub: 'High priority needed', subColor: 'text-tertiary', fill: true },
            { label: 'Avg. Consultation', value: '18m', icon: 'timer', sub: 'Optimal performance', subColor: 'text-secondary' },
            { label: 'Active Care Plans', value: '142', icon: 'favorite', sub: 'In monitoring phase', subColor: 'text-secondary' },
            { label: 'Total Income', value: 'PKR 487K', icon: 'trending_up', sub: '+18% this month', subColor: 'text-secondary' },
          ].map((s, i) => (
            <div key={i} className="bg-surface-container-low p-6 rounded-xl">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{s.label}</p>
              <h3 className="text-3xl font-bold">{s.value}</h3>
              <div className={`flex items-center gap-2 mt-2 text-xs ${s.subColor}`}>
                <span className="material-symbols-outlined text-sm" style={s.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>{s.icon}</span>
                <span>{s.sub}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Today's Agenda — ONLY today's appointments */}
        <section className="col-span-12 lg:col-span-8 space-y-6 reveal reveal-delay-1">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Today's Agenda</h2>
            <Link to="/my-schedule" className="text-primary text-sm font-semibold hover:underline">View Full Schedule →</Link>
          </div>
          {todayAgenda.length === 0 && (
            <div className="bg-surface-container-lowest p-10 rounded-xl text-center border border-outline-variant/10">
              <span className="material-symbols-outlined text-4xl text-outline mb-3">event_available</span>
              <h3 className="text-lg font-bold text-on-surface">No consultations today</h3>
              <p className="text-sm text-secondary mt-1">All accepted appointments for other dates are on your <Link to="/my-schedule" className="text-primary font-semibold hover:underline">schedule</Link>.</p>
            </div>
          )}
          {todayAgenda.map((item, index) => {
            const [clock, meridiem] = item.time.split(' ')
            return (
              <div key={item.id} className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className={`${index === 0 ? 'bg-primary-container/30' : 'bg-surface-container'} p-4 rounded-xl text-center min-w-[80px]`}>
                  <p className={`text-xs font-bold uppercase ${index === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{clock}</p>
                  <p className={`text-lg font-bold ${index === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{meridiem}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-on-surface">{item.patient}</h3>
                  <p className="text-sm text-on-surface-variant">Video Consultation</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link to={item.videoTo} className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-bold hover:opacity-90 transition-all text-center no-underline">{item.joinLabel}</Link>
                  <button type="button" onClick={() => openReschedule(item)} className="flex-1 md:flex-none px-5 py-2.5 bg-surface-container text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container-high transition-all">Reschedule</button>
                </div>
              </div>
            )
          })}
        </section>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-8 reveal reveal-delay-2">
          {/* New Requests */}
          <div className="bg-white rounded-2xl p-6 editorial-shadow">
            <h2 className="text-xl font-bold mb-6">New Requests</h2>
            <div className="space-y-6">
              {requests.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-4">No pending requests.</p>
              )}
              {requests.map((r) => (
                <div key={r.id} className="flex items-start gap-4">
                  <img alt="Patient" className="w-12 h-12 rounded-full object-cover" src={r.img} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-on-surface-variant mb-3">{r.time}</p>
                    <div className="flex gap-2">
                      <button onClick={() => acceptRequest(r)} className="text-[11px] font-bold text-primary px-3 py-1.5 bg-primary-container/20 rounded-lg hover:bg-primary-container/40 transition-colors">Accept</button>
                      <button onClick={() => { setRejectModal(r); setRejectReason('') }} className="text-[11px] font-bold text-tertiary px-3 py-1.5 bg-tertiary-container/20 rounded-lg hover:bg-tertiary-container/40 transition-colors">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Records */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Patient Records</h2>
            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
              {[
                { type: 'Consultation', desc: 'Completed Video Consult with Zubair Ahmed', time: '1 hour ago', active: true },
                { type: 'Lab Records', desc: 'Filed Hematology Report for Omar Farooq', time: '3 hours ago' },
                { type: 'Care Management', desc: 'Updated Care Plan for Zainab Khan', time: '5 hours ago' },
                { type: 'Pharmacy', desc: 'Prescription Refill Approved for Maryam Shah', time: 'Yesterday' },
              ].map((r, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-5 h-5 bg-white rounded-full border-2 ${r.active ? 'border-primary' : 'border-outline'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 ${r.active ? 'bg-primary' : 'bg-outline'} rounded-full`}></div>
                  </div>
                  <p className={`text-xs font-bold ${r.active ? 'text-primary' : 'text-on-surface-variant'} mb-0.5`}>{r.type}</p>
                  <p className="text-sm font-medium">{r.desc}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase mt-1">{r.time}</p>
                </div>
              ))}
            </div>
            <Link to="/patient-records" className="block w-full mt-8 py-3 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all text-center">View All Records</Link>
          </div>
        </aside>
      </div>

      {/* Mobile FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center editorial-shadow lg:hidden z-50">
        <span className="material-symbols-outlined">add</span>
      </button>
      {rescheduleItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setRescheduleItem(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Reschedule Consultation</h2>
                <p className="text-xs text-secondary mt-1">{rescheduleItem.patient}</p>
              </div>
              <button type="button" className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setRescheduleItem(null)}>close</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Date</label>
                <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" />
              </div>
              <p className="text-sm text-on-surface-variant">Choose an available time slot.</p>
              <div className="grid grid-cols-1 gap-2">
                {rescheduleItem.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedTime === slot ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/40 text-on-surface'}`}
                  >
                    <span className="block text-sm font-bold">{slot}</span>
                    <span className="text-xs text-secondary">Available</span>
                  </button>
                ))}
              </div>
              {(!rescheduleDate || !selectedTime) && <p className="text-xs text-error font-medium">{!rescheduleDate ? 'Please select a date to reschedule.' : 'Please select a time slot.'}</p>}
              <button type="button" onClick={confirmReschedule} disabled={!rescheduleDate || !selectedTime} className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}
      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setRejectModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Reject Appointment</h2>
                <p className="text-xs text-tertiary mt-1">{rejectModal.name} — {rejectModal.time}</p>
              </div>
              <button type="button" className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setRejectModal(null)}>close</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface-variant">Please provide a reason for rejecting this appointment request.</p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/60 focus:ring-2 focus:ring-tertiary/20 resize-none"
                rows="3"
                placeholder="e.g. Schedule conflict, patient referred to specialist..."
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setRejectModal(null)} className="flex-1 py-3 bg-surface-container text-on-surface rounded-xl text-sm font-bold hover:bg-surface-container-high transition-all">Cancel</button>
                <button type="button" onClick={confirmReject} disabled={!rejectReason.trim()} className="flex-1 py-3 bg-tertiary text-on-tertiary rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Confirm Reject</button>
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
