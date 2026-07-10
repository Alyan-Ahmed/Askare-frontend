import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CHAT_REPLIES = [
  "I can see the results clearly now. Let's discuss the next steps.",
  "Could you describe that symptom in more detail?",
  "Understood. I'll prescribe the adjusted dosage after this call.",
  "Good to know. Let's discuss this further.",
  "I'd recommend we schedule a follow-up in two weeks.",
]

const DOCTOR_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjjHmze-FPbpcsPti5gE9P6DmTWdj7N_V9NOsOwt2sGMXJiFOE0OuiMVrdsq_lsC5GrV3RjgcT80enDRKSfiQ_9oDOx4Jd0RELfP9PwU5r9t0WNsS4sCCiPtdEn7jcbfow-3oUoUt3LJNpvWa5wc6zABuVTDxD5_9K7jtcoP6Ulf2rH7VfKy0vrJZT8bMrtJDI6-dWqhsFZGtmZ4iiUxjGNOxOpy9DSk2Kq1WWaWu7BvsxElA4Vp_enUn2ZHwfVID-y-ToYzyE7w'

const INITIAL_MESSAGES = [
  { type: 'system', text: 'Consultation started' },
  { type: 'received', text: "Hello! I can see you've joined. How are you feeling today?", time: '14:30' },
  { type: 'sent', text: "Hi Doctor! I'm doing better since the last checkup. Just wanted to follow up on the medication.", time: '14:31' },
  { type: 'received', text: "That's great to hear! Let me pull up your records while we chat. I'll share my screen in a moment.", time: '14:31' },
]

