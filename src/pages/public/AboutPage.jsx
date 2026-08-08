export default function AboutPage() {
  return (
    <main className="pt-20 pb-20">
      {/* Hero Section: Editorial Pulse */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-32 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-on-primary-container rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">The Clinical Curator</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-8 text-on-background">
              Bridging the gap between <br />
              <span className="text-primary italic">Intelligence</span> &amp; Empathy.
            </h1>
            <p className="text-xl text-secondary leading-relaxed max-w-2xl font-light">
              Askare is Karachi's pioneer cognitive healthcare platform, combining sophisticated AI diagnostics with the essential warmth of local clinical expertise.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-end reveal reveal-delay-2">
            <div className="w-full aspect-square bg-surface-container-high rounded-[2rem] overflow-hidden relative group">
              <img alt="Modern clinical research laboratory" className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8se1ad1OqEf5K3KkC3D6qMKlE8eACSJ-JmXrfy37wmEybeqFRfX-kyUL6UnrtyhXAMrRRaB9LMjyT9_xU8VtLXwOFL6JQd8BrP_1dbk0xllHU6XZkJ32r8TuFbZmfvGHnEcvQo3FAA3JvMKB-AGbUoPq9uQ3YsroD7c3H073Zpd4FpOQlkt_heMLWy38HTz6TwFv830iQ8NAk8LAkS7nnpkEs-EZl5eQUCgWnQSPBIVTXYYSKktyA6_mGr3TIo5WVnB3Dsb4tdNQ" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values: Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20 md:mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-10 bg-surface-container-low rounded-[2rem] flex flex-col justify-between min-h-[320px] reveal">
            <span className="material-symbols-outlined text-primary text-4xl">lightbulb</span>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h3>
              <p className="text-secondary leading-relaxed font-light">To democratize access to premium cognitive care in Pakistan through ethical AI integration and culturally-aware clinical pathways.</p>
            </div>
          </div>
          <div className="p-10 bg-primary text-on-primary rounded-[2rem] flex flex-col justify-between min-h-[320px] reveal reveal-delay-1">
            <span className="material-symbols-outlined text-4xl">visibility</span>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-on-primary opacity-80 leading-relaxed font-light">A world where every individual has a digital cognitive twin—supporting early detection and lifelong mental resilience.</p>
            </div>
          </div>
          <div className="p-10 bg-surface-container-high rounded-[2rem] flex flex-col justify-between min-h-[320px] reveal reveal-delay-2">
            <span className="material-symbols-outlined text-tertiary text-4xl">favorite</span>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-on-background">Our Values</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium"><span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span> Radial Transparency</div>
                <div className="flex items-center gap-2 text-sm font-medium"><span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span> Scientific Rigor</div>
                <div className="flex items-center gap-2 text-sm font-medium"><span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span> Patient Privacy First</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline: The Askare Journey */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <div className="mb-16 reveal">
          <h2 className="text-3xl font-semibold mb-4">The Askare Journey</h2>
          <div className="h-1 w-20 bg-primary-container rounded-full"></div>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/20 -translate-x-1/2"></div>
          <div className="space-y-20">
            {/* Event 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12 group reveal">
              <div className="lg:w-1/2 lg:text-right">
                <span className="text-label-md text-primary font-bold tracking-widest uppercase mb-2 block">GENESIS</span>
                <h4 className="text-2xl font-semibold mb-4">Identifying the Gap</h4>
                <p className="text-secondary font-light">Founders observed a critical 14-month waiting period for cognitive assessments in Karachi. The need for a rapid, reliable triage tool became evident.</p>
              </div>
              <div className="relative z-10 w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center shrink-0">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              </div>
              <div className="lg:w-1/2">
                <div className="w-full h-40 bg-surface-container-low rounded-xl overflow-hidden">
                  <img alt="Doctor in Karachi with tablet" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfUUYmMKHH4orbv0lyaFFfj_5urzyayOm6Uyt-77EH78tSetMlM5xD9Tbze_JK7uUXSR54Eya82sIxKojd6ZSuctIVsjp6rt0-UoOcnxOcBS3VxUdyhVg35i3fdToXVmMHdUTu_JYu5fBAZIHuWZcM_kUo4oxYrJKORiGDpENzqEoujxx53V5-rtG0y3icl6iXZC3MhgMhZD0D0Jl3GdV8JBG7vlG8-iKjZj4BYOOb2xghbM38Qe18qFVcihHxN4YI3fdJg_NycYw" />
                </div>
              </div>
            </div>
            {/* Event 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 group reveal">
              <div className="lg:w-1/2 lg:text-left">
                <span className="text-label-md text-tertiary font-bold tracking-widest uppercase mb-2 block">Development</span>
                <h4 className="text-2xl font-semibold mb-4">AI Validation</h4>
                <p className="text-secondary font-light">Partnered with leading data scientists to train our proprietary LLM on diverse clinical datasets, ensuring zero-bias in cognitive screening.</p>
              </div>
              <div className="relative z-10 w-12 h-12 bg-background border-4 border-tertiary rounded-full flex items-center justify-center shrink-0">
                <span className="w-2 h-2 bg-tertiary rounded-full"></span>
              </div>
              <div className="lg:w-1/2">
                <div className="w-full h-40 bg-surface-container-low rounded-xl overflow-hidden">
                  <img alt="Neural networks visualization" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCMVz7-iExywyJopqPYiS3_G3QuffiyV4vnBhikwhpW1yFBzRpHQNT-4yhoE3DjmR3kM5f6dg6zuaeOQ4Lj-y8zV6aGd4530upWTkWHsjgdPmwrKRcDDY_74CAmQtd6G9aytj5bOw_lNsofsiOh5zwqZpo7226PbZ3-wPXa0cduBhHsV6xUB0KAY5e-lWTjoQDnZ1FKuGxaJ5wanJGKIi2xoUsRRclnCmvb7nRBHwCohWPNbNbmxJ8VTkAYU9n8YeU4x0qKyOmTm0" />
                </div>
              </div>
            </div>
            {/* Event 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12 group reveal">
              <div className="lg:w-1/2 lg:text-right">
                <span className="text-label-md text-primary font-bold tracking-widest uppercase mb-2 block">LAUNCH</span>
                <h4 className="text-2xl font-semibold mb-4">Askare Live</h4>
                <p className="text-secondary font-light">Official launch in Karachi, connecting over 5,000 patients to immediate AI insights and professional video consultations.</p>
              </div>
              <div className="relative z-10 w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center shrink-0">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              </div>
              <div className="lg:w-1/2">
                <div className="w-full h-40 bg-surface-container-low rounded-xl overflow-hidden">
                  <img alt="Medical team collaborating" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL6-9v5SeQCK0R5N0ns8zz0wKnMF-XM0Wt-pXKyr58nrER5oS65ZRBtfM9QTVvaXWVQ9-HvCLq3TE3U282cFkEOPTUkE0plrwPF-cYHNt0y7S4l46loS-aHQqSDyz5PEtNxcOgjtT3-5_rskMPf83c9wtCGR2cDTrKUmE30FAKFsGCIiz_HxnzUuaXG8cUmjDIK8nSPiGiiwv21lFNCUtdp2XoEv_C85sspzhdpauA5XPCkDP3wz6Cpu4AZFG533RbPwE-tBQ443w" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-surface-container-low py-32 rounded-[3rem] mb-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20 reveal">
            <h2 className="text-4xl font-semibold mb-4">Our Multidisciplinary Team</h2>
            <p className="text-secondary max-w-xl mx-auto font-light">Merging world-class medical expertise with cutting-edge engineering.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-3xl transition-transform hover:-translate-y-2 reveal">
              <div className="w-20 h-20 bg-primary-container rounded-2xl mb-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">stethoscope</span>
              </div>
              <h4 className="text-xl font-bold mb-1">Dr. S. Abbas</h4>
              <p className="text-primary text-sm font-semibold mb-4 uppercase tracking-wider">Chief Medical Officer</p>
              <p className="text-secondary text-sm leading-relaxed font-light">Specialist in Geriatric Psychiatry with 20+ years of experience in cognitive clinical trials.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-3xl transition-transform hover:-translate-y-2 reveal reveal-delay-1">
              <div className="w-20 h-20 bg-secondary-container rounded-2xl mb-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-3xl">psychology</span>
              </div>
              <h4 className="text-xl font-bold mb-1">Sarah Jenkins</h4>
              <p className="text-secondary text-sm font-semibold mb-4 uppercase tracking-wider">AI Ethics Lead</p>
              <p className="text-secondary text-sm leading-relaxed font-light">Pioneer in responsible machine learning and NLP focused on empathetic digital interactions.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-3xl transition-transform hover:-translate-y-2 reveal reveal-delay-2">
              <div className="w-20 h-20 bg-tertiary-container rounded-2xl mb-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-3xl">support_agent</span>
              </div>
              <h4 className="text-xl font-bold mb-1">Ahmed Raza</h4>
              <p className="text-tertiary text-sm font-semibold mb-4 uppercase tracking-wider">Patient Care Director</p>
              <p className="text-secondary text-sm leading-relaxed font-light">Managing Karachi's largest network of human care support agents and follow-up specialists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <div className="bg-primary p-12 lg:p-20 rounded-[3rem] text-on-primary relative overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.4,-44.7C85.5,-31.2,90.8,-15.6,91.3,0.3C91.9,16.2,87.7,32.3,79,45.3C70.3,58.3,57,68.2,42.4,75.4C27.7,82.7,11.7,87.3,-3.1,92.6C-17.9,97.9,-35.8,103.9,-49.5,98.6C-63.2,93.3,-72.7,76.6,-80.4,60.6C-88.1,44.6,-94,29.3,-95.1,13.7C-96.2,-1.9,-92.5,-17.8,-85.4,-31.9C-78.3,-46.1,-67.7,-58.5,-55.1,-66.1C-42.5,-73.7,-27.9,-76.5,-13.6,-80.1C0.7,-83.7,15.1,-88.2,31.3,-83.6C47.5,-79.1,65.5,-65.5,44.7,-76.4Z" fill="currentColor" transform="translate(100 100)"></path>
            </svg>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-semibold mb-6">Built on Unwavering Trust</h2>
              <p className="text-xl text-on-primary/80 mb-10 font-light leading-relaxed">
                Safety isn't a feature; it's our foundation. We utilize end-to-end encryption and medical-grade AI validation to ensure your data remains your own.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">verified_user</span> HIPAA Compliant
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">lock</span> E2E Encrypted
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">policy</span> GDPR Ready
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <h5 className="font-bold mb-2">Responsible AI</h5>
                <p className="text-sm text-on-primary/70">Our algorithms are regularly audited by third-party medical boards to prevent diagnostic drift.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <h5 className="font-bold mb-2">Patient Privacy</h5>
                <p className="text-sm text-on-primary/70">Personal identifiers are scrubbed before any data processing begins, ensuring absolute anonymity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="max-w-4xl mx-auto px-8">
        <div className="bg-error-container/10 p-8 rounded-2xl border-l-4 border-tertiary">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-tertiary">warning</span>
            <div>
              <h4 className="text-tertiary font-bold mb-2">Medical Disclaimer</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed italic">
                Askare is an AI-supported cognitive assistance tool. It is designed to provide reference information and support. It DOES NOT replace professional medical diagnosis, emergency medical care, or the direct advice of a licensed physician. If you are experiencing a medical emergency, please contact local emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
