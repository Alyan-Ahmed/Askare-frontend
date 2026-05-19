import { useState, useEffect } from 'react'

const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const tomorrowStr = () => { const d = new Date(); d.setDate(d.getDate()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

const APPTS = [
  // Yesterday (past — completed / uncompleted)
  { time: '09:30 AM', date: yesterdayStr(), name: 'Mr. Rafiq Hussain', type: 'General Check-up', location: 'Room 201', status: 'Completed', color: 'bg-primary-fixed-dim', purpose: 'Annual physical exam', notes: 'All vitals normal. Follow-up in 6 months.' },
  { time: '11:00 AM', date: yesterdayStr(), name: 'Mrs. Nadia Patel', type: 'Video Consult', location: 'Online', status: 'No-Show', color: 'bg-tertiary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Dermatology follow-up', notes: 'Patient did not join the call.' },
  { time: '02:00 PM', date: yesterdayStr(), name: 'Mr. Tariq Shah', type: 'Lab Review', location: 'Room 302', status: 'Completed', color: 'bg-primary-fixed-dim', purpose: 'Blood work review', notes: 'Cholesterol slightly elevated. Diet plan prescribed.' },
  // Today
  { time: '09:00 AM', date: todayStr(), name: 'Mrs. Sarah Jenkins', type: 'General Check-up', location: 'Room 302', status: 'Confirmed', color: 'bg-primary-fixed-dim', purpose: 'Routine health assessment', notes: 'Patient has a history of mild hypertension.' },
  { time: '10:30 AM', date: todayStr(), name: 'Mr. David Ahmed', type: 'Video Consult', location: 'Online', status: 'Live Now', color: 'bg-tertiary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Follow-up consultation', notes: 'Post-surgery follow-up.' },
  // Tomorrow
  { time: '11:45 AM', date: tomorrowStr(), name: 'Ms. Fatima Noor', type: 'Lab Review', location: 'In-Person', status: 'Pending', color: 'bg-surface-container-highest', faded: true, purpose: 'Laboratory results review', notes: 'Review recent CBC and thyroid panel.' },
  { time: '02:15 PM', date: tomorrowStr(), name: 'Ayesha Khan', type: 'Immunization', location: 'Room 104', status: 'Confirmed', color: 'bg-primary-fixed-dim', purpose: 'Scheduled immunization', notes: 'Hepatitis B vaccine – dose 2 of 3.' },
]

const SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const FULL = { Sun:'Sunday',Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday' }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
function suffix(d){if(d>3&&d<21)return'th';switch(d%10){case 1:return'st';case 2:return'nd';case 3:return'rd';default:return'th'}}

const CONTACT_TEMPLATES = [
  { label: 'Reminder', icon: 'notifications', message: 'Hi, just a reminder about your upcoming appointment. Please confirm your attendance.' },
  { label: 'Bring Reports', icon: 'description', message: 'Please bring your previous lab reports and prescriptions for the appointment.' },
  { label: 'Confirmed', icon: 'check_circle', message: 'Your appointment has been confirmed. See you soon!' },
]

export default function MySchedulePage() {
  const [appointments, setAppointments] = useState(() => {
    const base = APPTS.map((appt, id) => ({ ...appt, id }))
    // Merge any accepted appointments synced from Dashboard
    const synced = JSON.parse(sessionStorage.getItem('askare_schedule_sync') || '[]')
    const merged = [...base, ...synced.map((s, i) => ({ ...s, id: base.length + i }))]
    return merged
  })
  const [anchor, setAnchor] = useState(() => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d })
  const [selIdx, setSelIdx] = useState(() => new Date().getDay())
  const [menuOpen, setMenuOpen] = useState(null)
  const [modal, setModal] = useState(null)
  const [detailPatient, setDetailPatient] = useState(null)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('success')
  const [blockModal, setBlockModal] = useState(false)
  const [rescheduleModal, setRescheduleModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [blockDate, setBlockDate] = useState('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [modalError, setModalError] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [addedRecords, setAddedRecords] = useState([])
  const [recordModal, setRecordModal] = useState(null)
  const [recordNotes, setRecordNotes] = useState('')

  const days = Array.from({length:7},(_,i)=>{const d=new Date(anchor);d.setDate(d.getDate()+i);return d})
  const sel = days[selIdx]
  const dateStr = `${FULL[SHORT[sel.getDay()]]}, ${MONTHS[sel.getMonth()]} ${sel.getDate()}${suffix(sel.getDate())}, ${sel.getFullYear()}`
  const selDateStr = `${sel.getFullYear()}-${String(sel.getMonth()+1).padStart(2,'0')}-${String(sel.getDate()).padStart(2,'0')}`
  const filteredAppts = appointments.filter(a => a.date === selDateStr)
  const isPastDay = selDateStr < todayStr()

  useEffect(()=>{const h=()=>setMenuOpen(null);document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[])

  const showToast=(msg,type='success')=>{setToastType(type);setToast(msg);setTimeout(()=>setToast(''),4000)}
  const prevWeek=()=>{setAnchor(d=>{const n=new Date(d);n.setDate(n.getDate()-7);return n});setSelIdx(0)}
  const nextWeek=()=>{setAnchor(d=>{const n=new Date(d);n.setDate(n.getDate()+7);return n});setSelIdx(0)}

  const openAction=(action,appt)=>{setMenuOpen(null);setDetailPatient(appt);setContactMessage('');setModal(action)}
  const closeModal=()=>{setModal(null);setDetailPatient(null);setContactMessage('')}
  const cancelAppointment=()=>{const patientName=detailPatient.name;setAppointments(prev=>prev.filter(appt=>appt.id!==detailPatient.id));closeModal();showToast(`Appointment for ${patientName} cancelled`)}

  return (
    <div className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full">
      <header className="mb-10 flex justify-between items-end reveal">
        <div>
          <h1 className="text-4xl font-semibold text-on-surface tracking-tight mb-2">My Schedule</h1>
          <p className="text-on-surface-variant text-lg">{dateStr}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Timeline */}
        <div className="col-span-12 lg:col-span-8 space-y-6 reveal reveal-delay-1">
          {/* Day Nav */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <button className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm" onClick={prevWeek}>
                <span className="material-symbols-outlined">chevron_left</span> Previous 7 Days
              </button>
              <button className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm" onClick={nextWeek}>
                Next 7 Days <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {days.map((d,i)=>(
                <button key={i} onClick={()=>setSelIdx(i)} className={`flex flex-col items-center p-3 rounded-xl min-w-[58px] transition-colors ${selIdx===i?'bg-primary-container text-on-primary-container':'hover:bg-surface-container-low'}`}>
                  <span className={`text-xs uppercase font-bold tracking-tighter ${selIdx===i?'opacity-70':'opacity-50'}`}>{SHORT[d.getDay()]}</span>
                  <span className="text-xl font-bold">{d.getDate()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Cards */}
          <div className="space-y-4">
            {filteredAppts.length === 0 ? (
              <div className="bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/10 text-center shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">{isPastDay ? 'event_available' : 'event_busy'}</span>
                <h3 className="text-lg font-bold text-on-surface">{isPastDay ? 'No consultations recorded' : 'No schedule or upcoming meetings'}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{isPastDay ? 'There were no appointments on this day.' : 'Your schedule is clear for the selected day.'}</p>
              </div>
            ) : filteredAppts.map((a,i)=>(
              <div key={a.id} className="bg-surface-container-lowest p-6 rounded-xl flex items-center group hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-outline-variant/10 shadow-sm">
                <div className={`w-24 text-on-surface-variant font-medium ${a.faded?'opacity-70':''}`}>{a.time}</div>
                <div className={`w-1 ${a.color} self-stretch rounded-full mx-6 ${a.faded?'opacity-70':''}`}></div>
                <div className={`flex-1 ${a.faded?'opacity-70':''}`}>
                  <h3 className="text-lg font-semibold text-on-surface">{a.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-on-surface-variant">
                    <span className={`flex items-center gap-1 ${a.isVideo?'text-tertiary font-medium':''}`}>
                      <span className="material-symbols-outlined text-sm">{a.isVideo?'videocam':'clinical_notes'}</span> {a.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">{a.isVideo?'history':'location_on'}</span> {a.isVideo?'Follow-up':a.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {a.status==='Completed'?(
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1"><span className="material-symbols-outlined text-xs" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>Completed</span>
                  ):a.status==='No-Show'?(
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 flex items-center gap-1"><span className="material-symbols-outlined text-xs">cancel</span>No-Show</span>
                  ):a.status==='Live Now'?(
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tertiary-container/30 text-on-tertiary-container">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> Live Now
                    </div>
                  ):a.status==='Pending'?(
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">Pending</span>
                  ):(
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">Confirmed</span>
                  )}
                  <div className="relative" onClick={e=>e.stopPropagation()}>
                    <button className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container-high transition-opacity" onClick={()=>setMenuOpen(menuOpen===i?null:i)}>more_vert</button>
                    {menuOpen===i&&(
                      <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 z-50 py-2">
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('view',a)}><span className="material-symbols-outlined text-base text-primary">visibility</span> View Details</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('rescheduleAppt',a)}><span className="material-symbols-outlined text-base text-secondary">event</span> Reschedule</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('contact',a)}><span className="material-symbols-outlined text-base text-tertiary">chat</span> Contact Patient</button>
                        {(a.status==='Completed'||a.status==='No-Show')&&(
                          <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>{
                            setMenuOpen(null)
                            if(a.status==='No-Show'){showToast(`Cannot add record — ${a.name} did not attend the meeting`,'error');return}
                            if(addedRecords.includes(a.id)){showToast(`Record for ${a.name} already added`);return}
                            setRecordModal(a);setRecordNotes('')
                          }}><span className={`material-symbols-outlined text-base ${addedRecords.includes(a.id)?'text-green-600':'text-primary'}`}>{addedRecords.includes(a.id)?'check_circle':'post_add'}</span> {addedRecords.includes(a.id)?'Record Added':'Add to Patient Records'}</button>
                        )}
                        {!(a.status==='Completed'||a.status==='No-Show')&&(<>
                          <div className="border-t border-outline-variant/10 my-1"></div>
                          <button className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container/20 flex items-center gap-3" onClick={()=>openAction('cancel',a)}><span className="material-symbols-outlined text-base">cancel</span> Cancel Appointment</button>
                        </>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6 reveal reveal-delay-2">
          {/* Summary Card */}
          <div className="bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-6">Today's Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-on-primary/10 pb-4"><span className="text-on-primary/70">Total Appointments</span><span className="text-2xl font-bold">12</span></div>
                <div className="flex justify-between items-center border-b border-on-primary/10 pb-4"><span className="text-on-primary/70">Video Consultations</span><span className="text-2xl font-bold">4</span></div>
                <div className="flex justify-between items-center"><span className="text-on-primary/70">Average Wait Time</span><span className="text-2xl font-bold">8m</span></div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-container/10 rounded-full"></div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            {(() => { const now = new Date(); const y = now.getFullYear(); const m = now.getMonth(); const today = now.getDate(); const firstDay = new Date(y, m, 1).getDay(); const daysInMonth = new Date(y, m + 1, 0).getDate(); return (<>
              <span className="font-bold text-on-surface block mb-6">{MONTHS[m]} {y}</span>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S','M','T','W','T','F','S'].map((d,i)=>(<div key={i} className="font-bold opacity-40 mb-2">{d}</div>))}
                {[...Array(firstDay)].map((_,i)=>(<div key={`b${i}`} className="py-2"></div>))}
                {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>(
                  <button key={d} className={`py-2 rounded-lg transition-all ${d===today?'font-bold bg-primary text-on-primary hover:opacity-90':'text-on-surface hover:bg-primary-container/30'}`}>{d}</button>
                ))}
              </div>
            </>)})()}
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Availability Management</h4>
            <button className="w-full text-left p-4 rounded-lg bg-surface-container-lowest flex items-center justify-between hover:translate-x-1 transition-transform group shadow-sm" onClick={()=>setBlockModal(true)}>
              <span className="flex items-center gap-3 font-semibold"><span className="material-symbols-outlined text-primary">schedule</span> Block Out Time</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
            </button>
            <button className="w-full text-left p-4 rounded-lg bg-surface-container-lowest flex items-center justify-between hover:translate-x-1 transition-transform group shadow-sm" onClick={()=>{
              setRescheduleModal(true)
            }}>
              <span className="flex items-center gap-3 font-semibold"><span className="material-symbols-outlined text-primary">sync_alt</span> Reschedule Day</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {modal==='view'&&detailPatient&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">person</span> Patient Details</h2>
              <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={closeModal}>close</button>
            </div>
            <p className="text-xs text-secondary mb-6">Appointment information and patient overview.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center"><span className="material-symbols-outlined text-primary text-2xl">person</span></div>
                <div><h3 className="font-bold text-on-surface text-lg">{detailPatient.name}</h3><p className="text-xs font-semibold text-primary">{detailPatient.status}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Time</p><p className="font-semibold text-on-surface">{detailPatient.time}</p></div>
                <div className="p-3 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Type</p><p className="font-semibold text-on-surface">{detailPatient.type}</p></div>
                <div className="p-3 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Location</p><p className="font-semibold text-on-surface">{detailPatient.location}</p></div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Purpose</p><p className="text-sm text-on-surface">{detailPatient.purpose}</p></div>
              <div className="p-4 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Notes</p><p className="text-sm text-on-surface">{detailPatient.notes}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appt Modal */}
      {modal==='rescheduleAppt'&&detailPatient&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface">Reschedule — {detailPatient.name}</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={closeModal}>close</button></div>
            <div className="space-y-5">
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Date</label><input type="date" value={rescheduleDate} onChange={e=>{setRescheduleDate(e.target.value);setModalError('')}} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Time</label><input type="time" value={rescheduleTime} onChange={e=>{setRescheduleTime(e.target.value);setModalError('')}} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
              {modalError && <p className="text-xs text-error font-medium">{modalError}</p>}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>{closeModal();setModalError('');setRescheduleDate('');setRescheduleTime('')}}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{
                  if(!rescheduleDate){setModalError('Please select a new date.');return}
                  if(!rescheduleTime){setModalError('Please select a new time.');return}
                  // Convert 24h time to 12h format
                  const [hh,mm] = rescheduleTime.split(':')
                  let h = parseInt(hh,10)
                  const ampm = h >= 12 ? 'PM' : 'AM'
                  h = h % 12 || 12
                  const formattedTime = `${String(h).padStart(2,'0')}:${mm} ${ampm}`
                  const isPast = detailPatient.status==='Completed'||detailPatient.status==='No-Show'
                  if(isPast){
                    // Keep original as-is, create a NEW appointment on the target date
                    setAppointments(prev=>[...prev, { ...detailPatient, id: Date.now(), date: rescheduleDate, time: formattedTime, status: 'Confirmed', color: 'bg-primary-fixed-dim', faded: false }])
                  } else {
                    setAppointments(prev=>prev.map(a=>a.id===detailPatient.id?{...a,date:rescheduleDate,time:formattedTime,status:'Confirmed'}:a))
                  }
                  closeModal();setRescheduleDate('');setRescheduleTime('');setModalError('')
                  showToast(isPast ? `New appointment created for ${detailPatient.name} on ${rescheduleDate}` : `${detailPatient.name} rescheduled to ${rescheduleDate}`)
                }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {modal==='contact'&&detailPatient&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">chat</span> Contact Patient
              </h2>
              <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={closeModal}>close</button>
            </div>
            <p className="text-xs text-secondary mb-6">Send a message to <span className="font-bold text-on-surface">{detailPatient.name}</span>.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_TEMPLATES.map((template)=>(
                    <button
                      key={template.label}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-container-low hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-colors inline-flex items-center gap-1.5"
                      onClick={()=>setContactMessage(template.message)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">{template.icon}</span>
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e)=>setContactMessage(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface resize-none focus:ring-2 focus:ring-primary/20"
                  rows="4"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={closeModal}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 disabled:opacity-50" disabled={!contactMessage.trim()} onClick={()=>{closeModal();showToast(`Message sent to ${detailPatient.name}`)}}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {modal==='cancel'&&detailPatient&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface">Cancel — {detailPatient.name}</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={closeModal}>close</button></div>
            <div className="space-y-4">
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Reason</label>
                <select value={cancelReason} onChange={e=>setCancelReason(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface"><option value="">Select reason...</option><option>Patient Request</option><option>Doctor Unavailable</option><option>Emergency</option><option>Other</option></select>
              </div>
              <textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface resize-none" rows="3" placeholder="Additional notes..."></textarea>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>{closeModal();setCancelReason('')}}>Keep</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-error text-on-error hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!cancelReason} onClick={()=>{cancelAppointment();setCancelReason('')}}>Cancel Appointment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Out Modal */}
      {blockModal&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={()=>setBlockModal(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-2"><h2 className="text-xl font-bold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">schedule</span> Block Out Time</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={()=>setBlockModal(false)}>close</button></div>
            <p className="text-xs text-secondary mb-6">Mark yourself as unavailable for a specific time period.</p>
            <div className="space-y-5">
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date</label><input type="date" value={blockDate} onChange={e=>{setBlockDate(e.target.value);setModalError('')}} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Time Range</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1"><label className="block text-[10px] text-secondary mb-1">From</label><input type="time" defaultValue="09:00" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface font-semibold text-center" /></div>
                  <span className="material-symbols-outlined text-primary mt-4">arrow_forward</span>
                  <div className="flex-1"><label className="block text-[10px] text-secondary mb-1">To</label><input type="time" defaultValue="17:00" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface font-semibold text-center" /></div>
                </div>
              </div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Reason (Optional)</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface"><option value="">Select reason...</option><option>Personal Time Off</option><option>Conference / Training</option><option>Administrative Work</option><option>Emergency Leave</option><option>Other</option></select>
              </div>
              {modalError && <p className="text-xs text-error font-medium">{modalError}</p>}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>{setBlockModal(false);setModalError('')}}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{if(!blockDate){setModalError('Please select a date.');return};setBlockModal(false);setBlockDate('');setModalError('');showToast('Time blocked out successfully')}}>Block Time</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Day Modal */}
      {rescheduleModal&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={()=>setRescheduleModal(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">sync_alt</span> Reschedule Day</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={()=>setRescheduleModal(false)}>close</button></div>
            <p className="text-sm text-on-surface-variant mb-5">Move all appointments from one day to another.</p>
            <div className="space-y-5">
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Original Date</label><input type="date" value={rescheduleDate} onChange={e=>{setRescheduleDate(e.target.value);setModalError('')}} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Move To Date</label><input type="date" value={rescheduleTime} onChange={e=>{setRescheduleTime(e.target.value);setModalError('')}} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Notification Message (Optional)</label><textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface resize-none" rows="3" placeholder="e.g. Due to an emergency..."></textarea></div>
              {modalError && <p className="text-xs text-error font-medium">{modalError}</p>}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>{setRescheduleModal(false);setModalError('');setRescheduleDate('');setRescheduleTime('')}}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{
                  if(!rescheduleDate||!rescheduleTime){setModalError('Please select both dates.');return}
                  if(rescheduleDate===rescheduleTime){setModalError('Original and target dates cannot be the same.');return}
                  if(rescheduleDate < todayStr()){setModalError('Cannot reschedule a past day. Only today or future dates allowed.');return}
                  const count = appointments.filter(a=>a.date===rescheduleDate).length
                  if(count===0){setModalError('No appointments found on the original date.');return}
                  setAppointments(prev=>prev.map(a=>a.date===rescheduleDate?{...a,date:rescheduleTime}:a))
                  setRescheduleModal(false);setRescheduleDate('');setRescheduleTime('');setModalError('')
                  showToast(`${count} appointment${count!==1?'s':''} moved successfully`)
                }}>Reschedule All</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Patient Records Modal */}
      {recordModal&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={()=>setRecordModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-2"><h2 className="text-xl font-bold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">post_add</span> Add to Patient Records</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={()=>setRecordModal(null)}>close</button></div>
            <p className="text-xs text-secondary mb-6">Add consultation record for <span className="font-bold text-on-surface">{recordModal.name}</span>.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center"><span className="material-symbols-outlined text-primary text-2xl">person</span></div>
                <div><h3 className="font-bold text-on-surface text-lg">{recordModal.name}</h3><p className="text-xs font-semibold text-primary">{recordModal.status} • {recordModal.time}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Type</p><p className="font-semibold text-on-surface text-sm">{recordModal.type}</p></div>
                <div className="p-3 bg-surface-container-low rounded-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Location</p><p className="font-semibold text-on-surface text-sm">{recordModal.location}</p></div>
              </div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Diagnosis / Illness</label><input type="text" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-sm" placeholder="e.g. Mild Hypertension" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Doctor's Notes</label><textarea value={recordNotes} onChange={e=>setRecordNotes(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface resize-none text-sm" rows="3" placeholder="Write clinical notes, recommendations, prescriptions..."></textarea></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Prescribed Medicines (Optional)</label><input type="text" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-sm" placeholder="e.g. Lisinopril 10mg, Atorvastatin 20mg" /></div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>setRecordModal(null)}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{setAddedRecords(prev=>[...prev,recordModal.id]);setRecordModal(null);showToast(`${recordModal.name} added to Patient Records`)}}>Add Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast&&(
        <div className="fixed bottom-8 right-8 z-[90]">
          <div className={`${toastType==='error'?'bg-error':'bg-primary'} text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm animate-slide-up`}>
            <span className="material-symbols-outlined" style={{fontVariationSettings:'"FILL" 1'}}>{toastType==='error'?'cancel':'check_circle'}</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
