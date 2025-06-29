'use client'

import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { Clock, Video, User, MapPin, Play, Pause, RotateCcw, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import { mockAppointments, mockPatients } from '@/data/mockData'
import { Appointment } from '@/types'

export default function Schedule() {
  const [appointments] = useState(mockAppointments)
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState('')
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Animate appointment cards
    gsap.fromTo('.appointment-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    )

    // Set first appointment as active
    if (appointments.length > 0) {
      setActiveAppointmentId(appointments[0].id)
    }
  }, [appointments])

  useEffect(() => {
    if (activeAppointmentId) {
      const activeAppointment = appointments.find(apt => apt.id === activeAppointmentId)
      if (activeAppointment) {
        startCountdown(activeAppointment.time)
      }
    }
    
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, [activeAppointmentId])

  const formatAppointmentTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatAppointmentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const startCountdown = (endTime: string) => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(endTime).getTime()
      const difference = target - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setCountdown('Session Started')
        if (countdownInterval) {
          clearInterval(countdownInterval)
        }
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    setCountdownInterval(interval)
  }

  const handleAppointmentClick = (appointmentId: string) => {
    setActiveAppointmentId(appointmentId)
    
    // Animate focus change
    gsap.fromTo('.session-focus-content', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
  }

  const getPatientNotes = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId)
    return patient?.notes.slice(0, 2) || []
  }

  const activeAppointment = appointments.find(apt => apt.id === activeAppointmentId)
  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  return (
    <div className="min-h-screen w-full">
      <Header />
      
      <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming List */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl mb-6" style={{ color: 'var(--text-heading)' }}>Upcoming Appointments</h2>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                onClick={() => handleAppointmentClick(appointment.id)}
                className={`appointment-card detail-card p-6 cursor-pointer transition-all duration-300 ${
                  activeAppointmentId === appointment.id ? 'active' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: activeAppointmentId === appointment.id ? 'var(--accent-gold)' : 'var(--border-color)' 
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={appointment.avatar} 
                    alt={appointment.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
                      {appointment.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatAppointmentDate(appointment.time)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatAppointmentTime(appointment.time)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {appointment.type === 'Virtual' ? (
                      <Video className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
                    ) : (
                      <MapPin className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
                    )}
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {appointment.type}
                    </span>
                  </div>
                </div>
                
                <div className="countdown-box p-3 rounded-lg text-center">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Time Until Session</p>
                  <p className="font-mono text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>
                    {activeAppointmentId === appointment.id ? countdown : '--:--:--'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Session Focus */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl mb-6" style={{ color: 'var(--accent-gold)' }}>Session Focus</h2>
          <div className="detail-card p-8 min-h-[450px]">
            {!activeAppointment ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Calendar className="w-16 h-16 mb-4" style={{ color: 'var(--text-secondary)' }} />
                <h3 className="text-2xl mb-2" style={{ color: 'var(--text-heading)' }}>No Session Selected</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Select an appointment from the list to view session details and preparation materials.
                </p>
              </div>
            ) : (
              <div className="session-focus-content">
                {/* Session Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <img 
                      src={activeAppointment.avatar} 
                      alt={activeAppointment.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                        {activeAppointment.name}
                      </h3>
                      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        {formatAppointmentDate(activeAppointment.time)} at {formatAppointmentTime(activeAppointment.time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="countdown-box p-4 rounded-lg text-center min-w-[150px]">
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Starts In</p>
                    <p className="font-mono text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                      {countdown}
                    </p>
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                      {activeAppointment.type === 'Virtual' ? (
                        <Video className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
                      ) : (
                        <MapPin className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
                      )}
                      Session Type
                    </h4>
                    <p style={{ color: 'var(--text-primary)' }}>{activeAppointment.type}</p>
                    {activeAppointment.type === 'Virtual' && (
                      <button className="action-button mt-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
                        style={{ backgroundColor: 'var(--accent-green)', color: 'var(--bg-main)' }}>
                        Join Video Call
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                      <Clock className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                      Duration
                    </h4>
                    <p style={{ color: 'var(--text-primary)' }}>{activeAppointment.duration || 50} minutes</p>
                    <div className="flex gap-2 mt-2">
                      <button className="action-button p-2 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)' }}>
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="action-button p-2 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <Pause className="w-4 h-4" />
                      </button>
                      <button className="action-button p-2 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Previous Session Notes */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
                    Previous Session Notes
                  </h4>
                  <div className="space-y-4">
                    {getPatientNotes(activeAppointment.patientId).map((note) => (
                      <div key={note.id} className="p-4 rounded-lg border-l-4" 
                        style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'var(--accent-green)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                            {new Date(note.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </h5>
                          {note.mood && (
                            <span className="px-2 py-1 rounded text-sm" 
                              style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)' }}>
                              Mood: {note.mood}/10
                            </span>
                          )}
                        </div>
                        <p className="mb-3 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                          {note.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Preparation */}
                <div>
                  <h4 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
                    Session Preparation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                      <h5 className="font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Focus Areas</h5>
                      <ul className="space-y-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <li>• Review homework assignments</li>
                        <li>• Continue anxiety management techniques</li>
                        <li>• Discuss upcoming work presentation</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                      <h5 className="font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Materials Needed</h5>
                      <ul className="space-y-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <li>• Breathing exercise handout</li>
                        <li>• Goal setting worksheet</li>
                        <li>• Progress tracking chart</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
