import { useState, useMemo } from 'react'
import { AdminSidebar } from '../components/Sidebars'

/* ─── Shared Data ─── */
const ALL_DOCTORS = [
  { id: 1, name: 'Dr. Arsalan Khan', spec: 'General Physician', location: 'Clifton, Karachi', rating: '4.9', price: 'PKR 2,500', gender: 'Male', status: 'Active', joined: 'Jan 15, 2024', patients: 128, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4LyJ5urRhYWaNc0fAHi1aTPLnVNXCr9Jt3_5dGQkr4oLP2ZKJVy6rIpZrwq0M2pRVXyd9husXHlkwbu953qA9NJcmVQTAwcoY5vO9R0WOEZVtm2ycNh4gYQqj8ef4G7tyZBVvySBVcnN79uOgWnsxrVhjq2L1tbDDu3svWyhtYP5QWFMxpJExQVH5qNCL1n71mb-T_7bbgRMoxc4ZKChtFLv2MhapV1uxN-3cexn7PW6JJV9r95g4ia08RxSTMZipeYxtApQyHQ', about: 'Experienced GP with 12+ years in family medicine, chronic disease management.' },
  { id: 2, name: 'Dr. Sarah Ahmed', spec: 'Pediatrician', location: 'DHA Phase VI, Karachi', rating: '5.0', price: 'PKR 3,000', gender: 'Female', status: 'Active', joined: 'Mar 22, 2024', patients: 95, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-KawnVanuKt14ZQFtYKaRGkXXXSy_dSCBaDU6_oWWDI5SkQxorawLqkFKaF28GKp9625EUcBiNzTKK07YeNngi0A4y91Wo6DBSKJSuFG4_A9Lqkh4KAeEXbCq0r8CxB8Q7egHxfNXcwNwJwjuFZtM2QXRDaEk3eaFm4b0dNFhihp70seNnWVEl5xw7SdlbO2ARt_0cMPWiTz7Z_ZGDtSwtYoXJQVrNdrAAXSne880taIH5w9NCdSq17vWdMaMszuEhamhlP5Ea58', about: 'Board-certified pediatrician at Aga Khan University Hospital.' },
  { id: 3, name: 'Dr. Mansoor Ali', spec: 'Psychiatrist', location: 'Gulshan-e-Iqbal, Karachi', rating: '4.8', price: 'PKR 5,000', gender: 'Male', status: 'Active', joined: 'Feb 10, 2024', patients: 67, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0R2oB8OJVQzikzuZsZ6-yi1yy7TSmFjQDJBvIqUptz-S9nkEMSg7m_2T8bN8g_MJqvKANbPxrqi0lLknSMt_nyI9WJBrd-_N38Hw2SvMNxS3IAr74fExUA_bY83zpTQVvIgt4QdZRoEmxfDVX84ATLqB64VZJCC1orZaIXsv38DyxOX1VgVLzUrqJ4_LSzdGgCGca54Kr2iMwFYlHICqj9RGSPgEb1rOvglrTyexlyQPcdJ-6hOenL48N__8-akZdUgGcu8bQ38A', about: 'Senior consultant psychiatrist specializing in CBT and mood disorders.' },
  { id: 4, name: 'Dr. Mariam Farooq', spec: 'Pediatrics', location: 'PECHS, Karachi', rating: '4.7', price: 'PKR 2,800', gender: 'Female', status: 'Pending', joined: 'May 01, 2025', patients: 0, img: '', about: 'Pediatrics specialist with focus on neonatal care.' },
  { id: 5, name: 'Dr. Sarah Khalil', spec: 'Cardiology', location: 'North Nazimabad, Karachi', rating: '4.6', price: 'PKR 4,500', gender: 'Female', status: 'Active', joined: 'Apr 18, 2024', patients: 82, img: '', about: 'Interventional cardiologist with 8 years of experience.' },
  { id: 6, name: 'Dr. Ahmed Raza', spec: 'General Practitioner', location: 'Bahadurabad, Karachi', rating: '4.5', price: 'PKR 2,000', gender: 'Male', status: 'Suspended', joined: 'Jun 05, 2024', patients: 45, img: '', about: 'GP with interest in preventive medicine and wellness.' },
]

const ALL_PATIENTS = [
  { id: '#RE-9021', name: 'Arsalan Khan', status: 'Active', lastVisit: '12 Oct 2023', condition: 'Hypertension Management', medications: ['Lisinopril 10mg', 'Atorvastatin 20mg'], doctor: 'Dr. Arsalan Khan' },
  { id: '#RE-8842', name: 'Zainab Ahmed', status: 'Critical', lastVisit: '05 Nov 2023', condition: 'Post-operative Recovery', medications: ['Cefixime 400mg', 'Paracetamol 500mg'], doctor: 'Dr. Sarah Ahmed' },
  { id: '#RE-4412', name: 'Omar Malik', status: 'Stable', lastVisit: '28 Oct 2023', condition: 'Type 2 Diabetes', medications: ['Metformin 500mg'], doctor: 'Dr. Ahmed Raza' },
  { id: '#RE-1256', name: 'Fatima Jinnah', status: 'Active', lastVisit: '01 Nov 2023', condition: 'Vaccination Follow-up', medications: [], doctor: 'Dr. Mariam Farooq' },
  { id: '#RE-3390', name: 'Bilal Siddiqui', status: 'Stable', lastVisit: '15 Oct 2023', condition: 'Gastrointestinal Follow-up', medications: ['Omeprazole 20mg'], doctor: 'Dr. Arsalan Khan' },
  { id: '#RE-7712', name: 'Sara Ahmed', status: 'Observation', lastVisit: '22 Oct 2023', condition: 'Allergic Reaction', medications: ['Cetirizine 10mg'], doctor: 'Dr. Sarah Khalil' },
]

const ALL_APPOINTMENTS = [
  { id: 1, patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '09:00 AM', type: 'General Check-up', status: 'Confirmed', location: 'Room 302' },
  { id: 2, patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '10:30 AM', type: 'Video Consult', status: 'Live Now', location: 'Online' },
  { id: 3, patient: 'Ms. Fatima Noor', doctor: 'Dr. Arsalan Khan', date: 'Tomorrow', time: '11:45 AM', type: 'Lab Review', status: 'Pending', location: 'In-Person' },
  { id: 4, patient: 'Ayesha Khan', doctor: 'Dr. Arsalan Khan', date: 'Tomorrow', time: '02:15 PM', type: 'Immunization', status: 'Confirmed', location: 'Room 104' },
  { id: 5, patient: 'Mr. Rafiq Hussain', doctor: 'Dr. Arsalan Khan', date: 'Yesterday', time: '09:30 AM', type: 'General Check-up', status: 'Completed', location: 'Room 201' },
  { id: 6, patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', date: 'Yesterday', time: '11:00 AM', type: 'Video Consult', status: 'No-Show', location: 'Online' },
  { id: 7, patient: 'Mr. Tariq Shah', doctor: 'Dr. Sarah Ahmed', date: 'Yesterday', time: '02:00 PM', type: 'Lab Review', status: 'Completed', location: 'Room 302' },
  { id: 8, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Oct 24, 2026', time: '10:30 AM', type: 'Cardiology', status: 'Confirmed', location: 'Online' },
  { id: 9, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Oct 28, 2026', time: '02:15 PM', type: 'General Practice', status: 'Confirmed', location: 'In-Person' },
  { id: 10, patient: 'Alyan Ahmed', doctor: 'Dr. Mariam Farooq', date: 'Sept 12, 2026', time: '10:00 AM', type: 'Pediatrics', status: 'Completed', location: 'In-Person' },
  { id: 11, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Aug 30, 2026', time: '11:00 AM', type: 'Cardiology', status: 'Not Attended', location: 'Online' },
  { id: 12, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Aug 15, 2026', time: '09:00 AM', type: 'General Practice', status: 'Completed', location: 'In-Person' },
]

const VIDEO_CALLS = [
  { id: 1, doctor: 'Dr. Arsalan Khan', patient: 'Mr. David Ahmed', date: 'Today', time: '10:30 AM', duration: '32 min', status: 'Live' },
  { id: 2, doctor: 'Dr. Mansoor Ali', patient: 'Mrs. Nadia Patel', date: 'Yesterday', time: '11:00 AM', duration: '—', status: 'Missed' },
  { id: 3, doctor: 'Dr. Sarah Khalil', patient: 'Alyan Ahmed', date: 'Aug 30, 2026', time: '11:00 AM', duration: '—', status: 'Not Attended' },
  { id: 4, doctor: 'Dr. Sarah Ahmed', patient: 'Mrs. Sarah Jenkins', date: 'Oct 10, 2026', time: '03:00 PM', duration: '28 min', status: 'Completed' },
  { id: 5, doctor: 'Dr. Arsalan Khan', patient: 'Ayesha Gillani', date: 'Oct 08, 2026', time: '04:00 PM', duration: '41 min', status: 'Completed' },
  { id: 6, doctor: 'Dr. Mansoor Ali', patient: 'Haris Vohra', date: 'Oct 05, 2026', time: '09:00 AM', duration: '35 min', status: 'Completed' },
]

const AI_QUERIES = [
  { id: 1, patient: 'Alyan Ahmed', query: 'Persistent lower back pain for 3 days, worse when sitting', response: 'Suggested physiotherapy evaluation', timestamp: '09:31 AM, Today', flag: false },
  { id: 2, patient: 'Arsalan Khan', query: 'Chest tightness and shortness of breath', response: 'Flagged for urgent cardiology referral', timestamp: '11:15 AM, Today', flag: true },
  { id: 3, patient: 'Zainab Ahmed', query: 'Post-surgery wound redness and swelling', response: 'Advised immediate doctor consultation', timestamp: '02:20 PM, Yesterday', flag: true },
  { id: 4, patient: 'Omar Malik', query: 'Blood sugar reading of 180 after meals', response: 'Recommended dietary adjustments and monitoring', timestamp: '04:00 PM, Yesterday', flag: false },
  { id: 5, patient: 'Fatima Jinnah', query: 'Child vaccination side effects — mild fever', response: 'Normal post-vaccination response, monitor for 48h', timestamp: '10:00 AM, Oct 20', flag: false },
  { id: 6, patient: 'Sara Ahmed', query: 'Recurring hives after eating shellfish', response: 'Suggested allergy testing and avoidance', timestamp: '03:30 PM, Oct 19', flag: false },
]

const TRANSACTIONS = [
  { id: 'TXN-001', patient: 'Alyan Ahmed', doctor: 'Dr. Arsalan Khan', amount: 'PKR 2,500', date: 'Oct 14, 2026', method: 'Card', status: 'Paid' },
  { id: 'TXN-002', patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', amount: 'PKR 4,500', date: 'Oct 24, 2026', method: 'Card', status: 'Paid' },
  { id: 'TXN-003', patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', amount: 'PKR 2,000', date: 'Oct 28, 2026', method: 'Crypto', status: 'Paid' },
  { id: 'TXN-004', patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', amount: 'PKR 2,500', date: 'Today', method: 'Card', status: 'Paid' },
  { id: 'TXN-005', patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', amount: 'PKR 2,500', date: 'Today', method: 'Card', status: 'Pending' },
  { id: 'TXN-006', patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', amount: 'PKR 5,000', date: 'Yesterday', method: 'Card', status: 'Refund Requested' },
  { id: 'TXN-007', patient: 'Ayesha Gillani', doctor: 'Dr. Arsalan Khan', amount: 'PKR 2,500', date: 'Oct 08', method: 'Card', status: 'Paid' },
  { id: 'TXN-008', patient: 'Haris Vohra', doctor: 'Dr. Mansoor Ali', amount: 'PKR 5,000', date: 'Oct 05', method: 'Crypto', status: 'Paid' },
]

const COMPLAINTS = [
  { id: 'CMP-001', from: 'Alyan Ahmed', role: 'Patient', subject: 'Video call connection issues', date: 'Oct 20, 2026', status: 'Open', priority: 'High', detail: 'The video call kept freezing during my consultation with Dr. Khalil. Had to reconnect 3 times.' },
  { id: 'CMP-002', from: 'Dr. Ahmed Raza', role: 'Doctor', subject: 'Schedule sync not working', date: 'Oct 18, 2026', status: 'In Progress', priority: 'Medium', detail: 'Appointments accepted from dashboard are not appearing in My Schedule page consistently.' },
  { id: 'CMP-003', from: 'Mrs. Nadia Patel', role: 'Patient', subject: 'Refund not processed', date: 'Oct 15, 2026', status: 'Open', priority: 'High', detail: 'Doctor did not attend the call but I was charged PKR 5,000. Requesting full refund.' },
  { id: 'CMP-004', from: 'Dr. Sarah Ahmed', role: 'Doctor', subject: 'Patient no-show policy', date: 'Oct 12, 2026', status: 'Resolved', priority: 'Low', detail: 'Need clarity on the platform policy for repeated patient no-shows.' },
  { id: 'CMP-005', from: 'Omar Malik', role: 'Patient', subject: 'AI diagnosis inaccuracy', date: 'Oct 10, 2026', status: 'In Progress', priority: 'Medium', detail: 'The AI suggested I might have a condition that my doctor later ruled out. Requesting review of AI accuracy.' },
]

const SPECIALIZATIONS = ['General Physician', 'Pediatrician', 'Psychiatrist', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon', 'Oncologist']

const MONTHLY_DATA = [
  { month: 'Jul', appointments: 38, revenue: 95000 },
  { month: 'Aug', appointments: 45, revenue: 112500 },
  { month: 'Sep', appointments: 52, revenue: 130000 },
  { month: 'Oct', appointments: 61, revenue: 152500 },
  { month: 'Nov', appointments: 48, revenue: 120000 },
  { month: 'Dec', appointments: 55, revenue: 137500 },
]

/* ─── Helper Components ─── */
const statusColor = (s) => {
  const map = { Active: 'bg-emerald-500/15 text-emerald-400', Pending: 'bg-amber-500/15 text-amber-400', Suspended: 'bg-red-500/15 text-red-400', Critical: 'bg-red-500/15 text-red-400', Stable: 'bg-sky-500/15 text-sky-400', Observation: 'bg-amber-500/15 text-amber-400', Completed: 'bg-emerald-500/15 text-emerald-400', Confirmed: 'bg-sky-500/15 text-sky-400', 'Live Now': 'bg-emerald-500/15 text-emerald-400 animate-pulse', 'No-Show': 'bg-red-500/15 text-red-400', 'Not Attended': 'bg-red-500/15 text-red-400', Live: 'bg-emerald-500/15 text-emerald-400 animate-pulse', Missed: 'bg-red-500/15 text-red-400', Paid: 'bg-emerald-500/15 text-emerald-400', 'Refund Requested': 'bg-amber-500/15 text-amber-400', Open: 'bg-red-500/15 text-red-400', 'In Progress': 'bg-amber-500/15 text-amber-400', Resolved: 'bg-emerald-500/15 text-emerald-400', High: 'bg-red-500/15 text-red-400', Medium: 'bg-amber-500/15 text-amber-400', Low: 'bg-sky-500/15 text-sky-400' }
  return map[s] || 'bg-white/10 text-white/60'
}

function Badge({ children, status }) {
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor(status || children)}`}>{children}</span>
}

function StatCard({ icon, label, value, sub, color = 'from-[#00d4aa] to-[#00a88a]' }) {
  return (
    <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        {sub && <span className="text-xs text-emerald-400 font-semibold">{sub}</span>}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-[#8899a6] font-medium">{label}</p>
    </div>
  )
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-[#00d4aa] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-[#8899a6] ml-10">{subtitle}</p>}
    </div>
  )
}

function TableWrapper({ children }) {
  return (
    <div className="bg-[#131f38] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function Th({ children, className = '' }) {
  return <th className={`px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#8899a6] ${className}`}>{children}</th>
}

function Td({ children, className = '' }) {
  return <td className={`px-5 py-4 text-sm ${className}`}>{children}</td>
}

/* ─── Main Component ─── */
export default function AdminDashboardPage() {
  const [section, setSection] = useState('overview')
  const [doctorList, setDoctorList] = useState(ALL_DOCTORS)
  const [patientList, setPatientList] = useState(ALL_PATIENTS)
  const [appointmentFilter, setAppointmentFilter] = useState('All')
  const [complaintList, setComplaintList] = useState(COMPLAINTS)
  const [specList, setSpecList] = useState(SPECIALIZATIONS)
  const [newSpec, setNewSpec] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filteredAppts = useMemo(() => {
    if (appointmentFilter === 'All') return ALL_APPOINTMENTS
    return ALL_APPOINTMENTS.filter(a => a.status === appointmentFilter)
  }, [appointmentFilter])

  /* ─── Section: Overview ─── */
  const renderOverview = () => {
    const totalRevenue = TRANSACTIONS.filter(t => t.status === 'Paid').reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, '')), 0)
    const maxAppts = Math.max(...MONTHLY_DATA.map(m => m.appointments))
    return (
      <>
        <SectionTitle icon="dashboard" title="Dashboard Overview" subtitle="Real-time platform metrics and activity" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon="group" label="Total Patients" value={ALL_PATIENTS.length} sub="+12%" />
          <StatCard icon="medical_services" label="Total Doctors" value={ALL_DOCTORS.length} sub="+2" color="from-[#6366f1] to-[#4f46e5]" />
          <StatCard icon="calendar_month" label="Total Appointments" value={ALL_APPOINTMENTS.length} color="from-[#f59e0b] to-[#d97706]" />
          <StatCard icon="payments" label="Total Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} sub="+18%" color="from-[#ec4899] to-[#db2777]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#131f38] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-[#8899a6] mb-1 font-medium">Active Cases</p>
            <p className="text-xl font-bold text-white">{ALL_PATIENTS.filter(p => p.status === 'Active').length}</p>
          </div>
          <div className="bg-[#131f38] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-[#8899a6] mb-1 font-medium">Pending Requests</p>
            <p className="text-xl font-bold text-amber-400">{doctorList.filter(d => d.status === 'Pending').length}</p>
          </div>
          <div className="bg-[#131f38] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-[#8899a6] mb-1 font-medium">Completed Sessions</p>
            <p className="text-xl font-bold text-emerald-400">{ALL_APPOINTMENTS.filter(a => a.status === 'Completed').length}</p>
          </div>
          <div className="bg-[#131f38] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-[#8899a6] mb-1 font-medium">No-Shows</p>
            <p className="text-xl font-bold text-red-400">{ALL_APPOINTMENTS.filter(a => a.status === 'No-Show' || a.status === 'Not Attended').length}</p>
          </div>
        </div>

        {/* Mini Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">Monthly Appointments</h3>
            <div className="flex items-end gap-3 h-40">
              {MONTHLY_DATA.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-[#8899a6] font-bold">{m.appointments}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00d4aa] to-[#00d4aa]/40 transition-all" style={{ height: `${(m.appointments / maxAppts) * 100}%` }} />
                  <span className="text-[10px] text-[#8899a6]">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">Revenue Trend (PKR)</h3>
            <div className="flex items-end gap-3 h-40">
              {MONTHLY_DATA.map(m => {
                const maxRev = Math.max(...MONTHLY_DATA.map(x => x.revenue))
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-[#8899a6] font-bold">{(m.revenue / 1000).toFixed(0)}k</span>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-[#6366f1] to-[#6366f1]/40 transition-all" style={{ height: `${(m.revenue / maxRev) * 100}%` }} />
                    <span className="text-[10px] text-[#8899a6]">{m.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: 'person_add', text: 'New patient Alyan Ahmed registered', time: '2 min ago', color: 'text-emerald-400' },
              { icon: 'check_circle', text: 'Dr. Arsalan Khan accepted appointment with Ayesha Gillani', time: '15 min ago', color: 'text-sky-400' },
              { icon: 'videocam', text: 'Video call between Dr. Arsalan Khan & Mr. David Ahmed started', time: '30 min ago', color: 'text-emerald-400' },
              { icon: 'warning', text: 'AI flagged urgent query from Arsalan Khan — chest tightness', time: '1 hour ago', color: 'text-amber-400' },
              { icon: 'payments', text: 'Payment of PKR 2,500 received from Mrs. Sarah Jenkins', time: '2 hours ago', color: 'text-emerald-400' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                <span className={`material-symbols-outlined ${a.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                <div className="flex-1"><p className="text-sm text-white/90">{a.text}</p></div>
                <span className="text-[10px] text-[#8899a6] whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  /* ─── Section: Doctor Management ─── */
  const renderDoctors = () => (
    <>
      <SectionTitle icon="medical_services" title="Doctor Management" subtitle={`${doctorList.length} registered doctors`} />
      <TableWrapper>
        <table className="w-full">
          <thead className="bg-[#0f1a2e]"><tr><Th>Doctor</Th><Th>Specialization</Th><Th>Location</Th><Th>Rating</Th><Th>Price</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {doctorList.map(d => (
              <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1a2a47] flex items-center justify-center overflow-hidden">
                      {d.img ? <img src={d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-[#8899a6] text-sm">person</span>}
                    </div>
                    <div><p className="font-semibold text-white text-sm">{d.name}</p><p className="text-[10px] text-[#8899a6]">{d.gender} • Joined {d.joined}</p></div>
                  </div>
                </Td>
                <Td className="text-white/80">{d.spec}</Td>
                <Td className="text-[#8899a6]">{d.location}</Td>
                <Td><span className="text-amber-400 font-bold">★ {d.rating}</span></Td>
                <Td className="text-white/80 font-medium">{d.price}</Td>
                <Td><Badge>{d.status}</Badge></Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setModal({ type: 'doctor', data: d })} className="px-3 py-1.5 rounded-lg bg-white/5 text-[#00d4aa] text-xs font-bold hover:bg-[#00d4aa]/10 transition-colors">View</button>
                    {d.status === 'Pending' && <button onClick={() => { setDoctorList(prev => prev.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); showToast(`${d.name} approved`) }} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors">Approve</button>}
                    {d.status === 'Active' && <button onClick={() => { setDoctorList(prev => prev.map(x => x.id === d.id ? { ...x, status: 'Suspended' } : x)); showToast(`${d.name} suspended`) }} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors">Suspend</button>}
                    {d.status === 'Suspended' && <button onClick={() => { setDoctorList(prev => prev.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); showToast(`${d.name} reactivated`) }} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors">Reactivate</button>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </>
  )

  /* ─── Section: Patient Management ─── */
  const renderPatients = () => (
    <>
      <SectionTitle icon="group" title="Patient Management" subtitle={`${patientList.length} registered patients`} />
      <TableWrapper>
        <table className="w-full">
          <thead className="bg-[#0f1a2e]"><tr><Th>Patient</Th><Th>ID</Th><Th>Status</Th><Th>Last Visit</Th><Th>Condition</Th><Th>Doctor</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {patientList.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <Td className="font-semibold text-white">{p.name}</Td>
                <Td className="text-[#8899a6] font-mono text-xs">{p.id}</Td>
                <Td><Badge>{p.status}</Badge></Td>
                <Td className="text-[#8899a6]">{p.lastVisit}</Td>
                <Td className="text-white/80 max-w-[200px] truncate">{p.condition}</Td>
                <Td className="text-white/70">{p.doctor}</Td>
                <Td className="text-right">
                  <button onClick={() => setModal({ type: 'patient', data: p })} className="px-3 py-1.5 rounded-lg bg-white/5 text-[#00d4aa] text-xs font-bold hover:bg-[#00d4aa]/10 transition-colors">Details</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </>
  )

  /* ─── Section: Appointments ─── */
  const renderAppointments = () => (
    <>
      <SectionTitle icon="calendar_month" title="Appointment Management" subtitle={`${ALL_APPOINTMENTS.length} total appointments`} />
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Confirmed', 'Completed', 'Pending', 'No-Show', 'Not Attended', 'Live Now'].map(f => (
          <button key={f} onClick={() => setAppointmentFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${appointmentFilter === f ? 'bg-[#00d4aa] text-[#0a1628]' : 'bg-white/5 text-[#8899a6] hover:bg-white/10 hover:text-white'}`}>{f}</button>
        ))}
      </div>
      <TableWrapper>
        <table className="w-full">
          <thead className="bg-[#0f1a2e]"><tr><Th>Patient</Th><Th>Doctor</Th><Th>Date</Th><Th>Time</Th><Th>Type</Th><Th>Location</Th><Th>Status</Th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {filteredAppts.map(a => (
              <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                <Td className="font-semibold text-white">{a.patient}</Td>
                <Td className="text-white/80">{a.doctor}</Td>
                <Td className="text-[#8899a6]">{a.date}</Td>
                <Td className="text-white/70">{a.time}</Td>
                <Td className="text-white/70">{a.type}</Td>
                <Td className="text-[#8899a6]">{a.location}</Td>
                <Td><Badge>{a.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppts.length === 0 && <div className="p-8 text-center text-[#8899a6] text-sm">No appointments match this filter.</div>}
      </TableWrapper>
    </>
  )

  /* ─── Section: Video Call Logs ─── */
  const renderVideoCalls = () => (
    <>
      <SectionTitle icon="videocam" title="Video Call Logs" subtitle="All video consultation sessions" />
      <TableWrapper>
        <table className="w-full">
          <thead className="bg-[#0f1a2e]"><tr><Th>Doctor</Th><Th>Patient</Th><Th>Date</Th><Th>Time</Th><Th>Duration</Th><Th>Status</Th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {VIDEO_CALLS.map(v => (
              <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                <Td className="font-semibold text-white">{v.doctor}</Td>
                <Td className="text-white/80">{v.patient}</Td>
                <Td className="text-[#8899a6]">{v.date}</Td>
                <Td className="text-white/70">{v.time}</Td>
                <Td className="text-white/70 font-medium">{v.duration}</Td>
                <Td><Badge>{v.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </>
  )

  /* ─── Section: AI Monitoring ─── */
  const renderAI = () => (
    <>
      <SectionTitle icon="psychology" title="AI Chat Monitoring" subtitle="User queries and safety alerts" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon="chat" label="Total Queries" value={AI_QUERIES.length} color="from-[#8b5cf6] to-[#7c3aed]" />
        <StatCard icon="avg_pace" label="Avg Response Time" value="1.8s" color="from-[#06b6d4] to-[#0891b2]" />
        <StatCard icon="flag" label="Flagged Queries" value={AI_QUERIES.filter(q => q.flag).length} sub="Needs Review" color="from-[#ef4444] to-[#dc2626]" />
      </div>
      <TableWrapper>
        <table className="w-full">
          <thead className="bg-[#0f1a2e]"><tr><Th>Patient</Th><Th>Query</Th><Th>AI Response</Th><Th>Timestamp</Th><Th>Flag</Th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {AI_QUERIES.map(q => (
              <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                <Td className="font-semibold text-white">{q.patient}</Td>
                <Td className="text-white/80 max-w-[220px] truncate">{q.query}</Td>
                <Td className="text-[#8899a6] max-w-[220px] truncate">{q.response}</Td>
                <Td className="text-[#8899a6] text-xs whitespace-nowrap">{q.timestamp}</Td>
                <Td>{q.flag ? <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>Flagged</span> : <span className="text-emerald-400 text-xs font-bold">Safe</span>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </>
  )

  /* ─── Section: Payments ─── */
  const renderPayments = () => {
    const totalRevenue = TRANSACTIONS.filter(t => t.status === 'Paid').reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, '')), 0)
    const pendingAmount = TRANSACTIONS.filter(t => t.status === 'Pending').reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, '')), 0)
    const refundAmount = TRANSACTIONS.filter(t => t.status === 'Refund Requested').reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, '')), 0)
    return (
      <>
        <SectionTitle icon="payments" title="Payments" subtitle="Financial overview and transactions" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon="account_balance" label="Total Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} color="from-[#00d4aa] to-[#00a88a]" />
          <StatCard icon="pending" label="Pending" value={`PKR ${pendingAmount.toLocaleString()}`} color="from-[#f59e0b] to-[#d97706]" />
          <StatCard icon="undo" label="Refund Requests" value={`PKR ${refundAmount.toLocaleString()}`} color="from-[#ef4444] to-[#dc2626]" />
          <StatCard icon="trending_up" label="Avg Consultation" value="PKR 3,250" color="from-[#6366f1] to-[#4f46e5]" />
        </div>
        <TableWrapper>
          <table className="w-full">
            <thead className="bg-[#0f1a2e]"><tr><Th>TX ID</Th><Th>Patient</Th><Th>Doctor</Th><Th>Amount</Th><Th>Date</Th><Th>Method</Th><Th>Status</Th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {TRANSACTIONS.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <Td className="text-[#00d4aa] font-mono text-xs font-bold">{t.id}</Td>
                  <Td className="font-semibold text-white">{t.patient}</Td>
                  <Td className="text-white/80">{t.doctor}</Td>
                  <Td className="text-white font-bold">{t.amount}</Td>
                  <Td className="text-[#8899a6]">{t.date}</Td>
                  <Td><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${t.method === 'Crypto' ? 'text-amber-400' : 'text-sky-400'}`}><span className="material-symbols-outlined text-sm">{t.method === 'Crypto' ? 'currency_bitcoin' : 'credit_card'}</span>{t.method}</span></Td>
                  <Td><Badge>{t.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </>
    )
  }

  /* ─── Section: Reports ─── */
  const renderReports = () => {
    const statusCounts = ALL_PATIENTS.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc }, {})
    const condCounts = ALL_PATIENTS.reduce((acc, p) => { acc[p.condition] = (acc[p.condition] || 0) + 1; return acc }, {})
    const topDoctors = [...ALL_DOCTORS].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5)
    return (
      <>
        <SectionTitle icon="analytics" title="Reports & Analytics" subtitle="Platform insights and trends" />

        {/* Patient Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">Patient Status Distribution</h3>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-4">
                  <Badge status={status}>{status}</Badge>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${status === 'Active' ? 'bg-emerald-500' : status === 'Critical' ? 'bg-red-500' : status === 'Stable' ? 'bg-sky-500' : 'bg-amber-500'}`} style={{ width: `${(count / ALL_PATIENTS.length) * 100}%` }} />
                  </div>
                  <span className="text-sm text-white font-bold w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">Common Conditions</h3>
            <div className="space-y-3">
              {Object.entries(condCounts).map(([cond, count]) => (
                <div key={cond} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/80">{cond}</span>
                  <span className="text-xs font-bold text-[#00d4aa] bg-[#00d4aa]/10 px-2.5 py-1 rounded-full">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-6">Top Rated Doctors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topDoctors.map((d, i) => (
              <div key={d.id} className="bg-[#0f1a2e] rounded-xl p-4 text-center border border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00a88a] mx-auto flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">#{i + 1}</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">{d.name}</p>
                <p className="text-[10px] text-[#8899a6] mb-2">{d.spec}</p>
                <span className="text-amber-400 font-bold text-sm">★ {d.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  /* ─── Section: Complaints ─── */
  const renderComplaints = () => (
    <>
      <SectionTitle icon="support_agent" title="Complaints & Support" subtitle={`${complaintList.length} total tickets`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon="error" label="Open Tickets" value={complaintList.filter(c => c.status === 'Open').length} color="from-[#ef4444] to-[#dc2626]" />
        <StatCard icon="pending" label="In Progress" value={complaintList.filter(c => c.status === 'In Progress').length} color="from-[#f59e0b] to-[#d97706]" />
        <StatCard icon="check_circle" label="Resolved" value={complaintList.filter(c => c.status === 'Resolved').length} color="from-[#00d4aa] to-[#00a88a]" />
      </div>
      <TableWrapper>
        <table className="w-full">
          <thead className="bg-[#0f1a2e]"><tr><Th>ID</Th><Th>From</Th><Th>Role</Th><Th>Subject</Th><Th>Date</Th><Th>Priority</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {complaintList.map(c => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <Td className="text-[#00d4aa] font-mono text-xs font-bold">{c.id}</Td>
                <Td className="font-semibold text-white">{c.from}</Td>
                <Td className="text-[#8899a6]">{c.role}</Td>
                <Td className="text-white/80 max-w-[200px] truncate">{c.subject}</Td>
                <Td className="text-[#8899a6]">{c.date}</Td>
                <Td><Badge>{c.priority}</Badge></Td>
                <Td><Badge>{c.status}</Badge></Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setModal({ type: 'complaint', data: c })} className="px-3 py-1.5 rounded-lg bg-white/5 text-[#00d4aa] text-xs font-bold hover:bg-[#00d4aa]/10 transition-colors">View</button>
                    {c.status !== 'Resolved' && <button onClick={() => { setComplaintList(prev => prev.map(x => x.id === c.id ? { ...x, status: 'Resolved' } : x)); showToast(`${c.id} resolved`) }} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors">Resolve</button>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </>
  )

  /* ─── Section: Settings ─── */
  const renderSettings = () => (
    <>
      <SectionTitle icon="settings" title="Platform Settings" subtitle="Manage categories, rules, and configurations" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specializations */}
        <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#00d4aa] text-lg">category</span>Manage Specializations</h3>
          <div className="flex gap-2 mb-4">
            <input type="text" value={newSpec} onChange={e => setNewSpec(e.target.value)} placeholder="Add new specialization..." className="flex-1 bg-[#0f1a2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#8899a6] focus:border-[#00d4aa]/40 focus:ring-1 focus:ring-[#00d4aa]/20 outline-none transition-all" />
            <button onClick={() => { if (newSpec.trim() && !specList.includes(newSpec.trim())) { setSpecList(prev => [...prev, newSpec.trim()]); setNewSpec(''); showToast('Specialization added') } }} className="px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a1628] text-sm font-bold hover:bg-[#00b894] transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {specList.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/80 text-xs font-medium border border-white/10">
                {s}
                <button onClick={() => { setSpecList(prev => prev.filter(x => x !== s)); showToast(`${s} removed`) }} className="hover:text-red-400 transition-colors"><span className="material-symbols-outlined text-sm">close</span></button>
              </span>
            ))}
          </div>
        </div>

        {/* Platform Rules */}
        <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#00d4aa] text-lg">gavel</span>Platform Rules</h3>
          <div className="space-y-4">
            {[
              { label: 'Cancellation Policy', value: 'Non-refundable after confirmation' },
              { label: 'No-Show Policy', value: 'Repayment required for rescheduling' },
              { label: 'Refund Window', value: '24 hours before appointment' },
              { label: 'Max Reschedules', value: '2 per appointment' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/80">{r.label}</span>
                <span className="text-xs font-bold text-[#00d4aa] bg-[#00d4aa]/10 px-3 py-1.5 rounded-lg">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#00d4aa] text-lg">shield</span>Privacy Settings</h3>
          <div className="space-y-4">
            {[
              { label: 'Data Retention Period', value: '5 years', enabled: true },
              { label: 'HIPAA Compliance Mode', value: 'Enabled', enabled: true },
              { label: 'Patient Consent Required', value: 'Active', enabled: true },
              { label: 'Anonymous AI Queries', value: 'Disabled', enabled: false },
            ].map(p => (
              <div key={p.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div><p className="text-sm text-white/80">{p.label}</p><p className="text-[10px] text-[#8899a6]">{p.value}</p></div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${p.enabled ? 'bg-[#00d4aa]' : 'bg-white/20'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${p.enabled ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Types */}
        <div className="bg-[#131f38] rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#00d4aa] text-lg">event_note</span>Appointment Types</h3>
          <div className="space-y-3">
            {['General Check-up', 'Video Consultation', 'Lab Review', 'Immunization', 'Follow-up', 'Emergency', 'Prescription Refill'].map(t => (
              <div key={t} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="w-2 h-2 rounded-full bg-[#00d4aa]" />
                <span className="text-sm text-white/80">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  /* ─── Render Section ─── */
  const renderSection = () => {
    switch (section) {
      case 'overview': return renderOverview()
      case 'doctors': return renderDoctors()
      case 'patients': return renderPatients()
      case 'appointments': return renderAppointments()
      case 'videocalls': return renderVideoCalls()
      case 'ai': return renderAI()
      case 'payments': return renderPayments()
      case 'reports': return renderReports()
      case 'complaints': return renderComplaints()
      case 'settings': return renderSettings()
      default: return renderOverview()
    }
  }

  return (
    <div className="min-h-screen">
      <AdminSidebar activeSection={section} onSectionChange={setSection} />
      <main className="ml-64 min-h-screen p-8">
        {renderSection()}
      </main>

      {/* Detail Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-[#131f38] rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {modal.type === 'doctor' && 'Doctor Profile'}
                {modal.type === 'patient' && 'Patient Details'}
                {modal.type === 'complaint' && `Ticket ${modal.data.id}`}
              </h3>
              <button onClick={() => setModal(null)} className="p-2 rounded-full hover:bg-white/10 text-[#8899a6] transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {modal.type === 'doctor' && (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#1a2a47] flex items-center justify-center overflow-hidden">
                      {modal.data.img ? <img src={modal.data.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-[#8899a6] text-2xl">person</span>}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{modal.data.name}</p>
                      <p className="text-sm text-[#00d4aa]">{modal.data.spec}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Location</p><p className="text-sm text-white">{modal.data.location}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Rating</p><p className="text-sm text-amber-400 font-bold">★ {modal.data.rating}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Price</p><p className="text-sm text-white">{modal.data.price}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Status</p><Badge>{modal.data.status}</Badge></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Patients</p><p className="text-sm text-white">{modal.data.patients}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Gender</p><p className="text-sm text-white">{modal.data.gender}</p></div>
                  </div>
                  <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">About</p><p className="text-sm text-white/80 leading-relaxed">{modal.data.about}</p></div>
                </>
              )}
              {modal.type === 'patient' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Name</p><p className="text-sm text-white font-bold">{modal.data.name}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">ID</p><p className="text-sm text-[#00d4aa] font-mono">{modal.data.id}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Status</p><Badge>{modal.data.status}</Badge></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Last Visit</p><p className="text-sm text-white">{modal.data.lastVisit}</p></div>
                    <div className="col-span-2"><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Condition</p><p className="text-sm text-white/80">{modal.data.condition}</p></div>
                    <div className="col-span-2"><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Assigned Doctor</p><p className="text-sm text-white">{modal.data.doctor}</p></div>
                  </div>
                  {modal.data.medications?.length > 0 && (
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-2">Medications</p>
                      <div className="flex flex-wrap gap-2">{modal.data.medications.map(m => <span key={m} className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs border border-white/10">{m}</span>)}</div>
                    </div>
                  )}
                </>
              )}
              {modal.type === 'complaint' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">From</p><p className="text-sm text-white font-bold">{modal.data.from}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Role</p><p className="text-sm text-white">{modal.data.role}</p></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Priority</p><Badge>{modal.data.priority}</Badge></div>
                    <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Status</p><Badge>{modal.data.status}</Badge></div>
                  </div>
                  <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Subject</p><p className="text-sm text-white font-medium">{modal.data.subject}</p></div>
                  <div><p className="text-[10px] text-[#8899a6] uppercase tracking-widest mb-1">Details</p><p className="text-sm text-white/80 leading-relaxed">{modal.data.detail}</p></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[110]">
          <div className="bg-[#00d4aa] text-[#0a1628] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-bold text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
