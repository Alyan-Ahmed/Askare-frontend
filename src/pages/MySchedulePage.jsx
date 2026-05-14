import { useState, useEffect } from 'react'

const APPTS = [
  { time: '09:00 AM', name: 'Mrs. Sarah Jenkins', type: 'General Check-up', location: 'Room 302', status: 'Confirmed', color: 'bg-primary-fixed-dim', purpose: 'Routine health assessment', notes: 'Patient has a history of mild hypertension.' },
  { time: '10:30 AM', name: 'Mr. David Ahmed', type: 'Video Consult', location: 'Online', status: 'Live Now', color: 'bg-tertiary-fixed-dim', icon: 'videocam', isVideo: true, purpose: 'Follow-up consultation', notes: 'Post-surgery follow-up.' },
  { time: '11:45 AM', name: 'Ms. Fatima Noor', type: 'Lab Review', location: 'In-Person', status: 'Pending', color: 'bg-surface-container-highest', faded: true, purpose: 'Laboratory results review', notes: 'Review recent CBC and thyroid panel.' },
  { time: '02:15 PM', name: 'Ayesha Khan', type: 'Immunization', location: 'Room 104', status: 'Confirmed', color: 'bg-primary-fixed-dim', purpose: 'Scheduled immunization', notes: 'Hepatitis B vaccine – dose 2 of 3.' },
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
  const [appointments, setAppointments] = useState(() => APPTS.map((appt, id) => ({ ...appt, id })))
  const [anchor, setAnchor] = useState(new Date(2026, 9, 21))
  const [selIdx, setSelIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(null)
  const [modal, setModal] = useState(null)
  const [detailPatient, setDetailPatient] = useState(null)
  const [toast, setToast] = useState('')
  const [blockModal, setBlockModal] = useState(false)
  const [rescheduleModal, setRescheduleModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')

  const days = Array.from({length:7},(_,i)=>{const d=new Date(anchor);d.setDate(d.getDate()+i);return d})
  const sel = days[selIdx]
  const dateStr = `${FULL[SHORT[sel.getDay()]]}, ${MONTHS[sel.getMonth()]} ${sel.getDate()}${suffix(sel.getDate())}, ${sel.getFullYear()}`

  useEffect(()=>{const h=()=>setMenuOpen(null);document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[])

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(''),4000)}
  const prevWeek=()=>{setAnchor(d=>{const n=new Date(d);n.setDate(n.getDate()-7);return n});setSelIdx(0)}
  const nextWeek=()=>{setAnchor(d=>{const n=new Date(d);n.setDate(n.getDate()+7);return n});setSelIdx(0)}

  const openAction=(action,appt)=>{setMenuOpen(null);setDetailPatient(appt);setContactMessage('');setModal(action)}
  const closeModal=()=>{setModal(null);setDetailPatient(null);setContactMessage('')}
  const cancelAppointment=()=>{const patientName=detailPatient.name;setAppointments(prev=>prev.filter(appt=>appt.id!==detailPatient.id));closeModal();showToast(`Appointment for ${patientName} cancelled`)}

  return (
    <div className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-semibold text-on-surface tracking-tight mb-2">My Schedule</h1>
          <p className="text-on-surface-variant text-lg">{dateStr}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Timeline */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
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
            {appointments.length === 0 ? (
              <div className="bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/10 text-center shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">event_busy</span>
                <h3 className="text-lg font-bold text-on-surface">No schedule or upcoming meetings</h3>
                <p className="text-sm text-on-surface-variant mt-1">Your schedule is clear for the selected day.</p>
              </div>
            ) : appointments.map((a,i)=>(
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
                  {a.status==='Live Now'?(
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tertiary-container/30 text-on-tertiary-container">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> Live Now
                    </div>
                  ):a.status==='Pending'?(
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">Pending</span>
                  ):(
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">Confirmed</span>
                  )}
                  <div className="relative" onClick={e=>e.stopPropagation()}>
                    <button className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-surface-container-high" onClick={()=>setMenuOpen(menuOpen===i?null:i)}>more_vert</button>
                    {menuOpen===i&&(
                      <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 z-50 py-2">
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('view',a)}><span className="material-symbols-outlined text-base text-primary">visibility</span> View Details</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('rescheduleAppt',a)}><span className="material-symbols-outlined text-base text-secondary">event</span> Reschedule</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-3" onClick={()=>openAction('contact',a)}><span className="material-symbols-outlined text-base text-tertiary">chat</span> Contact Patient</button>
                        <div className="border-t border-outline-variant/10 my-1"></div>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container/20 flex items-center gap-3" onClick={()=>openAction('cancel',a)}><span className="material-symbols-outlined text-base">cancel</span> Cancel Appointment</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
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
            <span className="font-bold text-on-surface block mb-6">October 2026</span>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S','M','T','W','T','F','S'].map((d,i)=>(<div key={i} className="font-bold opacity-40 mb-2">{d}</div>))}
              {[...Array(4)].map((_,i)=>(<div key={`b${i}`} className="py-2"></div>))}
              {Array.from({length:31},(_,i)=>i+1).map(d=>(
                <button key={d} className={`py-2 rounded-lg transition-all ${d===21?'font-bold bg-primary text-on-primary hover:opacity-90':'text-on-surface hover:bg-primary-container/30'}`}>{d}</button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Availability Management</h4>
            <button className="w-full text-left p-4 rounded-lg bg-surface-container-lowest flex items-center justify-between hover:translate-x-1 transition-transform group shadow-sm" onClick={()=>setBlockModal(true)}>
              <span className="flex items-center gap-3 font-semibold"><span className="material-symbols-outlined text-primary">schedule</span> Block Out Time</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
            </button>
            <button className="w-full text-left p-4 rounded-lg bg-surface-container-lowest flex items-center justify-between hover:translate-x-1 transition-transform group shadow-sm" onClick={()=>setRescheduleModal(true)}>
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
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Date</label><input type="date" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Time</label><input type="time" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={closeModal}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{closeModal();showToast(`Appointment rescheduled for ${detailPatient.name}`)}}>Confirm</button>
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
                <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface"><option value="">Select reason...</option><option>Patient Request</option><option>Doctor Unavailable</option><option>Emergency</option><option>Other</option></select>
              </div>
              <textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface resize-none" rows="3" placeholder="Additional notes..."></textarea>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={closeModal}>Keep</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-error text-on-error hover:opacity-90" onClick={cancelAppointment}>Cancel Appointment</button>
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
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date</label><input type="date" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface" /></div>
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
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>setBlockModal(false)}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{setBlockModal(false);showToast('Time blocked out successfully')}}>Block Time</button>
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
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Original Date</label><input type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Move To Date</label><input type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface" /></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Notification Message (Optional)</label><textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface resize-none" rows="3" placeholder="e.g. Due to an emergency..."></textarea></div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={()=>setRescheduleModal(false)}>Cancel</button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90" onClick={()=>{setRescheduleModal(false);showToast('All appointments rescheduled successfully')}}>Reschedule All</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast&&(
        <div className="fixed bottom-8 right-8 z-[90]">
          <div className="bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm animate-slide-up">
            <span className="material-symbols-outlined" style={{fontVariationSettings:'"FILL" 1'}}>check_circle</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
