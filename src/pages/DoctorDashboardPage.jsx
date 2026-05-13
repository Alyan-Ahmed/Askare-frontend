import { Link } from 'react-router-dom'

export default function DoctorDashboardPage() {
  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      {/* Header Welcome */}
      <header className="mb-12">
        <h1 className="text-4xl font-medium text-on-background tracking-tight mb-2">Welcome back, <span className="font-extrabold text-primary">Dr. Khan</span></h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">Your clinical agenda is ready. You have 4 video consultations scheduled for today and 3 pending booking requests.</p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Stats */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
          {[
            { label: 'Patients Today', value: '24', icon: 'trending_up', sub: '12% from yesterday', subColor: 'text-secondary' },
            { label: 'Pending Reports', value: '08', icon: 'error', sub: 'High priority needed', subColor: 'text-tertiary', fill: true },
            { label: 'Avg. Consultation', value: '18m', icon: 'timer', sub: 'Optimal performance', subColor: 'text-secondary' },
            { label: 'Active Care Plans', value: '142', icon: 'favorite', sub: 'In monitoring phase', subColor: 'text-secondary' },
            { label: 'Total Income', value: 'PKR 487K', icon: 'trending_up', sub: '+18% this month', subColor: 'text-secondary' },
          ].map((s, i) => (
            <div key={i} className="bg-surface-container-low p-6 rounded-xl">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{s.label}</p>
              <h3 className="text-3xl font-bold">{s.value}</h3>
              <div className={`flex items-center gap-2 mt-2 text-xs ${s.subColor}`}>
                <span className="material-symbols-outlined text-sm" style={s.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>{s.icon}</span>
                <span>{s.sub}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Today's Agenda */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Today's Agenda</h2>
          </div>
          {/* Agenda Item 1 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="bg-primary-container/30 p-4 rounded-xl text-center min-w-[80px]">
              <p className="text-xs font-bold text-primary uppercase">10:30</p>
              <p className="text-lg font-bold text-primary">AM</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-on-surface">Zubair Ahmed</h3>
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Follow-up</span>
              </div>
              <p className="text-sm text-on-surface-variant">Post-Op Recovery Check | Video Consult</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Link to="/video-call?role=doctor&patient=Zubair%20Ahmed" className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-bold hover:opacity-90 transition-all text-center no-underline">Join Room</Link>
              <button className="flex-1 md:flex-none px-5 py-2.5 bg-surface-container text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container-high transition-all">Reschedule</button>
            </div>
          </div>
          {/* Agenda Item 2 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="bg-surface-container p-4 rounded-xl text-center min-w-[80px]">
              <p className="text-xs font-bold text-on-surface-variant uppercase">11:45</p>
              <p className="text-lg font-bold text-on-surface-variant">AM</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-on-surface">Sara Mansoor</h3>
                <span className="bg-tertiary-container/30 text-tertiary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Emergency</span>
              </div>
              <p className="text-sm text-on-surface-variant">Acute Respiratory Distress | Audio Call</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Link to="/video-call?role=doctor&patient=Sara%20Mansoor" className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-bold hover:opacity-90 transition-all text-center no-underline">Join Call</Link>
              <button className="flex-1 md:flex-none px-5 py-2.5 bg-surface-container text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container-high transition-all">Reschedule</button>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* New Requests */}
          <div className="bg-white rounded-2xl p-6 editorial-shadow">
            <h2 className="text-xl font-bold mb-6">New Requests</h2>
            <div className="space-y-6">
              {[
                { name: 'Ayesha Gillani', time: 'Today, 4:00 PM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtgVqtpoxuwZPcPtyRCurlpOWa5ZbVBDhnT87pQnDoBjbIXbHpU0fIUAjJEB6CVxbFPuVov_U-7f-s4R5_HiiVkSBgS5j-jrPD5GMgG2OgolJhRBka_ohz-LBoiCT1GLYdGbSrl_G2EuoPfeUbdKkVMCI4RC5hNzGIC4B2kLGg8FuPqmB313lXYeyrGPvqu09tGfeoiq7PmoOqo1nEc5JR9ecg7_ARrthJiyMptJ6IV8AIK4ru08DEGDPaplCJGWHm6ZyAufKSRI8' },
                { name: 'Haris Vohra', time: 'Tomorrow, 9:00 AM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYy0fu43U11KW0wcTYp4ZvUYs_yE3SWPavj75hGM4ZYZIKeTZ4RG1315tCcje282qekzwFiljsbEZf98A-QdsMVhcGEkn8wwkrJZSV1pJ0OqhcUafjdZwO78r_HdcBLtJv_59DTW_c5gdv4ghV008-FaXh6XhVVmqvTEsaX4R6klCRv12QcTCzhK8zckWklxGeVGTrfFO41zNFFvgjNvjRNgqOB1SophZLoXnGfmD944WeV88Z9A3m1Rw0tNtrD7MDJ0c6-57etHA' },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-4">
                  <img alt="Patient" className="w-12 h-12 rounded-full object-cover" src={r.img} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-on-surface-variant mb-3">{r.time}</p>
                    <div className="flex gap-2">
                      <button className="text-[11px] font-bold text-primary px-3 py-1.5 bg-primary-container/20 rounded-lg hover:bg-primary-container/40 transition-colors">Accept</button>
                      <button className="text-[11px] font-bold text-tertiary px-3 py-1.5 bg-tertiary-container/20 rounded-lg hover:bg-tertiary-container/40 transition-colors">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Records */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Patient Records</h2>
            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
              {[
                { type: 'Consultation', desc: 'Completed Video Consult with Zubair Ahmed', time: '1 hour ago', active: true },
                { type: 'Lab Records', desc: 'Filed Hematology Report for Omar Farooq', time: '3 hours ago' },
                { type: 'Care Management', desc: 'Updated Care Plan for Zainab Khan', time: '5 hours ago' },
                { type: 'Pharmacy', desc: 'Prescription Refill Approved for Maryam Shah', time: 'Yesterday' },
              ].map((r, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-5 h-5 bg-white rounded-full border-2 ${r.active ? 'border-primary' : 'border-outline'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 ${r.active ? 'bg-primary' : 'bg-outline'} rounded-full`}></div>
                  </div>
                  <p className={`text-xs font-bold ${r.active ? 'text-primary' : 'text-on-surface-variant'} mb-0.5`}>{r.type}</p>
                  <p className="text-sm font-medium">{r.desc}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase mt-1">{r.time}</p>
                </div>
              ))}
            </div>
            <Link to="/patient-records" className="block w-full mt-8 py-3 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all text-center">View All Records</Link>
          </div>
        </aside>
      </div>

      {/* Mobile FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center editorial-shadow lg:hidden z-50">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  )
}
