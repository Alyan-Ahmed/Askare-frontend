import { useState, useEffect } from 'react'

const PATIENT_RECORDS_KEY = 'askare_patient_records'
const DEFAULT_PATIENT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAox2cELp727nc8F0QqlouZa__6ZAv4-XcyEzgKe10NFebkQZ6zwt1AVi5A40vtPQlgILrsZO4LEBhgNSHYHes6nqyU_4kjT4LRk4umkaWEpp9o_VpetLVnbbB9Zd2jNVNrpUvg_5U6PulVe0fwMTqmJQ8iB76aIZ86NAX_D7f-WEhXXum1-y8GdUP44sNRoZKGW9TEuwIYHcU_HCp90mV_Ha_VHzhFzOMyeHQw2z7EjJ1H95UUmUeqoJLIy7TscjeCBzVcGXi2ZYY'
const RECORD_STATUS_OPTIONS = ['Active', 'Stable', 'Observation', 'Critical']

const records = [
  { name: 'Arsalan Khan', id: '#RE-9021', status: 'Active', lastVisit: '12 Oct 2023', condition: 'Hypertension Management & Routine follow-up.', illness: 'Hypertension Management', medications: ['Lisinopril 10mg', 'Atorvastatin 20mg'], notes: 'Patient is responding well to current treatment plan. Continue monitoring blood pressure and schedule follow-up in 4 weeks.', img: DEFAULT_PATIENT_IMG },
  { name: 'Zainab Ahmed', id: '#RE-8842', status: 'Critical', lastVisit: '05 Nov 2023', condition: 'Post-operative recovery monitoring.', illness: 'Post-operative Recovery', medications: ['Cefixime 400mg', 'Paracetamol 500mg'], notes: 'Requires close follow-up and wound care review.', img: DEFAULT_PATIENT_IMG },
  { name: 'Omar Malik', id: '#RE-4412', status: 'Stable', lastVisit: '28 Oct 2023', condition: 'Type 2 Diabetes ongoing treatment plan.', illness: 'Type 2 Diabetes', medications: ['Metformin 500mg'], notes: 'Blood sugar trend is stable with current medication and diet plan.', img: DEFAULT_PATIENT_IMG },
  { name: 'Fatima Jinnah', id: '#RE-1256', status: 'Active', lastVisit: '01 Nov 2023', condition: 'Pediatric vaccination schedule Phase 3.', illness: 'Vaccination Follow-up', medications: [], notes: 'Continue vaccination schedule and routine pediatric monitoring.', img: DEFAULT_PATIENT_IMG },
  { name: 'Bilal Siddiqui', id: '#RE-3390', status: 'Stable', lastVisit: '15 Oct 2023', condition: 'Gastrointestinal consultation follow-up.', illness: 'Gastrointestinal Follow-up', medications: ['Omeprazole 20mg'], notes: 'Symptoms improved. Continue dietary changes.', img: DEFAULT_PATIENT_IMG },
  { name: 'Sara Ahmed', id: '#RE-7712', status: 'Observation', lastVisit: '22 Oct 2023', condition: 'Acute allergic reaction monitoring.', illness: 'Allergic Reaction', medications: ['Cetirizine 10mg'], notes: 'Monitor for recurring symptoms and avoid known triggers.', img: DEFAULT_PATIENT_IMG },
]

const statusStyles = {
  Active: 'bg-primary-container text-on-primary-container',
  Critical: 'bg-tertiary-container text-on-tertiary-container',
  Stable: 'bg-surface-container-high text-secondary',
  Observation: 'bg-tertiary-container text-on-tertiary-container',
}

const dateFilterOptions = ['All Time', 'Last 30 Days', 'Last 90 Days', 'Last Year']

