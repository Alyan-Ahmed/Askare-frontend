import { useState, useRef } from 'react'

export default function MedicalRecordsPage() {
  const fileInputRef = useRef(null)
  const [uploadedRecords, setUploadedRecords] = useState([])

  const defaultRecords = [
    { icon: 'bloodtype', iconBg: 'bg-primary-container/30', iconColor: 'text-primary', title: 'Full Blood Count (FBC)', sub: 'Diagnostic Laboratory • Oct 24, 2025', action: 'View Report' },
    { icon: 'radiology', iconBg: 'bg-secondary-container/30', iconColor: 'text-secondary', title: 'Lumbar Spine MRI Scan', sub: 'City Radiology Center • Sep 12, 2025', action: 'View Scans' },
    { icon: 'prescriptions', iconBg: 'bg-tertiary-container/30', iconColor: 'text-tertiary', title: 'Post-Op Recovery Medication', sub: 'Dr. Sarah Ahmed • Aug 05, 2025', action: 'View Details' },
    { icon: 'vaccines', iconBg: 'bg-primary-container/30', iconColor: 'text-primary', title: 'Vaccination Certificate - Booster', sub: 'National Health Portal • Jan 15, 2025', action: 'View Certificate' },
    { icon: 'ecg', iconBg: 'bg-tertiary-container/20', iconColor: 'text-tertiary', title: 'Electrocardiogram (ECG) Report', sub: 'Heart & Vascular Institute • Dec 02, 2024', action: 'View Report' },
  ]

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    const newRecords = files.map(f => ({
      icon: 'description',
      iconBg: 'bg-primary-container/30',
      iconColor: 'text-primary',
      title: f.name,
      sub: `Uploaded from PC • ${dateStr}`,
      action: 'View File',
      isUploaded: true,
    }))
    setUploadedRecords(prev => [...newRecords, ...prev])
    e.target.value = ''
  }

  const allRecords = [...uploadedRecords, ...defaultRecords]

  return (
    <div className="flex-1 px-8 py-12 md:px-12 overflow-y-auto">
      <header className="mb-12 max-w-4xl reveal">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-on-surface mb-2 font-headline leading-tight">Medical Records</h1>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Upload Medical Record
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 max-w-5xl">
        {allRecords.map((r, i) => (
          <div key={i} className={`group bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between hover:bg-surface-bright transition-all duration-300 border border-transparent hover:shadow-[0_12px_32px_rgba(44,52,54,0.06)] reveal reveal-delay-${Math.min(i + 1, 4)}${r.isUploaded ? ' ring-1 ring-primary/20' : ''}`}>
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
