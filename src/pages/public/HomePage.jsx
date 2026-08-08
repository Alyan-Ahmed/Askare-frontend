import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function HomePage() {
  const [symptoms, setSymptoms] = useState('')
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const aiLink = isLoggedIn ? '/ai-diagnosis' : '/login'
  const bookingLink = isLoggedIn ? '/book-video-call' : '/login'

  const handleSymptomSubmit = (e) => {
    e.preventDefault()
    const message = symptoms.trim()
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    navigate('/ai-diagnosis', { state: message ? { initialMessage: message } : undefined })
  }

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/30 text-on-primary-container border border-primary-container/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[0.7rem] font-bold tracking-widest uppercase">Karachi-Based AI Care</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-on-surface leading-[1.1]">
            Intelligent diagnosis, <br />
            <span className="text-primary italic">human-centered</span> care.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
            Askare combines advanced AI diagnostics with verified local expertise in Karachi to provide instant
            health insights and seamless professional care.
          </p>
          {/* AI Symptom Input Box */}
          <form onSubmit={handleSymptomSubmit} className="bg-surface-container-lowest p-2 rounded-2xl shadow-xl shadow-on-surface/5 border border-surface-container flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-3 gap-3">
              <span className="material-symbols-outlined text-outline">psychology</span>
              <input
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="Describe your symptoms (e.g. Sharp pain in left shoulder)" type="text" />
            </div>
            <button type="submit"
              className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-colors">
              Ask AI <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link to={aiLink} className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              Talk to AI <span className="material-symbols-outlined">chat</span>
            </Link>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <Link to={bookingLink} className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
              Book Doctor Video Call <span className="material-symbols-outlined">videocam</span>
            </Link>
          </div>
        </div>
        {/* Hero Image Layered */}
        <div className="relative reveal reveal-delay-2">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-tertiary-container/10 rounded-full blur-3xl animate-float"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img className="w-full h-[500px] object-cover"
              alt="Modern high-end clinical setting in Karachi"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz2fL4kSoSvtRtqrG2xuUockjysDhyBEuU_98_LO9gmg5xgXjJcoR0vGMRy1PbCEXRc1vTO8CjyCSkz1WxNOqUcbZS9OXtDQ4tn5TYS420c67Mi1M0a-T6GaVtS_XiWkHKuVNovfEgKcKh_Z7vqvQ2chKrlNrAVJ03GYqZZ9mt9jB5rpCrSZoMUpqRm0XW-Mw-77PNCnsKs06JTQbvcp_F2JW68CUwQ7Kvcrpg4eBI4lUr58VoTtGDnL57cjzAB2-CbrdkLJPPVYo" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover object-top" alt="Dr. Arsalan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4LyJ5urRhYWaNc0fAHi1aTPLnVNXCr9Jt3_5dGQkr4oLP2ZKJVy6rIpZrwq0M2pRVXyd9husXHlkwbu953qA9NJcmVQTAwcoY5vO9R0WOEZVtm2ycNh4gYQqj8ef4G7tyZBVvySBVcnN79uOgWnsxrVhjq2L1tbDDu3svWyhtYP5QWFMxpJExQVH5qNCL1n71mb-T_7bbgRMoxc4ZKChtFLv2MhapV1uxN-3cexn7PW6JJV9r95g4ia08RxSTMZipeYxtApQyHQ" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover object-top" alt="Dr. Sarah" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-KawnVanuKt14ZQFtYKaRGkXXXSy_dSCBaDU6_oWWDI5SkQxorawLqkFKaF28GKp9625EUcBiNzTKK07YeNngi0A4y91Wo6DBSKJSuFG4_A9Lqkh4KAeEXbCq0r8CxB8Q7egHxfNXcwNwJwjuFZtM2QXRDaEk3eaFm4b0dNFhihp70seNnWVEl5xw7SdlbO2ARt_0cMPWiTz7Z_ZGDtSwtYoXJQVrNdrAAXSne880taIH5w9NCdSq17vWdMaMszuEhamhlP5Ea58" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover object-top" alt="Dr. Mansoor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0R2oB8OJVQzikzuZsZ6-yi1yy7TSmFjQDJBvIqUptz-S9nkEMSg7m_2T8bN8g_MJqvKANbPxrqi0lLknSMt_nyI9WJBrd-_N38Hw2SvMNxS3IAr74fExUA_bY83zpTQVvIgt4QdZRoEmxfDVX84ATLqB64VZJCC1orZaIXsv38DyxOX1VgVLzUrqJ4_LSzdGgCGca54Kr2iMwFYlHICqj9RGSPgEb1rOvglrTyexlyQPcdJ-6hOenL48N__8-akZdUgGcu8bQ38A" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Verified Specialists</p>
                  <p className="text-[0.65rem] text-on-surface-variant">Available now for consultations in Karachi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Bar */}
      <section className="bg-surface-container-low py-10 reveal">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center gap-8 opacity-70">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">security</span>
            <span className="text-xs font-semibold tracking-widest uppercase">HIPAA Compliant Privacy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <span className="text-xs font-semibold tracking-widest uppercase">PMDC Certified Doctors</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <span className="text-xs font-semibold tracking-widest uppercase">Karachi Hub Care</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">info</span>
            <span className="text-xs font-semibold tracking-widest uppercase">Medical Disclaimer: AI info only</span>
          </div>
        </div>
      </section>

      {/* Features: How it Works (Editorial Bento) */}
      <section className="py-32 max-w-7xl mx-auto px-8">
        <div className="max-w-2xl mb-20 reveal">
          <h2 className="text-3xl font-semibold mb-6">A smarter journey to wellness</h2>
          <p className="text-on-surface-variant text-lg">We've redesigned medical consultation for the modern age, focusing on speed without compromising accuracy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-12 flex flex-col justify-between shadow-sm border border-surface-container reveal reveal-delay-1">
            <div className="max-w-md">
              <span className="text-primary font-bold text-lg mb-4 block">01. AI Analysis</span>
              <h3 className="text-3xl font-semibold mb-4 leading-tight">Instant cognitive symptom mapping</h3>
              <p className="text-on-surface-variant">Our AI cross-references millions of clinical data points to categorize your concerns and provide initial guidance in seconds.</p>
            </div>
            <div className="mt-8 flex justify-end">
              <img className="w-2/3 h-48 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                alt="Digital medical dashboard"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3VCV3c-1s7Z4UG_g5Cp4mX9258g2RYB3R1vgGkviRD2-EpTVxgiQoyavTY2RCz3PPWjL13qzGcjtHNRI1f4XcQaxzBWhgAZq6ozWWGdYsu7nSFuw-45CFEVBTWX69C_t1c9INe5cWij6QzbJhIrli2iu7gTvNqz0D0yUO7bJA7oXy2hvLpGqmqgqdNu8K9A5PegJ2RJJOomDNotUHyaPgbuUDGNwJT8CNWtwyQewvwTMUz6q-zeyyT78VDh3hDOcE2gSL36S2oMo" />
            </div>
          </div>
          <div className="md:col-span-4 bg-primary text-on-primary rounded-[2rem] p-10 flex flex-col justify-end reveal reveal-delay-2">
            <span className="font-bold text-lg mb-4 block">02. Video Link</span>
            <h3 className="text-2xl font-semibold mb-4 leading-tight">Direct connection to Karachi's top specialists</h3>
            <p className="text-on-primary/80 mb-8">Skip the waiting room. Speak to a board-certified doctor from your home within 15 minutes.</p>
            <Link to={bookingLink} className="w-full bg-white text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              Get Started <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
          <div className="md:col-span-4 bg-tertiary-container text-on-tertiary-container rounded-[2rem] p-10 flex flex-col justify-between reveal reveal-delay-3">
            <span className="material-symbols-outlined text-4xl">prescriptions</span>
            <div>
              <h3 className="text-xl font-bold mb-2">Digital Prescription</h3>
              <p className="text-sm opacity-80">Instant e-prescriptions accepted at all leading pharmacies across Karachi.</p>
            </div>
          </div>
          <div className="md:col-span-8 bg-surface-container rounded-[2rem] p-10 flex items-center justify-between gap-8 reveal reveal-delay-4">
            <div className="max-w-xs">
              <h3 className="text-xl font-bold mb-2">Patient Benefits</h3>
              <p className="text-sm text-on-surface-variant">24/7 access to your records, recurring health tracking, and priority scheduling for families.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">family_restroom</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">history</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16 reveal">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold mb-4">Specialized care for every need</h2>
              <p className="text-on-surface-variant">Our network includes the most respected medical professionals in Karachi across diverse fields.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 group"></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Neurology', docs: '12 Available Doctors', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfzFJv7N3_jFM6BTX4TFMlqoYlQSbzsITAxQEszraeh0-WJGQn0sCtcyTji2rlETcP2-cMf3sKSkZPV3k3A88mN6SUlLF4qo1X84uQ9Fq3umVSXs9syO7i7_eP3gSlqAJu6mIyghcr-X3hyu8aSPZ3EgnZB09svlL65bOzvGH6WZiBfhpNsX_cq3Q-W8BlMpKeUDR_2ONNw1UIlNPac-c5Rwc0Nsl17I-sWq7qT-Fc6Qz0lUUTtt6d1fwAgdTzd-Ggdje5HbWmgp0' },
              { name: 'Cardiology', docs: '8 Available Doctors', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmLO4r8ka_hKIp3Fs3gYsEXTosP7RyR7ehWd_42UfYU63Fb_uUpuKYsJ7FopnX_K1GNT8k-VophJIE9nSOG_0aYFO_UeBCkHP7bhEhxGQ45ikEEJeS-OlUE_RQWPTPh3f7rjc4eIq-hzAw0GExfmeTn1GOTaMZ3zUMS2C_0sr1T2RYOjbjskKlU4AOG1xdXFVleygDI2nXyGnNJAr2-ZBGWo62eJTQr0Rsz-d_iSEi8ZWgaSE245ImsXUA3ozfLHGl1N4uOYYEts' },
              { name: 'Psychiatry', docs: '15 Available Doctors', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8IAZRnys-KxbQ16MAroyCeNottECx4hAgDncF2TShfaFb8GniPCP7qYsa7cnnFtTPlgfzhGEY7jQZLzJIkP-Mu_hHkRXvoObGKONYM3nHb2MXPMKpMrbZqmOCY5tl55XC0cq9mz0zEdN-UVmAsr89beh7DR1Soh5FVai2-w7O_TwDoUvf9nCYbuhrYAM-Uar_z2e8-R6rY4eeWzUqz43f24LE0Wi5Q5_wb-bixJYxvReW4pmlOw8saz2tNmFffvAub9dATVUTyk' },
              { name: 'Pediatrics', docs: '20 Available Doctors', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOItay6eeZ9g3d8XlHR7HDRnxG3s6VDD3rPuzaaicfEUrTLIrnb-vWJQu1umzvUdJyJO0USN6JYvhMoTyBuL7-cO8tkcSIcqbaKDRFo7KxAmsk-zE7XlkhHxvM5S-FuOow9MXVGfvi2RnI-xGXMI45zdnxCnKx4qrveM2C54LObBj_lWoLEapplUs9Rn4WQpayK2cwn9zcv4UmBBxQqbyq_uk6rgxgLm1O6KvQkE3GMp8_yn83vzePTkbrX9mdLFDd9m2Sbk36b0' },
            ].map((s, i) => (
              <div key={i} className="group cursor-pointer reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-surface-container-high">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={s.name} src={s.img} />
                </div>
                <h4 className="text-lg font-bold mb-1">{s.name}</h4>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">{s.docs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Asymmetric Layout) */}
      <section className="py-32 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative">
          <span className="text-7xl font-black text-on-surface/5 absolute -top-12 left-8">TRUSTED</span>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 reveal">
              <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm relative z-10">
                <div className="flex gap-1 text-tertiary mb-6">
                  {[...Array(5)].map((_, j) => <span key={j} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
                <p className="text-xl font-medium leading-relaxed italic text-on-surface mb-8">
                  "Askare's AI helped me identify my persistent migraine triggers before I even talked to
                  the doctor. The video consultation was seamless, and I had my meds delivered within 2
                  hours in Clifton."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Ahmed Khan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-7d7xZTz8KLtwUV5-JKesaGB1xo22iDBNROPYDmgiXlyXXrLIKuYACEdNto6u_LLYI3ru9QsYRr4Vuz9jmZzjRqfCkcRkh6leLEBJUqEOb0QflIe3GwNfAeSSqtdoH414ge9QUf_lwIuAqbgcY_dB3y0Tr7xvd-OxI5EIRDR7pqQ1ZXSl2mJ_WpYPPcZmHOL7Fs6dxo0FB-MX8FLu5xPFKcNYu2yBAdeMlNpw_oZl-7KYGcmkDXBjwaAUu5q0m1TR4Hj0QwKWMfI" />
                  </div>
                  <div>
                    <h5 className="font-bold">Ahmed Khan</h5>
                    <p className="text-xs text-on-surface-variant">Marketing Director, Karachi</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest/60 p-8 rounded-[2rem] ml-12 border border-surface-container">
                <p className="text-lg leading-relaxed text-on-surface-variant mb-6">
                  "The peace of mind is what I pay for. Having verified doctors available instantly for my
                  kids is a game changer for a busy parent."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Sara Zehra" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD0Cl5d6Jo7y9cw0cNffx25TwsvXqGf-pZZYtn2RwVc-A7pip93TqKwAvnqJBxiWI9_x7DTlXHwfc8eeQZol1c9VAl3Y53eioZxTpY9UZ7g4TXjUynTnYXO73vmJ6ZKiT1-Zo3Rb6vAwA7C_V-wa7w7iY26jEQuVfjv1qP9N8V4S2xDXvaG3M5I62_bwZpn_MxGuuVg0IFFeE_0jqeEZ-lF7TehBcLcmrDwPlIXklZUUoe6UQFseAGJ5tG3tGGqhq3mecB6CHh_Kk" />
                  </div>
                  <h5 className="font-bold">Sara Zehra</h5>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative reveal reveal-delay-2">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-125"></div>
              <img className="relative rounded-[3rem] shadow-2xl z-10" alt="Video consultation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbciumz1EY_TurOcPX6XjrJjU9x4WP-9aXeVnXQcPo8SaZrNY1DeVAwl8yuwVLfp1QljBFKTXyTNpgQTAXL6BYEUmHWq4C7UWfgPOax8Z88hiqof8_Q4jl25ilaN2z5B8lBpIOJLfiAT5tBxXvovdSKHZwja5QjDPn4RlgRaUiy3_iw9pkIqeUch0b3eb_w-zasS84TGZuJd_5laJ7G--hVK7ZLOP5gDPXibpkZR0NhYT8KspsYavzrUazBCnX9fJFCbaPYHFkifU" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="bg-primary-dim rounded-[3rem] p-16 text-center text-on-primary relative overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 max-w-2xl mx-auto leading-tight">Your health shouldn't have to wait.</h2>
          <p className="text-on-primary/80 text-xl mb-12 max-w-xl mx-auto">Start your first AI diagnosis for free and experience the future of care in Karachi.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={bookingLink} className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-on-primary transition-colors">Book Your First Call</Link>
            <Link to="/about" className="bg-primary/20 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary/30 transition-colors">Learn More</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