function readStoredRecords() {
  try {
    return JSON.parse(sessionStorage.getItem(PATIENT_RECORDS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeStoredRecords(nextRecords) {
  sessionStorage.setItem(PATIENT_RECORDS_KEY, JSON.stringify(nextRecords))
}

function parseVisitDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date(0) : date
}

function formatVisitDate(value) {
  const source = value ? new Date(`${value}T00:00:00`) : new Date()
  const date = Number.isNaN(source.getTime()) ? new Date() : source
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function normalizeRecordId(value) {
  const id = value.trim()
  if (!id) return `#RE-${String(Date.now()).slice(-4)}`
  return id.startsWith('#') ? id : `#${id}`
}

function medicationList(record) {
  if (Array.isArray(record.medications)) return record.medications
  if (typeof record.medications === 'string') return record.medications.split(',').map(item => item.trim()).filter(Boolean)
  return []
}

export default function PatientRecordsPage() {
  const [allRecords, setAllRecords] = useState(() => [...readStoredRecords(), ...records])
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [newRecordOpen, setNewRecordOpen] = useState(false)
  const [recordModal, setRecordModal] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('All Time')
  const [draftStatusFilter, setDraftStatusFilter] = useState('all')
  const [draftDateFilter, setDraftDateFilter] = useState('All Time')

  useEffect(() => {
    if (filterOpen || newRecordOpen || recordModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [filterOpen, newRecordOpen, recordModal])

  const latestVisitDate = allRecords.reduce((latest, record) => {
    const date = parseVisitDate(record.lastVisit)
    return date > latest ? date : latest
  }, parseVisitDate(allRecords[0]?.lastVisit || new Date().toISOString()))

  const filtered = allRecords.filter(record => {
    const query = search.toLowerCase()
    const medicines = medicationList(record).join(' ').toLowerCase()
    const matchSearch = record.name.toLowerCase().includes(query) || record.id.toLowerCase().includes(query) || record.condition.toLowerCase().includes(query) || (record.illness || '').toLowerCase().includes(query) || medicines.includes(query)
    const matchStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter
    const visitDate = parseVisitDate(record.lastVisit)
    const daysAgo = (latestVisitDate - visitDate) / (1000 * 60 * 60 * 24)
    const matchDate = dateFilter === 'All Time' || (dateFilter === 'Last 30 Days' && daysAgo <= 30) || (dateFilter === 'Last 90 Days' && daysAgo <= 90) || (dateFilter === 'Last Year' && daysAgo <= 365)
    return matchSearch && matchStatus && matchDate
  })

  const openFilters = () => {
    setDraftStatusFilter(statusFilter)
    setDraftDateFilter(dateFilter)
    setFilterOpen(true)
  }

  const applyFilters = () => {
    setStatusFilter(draftStatusFilter)
    setDateFilter(draftDateFilter)
    setFilterOpen(false)
  }

  const createRecord = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const illness = String(form.get('illness') || '').trim()
    const medications = String(form.get('medications') || '').split(',').map(item => item.trim()).filter(Boolean)
    const notes = String(form.get('notes') || '').trim()
    const newRecord = {
      name: String(form.get('name') || '').trim(),
      id: normalizeRecordId(String(form.get('id') || '')),
      status: String(form.get('status') || 'Active'),
      lastVisit: formatVisitDate(String(form.get('visitDate') || '')),
      condition: illness || notes || 'New patient record.',
      illness,
      medications,
      notes,
      img: DEFAULT_PATIENT_IMG,
      source: 'patient-records',
    }
    const stored = readStoredRecords()
    writeStoredRecords([newRecord, ...stored])
    setAllRecords(prev => [newRecord, ...prev])
    setNewRecordOpen(false)
    event.currentTarget.reset()
  }

  return (
    <div className="flex-1 px-8 py-10 max-w-7xl mx-auto w-full">
      <header className="mb-12 reveal">
        <h1 className="text-4xl font-medium text-on-surface leading-tight tracking-tight mb-8">Patient Records</h1>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="w-full max-w-xl">
            <label className="block text-[0.75rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-2">Search Registry</label>
            <div className="relative"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-14 pl-12 bg-surface-container-low border-none rounded-xl text-body-lg focus:ring-2 focus:ring-primary/20 transition-shadow" placeholder="Patient name, ID, diagnosis, or medicine..." type="text" /></div>
          </div>
          <div className="flex gap-4">
            <button className="h-14 px-6 bg-surface-container-high text-primary rounded-xl font-semibold hover:bg-white transition-colors flex items-center gap-2" onClick={openFilters}><span className="material-symbols-outlined text-[20px]">filter_list</span>Filter</button>
            <button className="h-14 px-8 bg-primary text-on-primary rounded-xl font-semibold shadow-md hover:bg-primary-dim transition-all flex items-center gap-2" onClick={() => setNewRecordOpen(true)}><span className="material-symbols-outlined text-[20px]">add</span>New Record</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
        {filtered.map((record, index) => (
          <div key={`${record.id}-${index}`} className="bg-surface-container-lowest p-6 rounded-[1.5rem] group hover:bg-surface-container-high transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container"><img alt={record.name} className="w-full h-full object-cover" src={record.img || DEFAULT_PATIENT_IMG} /></div>
              <span className={`${statusStyles[record.status] || statusStyles.Active} text-[0.7rem] px-3 py-1 rounded-full font-bold uppercase tracking-wider`}>{record.status}</span>
            </div>
            <div><h3 className="text-title-md font-bold text-on-surface mb-1">{record.name}</h3><p className="text-label-md text-on-surface-variant mb-4">ID: {record.id}</p></div>
            <div className="space-y-3">
              <div className="flex items-center text-sm"><span className="material-symbols-outlined text-outline text-[18px] mr-2">calendar_month</span><span className="text-secondary">Last Visit: {record.lastVisit}</span></div>
              <div className="flex items-start text-sm"><span className="material-symbols-outlined text-outline text-[18px] mr-2 mt-0.5">description</span><span className="text-secondary leading-relaxed">{record.condition}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 text-xs font-bold text-primary bg-primary-container/20 px-3 py-2 rounded-lg hover:bg-primary-container/40 transition-colors" onClick={() => setRecordModal({ ...record, tab: 'report' })}>View Report</button>
              <button className="flex-1 text-xs font-bold text-tertiary bg-tertiary-container/20 px-3 py-2 rounded-lg hover:bg-tertiary-container/40 transition-colors" onClick={() => setRecordModal({ ...record, tab: 'scans' })}>Scans</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <span className="text-xs text-secondary">Showing {filtered.length} of {allRecords.length} records</span>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setFilterOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-8 z-10">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface">Filter Records</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setFilterOpen(false)}>close</button></div>
            <div className="space-y-6">
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Status</label><div className="flex flex-wrap gap-2">{['all', ...RECORD_STATUS_OPTIONS].map(status => <button key={status} onClick={() => setDraftStatusFilter(status.toLowerCase())} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${draftStatusFilter === status.toLowerCase() ? 'bg-primary border-primary text-white' : 'border-outline-variant/20 hover:border-primary hover:text-primary'}`}>{status === 'all' ? 'All' : status}</button>)}</div></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date Range</label><select value={draftDateFilter} onChange={(e) => setDraftDateFilter(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20">{dateFilterOptions.map(option => <option key={option}>{option}</option>)}</select></div>
              <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {newRecordOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setNewRecordOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface">New Patient Record</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setNewRecordOpen(false)}>close</button></div>
            <form className="space-y-5" onSubmit={createRecord}>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient Name</label><input name="name" type="text" placeholder="Enter patient full name" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required /></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient ID</label><input name="id" type="text" placeholder="e.g. RE-1234" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required /></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Illness Diagnosis</label><input name="illness" type="text" placeholder="e.g. Mild hypertension" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required /></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Prescribed Medications</label><input name="medications" type="text" placeholder="e.g. Lisinopril 10mg, Atorvastatin 20mg" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" /></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Doctor's Notes</label><textarea name="notes" placeholder="Recommendations, follow-up plan, or additional notes..." rows="3" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Status</label><select name="status" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20">{RECORD_STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></div>
                <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Visit Date</label><input name="visitDate" type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" /></div>
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined text-sm">add</span>Create Record</button>
            </form>
          </div>
        </div>
      )}

      {recordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setRecordModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden"><img alt={recordModal.name} src={recordModal.img || DEFAULT_PATIENT_IMG} className="w-full h-full object-cover" /></div><div><h2 className="text-lg font-bold text-on-surface">{recordModal.name}</h2><p className="text-sm text-secondary">{recordModal.id} - {recordModal.status}</p></div></div>
              <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setRecordModal(null)}>close</button>
            </div>
            {recordModal.tab === 'report' && (
              <div className="space-y-4">
                <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Clinical Summary</p><p className="text-sm text-on-surface leading-relaxed">{recordModal.condition}</p></div>
                <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Illness Diagnosis</p><p className="text-sm text-on-surface">{recordModal.illness || recordModal.condition}</p></div>
                <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Last Visit</p><p className="text-sm text-on-surface">{recordModal.lastVisit}</p></div>
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Prescribed Medications</p>
                  {medicationList(recordModal).length > 0 ? (
                    <div className="space-y-2 text-sm">{medicationList(recordModal).map((medicine, index) => <div key={index} className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">medication</span><span className="text-on-surface font-medium">{medicine}</span></div>)}</div>
                  ) : (
                    <p className="text-sm text-secondary">No prescribed medications recorded.</p>
                  )}
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Doctor's Notes</p><p className="text-sm text-on-surface leading-relaxed">{recordModal.notes || 'No additional notes recorded.'}</p></div>
              </div>
            )}
            {recordModal.tab === 'scans' && <div className="bg-surface-container-low p-6 rounded-xl text-center"><span className="material-symbols-outlined text-4xl text-outline-variant/40 mb-3 block">image</span><p className="text-sm text-secondary">No scans uploaded for this record yet.</p></div>}
          </div>
        </div>
      )}
    </div>
  )
}
