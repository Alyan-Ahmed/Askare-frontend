import { useState, useEffect } from 'react'

const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const tomorrowStr = () => { const d = new Date(); d.setDate(d.getDate()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

const APPTS = [
  // Yesterday (past — completed / uncompleted)
  { time: '09:30 AM', date: yesterdayStr(), name: 'Mr. Rafiq Hussain', type: 'Video Consultation', location: 'Online', status: 'Completed', color: 'bg-primary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Annual physical exam', notes: 'All vitals normal. Follow-up in 6 months.' },
  { time: '11:00 AM', date: yesterdayStr(), name: 'Mrs. Nadia Patel', type: 'Video Consultation', location: 'Online', status: 'No-Show', color: 'bg-tertiary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Dermatology follow-up', notes: 'Patient did not join the call.' },
  { time: '02:00 PM', date: yesterdayStr(), name: 'Mr. Tariq Shah', type: 'Video Consultation', location: 'Online', status: 'Completed', color: 'bg-primary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Blood work review', notes: 'Cholesterol slightly elevated. Diet plan prescribed.' },
  // Today
  { time: '09:00 AM', date: todayStr(), name: 'Mrs. Sarah Jenkins', type: 'Video Consultation', location: 'Online', status: 'Confirmed', color: 'bg-primary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Routine health assessment', notes: 'Patient has a history of mild hypertension.' },
  { time: '10:30 AM', date: todayStr(), name: 'Mr. David Ahmed', type: 'Video Consultation', location: 'Online', status: 'Live Now', color: 'bg-tertiary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Follow-up consultation', notes: 'Post-surgery follow-up.' },
  // Tomorrow
  { time: '11:45 AM', date: tomorrowStr(), name: 'Ms. Fatima Noor', type: 'Video Consultation', location: 'Online', status: 'Pending', color: 'bg-surface-container-highest', icon: 'videocam', isVideo: true, faded: true, purpose: 'Laboratory results review', notes: 'Review recent CBC and thyroid panel.' },
  { time: '02:15 PM', date: tomorrowStr(), name: 'Ayesha Khan', type: 'Video Consultation', location: 'Online', status: 'Confirmed', color: 'bg-primary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Scheduled immunization', notes: 'Hepatitis B vaccine – dose 2 of 3.' },
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

const PATIENT_RECORDS_KEY = 'askare_patient_records'
const RECORD_STATUS_OPTIONS = ['Active', 'Stable', 'Observation', 'Critical']
const DEFAULT_PATIENT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAox2cELp727nc8F0QqlouZa__6ZAv4-XcyEzgKe10NFebkQZ6zwt1AVi5A40vtPQlgILrsZO4LEBhgNSHYHes6nqyU_4kjT4LRk4umkaWEpp9o_VpetLVnbbB9Zd2jNVNrpUvg_5U6PulVe0fwMTqmJQ8iB76aIZ86NAX_D7f-WEhXXum1-y8GdUP44sNRoZKGW9TEuwIYHcU_HCp90mV_Ha_VHzhFzOMyeHQw2z7EjJ1H95UUmUeqoJLIy7TscjeCBzVcGXi2ZYY'

const readStoredPatientRecords = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PATIENT_RECORDS_KEY) || '[]')
  } catch {
    return []
  }
}

