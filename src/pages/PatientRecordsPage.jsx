import { useState, useEffect } from 'react'

const records = [
  { name: 'Arsalan Khan', id: '#RE-9021', status: 'Active', lastVisit: '12 Oct 2023', condition: 'Hypertension Management & Routine follow-up.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAox2cELp727nc8F0QqlouZa__6ZAv4-XcyEzgKe10NFebkQZ6zwt1AVi5A40vtPQlgILrsZO4LEBhgNSHYHes6nqyU_4kjT4LRk4umkaWEpp9o_VpetLVnbbB9Zd2jNVNrpUvg_5U6PulVe0fwMTqmJQ8iB76aIZ86NAX_D7f-WEhXXum1-y8GdUP44sNRoZKGW9TEuwIYHcU_HCp90mV_Ha_VHzhFzOMyeHQw2z7EjJ1H95UUmUeqoJLIy7TscjeCBzVcGXi2ZYY' },
  { name: 'Zainab Ahmed', id: '#RE-8842', status: 'Critical', lastVisit: '05 Nov 2023', condition: 'Post-operative recovery monitoring.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmXnPO21PLhwJVTniu_npMjfzDM_KSTIB0ClK01D_P5UfRiyWq-42Z9h1loZNpfpclplL_9RuDtKr2avUNbc2oB-CBK22UL75psIFW1HtZO8xNE1BKA6xr_r-cC9nZm4iVHArju-Ycp3SGIih52NKv1ubg4o2pWP3blu9YALwQi2mwcNLR7OcBfhAYAYQUgrUzvasuBu54wE5PtubBTNw91u8hBfn7lPw65R0LnHsors5M73nJxpDWE2oC-qSfrMeo-rRAXTjqo4k' },
  { name: 'Omar Malik', id: '#RE-4412', status: 'Stable', lastVisit: '28 Oct 2023', condition: 'Type 2 Diabetes ongoing treatment plan.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT9D0zcCJeziPvNNrzOZCc-Ev3PNg41xMF-B0TlxjjyUr-re1dzv-F_54dSIGZtNzjWESX21qhaggFbLbFRBUyjEJEk1CSNWLZJr3f26l6iFrvxsq09whmD4IJGeokkouEjykI7vEJZqj3AGnssJuPFHIach7dp9YSpbDAE-isJiHgDeIL7On97QIvj0CLk9-EsLmsojxPnpyZct20m9XMVzzXk89Ot0tsdkrNbhanxPKYIjzP4VI79b0GBlEm3gF5la4TtD9kX2w' },
  { name: 'Fatima Jinnah', id: '#RE-1256', status: 'Active', lastVisit: '01 Nov 2023', condition: 'Pediatric vaccination schedule (Phase 3).', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALz4JlxbMvibahzTI4zCPFusmX1bdhkln2rCK-2P0LZRcFu6J8NL-tIJkfFNKX6UOqUgDUR9yA_FwuiJxB8KvwnxroUigyUddYP0HEEumsVLNLyx36sRwOsMvnQBjbHhYPOE6rGhkIr1H8db8K1aEfiUYtotohP33yYK_ysupAG6Pk5ilviX_8zpMfTP7qjbBWJoCXxgccBdCMLZl5Hv_WeRoaTNNZ40yh4xrolieVL4ZK6x-skj1N1xrjN7V-l6Ef58c67p2Z8uk' },
  { name: 'Bilal Siddiqui', id: '#RE-3390', status: 'Stable', lastVisit: '15 Oct 2023', condition: 'Gastrointestinal consultation follow-up.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_c5I2a6Wyaw8Mc840Udt04Ij3QFNqnjGVJk5ejd9qpettYyhmmChUBybX9nRAStaYbC_P0qcDC1q6xaIjk_4HTAY6eKAZ8dS5qalLPv6VUyA7fIN1xFb0vJnfPS7P5cIC7l2i2iZuQbES6zUL8cCL2nZVgmdy5O-0BbUj8zT-rOszQQ_5W1-MtJidvbEMmxAey-4rZR2YNES46kv0FQZ_9Zn41vG0he75gmYNtIJ1Pgf4AGLJ_7SZR0MYDQMn26WzFJX3mpxg97I' },
  { name: 'Sara Ahmed', id: '#RE-7712', status: 'Observation', lastVisit: '22 Oct 2023', condition: 'Acute allergic reaction monitoring.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMre_IOTjkPWeJZmrG2uLZ8EBpLgH-0-hih8Hio0sqMp2_M9OlThcjfelgguLpQsQCmATtbDu9DfO3yoTTwJNPLMaRDxYA-2eHufyh2ncH9piJ4qaJKlBkJa1p3vYermXXzeReHQICkgWgEgnGHnW6ueh753EW2PFyK7GDyWztAlf02GKA4Q2suJETIseMgOyTCKp_wQMdJU4ClNhV_6nOseNoz9g9X7EP3tl6TwlzBIm7fpnfkce-vzZrIp7rvE5OC4s_QKuGvG4' },
]

const statusStyles = {
  Active: 'bg-primary-container text-on-primary-container',
  Critical: 'bg-tertiary-container text-on-tertiary-container',
  Stable: 'bg-surface-container-high text-secondary',
  Observation: 'bg-tertiary-container text-on-tertiary-container',
}

const dateFilterOptions = ['All Time', 'Last 30 Days', 'Last 90 Days', 'Last Year']

function parseVisitDate(value) {
  return new Date(value)
}

const latestVisitDate = records.reduce((latest, record) => {
  const date = parseVisitDate(record.lastVisit)
  return date > latest ? date : latest
}, parseVisitDate(records[0].lastVisit))

export default function PatientRecordsPage() {
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

  const filtered = records.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.condition.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter
    const visitDate = parseVisitDate(r.lastVisit)
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

  return (
    <div className="flex-1 px-8 py-10 max-w-7xl mx-auto w-full">
      <header className="mb-12">
        <h1 className="text-4xl font-medium text-on-surface leading-tight tracking-tight mb-8">Patient Records</h1>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="w-full max-w-xl">
            <label className="block text-[0.75rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-2">Search Registry</label>
            <div className="relative"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-14 pl-12 bg-surface-container-low border-none rounded-xl text-body-lg focus:ring-2 focus:ring-primary/20 transition-shadow" placeholder="Patient name, ID, or condition..." type="text" /></div>
          </div>
          <div className="flex gap-4">
            <button className="h-14 px-6 bg-surface-container-high text-primary rounded-xl font-semibold hover:bg-white transition-colors flex items-center gap-2" onClick={openFilters}><span className="material-symbols-outlined text-[20px]">filter_list</span>Filter</button>
            <button className="h-14 px-8 bg-primary text-on-primary rounded-xl font-semibold shadow-md hover:bg-primary-dim transition-all flex items-center gap-2" onClick={() => setNewRecordOpen(true)}><span className="material-symbols-outlined text-[20px]">add</span>New Record</button>
          </div>
        </div>
      </header>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rec, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-[1.5rem] group hover:bg-surface-container-high transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container"><img alt={rec.name} className="w-full h-full object-cover" src={rec.img} /></div>
              <span className={`${statusStyles[rec.status]} text-[0.7rem] px-3 py-1 rounded-full font-bold uppercase tracking-wider`}>{rec.status}</span>
            </div>
            <div><h3 className="text-title-md font-bold text-on-surface mb-1">{rec.name}</h3><p className="text-label-md text-on-surface-variant mb-4">ID: {rec.id}</p></div>
            <div className="space-y-3">
              <div className="flex items-center text-sm"><span className="material-symbols-outlined text-outline text-[18px] mr-2">calendar_month</span><span className="text-secondary">Last Visit: {rec.lastVisit}</span></div>
              <div className="flex items-start text-sm"><span className="material-symbols-outlined text-outline text-[18px] mr-2 mt-0.5">description</span><span className="text-secondary leading-relaxed">{rec.condition}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 text-xs font-bold text-primary bg-primary-container/20 px-3 py-2 rounded-lg hover:bg-primary-container/40 transition-colors" onClick={() => setRecordModal({ ...rec, tab: 'report' })}>View Report</button>
              <button className="flex-1 text-xs font-bold text-tertiary bg-tertiary-container/20 px-3 py-2 rounded-lg hover:bg-tertiary-container/40 transition-colors" onClick={() => setRecordModal({ ...rec, tab: 'scans' })}>Scans</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <span className="text-xs text-secondary">Showing {filtered.length} of {records.length} records</span>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setFilterOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-8 z-10">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface">Filter Records</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setFilterOpen(false)}>close</button></div>
            <div className="space-y-6">
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Status</label><div className="flex flex-wrap gap-2">{['all','Active','Critical','Stable','Observation'].map(s => <button key={s} onClick={() => setDraftStatusFilter(s.toLowerCase())} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${draftStatusFilter === s.toLowerCase() ? 'bg-primary border-primary text-white' : 'border-outline-variant/20 hover:border-primary hover:text-primary'}`}>{s === 'all' ? 'All' : s}</button>)}</div></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date Range</label><select value={draftDateFilter} onChange={(e) => setDraftDateFilter(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20">{dateFilterOptions.map(option => <option key={option}>{option}</option>)}</select></div>
              <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* New Record Modal */}
      {newRecordOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setNewRecordOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-8 z-10">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-on-surface">New Patient Record</h2><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setNewRecordOpen(false)}>close</button></div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setNewRecordOpen(false) }}>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient Name</label><input type="text" placeholder="Enter patient full name" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required /></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient ID</label><input type="text" placeholder="e.g. RE-1234" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline" required /></div>
              <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Condition / Notes</label><textarea placeholder="Describe the condition or diagnosis..." rows="3" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Status</label><select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20"><option>Active</option><option>Critical</option><option>Stable</option><option>Observation</option></select></div>
                <div><label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Visit Date</label><input type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" /></div>
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined text-sm">add</span>Create Record</button>
            </form>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
      {recordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setRecordModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-8 z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden"><img alt={recordModal.name} src={recordModal.img} className="w-full h-full object-cover" /></div><div><h2 className="text-lg font-bold text-on-surface">{recordModal.name}</h2><p className="text-sm text-secondary">{recordModal.id} • {recordModal.status}</p></div></div>
              <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high" onClick={() => setRecordModal(null)}>close</button>
            </div>
            {recordModal.tab === 'report' && <div className="space-y-4"><div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Clinical Summary</p><p className="text-sm text-on-surface leading-relaxed">{recordModal.condition}</p></div><div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Last Visit</p><p className="text-sm text-on-surface">{recordModal.lastVisit}</p></div><div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Vitals Recorded</p><div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-secondary">Blood Pressure:</span> <span className="text-on-surface font-medium">128/84 mmHg</span></div><div><span className="text-secondary">Heart Rate:</span> <span className="text-on-surface font-medium">72 bpm</span></div><div><span className="text-secondary">Temperature:</span> <span className="text-on-surface font-medium">98.6°F</span></div><div><span className="text-secondary">SpO2:</span> <span className="text-on-surface font-medium">98%</span></div></div></div><div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Medications</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-on-surface font-medium">Lisinopril 10mg</span><span className="text-secondary">Once daily</span></div><div className="flex justify-between"><span className="text-on-surface font-medium">Atorvastatin 20mg</span><span className="text-secondary">Before bed</span></div></div></div><div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Doctor's Notes</p><p className="text-sm text-on-surface leading-relaxed">Patient is responding well to current treatment plan. Continue monitoring blood pressure and schedule follow-up in 4 weeks. Recommend lifestyle modifications including dietary changes and regular exercise.</p></div></div>}
            {recordModal.tab === 'scans' && <div className="bg-surface-container-low p-6 rounded-xl text-center"><span className="material-symbols-outlined text-4xl text-outline-variant/40 mb-3 block">image</span><p className="text-sm text-secondary">No scans uploaded for this record yet.</p></div>}
            {recordModal.tab === 'details' && <div className="space-y-4"><div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Patient Information</p><div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-secondary">Name:</span> <span className="text-on-surface font-medium">{recordModal.name}</span></div><div><span className="text-secondary">ID:</span> <span className="text-on-surface font-medium">{recordModal.id}</span></div><div><span className="text-secondary">Status:</span> <span className="text-on-surface font-medium">{recordModal.status}</span></div><div><span className="text-secondary">Last Visit:</span> <span className="text-on-surface font-medium">{recordModal.lastVisit}</span></div></div></div></div>}
          </div>
        </div>
      )}
    </div>
  )
}
