import { useState, useEffect, useRef, useCallback } from 'react'

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

// Field names for the new record form — used for Enter key navigation
const NEW_RECORD_FIELDS = ['newrec-name', 'newrec-id', 'newrec-visitDate', 'newrec-illness', 'newrec-medications', 'newrec-notes', 'newrec-status']

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
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('success')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const formRef = useRef(null)

  const showToast = useCallback((msg, type = 'success') => { setToastType(type); setToast(msg); setTimeout(() => setToast(''), 4000) }, [])

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

  // Delete record handler
  const deleteRecord = (record) => {
    // Remove from allRecords state
    setAllRecords(prev => prev.filter(r => r.id !== record.id || r.name !== record.name))
    // Remove from sessionStorage if it was stored there
    const stored = readStoredRecords()
    const updated = stored.filter(r => r.id !== record.id || r.name !== record.name)
    writeStoredRecords(updated)
    setRecordModal(null)
    setDeleteConfirm(false)
    showToast(`Record for ${record.name} deleted successfully`)
  }

  // Handle Enter / Shift+Enter on form fields
  const handleFieldKeyDown = (e, fieldName) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: for textareas, let default newline happen; for inputs, do nothing
        if (e.target.tagName === 'INPUT') e.preventDefault()
        return
      }
      // Regular Enter: prevent default and go to next field
      e.preventDefault()
      const idx = NEW_RECORD_FIELDS.indexOf(fieldName)
      if (idx >= 0 && idx < NEW_RECORD_FIELDS.length - 1) {
        const nextField = document.getElementById(NEW_RECORD_FIELDS[idx + 1])
        if (nextField) { nextField.focus(); return }
      }
      // If last field or all required filled, try submit
      if (formRef.current) {
        const form = formRef.current
        const name = form.querySelector('[name="name"]')?.value.trim()
        const id = form.querySelector('[name="id"]')?.value.trim()
        const visitDate = form.querySelector('[name="visitDate"]')?.value
        const illness = form.querySelector('[name="illness"]')?.value.trim()
        const notes = form.querySelector('[name="notes"]')?.value.trim()
        if (name && id && visitDate && illness && notes) {
          form.requestSubmit()
        }
      }
    }
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
    showToast(`Record for ${newRecord.name} created successfully`)
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
              <button className="flex-1 text-xs font-bold text-primary bg-primary-container/20 px-3 py-2 rounded-lg hover:bg-primary-container/40 transition-colors" onClick={() => { setRecordModal({ ...record, tab: 'report' }); setDeleteConfirm(false) }}>View Report</button>
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
            <form ref={formRef} className="space-y-5" onSubmit={createRecord}>
              {/* Step 1: Patient Info */}
              <div className="flex items-center gap-2 mb-1"><span className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">1</span><span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Patient Information</span></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient Name <span className="text-error">*</span></label><input id="newrec-name" name="name" type="text" placeholder="Enter patient full name" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required onKeyDown={e => handleFieldKeyDown(e, 'newrec-name')} /></div>
                <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient ID <span className="text-error">*</span></label><input id="newrec-id" name="id" type="text" placeholder="e.g. RE-1234" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required onKeyDown={e => handleFieldKeyDown(e, 'newrec-id')} /></div>
              </div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Visit Date <span className="text-error">*</span></label><input id="newrec-visitDate" name="visitDate" type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" required onKeyDown={e => handleFieldKeyDown(e, 'newrec-visitDate')} /></div>

              {/* Step 2: Diagnosis */}
              <div className="flex items-center gap-2 mb-1 pt-2"><span className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">2</span><span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Clinical Details</span></div>
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-tertiary text-lg">coronavirus</span><label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Illness / Diagnosis <span className="text-error">*</span></label></div>
                <textarea id="newrec-illness" name="illness" placeholder="e.g. Mild hypertension" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline resize-none overflow-hidden" rows="1" required onKeyDown={e => handleFieldKeyDown(e, 'newrec-illness')} onInput={e=>{e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}}></textarea>
              </div>
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings:'"FILL" 1'}}>medication</span><label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Prescribed Medications</label></div><span className="text-[10px] text-secondary font-medium italic">Optional</span></div>
                <textarea id="newrec-medications" name="medications" placeholder="e.g. Lisinopril 10mg, Atorvastatin 20mg" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline resize-none overflow-hidden" rows="1" onKeyDown={e => handleFieldKeyDown(e, 'newrec-medications')} onInput={e=>{e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}}></textarea>
              </div>

              {/* Step 3: Notes */}
              <div className="flex items-center gap-2 mb-1 pt-2"><span className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">3</span><span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Notes & Status</span></div>
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-1"><span className="material-symbols-outlined text-primary text-lg">clinical_notes</span><label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Doctor's Notes <span className="text-error">*</span></label></div>
                <p className="text-[10px] text-secondary mb-3">Press Shift+Enter for a new line</p>
                <textarea id="newrec-notes" name="notes" placeholder="Recommendations, follow-up plan, or additional notes..." rows="3" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline resize-none overflow-hidden" required onKeyDown={e => handleFieldKeyDown(e, 'newrec-notes')} onInput={e=>{e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}}></textarea>
              </div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Status</label><select id="newrec-status" name="status" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" onKeyDown={e => handleFieldKeyDown(e, 'newrec-status')}>{RECORD_STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></div>
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

                {/* Delete Record */}
                <div className="pt-4 border-t border-outline-variant/10">
                  {!deleteConfirm ? (
                    <button className="w-full py-3 rounded-xl font-bold text-sm text-error bg-error-container/20 hover:bg-error-container/40 transition-colors flex items-center justify-center gap-2" onClick={() => setDeleteConfirm(true)}>
                      <span className="material-symbols-outlined text-base">delete</span> Delete Record
                    </button>
                  ) : (
                    <div className="bg-error-container/10 border border-error/20 rounded-xl p-4">
                      <p className="text-sm text-error font-semibold mb-3">Are you sure you want to delete this record? This action cannot be undone.</p>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20" onClick={() => setDeleteConfirm(false)}>Cancel</button>
                        <button className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-error text-on-error hover:opacity-90" onClick={() => deleteRecord(recordModal)}>Confirm Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {recordModal.tab === 'scans' && <div className="bg-surface-container-low p-6 rounded-xl text-center"><span className="material-symbols-outlined text-4xl text-outline-variant/40 mb-3 block">image</span><p className="text-sm text-secondary">No scans uploaded for this record yet.</p></div>}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[90]">
          <div className={`${toastType === 'error' ? 'bg-error' : 'bg-primary'} text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm animate-slide-up`}>
            <span className="material-symbols-outlined" style={{fontVariationSettings:'"FILL" 1'}}>{toastType === 'error' ? 'cancel' : 'check_circle'}</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
