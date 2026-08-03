import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const DEFAULT_DOCTORS = [
  { id: 1, uid: 'DOC-10201', name: 'Dr. Arsalan Khan', email: 'arsalan@askare.health', spec: 'General Physician', rating: '4.9', price: 'PKR 2,500', gender: 'Male', status: 'Active', joined: 'Jan 15, 2024', patients: 128, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4LyJ5urRhYWaNc0fAHi1aTPLnVNXCr9Jt3_5dGQkr4oLP2ZKJVy6rIpZrwq0M2pRVXyd9husXHlkwbu953qA9NJcmVQTAwcoY5vO9R0WOEZVtm2ycNh4gYQqj8ef4G7tyZBVvySBVcnN79uOgWnsxrVhjq2L1tbDDu3svWyhtYP5QWFMxpJExQVH5qNCL1n71mb-T_7bbgRMoxc4ZKChtFLv2MhapV1uxN-3cexn7PW6JJV9r95g4ia08RxSTMZipeYxtApQyHQ', about: 'Experienced GP with 12+ years in family medicine.' },
  { id: 2, uid: 'DOC-10302', name: 'Dr. Sarah Ahmed', email: 'sarah.a@askare.health', spec: 'Pediatrician', rating: '5.0', price: 'PKR 3,000', gender: 'Female', status: 'Active', joined: 'Mar 22, 2024', patients: 95, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-KawnVanuKt14ZQFtYKaRGkXXXSy_dSCBaDU6_oWWDI5SkQxorawLqkFKaF28GKp9625EUcBiNzTKK07YeNngi0A4y91Wo6DBSKJSuFG4_A9Lqkh4KAeEXbCq0r8CxB8Q7egHxfNXcwNwJwjuFZtM2QXRDaEk3eaFm4b0dNFhihp70seNnWVEl5xw7SdlbO2ARt_0cMPWiTz7Z_ZGDtSwtYoXJQVrNdrAAXSne880taIH5w9NCdSq17vWdMaMszuEhamhlP5Ea58', about: 'Board-certified pediatrician at Aga Khan University Hospital.' },
  { id: 3, uid: 'DOC-10403', name: 'Dr. Mansoor Ali', email: 'mansoor@askare.health', spec: 'Psychiatrist', rating: '4.8', price: 'PKR 5,000', gender: 'Male', status: 'Active', joined: 'Feb 10, 2024', patients: 67, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0R2oB8OJVQzikzuZsZ6-yi1yy7TSmFjQDJBvIqUptz-S9nkEMSg7m_2T8bN8g_MJqvKANbPxrqi0lLknSMt_nyI9WJBrd-_N38Hw2SvMNxS3IAr74fExUA_bY83zpTQVvIgt4QdZRoEmxfDVX84ATLqB64VZJCC1orZaIXsv38DyxOX1VgVLzUrqJ4_LSzdGgCGca54Kr2iMwFYlHICqj9RGSPgEb1rOvglrTyexlyQPcdJ-6hOenL48N__8-akZdUgGcu8bQ38A', about: 'Senior consultant psychiatrist specializing in CBT.' },
  { id: 4, uid: 'DOC-10504', name: 'Dr. Mariam Farooq', email: 'mariam@askare.health', spec: 'Pediatrician', rating: '4.7', price: 'PKR 2,800', gender: 'Female', status: 'Pending', joined: 'May 01, 2025', patients: 0, img: '', about: 'Pediatrics specialist with focus on neonatal care.' },
  { id: 5, uid: 'DOC-10605', name: 'Dr. Sarah Khalil', email: 'khalil@askare.health', spec: 'Cardiologist', rating: '4.6', price: 'PKR 4,500', gender: 'Female', status: 'Active', joined: 'Apr 18, 2024', patients: 82, img: '', about: 'Interventional cardiologist with 8 years of experience.' },
  { id: 6, uid: 'DOC-10706', name: 'Dr. Ahmed Raza', email: 'raza@askare.health', spec: 'General Physician', rating: '4.5', price: 'PKR 2,000', gender: 'Male', status: 'Suspended', joined: 'Jun 05, 2024', patients: 45, img: '', about: 'GP with interest in preventive medicine.' },
  { id: 7, uid: 'DOC-10807', name: 'Dr. Nadia Hassan', email: 'nadia@askare.health', spec: 'Cardiologist', rating: '4.7', price: 'PKR 4,000', gender: 'Female', status: 'Active', joined: 'Jul 20, 2024', patients: 54, img: '', about: 'Preventive cardiologist with research background.' },
  { id: 8, uid: 'DOC-10908', name: 'Dr. Usman Tariq', email: 'usman@askare.health', spec: 'Psychiatrist', rating: '4.4', price: 'PKR 4,500', gender: 'Male', status: 'Active', joined: 'Aug 03, 2024', patients: 39, img: '', about: 'Child & adolescent psychiatry specialist.' },
]

const DEFAULT_PATIENTS = [
  { uid: 'ASK-90210', name: 'Arsalan Khan', email: 'arsalan.k@gmail.com', gender: 'Male', status: 'Active', joined: 'Oct 12, 2023' },
  { uid: 'ASK-88420', name: 'Zainab Ahmed', email: 'zainab.a@gmail.com', gender: 'Female', status: 'Active', joined: 'Nov 05, 2023' },
  { uid: 'ASK-44120', name: 'Omar Malik', email: 'omar.m@gmail.com', gender: 'Male', status: 'Active', joined: 'Oct 28, 2023' },
  { uid: 'ASK-12560', name: 'Fatima Jinnah', email: 'fatima.j@gmail.com', gender: 'Female', status: 'Active', joined: 'Nov 01, 2023' },
  { uid: 'ASK-33900', name: 'Bilal Siddiqui', email: 'bilal.s@gmail.com', gender: 'Male', status: 'Active', joined: 'Oct 15, 2023' },
  { uid: 'ASK-77120', name: 'Sara Ahmed', email: 'sara.a@gmail.com', gender: 'Female', status: 'Active', joined: 'Oct 22, 2023' },
  { uid: 'ASK-19830', name: 'Hammad Ali', email: 'hammad.a@gmail.com', gender: 'Male', status: 'Suspended', joined: 'Sep 20, 2023' },
  { uid: 'ASK-55610', name: 'Aisha Noor', email: 'aisha.n@gmail.com', gender: 'Female', status: 'Active', joined: 'Dec 02, 2023' },
]

const ALL_APPOINTMENTS = [
  { id: 1, patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '09:00 AM', duration: '—', status: 'Confirmed' },
  { id: 2, patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '10:30 AM', duration: '32 min', status: 'Live Now' },
  { id: 3, patient: 'Ms. Fatima Noor', doctor: 'Dr. Arsalan Khan', date: 'Tomorrow', time: '11:45 AM', duration: '—', status: 'Confirmed' },
  { id: 4, patient: 'Ayesha Khan', doctor: 'Dr. Sarah Ahmed', date: 'Tomorrow', time: '02:15 PM', duration: '—', status: 'Confirmed' },
  { id: 5, patient: 'Mr. Rafiq Hussain', doctor: 'Dr. Arsalan Khan', date: 'Yesterday', time: '09:30 AM', duration: '24 min', status: 'Completed' },
  { id: 6, patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', date: 'Yesterday', time: '11:00 AM', duration: '—', status: 'Not Attended' },
  { id: 7, patient: 'Mr. Tariq Shah', doctor: 'Dr. Sarah Ahmed', date: 'Yesterday', time: '02:00 PM', duration: '28 min', status: 'Completed' },
  { id: 8, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Oct 24', time: '10:30 AM', duration: '—', status: 'Confirmed' },
  { id: 9, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Oct 28', time: '02:15 PM', duration: '—', status: 'Confirmed' },
  { id: 10, patient: 'Alyan Ahmed', doctor: 'Dr. Mariam Farooq', date: 'Sept 12', time: '10:00 AM', duration: '35 min', status: 'Completed' },
  { id: 11, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Aug 30', time: '11:00 AM', duration: '—', status: 'Not Attended' },
  { id: 12, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Aug 15', time: '09:00 AM', duration: '41 min', status: 'Completed' },
]

const VIDEO_CALLS = [
  { id: 1, doctor: 'Dr. Arsalan Khan', patient: 'Mr. David Ahmed', date: 'Today', time: '10:30 AM', duration: '32 min', status: 'Live Now' },
  { id: 2, doctor: 'Dr. Mansoor Ali', patient: 'Mrs. Nadia Patel', date: 'Yesterday', time: '11:00 AM', duration: '—', status: 'Not Attended' },
  { id: 3, doctor: 'Dr. Sarah Khalil', patient: 'Alyan Ahmed', date: 'Aug 30', time: '11:00 AM', duration: '—', status: 'Not Attended' },
  { id: 4, doctor: 'Dr. Sarah Ahmed', patient: 'Mrs. Sarah Jenkins', date: 'Oct 10', time: '03:00 PM', duration: '28 min', status: 'Completed' },
  { id: 5, doctor: 'Dr. Arsalan Khan', patient: 'Ayesha Gillani', date: 'Oct 08', time: '04:00 PM', duration: '41 min', status: 'Completed' },
  { id: 6, doctor: 'Dr. Mansoor Ali', patient: 'Haris Vohra', date: 'Oct 05', time: '09:00 AM', duration: '35 min', status: 'Completed' },
]

const AI_QUERIES = [
  { id: 1, patient: 'Alyan Ahmed', query: 'Persistent lower back pain for 3 days', response: 'Suggested physiotherapy evaluation', time: '09:31 AM, Today', flag: false },
  { id: 2, patient: 'Arsalan Khan', query: 'Chest tightness and shortness of breath', response: 'Flagged — urgent cardiology referral', time: '11:15 AM, Today', flag: true },
  { id: 3, patient: 'Zainab Ahmed', query: 'Post-surgery wound redness', response: 'Advised immediate doctor consultation', time: '02:20 PM, Yesterday', flag: true },
  { id: 4, patient: 'Omar Malik', query: 'Blood sugar reading of 180 mg/dL', response: 'Dietary adjustments recommended', time: '04:00 PM, Yesterday', flag: false },
  { id: 5, patient: 'Fatima Jinnah', query: 'Child has mild fever after vaccine', response: 'Normal post-vaccination response', time: '10:00 AM, Oct 20', flag: false },
  { id: 6, patient: 'Sara Ahmed', query: 'Recurring hives after shellfish', response: 'Allergy testing recommended', time: '03:30 PM, Oct 19', flag: false },
]

const TRANSACTIONS = [
  { id: 'TXN-4821', patient: 'Alyan Ahmed', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Oct 14, 2026', method: 'Debit Card', status: 'Completed' },
  { id: 'TXN-4822', patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', amount: 4500, date: 'Oct 24, 2026', method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-4823', patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', amount: 2000, date: 'Oct 28, 2026', method: 'Crypto (BTC)', status: 'Completed' },
  { id: 'TXN-4824', patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Today', method: 'Debit Card', status: 'Completed' },
  { id: 'TXN-4825', patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Today', method: 'Credit Card', status: 'Pending' },
  { id: 'TXN-4826', patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', amount: 5000, date: 'Yesterday', method: 'Debit Card', status: 'Refund Requested' },
  { id: 'TXN-4827', patient: 'Ayesha Gillani', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Oct 08', method: 'Debit Card', status: 'Completed' },
  { id: 'TXN-4828', patient: 'Haris Vohra', doctor: 'Dr. Mansoor Ali', amount: 5000, date: 'Oct 05', method: 'Crypto (USDT)', status: 'Completed' },
]

const COMPLAINTS = [
  { id: 'TKT-101', from: 'Alyan Ahmed', role: 'Patient', subject: 'Video call kept freezing', date: 'Oct 20, 2026', status: 'Open', detail: 'The video call kept freezing during my consultation with Dr. Khalil. Had to reconnect 3 times.' },
  { id: 'TKT-102', from: 'Dr. Ahmed Raza', role: 'Doctor', subject: 'Schedule sync not working', date: 'Oct 18, 2026', status: 'In Progress', detail: 'Appointments accepted from dashboard are not appearing in My Schedule page.' },
  { id: 'TKT-103', from: 'Mrs. Nadia Patel', role: 'Patient', subject: 'Refund not processed', date: 'Oct 15, 2026', status: 'Open', detail: 'Doctor did not attend the call but I was charged PKR 5,000. Requesting full refund.' },
  { id: 'TKT-104', from: 'Dr. Sarah Ahmed', role: 'Doctor', subject: 'Patient no-show policy', date: 'Oct 12, 2026', status: 'Resolved', detail: 'Need clarity on the platform policy for repeated patient no-shows.' },
  { id: 'TKT-105', from: 'Omar Malik', role: 'Patient', subject: 'AI diagnosis inaccuracy', date: 'Oct 10, 2026', status: 'In Progress', detail: 'The AI suggested a condition that my doctor later ruled out.' },
]

const MONTHLY = [
  { month: 'Jul', appts: 38, rev: 95000, patients: 12, doctors: 2 },
  { month: 'Aug', appts: 45, rev: 112500, patients: 18, doctors: 3 },
  { month: 'Sep', appts: 52, rev: 130000, patients: 24, doctors: 4 },
  { month: 'Oct', appts: 61, rev: 152500, patients: 31, doctors: 5 },
  { month: 'Nov', appts: 48, rev: 120000, patients: 36, doctors: 5 },
  { month: 'Dec', appts: 55, rev: 137500, patients: 42, doctors: 6 },
]
const ALL_TIME_DATA = [
  { month: 'Jan', appts: 18, rev: 45000, patients: 3, doctors: 1 },
  { month: 'Feb', appts: 22, rev: 55000, patients: 5, doctors: 1 },
  { month: 'Mar', appts: 28, rev: 70000, patients: 7, doctors: 2 },
  { month: 'Apr', appts: 31, rev: 77500, patients: 9, doctors: 2 },
  { month: 'May', appts: 35, rev: 87500, patients: 11, doctors: 2 },
  { month: 'Jun', appts: 33, rev: 82500, patients: 12, doctors: 2 },
  ...MONTHLY,
]


const DAILY_DATA = [
  { day: '1', appts: 2, rev: 5000, patients: 1, doctors: 0 },
  { day: '2', appts: 3, rev: 7500, patients: 0, doctors: 0 },
  { day: '3', appts: 1, rev: 2500, patients: 1, doctors: 0 },
  { day: '4', appts: 4, rev: 10000, patients: 2, doctors: 0 },
  { day: '5', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '6', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '7', appts: 5, rev: 12500, patients: 1, doctors: 0 },
  { day: '8', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '9', appts: 4, rev: 10000, patients: 2, doctors: 0 },
  { day: '10', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '11', appts: 1, rev: 2500, patients: 0, doctors: 0 },
  { day: '12', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '13', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '14', appts: 4, rev: 10000, patients: 2, doctors: 1 },
  { day: '15', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '16', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '17', appts: 5, rev: 12500, patients: 2, doctors: 0 },
  { day: '18', appts: 1, rev: 2500, patients: 0, doctors: 0 },
  { day: '19', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '20', appts: 4, rev: 10000, patients: 1, doctors: 0 },
  { day: '21', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '22', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '23', appts: 1, rev: 2500, patients: 0, doctors: 0 },
  { day: '24', appts: 4, rev: 10000, patients: 2, doctors: 0 },
  { day: '25', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '26', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '27', appts: 3, rev: 7500, patients: 1, doctors: 0 },
  { day: '28', appts: 5, rev: 12500, patients: 2, doctors: 0 },
  { day: '29', appts: 2, rev: 5000, patients: 0, doctors: 0 },
  { day: '30', appts: 3, rev: 7500, patients: 1, doctors: 0 },
]

/* Date sorting helper */
const parseDateRank = (d) => {
  if (!d) return 0
  const dl = d.toLowerCase()
  if (dl === 'today') return 99999
  if (dl === 'tomorrow') return 99998
  if (dl === 'yesterday') return 99997
  const months = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12 }
  const parts = d.replace(',','').split(' ')
  if (parts.length >= 2) { const m = months[parts[0].toLowerCase()] || 0; const day = parseInt(parts[1]) || 0; const yr = parts[2] ? parseInt(parts[2]) : 2026; return yr * 10000 + m * 100 + day }
  return 0
}
const sortByDate = (arr) => [...arr].sort((a, b) => parseDateRank(b.date) - parseDateRank(a.date))

const SPECS = ['General Physician', 'Pediatrician', 'Psychiatrist', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon', 'Oncologist']

const NAV = [
  { id: 'overview', icon: 'space_dashboard', label: 'Overview' },
  { id: 'doctors', icon: 'stethoscope', label: 'Doctors' },
  { id: 'patients', icon: 'groups', label: 'Patients' },
  { id: 'appointments', icon: 'event_note', label: 'Appointments' },
  { id: 'ai', icon: 'neurology', label: 'AI Monitoring' },
  { id: 'payments', icon: 'account_balance_wallet', label: 'Payments' },
  { id: 'complaints', icon: 'contact_support', label: 'Support' },
  { id: 'settings', icon: 'manufacturing', label: 'Settings' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const bdg = s => ({ Active:'bg-emerald-50 text-emerald-700 ring-emerald-600/20', Pending:'bg-amber-50 text-amber-700 ring-amber-600/20', Suspended:'bg-red-50 text-red-700 ring-red-600/20', Completed:'bg-[#059669]/10 text-[#059669] ring-[#059669]/20', Confirmed:'bg-[#2563eb]/10 text-[#2563eb] ring-[#2563eb]/20', 'Live Now':'bg-[#7c3aed]/10 text-[#7c3aed] ring-[#7c3aed]/20', 'Not Attended':'bg-[#dc2626]/10 text-[#dc2626] ring-[#dc2626]/20', 'Refund Requested':'bg-amber-50 text-amber-700 ring-amber-600/20', Open:'bg-red-50 text-red-700 ring-red-600/20', 'In Progress':'bg-amber-50 text-amber-700 ring-amber-600/20', Resolved:'bg-emerald-50 text-emerald-700 ring-emerald-600/20', Blocked:'bg-red-50 text-red-700 ring-red-600/20' })[s] || 'bg-gray-50 text-gray-600 ring-gray-500/20'

function B({ children }) { return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${bdg(children)}`}>{children}</span> }

function Kpi({ icon, label, value, sub, color = '#006977' }) {
  return (<div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '14' }}><span className="material-symbols-outlined text-2xl" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span></div>
      {sub && <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${typeof sub === 'string' && sub.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{sub}</span>}
    </div>
    <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
    <p className="text-sm text-gray-500 mt-1.5 font-medium">{label}</p>
  </div>)
}

function Head({ icon, title, count, children }) { return (<div className="flex items-center justify-between mb-7 flex-wrap gap-3"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#006977] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span><h2 className="text-2xl font-bold text-gray-900">{title}</h2></div><div className="flex items-center gap-3">{count !== undefined && <span className="text-sm font-semibold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">{count} total</span>}{children}</div></div>) }
function Card({ children, className = '' }) { return <div className={`bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ${className}`}>{children}</div> }
function SearchBar({ value, onChange, placeholder }) { return (<div className="relative mb-5"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span><input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none transition-all" /></div>) }
function TH({ children, className = '' }) { return <th className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 ${className}`}>{children}</th> }

/* SVG Area Chart */
function AreaChart({ data, dataKey, color, height = 200 }) {
  if (!data.length) return null
  const vals = data.map(d => d[dataKey]), max = Math.max(...vals), min = Math.min(...vals), range = max - min || 1
  const W = 520, padT = 25, padB = 32, cH = height - padT - padB, stepX = W / (data.length - 1)
  const pts = data.map((d, i) => ({ x: i * stepX, y: padT + cH - ((d[dataKey] - min) / range) * cH }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${W},${height - padB} L0,${height - padB} Z`
  const gId = `g-${color.replace('#', '')}-${dataKey}`
  return (<svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }}>
    <defs><linearGradient id={gId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
    {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = padT + cH * (1 - f); return <line key={f} x1="0" y1={y} x2={W} y2={y} stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="4,4" /> })}
    <path d={area} fill={`url(#${gId})`} /><path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {pts.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="4.5" fill="white" stroke={color} strokeWidth="2.5" /><text x={p.x} y={p.y - 13} textAnchor="middle" fill="#374151" style={{ fontSize: '11px', fontWeight: 600 }}>{dataKey === 'rev' ? `${(vals[i] / 1000).toFixed(0)}k` : vals[i]}</text><text x={p.x} y={height - 8} textAnchor="middle" fill="#9ca3af" style={{ fontSize: '11px' }}>{data[i].month}</text></g>))}
  </svg>)
}

/* Donut Chart */
function DonutChart({ segments, size = 160, centerLabel }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const r = 56, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r
  let off = 0
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="20" />
    {segments.map((seg, i) => { const pct = seg.value / total; const dash = circ * pct; const o = off; off += dash; return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="20" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-o} transform={`rotate(-90 ${cx} ${cy})`} /> })}
    <text x={cx} y={cy - 6} textAnchor="middle" fill="#111827" style={{ fontSize: '26px', fontWeight: 700 }}>{total}</text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="#9ca3af" style={{ fontSize: '11px', fontWeight: 500 }}>{centerLabel || 'Total'}</text>
  </svg>)
}

/* Horizontal bar */
function HBar({ label, value, max, color }) {
  return (<div className="flex items-center gap-4"><span className="text-sm text-gray-700 font-medium" style={{ minWidth: 140 }}>{label}</span><div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${Math.max((value / max) * 100, 8)}%`, backgroundColor: color }} /></div><span className="text-sm font-bold text-gray-800 w-6 text-right">{value}</span></div>)
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('overview')
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS)
  const [patients, setPatients] = useState(DEFAULT_PATIENTS)
  const [apptFilter, setApptFilter] = useState('All')
  const [payRange, setPayRange] = useState('all')
  const [payStatus, setPayStatus] = useState('All')
  const [complaints, setComplaints] = useState(COMPLAINTS)
  const [specs, setSpecs] = useState(SPECS)
  const [newSpec, setNewSpec] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const [patSearch, setPatSearch] = useState('')
  const [chartRange, setChartRange] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('Jul')
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showPayFilter, setShowPayFilter] = useState(false)
  const [payDateFrom, setPayDateFrom] = useState('')
  const [payDateTo, setPayDateTo] = useState('')
  const [privacy, setPrivacy] = useState({ dataRetention: true, hipaa: true, patientConsent: true, anonAI: false, twoFactor: true, auditLog: true, encryptBackup: true, sessionTimeout: true })
  const [notifSettings, setNotifSettings] = useState({ emailNotif: true, smsAlerts: false, systemAnnouncements: true, maintenanceAlerts: true })
  const [paySettings, setPaySettings] = useState({ currency: 'PKR', commission: '10', autoRefund: false, methods: ['Debit Card', 'Credit Card', 'Crypto (BTC)', 'Crypto (USDT)', 'JazzCash', 'EasyPaisa'] })
  const [consultSettings, setConsultSettings] = useState({ defaultDuration: '30', maxDaily: '12', bufferTime: '10', recording: false })
  const [maintenance, setMaintenance] = useState({ enabled: false, message: 'We are currently performing scheduled maintenance. Please check back soon.', downtime: '2 hours' })
  const toastTimer = useRef(null)

  const flash = m => {
    setToast(m)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setToast('')
      toastTimer.current = null
    }, 3000)
  }
  const togglePrivacy = k => { setPrivacy(p => ({ ...p, [k]: !p[k] })); flash(`${k} ${privacy[k] ? 'disabled' : 'enabled'}`) }

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  const filteredAppts = useMemo(() => sortByDate(apptFilter === 'All' ? ALL_APPOINTMENTS : ALL_APPOINTMENTS.filter(a => a.status === apptFilter)), [apptFilter])
  const totalRev = TRANSACTIONS.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0)
  const allTimeRev = ALL_TIME_DATA.reduce((s, d) => s + d.rev, 0)
  const allTimeAppts = ALL_TIME_DATA.reduce((s, d) => s + d.appts, 0)
  const filteredDocs = useMemo(() => { const q = docSearch.toLowerCase(); return q ? doctors.filter(d => d.name.toLowerCase().includes(q) || d.id.toString().includes(q) || (d.uid || '').toLowerCase().includes(q) || d.spec.toLowerCase().includes(q) || (d.email || '').toLowerCase().includes(q)) : doctors }, [docSearch, doctors])
  const filteredPats = useMemo(() => { const q = patSearch.toLowerCase(); return q ? patients.filter(p => p.name.toLowerCase().includes(q) || (p.uid || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q)) : patients }, [patSearch, patients])
  const chartData = chartRange === 'month' ? MONTHLY : chartRange === 'daily' ? DAILY_DATA.map(d => ({ ...d, month: d.day })) : ALL_TIME_DATA

  /* ─── SIDEBAR ─── */
  const sidebar = (
    <aside className="fixed left-0 top-0 bottom-0 w-[270px] bg-white border-r border-gray-200/80 flex flex-col z-50">
      <div className="px-7 py-7 border-b border-gray-100"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#006977] flex items-center justify-center"><span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span></div><div><p className="text-base font-bold text-gray-900 leading-none">Askare</p><p className="text-xs text-gray-400 font-medium tracking-wider uppercase mt-0.5">Admin Console</p></div></div></div>
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 pt-1 pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Navigation</p>
        {NAV.map(n => { const a = section === n.id; return (<button key={n.id} onClick={() => setSection(n.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${a ? 'bg-[#006977]/[0.08] text-[#006977] font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><span className="material-symbols-outlined text-[22px]" style={a ? { fontVariationSettings: "'FILL' 1" } : {}}>{n.icon}</span>{n.label}</button>) })}
      </nav>
      <div className="px-4 pb-5 border-t border-gray-100 pt-4 space-y-2">
        <div className="px-4 py-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#006977] flex items-center justify-center"><span className="material-symbols-outlined text-white text-base">admin_panel_settings</span></div><div><p className="text-sm font-semibold text-gray-900">Admin</p><p className="text-xs text-gray-400">admin@askare.health</p></div></div>
        <button onClick={() => { logout(); navigate('/login') }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"><span className="material-symbols-outlined text-[22px]">logout</span>Sign Out</button>
      </div>
    </aside>
  )

  /* ═══════════════════════════════════════════════════════════════
     OVERVIEW — ordered by importance (most critical → least)
     ═══════════════════════════════════════════════════════════════ */
  const renderOverview = () => {
    const countBy = (items, getKey) => items.reduce((acc, item) => {
      const key = getKey(item) || 'Not specified'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const percent = (part, total) => Math.round((part / Math.max(total, 1)) * 100)
    const palette = ['#059669', '#dc2626', '#7c3aed', '#2563eb', '#006977']
    const colorGroup = { green: '#059669', red: '#dc2626', purple: '#7c3aed', blue: '#2563eb', darkGreen: '#006977' }
    const toSegments = counts => Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }))

    const apptS = countBy(ALL_APPOINTMENTS, a => a.status)
    const videoS = countBy(VIDEO_CALLS, v => v.status)
    const docS = countBy(doctors, d => d.status)
    const patS = countBy(patients, p => p.status)
    const ticketS = countBy(complaints, c => c.status)
    const paymentS = countBy(TRANSACTIONS, t => t.status)
    const genderS = countBy(patients, p => p.gender)
    const payMethodS = countBy(TRANSACTIONS, t => t.method.startsWith('Crypto') ? 'Crypto' : t.method)

    const completedPayments = TRANSACTIONS.filter(t => t.status === 'Completed')
    const pendingPayments = TRANSACTIONS.filter(t => t.status === 'Pending')
    const refundRequests = TRANSACTIONS.filter(t => t.status === 'Refund Requested')
    const flaggedCount = AI_QUERIES.filter(q => q.flag).length
    const safeCount = AI_QUERIES.length - flaggedCount
    const notAttendedConsultations = (apptS['Not Attended'] || 0)
    const openSupport = (ticketS.Open || 0) + (ticketS['In Progress'] || 0)
    const restrictedUsers = (docS.Suspended || 0) + (patS.Blocked || 0)
    const actionCount = (docS.Pending || 0) + openSupport + refundRequests.length + flaggedCount + notAttendedConsultations + restrictedUsers
    const activePrivacyControls = Object.values(privacy).filter(Boolean).length
    const trendLabel = chartRange === 'daily' ? selectedMonth + ' (daily)' : chartRange === 'month' ? 'Last 6 months' : 'All 12 months'

    const appointmentSegments = [
      { label: 'Completed', value: apptS.Completed || 0, color: colorGroup.green },
      { label: 'Confirmed', value: apptS.Confirmed || 0, color: colorGroup.red },
      { label: 'Not Attended', value: apptS['Not Attended'] || 0, color: colorGroup.purple },
      { label: 'Live Now', value: apptS['Live Now'] || 0, color: colorGroup.blue },
    ].filter(s => s.value > 0)
    const videoSegments = [
      { label: 'Completed', value: videoS.Completed || 0, color: colorGroup.green },
      { label: 'Not Attended', value: videoS['Not Attended'] || 0, color: colorGroup.red },
      { label: 'Live Now', value: videoS['Live Now'] || 0, color: colorGroup.blue },
    ].filter(s => s.value > 0)
    const doctorSegments = [
      { label: 'Active', value: docS.Active || 0, color: colorGroup.green },
      { label: 'Suspended', value: docS.Suspended || 0, color: colorGroup.red },
      { label: 'Pending', value: docS.Pending || 0, color: colorGroup.purple },
    ].filter(s => s.value > 0)
    const patientSegments = [
      { label: 'Active', value: patS.Active || 0, color: colorGroup.green },
      { label: 'Blocked', value: patS.Blocked || 0, color: colorGroup.red },
    ].filter(s => s.value > 0)
    const paymentSegments = [
      { label: 'Completed', value: paymentS.Completed || 0, color: colorGroup.green },
      { label: 'Refund Requested', value: paymentS['Refund Requested'] || 0, color: colorGroup.red },
      { label: 'Pending', value: paymentS.Pending || 0, color: colorGroup.purple },
    ].filter(s => s.value > 0)
    const supportSegments = [
      { label: 'Resolved', value: ticketS.Resolved || 0, color: colorGroup.green },
      { label: 'Open', value: ticketS.Open || 0, color: colorGroup.red },
      { label: 'In Progress', value: ticketS['In Progress'] || 0, color: colorGroup.purple },
    ].filter(s => s.value > 0)
    const aiSegments = [
      { label: 'Safe', value: safeCount, color: colorGroup.green },
      { label: 'Flagged', value: flaggedCount, color: colorGroup.red },
    ].filter(s => s.value > 0)
    const genderSegments = toSegments(genderS)

    const specDist = doctors.filter(d => d.spec !== 'Pending Review').reduce((acc, d) => {
      acc[d.spec] = (acc[d.spec] || 0) + 1
      return acc
    }, SPECS.reduce((acc, spec) => { acc[spec] = 0; return acc }, {}))
    const maxSpec = Math.max(...Object.values(specDist), 1)
    const specRows = Object.entries(specDist).sort(([, a], [, b]) => b - a)
    const revenueByMethod = Object.entries(payMethodS).map(([label, count]) => ({
      label,
      count,
      value: TRANSACTIONS
        .filter(t => (t.method.startsWith('Crypto') ? 'Crypto' : t.method) === label && t.status === 'Completed')
        .reduce((sum, t) => sum + t.amount, 0),
    })).sort((a, b) => b.value - a.value)
    const maxMethodRevenue = Math.max(...revenueByMethod.map(m => m.value), 1)
    const topDoctors = [...doctors]
      .filter(d => Number.isFinite(parseFloat(d.rating)))
      .sort((a, b) => b.patients - a.patients)
      .slice(0, 5)
    const maxDoctorPatients = Math.max(...topDoctors.map(d => d.patients), 1)

    const actionQueue = [
      { label: 'Doctor approvals', value: docS.Pending || 0, icon: 'verified_user', color: '#f59e0b' },
      { label: 'Open support tickets', value: openSupport, icon: 'contact_support', color: '#ef4444' },
      { label: 'Refund requests', value: refundRequests.length, icon: 'undo', color: '#8b5cf6' },
      { label: 'Flagged AI cases', value: flaggedCount, icon: 'flag', color: '#dc2626' },
      { label: 'Not attended consults', value: notAttendedConsultations, icon: 'event_busy', color: '#f97316' },
      { label: 'Restricted users', value: restrictedUsers, icon: 'block', color: '#64748b' },
    ]
    const healthMetrics = [
      { label: 'Appointment completion', value: percent(apptS.Completed || 0, ALL_APPOINTMENTS.length), sub: `${apptS.Completed || 0} of ${ALL_APPOINTMENTS.length}` },
      { label: 'AI safe response rate', value: percent(safeCount, AI_QUERIES.length), sub: `${flaggedCount} flagged` },
      { label: 'Payment collection', value: percent(completedPayments.length, TRANSACTIONS.length), sub: `${pendingPayments.length + refundRequests.length} exceptions` },
      { label: 'Privacy controls active', value: percent(activePrivacyControls, Object.keys(privacy).length), sub: `${activePrivacyControls} enabled` },
    ]

    const SectionHead = ({ title, desc, children }) => (
      <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
        {children}
      </div>
    )
    const Legend = ({ segments }) => (
      <div className="space-y-2 flex-1 min-w-0">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-gray-600 flex-1 truncate">{s.label}</span>
            <span className="text-sm font-bold text-gray-800">{s.value}</span>
          </div>
        ))}
      </div>
    )
    const TrendPanel = ({ title, dataKey, color }) => (
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{trendLabel}</span>
        </div>
        <AreaChart data={chartData} dataKey={dataKey} color={color} height={180} />
      </Card>
    )
    const DonutPanel = ({ title, segments, centerLabel }) => (
      <Card className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <DonutChart segments={segments} size={142} centerLabel={centerLabel} />
          <Legend segments={segments} />
        </div>
      </Card>
    )
    const BarRow = ({ label, value, max, color, valueLabel }) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-gray-700 truncate">{label}</span>
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{valueLabel || value}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${value > 0 ? Math.min(Math.max((value / Math.max(max, 1)) * 100, 8), 92) : 0}%`, backgroundColor: color }} />
        </div>
      </div>
    )

    return (
      <>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006977]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#006977] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em]">Admin Control Center</p>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            </div>
          </div>
          <p className="text-base text-gray-500 max-w-3xl">Platform health across doctors, patients, appointments, AI monitoring, payments, and support.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <Kpi icon="account_balance_wallet" label="Total Revenue (All Time)" value={`PKR ${allTimeRev.toLocaleString()}`} sub={`+${Math.round(((MONTHLY[MONTHLY.length-1].rev - MONTHLY[0].rev) / Math.max(MONTHLY[0].rev,1)) * 100)}% from last year`} color="#006977" />
          <Kpi icon="event_note" label="Total Consultations" value={allTimeAppts} sub={`${(apptS.Confirmed || 0) + (apptS['Live Now'] || 0)} upcoming`} color="#6366f1" />
          <Kpi icon="stethoscope" label="Total Doctors" value={doctors.length} sub={`${docS.Pending || 0} pending approval`} color="#f59e0b" />
          <Kpi icon="groups" label="Total Patients" value={patients.length} sub={`+${MONTHLY[MONTHLY.length - 1].patients} this month`} color="#ec4899" />
        </div>

        <SectionHead title="Trend Analytics" desc="Growth and transaction movement over the selected period.">
          <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowMonthPicker(p => !p)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${chartRange === 'daily' ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{chartRange === 'daily' ? selectedMonth : 'Month'}<span className="material-symbols-outlined text-base">expand_more</span></button>
                {showMonthPicker && <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50 grid grid-cols-3 gap-1.5 w-[220px]" style={{ animation: 'fadeIn 0.15s ease' }}>
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                    <button key={m} onClick={() => { setSelectedMonth(m); setChartRange('daily'); setShowMonthPicker(false) }} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedMonth === m && chartRange === 'daily' ? 'bg-[#006977] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{m}</button>
                  ))}
                </div>}
              </div>
              {[{ id: 'month', label: 'Last 6 Months' }, { id: 'all', label: 'All Time' }].map(r => (
              <button key={r.id} onClick={() => { setChartRange(r.id); setShowMonthPicker(false) }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${chartRange === r.id ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{r.label}</button>
            ))}
          </div>
        </SectionHead>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendPanel title="Revenue Trend" dataKey="rev" color="#006977" />
          <TrendPanel title="Appointment Volume" dataKey="appts" color="#6366f1" />
          <TrendPanel title="Patient Signups" dataKey="patients" color="#ec4899" />
          <TrendPanel title="Doctor Onboarding" dataKey="doctors" color="#f59e0b" />
        </div>

        <SectionHead title="Distribution Analytics" desc="Status mix across consultations, users, payments, support, and AI reviews." />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          <DonutPanel title="Appointments" segments={appointmentSegments} centerLabel="Appts" />
          <DonutPanel title="Doctors" segments={doctorSegments} centerLabel="Doctors" />
          <DonutPanel title="Patients" segments={patientSegments} centerLabel="Patients" />
          <DonutPanel title="Payments" segments={paymentSegments} centerLabel="Payments" />
          <DonutPanel title="Support Tickets" segments={supportSegments} centerLabel="Tickets" />
          <DonutPanel title="Patient Gender" segments={genderSegments} centerLabel="Gender" />
        </div>

        <SectionHead title="Bar And Ranking Analytics" desc="Coverage, payment channels, and doctor workload by platform data." />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <Card className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-5">Specialization Coverage</h3>
            <div className="space-y-4">
              {specRows.map(([label, value], i) => (
                <BarRow key={label} label={label} value={value} max={maxSpec} color={palette[i % palette.length]} />
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-5">Revenue By Payment Method</h3>
            <div className="space-y-4">
              {revenueByMethod.map((method, i) => (
                <BarRow key={method.label} label={`${method.label} (${method.count})`} value={method.value} max={maxMethodRevenue} color={palette[i % palette.length]} valueLabel={`PKR ${method.value.toLocaleString()}`} />
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-1">Top Doctors by Patient Volume</h3><p className="text-xs text-gray-400 mb-4">Doctors ranked by total patients served</p>
            <div className="space-y-4">
              {topDoctors.map((doctor, i) => (
                <div key={doctor.id} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {doctor.img ? <img src={doctor.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 text-lg">person</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <BarRow label={doctor.name} value={doctor.patients} max={maxDoctorPatients} color={palette[i % palette.length]} valueLabel={`${doctor.patients} patients`} />
                    <p className="text-xs text-gray-400 mt-1 truncate">{doctor.spec}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <SectionHead title="Operations Health" desc="Items that need admin attention and service quality indicators." />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Action Queue</h3>
              <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{actionCount} total</span>
            </div>
            <div className="space-y-3">
              {actionQueue.map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + '14' }}>
                    <span className="material-symbols-outlined text-lg" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 flex-1">{item.label}</span>
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-5">Service Health</h3>
            <div className="space-y-4">
              {healthMetrics.map(metric => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{metric.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{metric.sub}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{metric.value}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#006977]" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-5">Recent Activity</h3>
            <div className="space-y-1">
              {[
                { icon: 'person_add', text: 'New patient registered on the platform', time: '2 min ago', color: '#006977' },
                { icon: 'check_circle', text: 'Dr. Arsalan Khan accepted appointment for Ayesha Gillani', time: '15 min ago', color: '#059669' },
                { icon: 'videocam', text: 'Video call started with Mr. David Ahmed', time: '30 min ago', color: '#6366f1' },
                { icon: 'flag', text: 'AI flagged urgent chest tightness query', time: '1 hr ago', color: '#ef4444' },
                { icon: 'payments', text: 'Payment received from Mrs. Sarah Jenkins', time: '2 hrs ago', color: '#006977' },
                { icon: 'person_add', text: 'Dr. Mariam Farooq is pending approval', time: '3 hrs ago', color: '#f59e0b' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: activity.color + '14' }}>
                    <span className="material-symbols-outlined text-lg" style={{ color: activity.color, fontVariationSettings: "'FILL' 1" }}>{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 leading-snug">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </>
    )
  }

  /* ─── DOCTORS ─── */
  const renderDoctors = () => (<>
    <Head icon="stethoscope" title="Doctor Management" count={doctors.length} />
    <SearchBar value={docSearch} onChange={setDocSearch} placeholder="Search by name, email, ID, or specialty…" />
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Doctor</TH><TH>UID</TH><TH>Specialty</TH><TH>Rating</TH><TH>Consult Fee</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{filteredDocs.map(d => (
      <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">{d.img ? <img src={d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400">person</span>}</div><div><p className="text-base font-semibold text-gray-900">{d.name}</p><p className="text-xs text-gray-400">{d.email}</p></div></div></td>
        <td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{d.uid}</td>
        <td className="px-5 py-5 text-base text-gray-600">{d.spec}</td>
        <td className="px-5 py-5"><span className="text-base font-semibold text-amber-500">{d.rating !== '—' ? `★ ${d.rating}` : '—'}</span></td>
        <td className="px-5 py-5 text-base text-gray-700 font-medium">{d.price}</td>
        <td className="px-5 py-5"><B>{d.status}</B></td>
        <td className="px-5 py-5 text-right"><div className="flex items-center justify-end gap-2">
          <button onClick={() => setModal({ t: 'doc', d })} className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
          {d.status === 'Pending' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); flash(`${d.name} approved`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Approve</button>}
          {d.status === 'Active' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Suspended' } : x)); flash(`${d.name} suspended`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Suspend</button>}
          {d.status === 'Suspended' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); flash(`${d.name} reactivated`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Reactivate</button>}
        </div></td>
      </tr>
    ))}{filteredDocs.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-base text-gray-400">No doctors found</td></tr>}</tbody></table></div></Card>
  </>)

  /* ─── PATIENTS (only signup data) ─── */
  const renderPatients = () => (<>
    <Head icon="groups" title="Patient Management" count={patients.length} />
    <SearchBar value={patSearch} onChange={setPatSearch} placeholder="Search by name, email, or UID…" />
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Patient</TH><TH>UID</TH><TH>Gender</TH><TH>Joined</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{filteredPats.map(p => (
      <tr key={p.uid} className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-5"><div><p className="text-base font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-400">{p.email}</p></div></td>
        <td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{p.uid}</td>
        <td className="px-5 py-5 text-base text-gray-600">{p.gender}</td>
        <td className="px-5 py-5 text-base text-gray-500">{p.joined}</td>
        <td className="px-5 py-5"><B>{p.status}</B></td>
        <td className="px-5 py-5 text-right"><div className="flex items-center justify-end gap-2">
          <button onClick={() => setModal({ t: 'pat', d: p })} className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
          {p.status === 'Active' && <button onClick={() => { setPatients(prev => prev.map(x => x.uid === p.uid ? { ...x, status: 'Suspended' } : x)); flash(`${p.name} suspended`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Suspend</button>}
          {p.status === 'Suspended' && <button onClick={() => { setPatients(prev => prev.map(x => x.uid === p.uid ? { ...x, status: 'Active' } : x)); flash(`${p.name} reactivated`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Reactivate</button>}
        </div></td>
      </tr>
    ))}{filteredPats.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-base text-gray-400">No patients found</td></tr>}</tbody></table></div></Card>
  </>)

  /* ─── APPOINTMENTS ─── */
  const renderAppointments = () => (<>
    <Head icon="event_note" title="Appointment Management" count={ALL_APPOINTMENTS.length} />
    <div className="flex flex-wrap gap-2 mb-6">{['All', 'Completed', 'Confirmed', 'Not Attended', 'Live Now'].map(f => <button key={f} onClick={() => setApptFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${apptFilter === f ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{f}</button>)}</div>
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Patient</TH><TH>Doctor</TH><TH>Date</TH><TH>Time</TH><TH>Duration</TH><TH>Status</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{filteredAppts.map(a => (<tr key={a.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-base font-semibold text-gray-900">{a.patient}</td><td className="px-5 py-5 text-base text-gray-600">{a.doctor}</td><td className="px-5 py-5 text-base text-gray-500">{a.date}</td><td className="px-5 py-5 text-base text-gray-500">{a.time}</td><td className="px-5 py-5 text-base text-gray-700 font-medium">{a.duration}</td><td className="px-5 py-5"><B>{a.status}</B></td></tr>))}</tbody></table></div>
    {filteredAppts.length === 0 && <p className="py-12 text-center text-base text-gray-400">No appointments match this filter.</p>}</Card>
  </>)

  /* ─── AI ─── */
  const renderAI = () => (<><Head icon="neurology" title="AI Chat Monitoring" /><div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"><Kpi icon="forum" label="Total Queries" value={AI_QUERIES.length} color="#8b5cf6" /><Kpi icon="speed" label="Avg Response" value="1.8s" color="#06b6d4" /><Kpi icon="flag" label="Flagged — Urgent Symptoms" value={AI_QUERIES.filter(q => q.flag).length} sub="Needs Review" color="#ef4444" /></div><Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Patient</TH><TH>Query</TH><TH>AI Response</TH><TH>Time</TH><TH>Safety</TH></tr></thead><tbody className="divide-y divide-gray-50">{AI_QUERIES.map(q => (<tr key={q.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-base font-semibold text-gray-900">{q.patient}</td><td className="px-5 py-5 text-base text-gray-600 max-w-[220px]">{q.query}</td><td className="px-5 py-5 text-sm text-gray-500 max-w-[220px]">{q.response}</td><td className="px-5 py-5 text-sm text-gray-400 whitespace-nowrap">{q.time}</td><td className="px-5 py-5">{q.flag ? <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600"><span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>Flagged</span> : <span className="text-sm font-semibold text-emerald-600">✓ Safe</span>}</td></tr>))}</tbody></table></div></Card></>)

  /* ─── PAYMENTS ─── */
  const renderPayments = () => {
    const statusFiltered = payStatus === 'All' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === payStatus)
    const filtered = sortByDate(statusFiltered)
    const filteredCompleted = filtered.filter(t => t.status === 'Completed')
    const filteredRev = filteredCompleted.reduce((s, t) => s + t.amount, 0)
    const pend = filtered.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amount, 0)
    const ref = filtered.filter(t => t.status === 'Refund Requested').reduce((s, t) => s + t.amount, 0)
    const avgFee = filteredCompleted.length > 0 ? Math.round(filteredRev / filteredCompleted.length) : 0
    return (<>
    <Head icon="account_balance_wallet" title="Patient Payments" count={filtered.length} />
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div className="flex flex-wrap gap-2">{['All', 'Completed', 'Pending', 'Refund Requested'].map(f => <button key={f} onClick={() => setPayStatus(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${payStatus === f ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{f}</button>)}</div>
      <div className="relative">
        <button onClick={() => setShowPayFilter(p => !p)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${(payDateFrom || payDateTo) ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}><span className="material-symbols-outlined text-base">filter_list</span>{(payDateFrom && payDateTo) ? `${payDateFrom} — ${payDateTo}` : 'Date Filter'}</button>
        {showPayFilter && <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-5 z-50 w-[300px]" style={{ animation: 'fadeIn 0.15s ease' }}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Date Range</p>
          <div className="space-y-3">
            <div><label className="text-sm text-gray-600 font-medium block mb-1">From</label><input type="date" value={payDateFrom} onChange={e => setPayDateFrom(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none" /></div>
            <div><label className="text-sm text-gray-600 font-medium block mb-1">To</label><input type="date" value={payDateTo} onChange={e => setPayDateTo(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowPayFilter(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-[#006977] text-white text-sm font-semibold hover:bg-[#005a66] transition-colors">Apply</button>
            <button onClick={() => { setPayDateFrom(''); setPayDateTo(''); setShowPayFilter(false) }} className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors">Clear</button>
          </div>
        </div>}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"><Kpi icon="account_balance" label="Revenue Collected" value={`PKR ${filteredRev.toLocaleString()}`} sub={`${filteredCompleted.length} transactions`} /><Kpi icon="schedule" label="Pending" value={`PKR ${pend.toLocaleString()}`} color="#f59e0b" /><Kpi icon="undo" label="Refunds" value={`PKR ${ref.toLocaleString()}`} color="#ef4444" /><Kpi icon="trending_up" label="Avg Fee" value={`PKR ${avgFee.toLocaleString()}`} color="#6366f1" /></div>
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>TX ID</TH><TH>Patient (Payer)</TH><TH>Doctor</TH><TH>Amount</TH><TH>Date</TH><TH>Method</TH><TH>Status</TH></tr></thead><tbody className="divide-y divide-gray-50">{filtered.map(t => (<tr key={t.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{t.id}</td><td className="px-5 py-5 text-base font-semibold text-gray-900">{t.patient}</td><td className="px-5 py-5 text-base text-gray-600">{t.doctor}</td><td className="px-5 py-5 text-base text-gray-900 font-bold">PKR {t.amount.toLocaleString()}</td><td className="px-5 py-5 text-base text-gray-500">{t.date}</td><td className="px-5 py-5 text-sm text-gray-500">{t.method}</td><td className="px-5 py-5"><B>{t.status}</B></td></tr>))}</tbody></table></div>
    {filtered.length === 0 && <p className="py-12 text-center text-base text-gray-400">No transactions match this filter.</p>}</Card>
  </>) }

  /* ─── SUPPORT (no priority, amber resolve button) ─── */
  const renderComplaints = () => (<>
    <Head icon="contact_support" title="Complaints & Support" count={complaints.length} />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"><Kpi icon="error_outline" label="Open" value={complaints.filter(c => c.status === 'Open').length} color="#ef4444" /><Kpi icon="hourglass_top" label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#f59e0b" /><Kpi icon="task_alt" label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} /></div>
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Ticket</TH><TH>From</TH><TH>Role</TH><TH>Subject</TH><TH>Date</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{sortByDate(complaints).map(c => (
      <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{c.id}</td>
        <td className="px-5 py-5 text-base font-semibold text-gray-900">{c.from}</td>
        <td className="px-5 py-5 text-base text-gray-500">{c.role}</td>
        <td className="px-5 py-5 text-base text-gray-600 max-w-[220px] truncate">{c.subject}</td>
        <td className="px-5 py-5 text-base text-gray-500">{c.date}</td>
        <td className="px-5 py-5"><B>{c.status}</B></td>
        <td className="px-5 py-5 text-right"><div className="flex items-center justify-end gap-2">
          <button onClick={() => setModal({ t: 'cmp', d: c })} className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
          {c.status !== 'Resolved' && <button onClick={() => { setComplaints(p => p.map(x => x.id === c.id ? { ...x, status: 'Resolved' } : x)); flash(`${c.id} resolved`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Resolve</button>}
        </div></td>
      </tr>
    ))}</tbody></table></div></Card>
  </>)

  /* ─── SETTINGS ─── */
  const Toggle = ({ on, onToggle, label, desc }) => (<div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"><div className="pr-4"><p className="text-base text-gray-800 font-medium">{label}</p><p className="text-sm text-gray-400 mt-0.5">{desc}</p></div><button onClick={onToggle} className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-[#006977]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[26px]' : 'left-0.5'}`} /></button></div>)

  const renderSettings = () => (<><Head icon="manufacturing" title="Platform Settings" /><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Platform Information */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">info</span>Platform Information</h3>
      {[{ l: 'Platform Name', v: 'Askare Health' }, { l: 'Version', v: 'v1.0.0' }, { l: 'Admin Email', v: 'admin@askare.health' }, { l: 'Support Email', v: 'support@askare.health' }, { l: 'Platform URL', v: 'https://askare.health' }].map(r => <div key={r.l} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"><span className="text-base text-gray-700">{r.l}</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{r.v}</span></div>)}
    </Card>
    {/* Manage Specializations */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">category</span>Manage Specializations</h3><div className="flex gap-2 mb-5"><input type="text" value={newSpec} onChange={e => setNewSpec(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newSpec.trim() && !specs.includes(newSpec.trim())) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); flash('Added') } }} placeholder="Add specialization…" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none transition-all" /><button onClick={() => { if (newSpec.trim() && !specs.includes(newSpec.trim())) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); flash('Added') } }} className="px-5 py-3 rounded-xl bg-[#006977] text-white text-sm font-semibold hover:bg-[#005a66] transition-colors">Add</button></div><div className="flex flex-wrap gap-2">{specs.map(s => <span key={s} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200">{s}<button onClick={() => { setSpecs(p => p.filter(x => x !== s)); flash(`Removed ${s}`) }} className="hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">close</span></button></span>)}</div></Card>
    {/* Notification Settings */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">notifications</span>Notification Settings</h3><p className="text-sm text-gray-400 mb-4">Control how the platform sends alerts and updates.</p>
      <Toggle on={notifSettings.emailNotif} onToggle={() => { setNotifSettings(p => ({ ...p, emailNotif: !p.emailNotif })); flash('Email notifications ' + (notifSettings.emailNotif ? 'disabled' : 'enabled')) }} label="Email Notifications" desc="Send appointment confirmations and updates via email" />
      <Toggle on={notifSettings.smsAlerts} onToggle={() => { setNotifSettings(p => ({ ...p, smsAlerts: !p.smsAlerts })); flash('SMS alerts ' + (notifSettings.smsAlerts ? 'disabled' : 'enabled')) }} label="SMS Alerts" desc="Send critical alerts via SMS to doctors and patients" />
      <Toggle on={notifSettings.systemAnnouncements} onToggle={() => { setNotifSettings(p => ({ ...p, systemAnnouncements: !p.systemAnnouncements })); flash('System announcements ' + (notifSettings.systemAnnouncements ? 'disabled' : 'enabled')) }} label="System Announcements" desc="Display platform-wide announcements to all users" />
      <Toggle on={notifSettings.maintenanceAlerts} onToggle={() => { setNotifSettings(p => ({ ...p, maintenanceAlerts: !p.maintenanceAlerts })); flash('Maintenance alerts ' + (notifSettings.maintenanceAlerts ? 'disabled' : 'enabled')) }} label="Maintenance Alerts" desc="Notify users before scheduled maintenance windows" />
    </Card>
    {/* Payment Configuration */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">payments</span>Payment Configuration</h3><p className="text-sm text-gray-400 mb-4">Configure payment methods and commission settings.</p>
      <div className="flex items-center justify-between py-4 border-b border-gray-100"><span className="text-base text-gray-700">Default Currency</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{paySettings.currency}</span></div>
      <div className="flex items-center justify-between py-4 border-b border-gray-100"><span className="text-base text-gray-700">Platform Commission</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{paySettings.commission}%</span></div>
      <Toggle on={paySettings.autoRefund} onToggle={() => { setPaySettings(p => ({ ...p, autoRefund: !p.autoRefund })); flash('Auto-refund ' + (paySettings.autoRefund ? 'disabled' : 'enabled')) }} label="Auto-Refund on No-Show" desc="Automatically refund patients when doctor doesn't attend" />
      <div className="pt-4"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accepted Methods</p><div className="flex flex-wrap gap-2">{paySettings.methods.map(m => <span key={m} className="px-3.5 py-2 rounded-full bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200">{m}</span>)}</div></div>
    </Card>
    {/* Consultation Settings */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">video_camera_front</span>Consultation Settings</h3><p className="text-sm text-gray-400 mb-4">Configure video consultation defaults and limits.</p>
      <div className="flex items-center justify-between py-4 border-b border-gray-100"><span className="text-base text-gray-700">Default Call Duration</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{consultSettings.defaultDuration} minutes</span></div>
      <div className="flex items-center justify-between py-4 border-b border-gray-100"><span className="text-base text-gray-700">Max Daily Appointments / Doctor</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{consultSettings.maxDaily}</span></div>
      <div className="flex items-center justify-between py-4 border-b border-gray-100"><span className="text-base text-gray-700">Buffer Between Appointments</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{consultSettings.bufferTime} minutes</span></div>
      <Toggle on={consultSettings.recording} onToggle={() => { setConsultSettings(p => ({ ...p, recording: !p.recording })); flash('Call recording ' + (consultSettings.recording ? 'disabled' : 'enabled')) }} label="Call Recording" desc="Record video consultations for quality assurance" />
    </Card>
    {/* Platform Rules */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">gavel</span>Platform Rules</h3>{[{ l: 'Cancellation Policy', v: 'Non-refundable after confirmation' }, { l: 'No-Show Policy', v: 'Repayment required' }, { l: 'Refund Window', v: '24 hours before appointment' }, { l: 'Max Reschedules', v: '2 per appointment' }].map(r => <div key={r.l} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"><span className="text-base text-gray-700">{r.l}</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{r.v}</span></div>)}</Card>
    {/* Privacy & Compliance — full width */}
    <Card className="p-6 lg:col-span-2"><h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">shield</span>Privacy & Compliance</h3><p className="text-sm text-gray-400 mb-5">Changes apply immediately.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-x-10"><div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2">Data Protection</p><Toggle on={privacy.dataRetention} onToggle={() => togglePrivacy('dataRetention')} label="Data Retention (5 Years)" desc="Keep records for regulatory compliance" /><Toggle on={privacy.hipaa} onToggle={() => togglePrivacy('hipaa')} label="HIPAA Compliance Mode" desc="Enforce health data privacy regulations" /><Toggle on={privacy.encryptBackup} onToggle={() => togglePrivacy('encryptBackup')} label="Encrypted Backups" desc="AES-256 encryption for all backups" /><Toggle on={privacy.patientConsent} onToggle={() => togglePrivacy('patientConsent')} label="Patient Consent Required" desc="Require consent before data collection" /></div><div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2">Security</p><Toggle on={privacy.twoFactor} onToggle={() => togglePrivacy('twoFactor')} label="Two-Factor Authentication" desc="2FA for admin and doctor accounts" /><Toggle on={privacy.auditLog} onToggle={() => togglePrivacy('auditLog')} label="Audit Logging" desc="Track all admin actions and access" /><Toggle on={privacy.sessionTimeout} onToggle={() => togglePrivacy('sessionTimeout')} label="Session Timeout (30 min)" desc="Auto-logout inactive users" /><Toggle on={privacy.anonAI} onToggle={() => togglePrivacy('anonAI')} label="Anonymous AI Queries" desc="Allow AI use without identification" /></div></div></Card>
    {/* Maintenance Mode — full width */}
    <Card className="p-6 lg:col-span-2"><h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">construction</span>Maintenance Mode</h3><p className="text-sm text-gray-400 mb-5">Put the platform into maintenance mode to prevent user access during updates.</p>
      <Toggle on={maintenance.enabled} onToggle={() => { setMaintenance(p => ({ ...p, enabled: !p.enabled })); flash('Maintenance mode ' + (maintenance.enabled ? 'disabled' : 'enabled')) }} label="Enable Maintenance Mode" desc="Users will see a maintenance page when enabled" />
      {maintenance.enabled && <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200"><div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-amber-600 text-lg">warning</span><span className="text-sm font-bold text-amber-700">Platform is in Maintenance Mode</span></div><div className="space-y-3"><div><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message to Users</label><textarea value={maintenance.message} onChange={e => setMaintenance(p => ({ ...p, message: e.target.value }))} className="w-full mt-1.5 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none transition-all resize-none" rows={2} /></div><div className="flex items-center justify-between"><span className="text-sm text-gray-600">Estimated Downtime</span><span className="text-sm font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">{maintenance.downtime}</span></div></div></div>}
    </Card>
    {/* Appointment Types */}
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">event_available</span>Appointment Types</h3>{['General Check-up', 'Video Consultation', 'Lab Review', 'Immunization', 'Follow-up', 'Emergency', 'Prescription Refill'].map(t => <div key={t} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"><span className="w-2 h-2 rounded-full bg-[#006977]" /><span className="text-base text-gray-700">{t}</span></div>)}</Card>
  </div></>)

  const views = { overview: renderOverview, doctors: renderDoctors, patients: renderPatients, appointments: renderAppointments, ai: renderAI, payments: renderPayments, complaints: renderComplaints, settings: renderSettings }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {sidebar}
      <main className="ml-[270px] p-8 max-w-[1400px]">{(views[section] || renderOverview)()}</main>

      {/* Modal */}
      {modal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModal(null)} /><div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100" style={{ animation: 'fadeIn 0.25s ease' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">{modal.t === 'doc' ? 'Doctor Profile' : modal.t === 'pat' ? 'Patient Details' : `Ticket ${modal.d.id}`}</h3><button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><span className="material-symbols-outlined text-xl">close</span></button></div>
        <div className="px-6 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {modal.t === 'doc' && <><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">{modal.d.img ? <img src={modal.d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 text-2xl">person</span>}</div><div><p className="text-lg font-bold text-gray-900">{modal.d.name}</p><p className="text-base text-[#006977]">{modal.d.spec}</p></div></div><div className="grid grid-cols-2 gap-x-6 gap-y-4">{[['Email', modal.d.email], ['UID', modal.d.uid], ['Rating', modal.d.rating !== '—' ? `★ ${modal.d.rating}` : '—'], ['Fee', modal.d.price], ['Patients', modal.d.patients], ['Joined', modal.d.joined]].map(([l, v]) => <div key={l}><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{l}</p><p className="text-base text-gray-800 font-medium">{v}</p></div>)}</div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">About</p><p className="text-base text-gray-600 leading-relaxed">{modal.d.about}</p></div></>}
          {modal.t === 'pat' && <><div className="grid grid-cols-2 gap-x-6 gap-y-4">{[['Name', modal.d.name], ['Email', modal.d.email], ['UID', modal.d.uid], ['Gender', modal.d.gender], ['Joined', modal.d.joined]].map(([l, v]) => <div key={l}><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{l}</p><p className="text-base text-gray-800 font-medium">{v}</p></div>)}</div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Account Status</p><B>{modal.d.status}</B></div></>}
          {modal.t === 'cmp' && <><div className="grid grid-cols-2 gap-x-6 gap-y-4">{[['From', modal.d.from], ['Role', modal.d.role], ['Date', modal.d.date]].map(([l, v]) => <div key={l}><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{l}</p><p className="text-base text-gray-800 font-medium">{v}</p></div>)}</div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Subject</p><p className="text-base text-gray-800 font-medium">{modal.d.subject}</p></div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Details</p><p className="text-base text-gray-600 leading-relaxed">{modal.d.detail}</p></div></>}
        </div></div></div>)}

      {toast && <div className="fixed bottom-6 right-6 z-[110]"><div className="bg-[#006977] text-white px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-base font-semibold"><span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{toast}</div></div>}
    </div>
  )
}