export default function VideoCallPage() {
  const { userRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [endModal, setEndModal] = useState(false)
  const [summaryModal, setSummaryModal] = useState(false)
  const [summaryDiagnosis, setSummaryDiagnosis] = useState('')
  const [summaryRecommendations, setSummaryRecommendations] = useState('')
  const [summaryMedicines, setSummaryMedicines] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [chatInput, setChatInput] = useState('')
  const [unread, setUnread] = useState(0)
  const chatRef = useRef(null)
  const timerRef = useRef(null)
  const localVideoRef = useRef(null)
  const screenVideoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const screenStreamRef = useRef(null)

  const params = new URLSearchParams(location.search)
  const routeRole = params.get('role')
  const effectiveRole = routeRole === 'doctor' || routeRole === 'patient' ? routeRole : userRole
  const doctorName = params.get('doctor') || 'Dr. Aris Thorne'
  const patientName = params.get('patient') || 'Sarah Chen'
  const peerName = effectiveRole === 'doctor' ? patientName : doctorName

  // Simulate connection after 3s
  useEffect(() => {
    const t = setTimeout(() => {
      setIsConnected(true)
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }, 3000)
    return () => { clearTimeout(t); if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // Try to get local camera
  useEffect(() => {
    const videoEl = localVideoRef.current
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        mediaStreamRef.current = stream
        if (videoEl) videoEl.srcObject = stream
        setIsVideoOff(false)
        setIsMuted(false)
      })
      .catch(() => {
        // If camera fails, try audio only
        navigator.mediaDevices?.getUserMedia({ audio: true })
          .then(stream => {
            mediaStreamRef.current = stream
            setIsMuted(false)
          })
          .catch(() => {})
      })
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop())
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  // Toggle microphone
  const toggleMute = useCallback(() => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = isMuted // if currently muted, enable; if unmuted, disable
      })
    }
    setIsMuted(!isMuted)
  }, [isMuted])

  // Toggle camera
  const toggleVideo = useCallback(() => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks()
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = isVideoOff // if currently off, enable; if on, disable
        })
        setIsVideoOff(!isVideoOff)
      } else {
        // No video track yet, try to get camera
        navigator.mediaDevices?.getUserMedia({ video: true })
          .then(stream => {
            const newVideoTrack = stream.getVideoTracks()[0]
            mediaStreamRef.current.addTrack(newVideoTrack)
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = mediaStreamRef.current
            }
            setIsVideoOff(false)
          })
          .catch(() => {})
      }
    } else {
      // No stream at all, request camera + audio
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mediaStreamRef.current = stream
          if (localVideoRef.current) localVideoRef.current.srcObject = stream
          setIsVideoOff(false)
          setIsMuted(false)
        })
        .catch(() => {})
    }
  }, [isVideoOff])

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop())
        screenStreamRef.current = null
      }
      setIsScreenSharing(false)
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
        screenStreamRef.current = screenStream

        // Show screen share in the main video area
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream
        }

        setIsScreenSharing(true)

        // Listen for user clicking "Stop sharing" in browser
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          screenStreamRef.current = null
          setIsScreenSharing(false)
        })
      } catch (err) {
        // User cancelled or error
        setIsScreenSharing(false)
      }
    }
  }, [isScreenSharing])

  const sendChat = () => {
    if (!chatInput.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(p => [...p, { type: 'sent', text: chatInput, time }])
    setChatInput('')
    setTimeout(() => {
      const reply = CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)]
      const rt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(p => [...p, { type: 'received', text: reply, time: rt }])
      if (!isChatOpen) setUnread(u => u + 1)
    }, 2000 + Math.random() * 2000)
  }

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop())
    if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop())
    if (effectiveRole === 'doctor') {
      setEndModal(false)
      setSummaryModal(true)
    } else {
      navigate(effectiveRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard')
    }
  }

  const submitSummary = () => {
    const summaries = JSON.parse(sessionStorage.getItem('askare_call_summaries') || '[]')
    summaries.push({
      patient: patientName,
      doctor: doctorName,
      diagnosis: summaryDiagnosis,
      recommendations: summaryRecommendations,
      medicines: summaryMedicines.split('\n').filter(m => m.trim()),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    sessionStorage.setItem('askare_call_summaries', JSON.stringify(summaries))
    navigate('/doctor-dashboard')
  }

  const dashPath = effectiveRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden" style={{ background: '#0b0f10' }}>

      {/* ── Top Bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[72px] flex items-center justify-between px-7" style={{ background: 'linear-gradient(0deg, transparent 0%, rgba(11,15,16,0.7) 60%, rgba(11,15,16,0.9) 100%)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => isConnected ? setEndModal(true) : navigate(dashPath)} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-white text-sm font-bold">{peerName}</h1>
            <p className="text-white/50 text-xs">{isScreenSharing ? 'Screen sharing active' : isConnected ? 'Video consultation in progress' : 'Connecting...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[13px] font-semibold tracking-wide" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <span className="w-2 h-2 rounded-full bg-green-500" style={{ animation: 'recPulse 1.5s ease-in-out infinite' }}></span>
              <span>{formatTime(elapsed)}</span>
            </div>
          )}
          <div className="flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
            <span className="material-symbols-outlined text-emerald-400 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>signal_cellular_alt</span>
            <span className="text-[11px] text-white/60 font-medium">Secure</span>
          </div>
        </div>
      </div>

      {/* ── Main Video Area ── */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(145deg, #0f1517 0%, #162023 50%, #0b1215 100%)' }}>
        {isScreenSharing ? (
          /* Screen Share View */
          <div className="w-full h-full flex items-center justify-center" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
            <video ref={screenVideoRef} autoPlay playsInline className="max-w-full max-h-full object-contain rounded-lg" style={{ border: '2px solid rgba(255,255,255,0.06)' }} />
            <div className="absolute top-20 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full px-4 py-2 z-10" style={{ background: 'rgba(0,105,119,0.9)', backdropFilter: 'blur(12px)' }}>
              <span className="material-symbols-outlined text-white text-sm">screen_share</span>
              <span className="text-white text-xs font-semibold">You are sharing your screen</span>
            </div>
          </div>
        ) : !isConnected ? (
          /* Connecting State with Ripple */
          <div className="text-center" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
              <img src={DOCTOR_AVATAR} alt={peerName} className="w-[100px] h-[100px] rounded-full object-cover relative z-[2]" style={{ border: '3px solid rgba(139,229,246,0.4)' }} />
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(139,229,246,0.3)', animation: 'ripple 2s ease-out infinite' }}></div>
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(139,229,246,0.3)', animation: 'ripple 2s ease-out infinite 0.6s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{peerName}</h2>
            <p className="text-white/50 text-sm">Connecting to secure consultation...</p>
          </div>
        ) : (
          /* Connected State */
          <div className="flex flex-col items-center gap-6" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <img src={DOCTOR_AVATAR} alt={peerName} className="w-[140px] h-[140px] rounded-full object-cover" style={{ border: '4px solid rgba(139,229,246,0.3)', boxShadow: '0 0 60px rgba(0,105,119,0.25)', animation: 'avatarPulse 3s ease-in-out infinite' }} />
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-1">{peerName}</h2>
              <p className="text-white/40 text-sm">Video consultation in progress</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Self/Local Video (PiP) ── */}
      <div className="absolute z-20 rounded-[20px] overflow-hidden" style={{ bottom: '120px', right: isChatOpen ? '404px' : '24px', width: '200px', height: '280px', background: '#1a2428', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.08)', transition: 'right 0.3s ease' }}>
        {isVideoOff ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #1a2428, #0f1517)' }}>
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-white/20">person</span>
              <p className="text-[10px] text-white/25 mt-1 font-medium">Camera Off</p>
            </div>
          </div>
        ) : (
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
        )}
        <div className="absolute bottom-3 left-3 bg-black/50 rounded-lg px-2.5 py-1 z-10" style={{ backdropFilter: 'blur(8px)' }}>
          <span className="text-[11px] text-white font-semibold">You</span>
        </div>
        {isMuted && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>mic_off</span>
          </div>
        )}
      </div>

      {/* ── Chat Side Panel ── */}
      <div className="absolute top-0 right-0 bottom-0 z-40 flex flex-col transition-transform duration-300" style={{
        width: '380px',
        background: 'rgba(15,21,23,0.97)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        transform: isChatOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-bold text-sm">In-Call Chat</h3>
          <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:bg-white/15 transition-all" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {messages.map((m, i) => m.type === 'system' ? (
            <div key={i} className="text-center">
              <span className="text-[11px] text-white/30 bg-white/5 px-3 py-1 rounded-full">{m.text}</span>
            </div>
          ) : (
            <div key={i} className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${m.type === 'sent' ? 'self-end rounded-2xl rounded-br-sm text-white' : 'self-start rounded-2xl rounded-bl-sm text-white/90'}`} style={{
              background: m.type === 'sent' ? '#006977' : 'rgba(255,255,255,0.08)',
              animation: 'fadeInUp 0.3s ease-out',
            }}>
              {m.text}
              <span className="block text-[10px] mt-1 opacity-60">{m.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex gap-2.5 items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            className="flex-1 rounded-full px-5 py-3 text-white text-[13px] outline-none transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            placeholder="Type a message..."
          />
          <button onClick={sendChat} className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-all" style={{ background: '#006977' }}>
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Control Bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-24 flex items-center justify-center gap-3 px-6" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(11,15,16,0.85) 40%, rgba(11,15,16,0.97) 100%)' }}>
        {/* Mic */}
        <button onClick={toggleMute} className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: isMuted ? 'rgba(168,56,54,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', color: isMuted ? '#fa746f' : 'white' }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{isMuted ? 'mic_off' : 'mic'}</span>
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap" style={{ background: 'rgba(30,40,44,0.95)', backdropFilter: 'blur(8px)' }}>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* Camera */}
        <button onClick={toggleVideo} className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: isVideoOff ? 'rgba(168,56,54,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', color: isVideoOff ? '#fa746f' : 'white' }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{isVideoOff ? 'videocam_off' : 'videocam'}</span>
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap" style={{ background: 'rgba(30,40,44,0.95)', backdropFilter: 'blur(8px)' }}>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
        </button>

        {/* Screen Share */}
        <button onClick={toggleScreenShare} className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: isScreenSharing ? 'white' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', color: isScreenSharing ? '#0b0f10' : 'white' }}>
          <span className="material-symbols-outlined">{isScreenSharing ? 'stop_screen_share' : 'screen_share'}</span>
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap" style={{ background: 'rgba(30,40,44,0.95)', backdropFilter: 'blur(8px)' }}>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
        </button>

        {/* Chat */}
        <button onClick={() => { setIsChatOpen(!isChatOpen); if (!isChatOpen) setUnread(0) }} className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: isChatOpen ? 'rgba(0,105,119,0.5)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', color: 'white' }}>
          <span className="material-symbols-outlined">chat</span>
          {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap" style={{ background: 'rgba(30,40,44,0.95)', backdropFilter: 'blur(8px)' }}>Chat</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 mx-2" style={{ background: 'rgba(255,255,255,0.1)' }}></div>

        {/* End Call */}
        <button onClick={() => setEndModal(true)} className="group relative h-14 rounded-[28px] flex items-center justify-center transition-all hover:scale-[1.08] active:scale-95" style={{ width: '72px', background: '#c62828', color: 'white' }}>
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>call_end</span>
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap" style={{ background: 'rgba(30,40,44,0.95)', backdropFilter: 'blur(8px)' }}>End Call</span>
        </button>
      </div>

      {/* ── End Call Modal ── */}
      {endModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-3xl p-10 text-center max-w-[400px] w-[90%]" style={{ background: '#1a2428', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeInUp 0.35s ease-out' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(198,40,40,0.15)' }}>
              <span className="material-symbols-outlined text-red-400 text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>call_end</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">End Consultation?</h3>
            <p className="text-white/50 text-sm mb-8">Are you sure you want to end this video consultation?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setEndModal(false)} className="px-6 py-3 rounded-xl text-white font-semibold text-sm hover:bg-white/15 transition-all" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
              <button onClick={endCall} className="px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: '#c62828' }}>End Call</button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations */}

      {/* Doctor Post-Call Summary Modal */}
      {summaryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-3xl p-8 max-w-[520px] w-[92%] max-h-[85vh] overflow-y-auto" style={{ background: '#1a2428', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeInUp 0.35s ease-out' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,105,119,0.2)' }}>
                <span className="material-symbols-outlined text-[#8be9f6] text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>clinical_notes</span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Post-Call Summary</h3>
                <p className="text-white/50 text-sm">Patient: {patientName}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Diagnosis / Illness</label>
                <textarea value={summaryDiagnosis} onChange={e => setSummaryDiagnosis(e.target.value)} rows="3" placeholder="Enter the diagnosis or illness identified..." className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none resize-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Doctor&apos;s Recommendations</label>
                <textarea value={summaryRecommendations} onChange={e => setSummaryRecommendations(e.target.value)} rows="3" placeholder="Enter your recommendations for the patient..." className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none resize-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Prescribed Medicines <span className="normal-case text-white/30">(one per line)</span></label>
                <textarea value={summaryMedicines} onChange={e => setSummaryMedicines(e.target.value)} rows="4" placeholder={"Paracetamol 500mg - Twice daily\nAmoxicillin 250mg - Three times daily"} className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none resize-none font-mono" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => navigate('/doctor-dashboard')} className="flex-1 px-5 py-3 rounded-xl text-white font-semibold text-sm hover:bg-white/15 transition-all" style={{ background: 'rgba(255,255,255,0.1)' }}>Skip</button>
              <button onClick={submitSummary} disabled={!summaryDiagnosis.trim()} className="flex-1 px-5 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: '#006977' }}>Submit &amp; End</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.7); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes avatarPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(0,105,119,0.2); }
          50% { box-shadow: 0 0 80px rgba(0,105,119,0.4); }
        }
        @keyframes recPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
