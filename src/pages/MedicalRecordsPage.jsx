export default function MedicalRecordsPage() {
  const records = [
    { icon: 'bloodtype', iconBg: 'bg-primary-container/30', iconColor: 'text-primary', title: 'Full Blood Count (FBC)', sub: 'Diagnostic Laboratory • Oct 24, 2025', action: 'View Report' },
    { icon: 'radiology', iconBg: 'bg-secondary-container/30', iconColor: 'text-secondary', title: 'Lumbar Spine MRI Scan', sub: 'City Radiology Center • Sep 12, 2025', action: 'View Scans' },
    { icon: 'prescriptions', iconBg: 'bg-tertiary-container/30', iconColor: 'text-tertiary', title: 'Post-Op Recovery Medication', sub: 'Dr. Sarah Ahmed • Aug 05, 2025', action: 'View Details' },
    { icon: 'vaccines', iconBg: 'bg-primary-container/30', iconColor: 'text-primary', title: 'Vaccination Certificate - Booster', sub: 'National Health Portal • Jan 15, 2025', action: 'View Certificate' },
    { icon: 'ecg', iconBg: 'bg-tertiary-container/20', iconColor: 'text-tertiary', title: 'Electrocardiogram (ECG) Report', sub: 'Heart & Vascular Institute • Dec 02, 2024', action: 'View Report' },
  ]

  return (
    <div className="flex-1 px-8 py-12 md:px-12 overflow-y-auto">
      <header className="mb-12 max-w-4xl">
        <h1 className="text-4xl font-medium tracking-tight text-on-surface mb-2 font-headline leading-tight">Medical Records</h1>
        <div className="w-16 h-1 bg-primary rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 gap-6 max-w-5xl">
        {records.map((r, i) => (
          <div key={i} className="group bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between hover:bg-surface-bright transition-all duration-300 border border-transparent hover:shadow-[0_12px_32px_rgba(44,52,54,0.06)]">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-xl ${r.iconBg} flex items-center justify-center ${r.iconColor}`}>
                <span className="material-symbols-outlined text-3xl">{r.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-on-surface">{r.title}</h3>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider opacity-70 mt-1">{r.sub}</p>
              </div>
            </div>
            <button className="bg-surface-container-high px-6 py-2.5 rounded-xl text-primary font-semibold text-sm hover:bg-primary hover:text-on-primary transition-all active:scale-95">{r.action}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