const formatRecordDate = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateValue
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const cleanPatientName = (name) => name.replace(/^(Mr\.|Mrs\.|Ms\.|Miss|Dr\.)\s+/i, '').trim()

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
  const [addedRecords, setAddedRecords] = useState(() => readStoredPatientRecords().map(record => record.sourceAppointmentId).filter(Boolean))
  const [recordModal, setRecordModal] = useState(null)
  const [recordNotes, setRecordNotes] = useState('')
  const [recordDiagnosis, setRecordDiagnosis] = useState('')
  const [recordMedicines, setRecordMedicines] = useState('')
  const [recordStatus, setRecordStatus] = useState('Active')

  const days = Array.from({length:7},(_,i)=>{const d=new Date(anchor);d.setDate(d.getDate()+i);return d})
  const sel = days[selIdx]
  const dateStr = `${FULL[SHORT[sel.getDay()]]}, ${MONTHS[sel.getMonth()]} ${sel.getDate()}${suffix(sel.getDate())}, ${sel.getFullYear()}`
  const selDateStr = `${sel.getFullYear()}-${String(sel.getMonth()+1).padStart(2,'0')}-${String(sel.getDate()).padStart(2,'0')}`
  const parseTimeMin = (t) => { const [c,m] = t.split(' '); let [h,mi] = c.split(':').map(Number); if(m==='PM'&&h!==12)h+=12; if(m==='AM'&&h===12)h=0; return h*60+mi }
  const filteredAppts = appointments.filter(a => a.date === selDateStr).sort((a,b) => parseTimeMin(a.time) - parseTimeMin(b.time))
  const isPastDay = selDateStr < todayStr()

  useEffect(()=>{const h=()=>setMenuOpen(null);document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[])

  const showToast=(msg,type='success')=>{setToastType(type);setToast(msg);setTimeout(()=>setToast(''),4000)}
  const prevWeek=()=>{setAnchor(d=>{const n=new Date(d);n.setDate(n.getDate()-7);return n});setSelIdx(0)}
  const nextWeek=()=>{setAnchor(d=>{const n=new Date(d);n.setDate(n.getDate()+7);return n});setSelIdx(0)}

  const openAction=(action,appt)=>{setMenuOpen(null);setDetailPatient(appt);setContactMessage('');setModalError('');setRescheduleDate('');setRescheduleTime('');setModal(action)}
  const closeModal=()=>{setModal(null);setDetailPatient(null);setContactMessage('');setModalError('')}
  const cancelAppointment=()=>{const patientName=detailPatient.name;setAppointments(prev=>prev.filter(appt=>appt.id!==detailPatient.id));closeModal();showToast(`Appointment for ${patientName} cancelled`)}
  const jumpToDate=(dateValue)=>{const d=new Date(`${dateValue}T00:00:00`);if(Number.isNaN(d.getTime()))return;const weekStart=new Date(d);weekStart.setDate(d.getDate()-d.getDay());setAnchor(weekStart);setSelIdx(d.getDay())}
  const resetRecordForm=(appt)=>{setRecordDiagnosis(appt?.purpose || '');setRecordMedicines('');setRecordStatus('Active');setRecordNotes(appt?.notes || '')}
  const addPatientRecord=()=>{
    const existing = readStoredPatientRecords()
    if(existing.some(record=>record.sourceAppointmentId===recordModal.id)){setAddedRecords(prev=>prev.includes(recordModal.id)?prev:[...prev,recordModal.id]);setRecordModal(null);showToast(`Record for ${recordModal.name} already exists`,'error');return}
    const medicines = recordMedicines.split(',').map(item=>item.trim()).filter(Boolean)
    const newRecord = {
      name: cleanPatientName(recordModal.name),
      id: `#RE-${String(Date.now()).slice(-4)}`,
      status: recordStatus,
      lastVisit: formatRecordDate(recordModal.date),
      condition: recordDiagnosis.trim(),
      illness: recordDiagnosis.trim(),
      medications: medicines,
      notes: recordNotes.trim(),
      img: DEFAULT_PATIENT_IMG,
      source: 'my-schedule',
      sourceAppointmentId: recordModal.id,
    }
    sessionStorage.setItem(PATIENT_RECORDS_KEY, JSON.stringify([newRecord, ...existing]))
    setAddedRecords(prev=>prev.includes(recordModal.id)?prev:[...prev,recordModal.id])
    setRecordModal(null)
    showToast(`${recordModal.name} added to Patient Records`)
  }

  return (
    <div className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full">
      <header className="mb-10 flex justify-between items-end reveal">
        <div>
          <h1 className="text-4xl font-semibold text-on-surface tracking-tight mb-2">My Schedule</h1>
          <p className="text-on-surface-variant text-lg">{dateStr}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6 reveal reveal-delay-1">
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
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('rescheduleAppt',a)}><span className="material-symbols-outlined text-base text-secondary">event</span> Reschedule</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('contact',a)}><span className="material-symbols-outlined text-base text-tertiary">chat</span> Contact Patient</button>
                        {(a.status==='Completed'||a.status==='No-Show')&&(
                          <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>{
                            setMenuOpen(null)
                            if(a.status==='No-Show'){showToast(`Cannot add record — ${a.name} did not attend the meeting`,'error');return}
                            if(addedRecords.includes(a.id)){showToast(`Record for ${a.name} already added`);return}
                            resetRecordForm(a);setModalError('');setRecordModal(a)
                          }}><span className={`material-symbols-outlined text-base ${addedRecords.includes(a.id)?'text-green-600':'text-primary'}`}>{addedRecords.includes(a.id)?'check_circle':'post_add'}</span> {addedRecords.includes(a.id)?'Record Added':'Add to Patient Records'}</button>
                        )}
                        {!(a.status==='Completed'||a.status==='No-Show')&&(
                          <button className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container/20 flex items-center gap-3" onClick={()=>openAction('cancel',a)}><span className="material-symbols-outlined text-base">cancel</span> Cancel Appointment</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6 reveal reveal-delay-2">
          <div className="bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-6">Today's Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-on-primary/10 pb-4"><span className="text-on-primary/70">Total Appointments</span><span className="text-2xl font-bold">12</span></div>
                <div className="flex justify-between items-center border-b border-on-primary/10 pb-4"><span className="text-on-primary/70">Completed</span><span className="text-2xl font-bold">7</span></div>
                <div className="flex justify-between items-center border-b border-on-primary/10 pb-4"><span className="text-on-primary/70">Remaining</span><span className="text-2xl font-bold">5</span></div>
                <div className="flex justify-between items-center"><span className="text-on-primary/70">Next Meeting At</span><span className="text-2xl font-bold">2:15 PM</span></div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-container/10 rounded-full"></div>
          </div>

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

          <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Availability Management</h4>
            <button className="w-full text-left p-4 rounded-lg bg-surface-container-lowest flex items-center justify-between hover:translate-x-1 transition-transform group shadow-sm" onClick={()=>{setModalError('');setBlockDate('');setBlockModal(true)}}>
              <span className="flex items-center gap-3 font-semibold"><span className="material-symbols-outlined text-primary">schedule</span> Block Out Time</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
            </button>
            <button className="w-full text-left p-4 rounded-lg bg-surface-container-lowest flex items-center justify-between hover:translate-x-1 transition-transform group shadow-sm" onClick={()=>{
              setRescheduleDate(selDateStr)
              setRescheduleTime('')
              setModalError('')
              setRescheduleModal(true)
            }}>
              <span className="flex items-center gap-3 font-semibold"><span className="material-symbols-outlined text-primary">sync_alt</span> Reschedule Day</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

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
                  if(rescheduleDate < todayStr()){setModalError('Cannot reschedule to a past date.');return}
                  const [hh,mm] = rescheduleTime.split(':')
                  let h = parseInt(hh,10)
                  const ampm = h >= 12 ? 'PM' : 'AM'
                  h = h % 12 || 12
                  const formattedTime = `${String(h).padStart(2,'0')}:${mm} ${ampm}`
                  // Check for time conflict on target date
                  const conflicting = appointments.filter(a=>a.id!==detailPatient.id && a.date===rescheduleDate && a.time===formattedTime)
                  if(conflicting.length>0){setModalError(`Cannot schedule two meetings on the same date and time.`);return}
                  // Check for duplicate (same patient already on target date)
                  const duplicate = appointments.filter(a=>a.id!==detailPatient.id && a.date===rescheduleDate && a.name===detailPatient.name)
                  if(duplicate.length>0){setModalError(`This meeting is already scheduled. Please attend the existing appointment first.`);return}
                  const isPast = detailPatient.status==='Completed'||detailPatient.status==='No-Show'
                  if(isPast){
                    setAppointments(prev=>[...prev, { ...detailPatient, id: Date.now(), date: rescheduleDate, time: formattedTime, status: 'Pending', color: 'bg-surface-container-highest', faded: true, needsPatientAcceptance: true }])
                  } else {
                    setAppointments(prev=>prev.map(a=>a.id===detailPatient.id?{...a,date:rescheduleDate,time:formattedTime,status:'Pending',color:'bg-surface-container-highest',faded:true}:a))
                  }
                  jumpToDate(rescheduleDate)
                  closeModal();setRescheduleDate('');setRescheduleTime('');setModalError('')
                  showToast(`Notification sent to ${detailPatient.name} for acceptance`)
                }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {blockModal&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={()=>setBlockModal(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl z-10 p-8">
            <div className="flex justify-between items-center mb-2"><h2 className="text-xl font-bold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">schedule</span> Block Out Time</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={()=>setBlockModal(false)}>close</button></div>
            <p className="text-xs text-secondary mb-6">Mark yourself as unavailable for a specific time period.</p>
            <div className="space-y-5">
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date</label><input type="date" min={todayStr()} value={blockDate} onChange={e=>{setBlockDate(e.target.value);setModalError('')}} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
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
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{if(!blockDate){setModalError('Please select a date.');return};if(blockDate<todayStr()){setModalError('Cannot block out past dates.');return};setBlockModal(false);setBlockDate('');setModalError('');showToast('Time blocked out successfully')}}>Block Time</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  const sourceAppts = appointments.filter(a=>a.date===rescheduleDate)
                  if(sourceAppts.length===0){setModalError('No meetings found on this date to reschedule.');return}
                  if(rescheduleDate < todayStr()){setModalError('This day has already passed and cannot be rescheduled. Please reschedule past appointments individually using the 3-dot menu.');return}
                  if(rescheduleTime < todayStr()){setModalError('Cannot reschedule meetings to a past date.');return}
                  const targetAppts = appointments.filter(a=>a.date===rescheduleTime)
                  // Check for time conflicts on target date
                  for(const src of sourceAppts){
                    const conflict = targetAppts.find(t=>t.time===src.time)
                    if(conflict){setModalError(`Cannot schedule two meetings on the same date and time.`);return}
                  }
                  // Check for duplicate times within source appointments themselves on the target
                  const srcTimes = sourceAppts.map(s=>s.time)
                  const hasDupTimes = srcTimes.some((t,i)=>srcTimes.indexOf(t)!==i)
                  if(hasDupTimes){setModalError('Cannot schedule 2 meetings on the same date and time.');return}
                  // Check if any source patient already has a meeting on target date
                  for(const src of sourceAppts){
                    const dup = targetAppts.find(t=>t.name===src.name)
                    if(dup){setModalError(`This meeting is already scheduled. Please attend the existing appointment first.`);return}
                  }
                  const count = sourceAppts.length
                  setAppointments(prev=>prev.map(a=>a.date===rescheduleDate?{...a,date:rescheduleTime,status:'Pending',color:'bg-surface-container-highest',faded:true}:a))
                  setRescheduleModal(false);setRescheduleDate('');setRescheduleTime('');setModalError('')
                  showToast(`Notification sent to ${count} patient${count!==1?'s':''} for acceptance`)
                }}>Reschedule All</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {recordModal&&(/* Clear error when opening */
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={()=>setRecordModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl z-10 p-10 max-h-[90vh] overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-on-surface">Add Clinical Record</h2>
              <p className="text-sm text-secondary">Documenting visit for <span className="font-semibold text-primary">{recordModal.name}</span></p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Record Status</label><select value={recordStatus} onChange={e=>setRecordStatus(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-sm">{RECORD_STATUS_OPTIONS.map(status=><option key={status}>{status}</option>)}</select></div>
                <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Consult Date</label><div className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-sm font-semibold">{formatRecordDate(recordModal.date)}</div></div>
              </div>
              {/* Illness Block */}
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-tertiary text-lg">coronavirus</span><label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Illness / Diagnosis <span className="text-error">*</span></label></div>
                <textarea id="schedule-rec-diagnosis" value={recordDiagnosis} onChange={e=>{setRecordDiagnosis(e.target.value);e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-sm resize-none overflow-hidden" rows="1" placeholder="e.g. Mild Hypertension" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('schedule-rec-medicines')?.focus()}}}></textarea>
              </div>
              {/* Medications Block (Optional) */}
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings:'"FILL" 1'}}>medication</span><label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Prescribed Medications</label></div><span className="text-[10px] text-secondary font-medium italic">Optional</span></div>
                <textarea id="schedule-rec-medicines" value={recordMedicines} onChange={e=>{setRecordMedicines(e.target.value);e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface text-sm resize-none overflow-hidden" rows="1" placeholder="e.g. Lisinopril 10mg, Atorvastatin 20mg" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('schedule-rec-notes')?.focus()}}}></textarea>
              </div>
              {/* Doctor's Notes Block */}
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-1"><span className="material-symbols-outlined text-primary text-lg">clinical_notes</span><label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Doctor's Notes <span className="text-error">*</span></label></div>
                <p className="text-[10px] text-secondary mb-3">Press Shift+Enter for a new line</p>
                <textarea id="schedule-rec-notes" value={recordNotes} onChange={e=>{setRecordNotes(e.target.value);e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface resize-none overflow-hidden text-sm" rows="3" placeholder="Write clinical notes, recommendations, prescriptions..." onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(recordDiagnosis.trim()&&recordNotes.trim()){addPatientRecord()}else{setModalError('Please fill all required fields.')}}}}></textarea>
              </div>
              {modalError && <p className="text-xs text-error font-medium bg-error-container/20 p-3 rounded-lg">{modalError}</p>}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high" onClick={()=>setRecordModal(null)}>Discard</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{
                  if(!recordDiagnosis.trim()){setModalError('Diagnosis is required.');return}
                  if(!recordNotes.trim()){setModalError("Notes are required.");return}
                  addPatientRecord()
                }}>Save Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
