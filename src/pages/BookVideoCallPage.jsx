import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const doctors = [
  { name: 'Dr. Arsalan Khan', spec: 'General Physician', rating: '4.9', location: 'Clifton, Karachi', price: 'PKR 2,500', gender: 'male', availability: ['today', 'tomorrow'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4LyJ5urRhYWaNc0fAHi1aTPLnVNXCr9Jt3_5dGQkr4oLP2ZKJVy6rIpZrwq0M2pRVXyd9husXHlkwbu953qA9NJcmVQTAwcoY5vO9R0WOEZVtm2ycNh4gYQqj8ef4G7tyZBVvySBVcnN79uOgWnsxrVhjq2L1tbDDu3svWyhtYP5QWFMxpJExQVH5qNCL1n71mb-T_7bbgRMoxc4ZKChtFLv2MhapV1uxN-3cexn7PW6JJV9r95g4ia08RxSTMZipeYxtApQyHQ', about: 'Dr. Arsalan is a highly experienced General Physician with over 12 years in family medicine. He specializes in chronic disease management and preventive care, serving the Clifton community with dedication.' },
  { name: 'Dr. Sarah Ahmed', spec: 'Pediatrician', rating: '5.0', location: 'DHA Phase VI, Karachi', price: 'PKR 3,000', gender: 'female', availability: ['tomorrow', 'weekend'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-KawnVanuKt14ZQFtYKaRGkXXXSy_dSCBaDU6_oWWDI5SkQxorawLqkFKaF28GKp9625EUcBiNzTKK07YeNngi0A4y91Wo6DBSKJSuFG4_A9Lqkh4KAeEXbCq0r8CxB8Q7egHxfNXcwNwJwjuFZtM2QXRDaEk3eaFm4b0dNFhihp70seNnWVEl5xw7SdlbO2ARt_0cMPWiTz7Z_ZGDtSwtYoXJQVrNdrAAXSne880taIH5w9NCdSq17vWdMaMszuEhamhlP5Ea58', about: 'Dr. Sarah Ahmed is a board-certified pediatrician known for her gentle approach with children. She has extensive training in neonatal care and childhood vaccinations at Aga Khan University Hospital.' },
  { name: 'Dr. Mansoor Ali', spec: 'Psychiatrist', rating: '4.8', location: 'Gulshan-e-Iqbal, Karachi', price: 'PKR 5,000', gender: 'male', availability: ['weekend'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0R2oB8OJVQzikzuZsZ6-yi1yy7TSmFjQDJBvIqUptz-S9nkEMSg7m_2T8bN8g_MJqvKANbPxrqi0lLknSMt_nyI9WJBrd-_N38Hw2SvMNxS3IAr74fExUA_bY83zpTQVvIgt4QdZRoEmxfDVX84ATLqB64VZJCC1orZaIXsv38DyxOX1VgVLzUrqJ4_LSzdGgCGca54Kr2iMwFYlHICqj9RGSPgEb1rOvglrTyexlyQPcdJ-6hOenL48N__8-akZdUgGcu8bQ38A', about: 'Dr. Mansoor Ali is a senior consultant psychiatrist specializing in cognitive behavioral therapy and mood disorders. He offers compassionate, evidence-based care for adults and seniors.' },
]

const timeSlots = ['09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '04:00 PM', '06:30 PM']
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const allSpecialties = ['All Specialties','General Physician','Pediatrician','Psychiatrist','Cardiologist','Neurologist']
const getDefaultFilters = () => ({ specialty: 'All Specialties', gender: [], availability: [], price: 'Any Price' })
const availabilityOptions = [
  { label: 'Available Today', value: 'today' },
  { label: 'Available Tomorrow', value: 'tomorrow' },
  { label: 'Available this Weekend', value: 'weekend' },
]
const priceOptions = ['Any Price','0 - 2,500','2,500 - 5,000','5,000+']

function getPriceAmount(price) {
  return Number(price.replace(/\D/g, ''))
}

function matchesPrice(price, selectedRange) {
  const amount = getPriceAmount(price)
  if (selectedRange === '0 - 2,500') return amount <= 2500
  if (selectedRange === '2,500 - 5,000') return amount >= 2500 && amount <= 5000
  if (selectedRange === '5,000+') return amount >= 5000
  return true
}

function isAllSpecialtyFilter(specialty) {
  return String(specialty).trim().toLowerCase().startsWith('all special')
}

export default function BookVideoCallPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(getDefaultFilters())
  const [draftFilters, setDraftFilters] = useState(getDefaultFilters())
  const [filterOpen, setFilterOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [selectedTime, setSelectedTime] = useState('11:00 AM')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const [specSearch, setSpecSearch] = useState('')

  useEffect(() => {
    if (modal || filterOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [modal, filterOpen])

  const filtered = useMemo(() => {
    const searchTerm = specSearch.trim().toLowerCase()

    return doctors.filter(d => {
      if (searchTerm && !`${d.name} ${d.spec}`.toLowerCase().includes(searchTerm)) return false
      if (!isAllSpecialtyFilter(filters.specialty) && !d.spec.toLowerCase().includes(filters.specialty.toLowerCase())) return false
      if (filters.gender.length > 0 && !filters.gender.includes(d.gender)) return false
      if (filters.availability.length > 0 && !filters.availability.some(opt => d.availability.includes(opt))) return false
      if (filters.price !== 'Any Price' && !matchesPrice(d.price, filters.price)) return false
      return true
    })
  }, [filters, specSearch])

  const calendarDays = useMemo(() => {
    const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const today = new Date()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const isPast = new Date(currentYear, currentMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      days.push({ day: d, isPast })
    }
    return days
  }, [currentMonth, currentYear])

  const navigateMonth = (dir) => {
    let m = currentMonth + dir, y = currentYear
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setCurrentMonth(m); setCurrentYear(y); setSelectedDay(null)
  }

  const openFilters = () => {
    setDraftFilters({
      specialty: filters.specialty,
      gender: filters.gender.slice(),
      availability: filters.availability.slice(),
      price: filters.price,
    })
    setFilterOpen(true)
  }

  const setDraftArrayFilter = (key, value, checked) => {
    setDraftFilters(prev => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter(item => item !== value),
    }))
  }

  const resetFilters = () => {
    setFilters(getDefaultFilters())
    setDraftFilters(getDefaultFilters())
    setSpecSearch('')
    setFilterOpen(false)
  }

  return (
    <main className="flex-1 pt-32 pb-32 max-w-[88rem] mx-auto px-6 w-full">
      <header className="mb-12 reveal">
        <h1 className="text-[3.5rem] leading-tight font-medium text-on-surface mb-2 font-headline">Find your specialist.</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-body leading-relaxed">Verified medical professionals in Karachi, available for instant high-definition video consultations.</p>
      </header>

      {/* Filters */}
      <section className="mb-10 flex flex-col md:flex-row gap-4 items-end reveal reveal-delay-1 relative z-10">
        <div className="w-full md:w-1/3 relative">
          <label className="block text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant mb-2 ml-1">Doctor or Specialty</label>
          <div className="relative">
            <input type="text" value={specSearch} onChange={(e) => setSpecSearch(e.target.value)} placeholder="Search doctor or specialty..." className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 pr-10 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant" />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">search</span>
          </div>
        </div>
        <div className="pb-1">
          <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors border-none relative" onClick={openFilters}>
            <span className="material-symbols-outlined text-xl">tune</span>Filters
          </button>
        </div>
      </section>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((doc) => (
          <div key={doc.name} className="group bg-surface-container-lowest rounded-[1.5rem] overflow-hidden hover:shadow-[0_12px_32px_rgba(44,52,54,0.06)] transition-all duration-300 border border-transparent hover:border-outline-variant/10">
            <div className="relative h-64 overflow-hidden">
              <img alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" src={doc.img} />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xl font-semibold text-on-surface mb-1">{doc.name}</h3><p className="text-primary font-medium text-sm">{doc.spec}</p></div>
                <div className="flex items-center text-tertiary"><span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>star</span><span className="ml-1 font-bold">{doc.rating}</span></div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-on-surface-variant text-sm"><span className="material-symbols-outlined text-lg mr-2">location_on</span>{doc.location}</div>
                <div className="flex items-center text-on-surface-variant text-sm"><span className="material-symbols-outlined text-lg mr-2">payments</span>{doc.price}</div>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2" onClick={() => setModal(doc)}>Book Video Call <span className="material-symbols-outlined text-sm">videocam</span></button>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)}></div>
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-surface-container-lowest shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
              <h2 className="text-xl font-bold text-on-surface font-headline">Filters</h2>
              <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant" onClick={() => setFilterOpen(false)}>close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div><h4 className="text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Specialty</h4><div className="flex flex-wrap gap-2">{allSpecialties.map(s => <button key={s} onClick={() => setDraftFilters(prev => ({ ...prev, specialty: s }))} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${draftFilters.specialty === s ? 'border-2 border-primary bg-primary/5 text-primary font-bold' : 'border border-outline-variant/20 hover:bg-primary/5 hover:border-primary'}`}>{s}</button>)}</div></div>
              <div><h4 className="text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Availability</h4><div className="space-y-4">{availabilityOptions.map(a => <label key={a.value} className="flex items-center gap-3 cursor-pointer group"><input className="w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary/20" type="checkbox" checked={draftFilters.availability.includes(a.value)} onChange={(e) => setDraftArrayFilter('availability', a.value, e.target.checked)} /><span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{a.label}</span></label>)}</div></div>
              <div><h4 className="text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Price Range (PKR)</h4><div className="space-y-4">{priceOptions.map(p => <label key={p} className="flex items-center gap-3 cursor-pointer group"><input className="w-5 h-5 border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer" name="price" type="radio" checked={draftFilters.price === p} onChange={() => setDraftFilters(prev => ({ ...prev, price: p }))} /><span className="text-sm font-medium text-on-surface">{p}</span></label>)}</div></div>
              <div><h4 className="text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Gender</h4><div className="flex gap-6">{['Male','Female'].map(g => <label key={g} className="flex items-center gap-2 cursor-pointer group"><input className="w-5 h-5 rounded border-outline-variant/30 text-primary cursor-pointer" type="checkbox" checked={draftFilters.gender.includes(g.toLowerCase())} onChange={(e) => setDraftArrayFilter('gender', g.toLowerCase(), e.target.checked)} /><span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{g}</span></label>)}</div></div>
            </div>
            <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low flex gap-4">
              <button className="flex-1 py-4 px-4 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all" onClick={() => { setFilters({ ...draftFilters, gender: [...draftFilters.gender], availability: [...draftFilters.availability] }); setFilterOpen(false) }}>Apply Filters</button>
              <button className="px-6 py-4 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/10 font-bold hover:bg-surface-container-high transition-all" onClick={resetFilters}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => setModal(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Left */}
            <div className="w-full md:w-[35%] bg-surface-container-low p-8 border-r border-outline-variant/10 overflow-y-auto">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 shadow-lg"><img alt="Doctor" className="w-full h-full object-cover" src={modal.img} /></div>
                <h2 className="text-2xl font-bold text-on-surface font-headline mb-1">{modal.name}</h2>
                <p className="text-primary font-semibold text-sm mb-6">{modal.spec}</p>
                <div className="space-y-6 w-full">
                  <section><h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant mb-2">About</h3><p className="text-sm text-on-surface-variant leading-relaxed">{modal.about}</p></section>
                  <section><h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant mb-3">Reviews</h3><div className="space-y-4">{[{ stars: 5, time: '2 days ago', text: '"Highly professional and clear with diagnosis."' }, { stars: 4, time: '1 week ago', text: '"Very empathetic and took time to listen."' }].map((r, i) => (<div key={i} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10"><div className="flex justify-between items-center mb-1"><div className="flex text-tertiary">{[...Array(r.stars)].map((_, j) => <span key={j} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>)}{[...Array(5 - r.stars)].map((_, j) => <span key={j} className="material-symbols-outlined text-sm">star</span>)}</div><span className="text-[10px] text-outline">{r.time}</span></div><p className="text-[13px] italic text-on-surface font-medium">{r.text}</p></div>))}</div></section>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <div className="hidden md:flex justify-end mb-4"><button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high transition-colors" onClick={() => setModal(null)}>close</button></div>
              <h2 className="text-2xl font-semibold text-on-surface font-headline mb-8">Schedule Video Call</h2>
              {/* Calendar */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">{monthNames[currentMonth].toUpperCase()} {currentYear}</span>
                  <div className="flex gap-2">
                    <button className="material-symbols-outlined text-sm p-1.5 rounded-full border border-outline-variant hover:bg-surface-container-high" onClick={() => navigateMonth(-1)}>chevron_left</button>
                    <button className="material-symbols-outlined text-sm p-1.5 rounded-full border border-outline-variant hover:bg-surface-container-high" onClick={() => navigateMonth(1)}>chevron_right</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-[10px] font-bold text-outline uppercase py-2">{d}</div>)}
                  {calendarDays.map((cell, i) => cell === null ? <div key={i}></div> : (
                    <button key={i} disabled={cell.isPast} onClick={() => !cell.isPast && setSelectedDay(cell.day)} className={`aspect-square flex flex-col items-center justify-center text-sm rounded-2xl transition-all relative ${selectedDay === cell.day ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : cell.isPast ? 'text-outline-variant/40 cursor-not-allowed' : 'border border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer'}`} style={cell.isPast ? {opacity: 0.85, cursor: 'not-allowed'} : {}}>{cell.day}</button>
                  ))}
                </div>
              </div>
              {/* Time Slots */}
              <div className="mb-12">
                <h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant mb-6">Available Time Slots</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map(t => <button key={t} onClick={() => setSelectedTime(t)} className={`py-4 px-2 rounded-2xl text-sm font-medium transition-all ${selectedTime === t ? 'border-2 border-primary bg-primary/5 text-primary font-bold' : 'border border-outline-variant/20 hover:border-primary hover:text-primary'}`}>{t}</button>)}
                </div>
              </div>
              <div className="flex items-center justify-between pt-8 border-t border-outline-variant/10">
                <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-outline font-bold">Total Fee</span><span className="text-xl font-bold text-on-surface">{modal.price}</span></div>
                <button disabled={!selectedDay} onClick={() => navigate('/payment-details', { state: { doctor: modal, date: selectedDay && `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`, time: selectedTime } })} className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 no-underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">Confirm Appointment <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
