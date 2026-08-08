import { useState } from 'react'

const DOCTOR_NOTIFICATIONS = [
  { icon: 'videocam', iconBg: 'bg-primary-container', iconColor: 'text-primary', title: 'Video consultation confirmed', desc: 'Zubair Ahmed - Oct 24 at 10:00 AM', time: '2 minutes ago' },
  { icon: 'lab_profile', iconBg: 'bg-tertiary-container/50', iconColor: 'text-tertiary', title: 'New patient request', desc: 'Ayesha Gillani requests a consultation', time: '1 hour ago' },
  { icon: 'medication', iconBg: 'bg-secondary-container/50', iconColor: 'text-secondary', title: 'Schedule update reminder', desc: "Tomorrow's schedule has 2 new bookings", time: '3 hours ago' },
]
const DOCTOR_EXTRA = [
  { icon: 'event_available', iconBg: 'bg-primary-container', iconColor: 'text-primary', title: 'Appointment rescheduled', desc: 'Mr. Hassan moved to Oct 28 at 2:00 PM', time: '5 hours ago' },
  { icon: 'feedback', iconBg: 'bg-tertiary-container/50', iconColor: 'text-tertiary', title: 'New patient review', desc: 'Sarah Chen left a 5-star review', time: 'Yesterday' },
]
const PATIENT_NOTIFICATIONS = [
  { icon: 'videocam', iconBg: 'bg-primary-container', iconColor: 'text-primary', title: 'Video consultation confirmed', desc: 'Dr. Arsalan Khan - Oct 24 at 10:00 AM', time: '2 minutes ago' },
  { icon: 'lab_profile', iconBg: 'bg-tertiary-container/50', iconColor: 'text-tertiary', title: 'Lab results are ready', desc: 'Your blood work report is now available', time: '1 hour ago' },
  { icon: 'medication', iconBg: 'bg-secondary-container/50', iconColor: 'text-secondary', title: 'Prescription refill reminder', desc: 'Your prescription expires in 3 days', time: '3 hours ago' },
]
const PATIENT_EXTRA = [
  { icon: 'event_available', iconBg: 'bg-primary-container', iconColor: 'text-primary', title: 'Appointment confirmed', desc: 'Dr. Arsalan Khan - Oct 28 at 3:00 PM', time: '6 hours ago' },
  { icon: 'health_and_safety', iconBg: 'bg-secondary-container/50', iconColor: 'text-secondary', title: 'Health tip of the day', desc: 'Stay hydrated — drink at least 8 glasses of water', time: 'Yesterday' },
]

function NotifItem({ n }) {
  return (
    <div className="p-4 hover:bg-surface-container-low transition-colors cursor-pointer">
      <div className="flex gap-3">
        <div className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center shrink-0`}>
          <span className={`material-symbols-outlined ${n.iconColor} text-sm`}>{n.icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface">{n.title}</p>
          <p className="text-xs text-secondary mt-0.5">{n.desc}</p>
          <p className="text-[10px] text-outline mt-1">{n.time}</p>
        </div>
      </div>
    </div>
  )
}

export default function NotificationPanel({ role = 'patient', show }) {
  const [showAll, setShowAll] = useState(false)
  const items = role === 'doctor' ? DOCTOR_NOTIFICATIONS : PATIENT_NOTIFICATIONS
  const extra = role === 'doctor' ? DOCTOR_EXTRA : PATIENT_EXTRA

  if (!show) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 z-[70] overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
        <h3 className="font-bold text-on-surface">Notifications</h3>
        <span className="text-[10px] font-bold text-primary bg-primary-container/30 px-2 py-0.5 rounded-full">{items.length + extra.length} New</span>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/5">
        {items.map((n, i) => <NotifItem key={i} n={n} />)}
        {showAll && extra.map((n, i) => <NotifItem key={`e${i}`} n={n} />)}
      </div>
      <div className="p-3 border-t border-outline-variant/10 text-center">
        <button className="text-xs font-bold text-primary hover:underline" onClick={(e) => { e.stopPropagation(); setShowAll(!showAll) }}>
          {showAll ? 'Show Less' : 'View All Notifications'}
        </button>
      </div>
    </div>
  )
}
