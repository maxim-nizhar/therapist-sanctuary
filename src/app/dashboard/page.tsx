'use client'

import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { Search, Plus, X, Calendar, TrendingUp, FileText } from 'lucide-react'
import Header from '@/components/Header'
import { mockPatients } from '@/data/mockData'
import { Patient, Note } from '@/types'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activePatientId, setActivePatientId] = useState<string | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [newNote, setNewNote] = useState({ content: '', tags: '', mood: 5 })
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)

  useEffect(() => {
    // Animate patient cards
    gsap.fromTo('.patient-card', 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    )
    
    // Animate welcome view
    gsap.fromTo('.welcome-element', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.3, ease: "power2.out" }
    )
  }, [])

  useEffect(() => {
    const filtered = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
  }, [searchTerm])

  const activePatient = activePatientId ? mockPatients.find(p => p.id === activePatientId) : null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const generateMoodGraph = (data: any[], width = 200, height = 50) => {
    if (!data.length) return ''
    
    const maxMood = Math.max(...data.map(d => d.mood))
    const minMood = Math.min(...data.map(d => d.mood))
    const range = maxMood - minMood || 1
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((d.mood - minMood) / range) * height
      return `${x},${y}`
    }).join(' ')
    
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          className="graph-line"
          style={{ stroke: 'var(--accent-green)' }}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width
          const y = height - ((d.mood - minMood) / range) * height
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              className="graph-dot"
              style={{ fill: 'var(--accent-green)' }}
            />
          )
        })}
      </svg>
    )
  }

  const handlePatientClick = (patientId: string) => {
    setActivePatientId(patientId)
    gsap.fromTo('.detail-view-content', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
  }

  const handleAddNote = () => {
    if (!activePatient || !newNote.content.trim()) return
    
    const note: Note = {
      id: `n${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      mood: newNote.mood
    }
    
    // In a real app, this would update the database
    console.log('Adding note:', note)
    
    setNewNote({ content: '', tags: '', mood: 5 })
    setIsNoteModalOpen(false)
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] h-[calc(100vh-88px)]">
        {/* Patient List Panel */}
        <aside className="border-r p-6 flex flex-col gap-6 overflow-y-auto" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Find a patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-black/20 focus:outline-none focus:ring-2 transition-all text-sm"
              style={{ 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(0,0,0,0.2)'
              }}
            />
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientClick(patient.id)}
                className={`patient-card p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  activePatientId === patient.id ? 'active' : ''
                }`}
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={patient.avatar} 
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: 'var(--text-heading)' }}>
                      {patient.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {patient.sessionType}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs mb-2">
                  <span style={{ color: 'var(--text-secondary)' }}>Last Session</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {formatDate(patient.lastSession)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Mood Trend
                  </span>
                  <div className="flex-1 ml-2">
                    {generateMoodGraph(patient.moodData.slice(-5), 80, 20)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Panel */}
        <main className="overflow-y-auto">
          {!activePatient ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="welcome-element mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <FileText className="w-12 h-12" style={{ color: 'var(--accent-gold)' }} />
                </div>
              </div>
              
              <h2 className="welcome-element text-4xl mb-4" style={{ color: 'var(--text-heading)' }}>
                Welcome to Your Practice
              </h2>
              
              <p className="welcome-element text-xl mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                Select a patient from the sidebar to view their profile, session notes, and progress tracking.
              </p>
              
              <div className="welcome-element grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-green)', opacity: 0.2 }}>
                    <FileText className="w-6 h-6" style={{ color: 'var(--accent-green)' }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Session Notes</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comprehensive session documentation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-gold)', opacity: 0.2 }}>
                    <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Progress Tracking</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Visual progress monitoring</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-red)', opacity: 0.2 }}>
                    <Calendar className="w-6 h-6" style={{ color: 'var(--accent-red)' }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Appointment History</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complete session timeline</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="detail-view-content p-8">
              {/* Patient Header */}
              <div className="detail-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={activePatient.avatar} 
                      alt={activePatient.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
                        {activePatient.name}
                      </h1>
                      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        {activePatient.sessionType} Therapy • {activePatient.status}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsNoteModalOpen(true)}
                    className="action-button flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                    style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Last Session</h3>
                    <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                      {formatDate(activePatient.lastSession)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Next Session</h3>
                    <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                      {activePatient.nextSession ? formatDate(activePatient.nextSession) : 'Not scheduled'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Total Sessions</h3>
                    <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                      {activePatient.notes.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mood Chart */}
              <div className="detail-card p-6 mb-8">
                <h2 className="text-2xl mb-4" style={{ color: 'var(--text-heading)' }}>Mood Progress</h2>
                <div className="flex justify-center">
                  {generateMoodGraph(activePatient.moodData, 600, 150)}
                </div>
              </div>

              {/* Session Notes */}
              <div className="detail-card p-6">
                <h2 className="text-2xl mb-6" style={{ color: 'var(--text-heading)' }}>Session Notes</h2>
                <div className="space-y-6">
                  {activePatient.notes.map((note) => (
                    <div key={note.id} className="border-l-4 pl-4 py-3" style={{ borderColor: 'var(--accent-green)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                          {formatDate(note.date)}
                        </h3>
                        {note.mood && (
                          <span className="px-2 py-1 rounded text-sm" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)' }}>
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
            </div>
          )}
        </main>
      </div>

      {/* Add Note Modal */}
      {isNoteModalOpen && (
        <div className="modal-overlay active fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="modal-content detail-card w-full max-w-2xl p-8 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl" style={{ color: 'var(--text-heading)' }}>Add Session Note</h3>
              <button 
                onClick={() => setIsNoteModalOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Session Notes
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={6}
                  className="w-full p-3 rounded-lg border bg-black/20 focus:outline-none focus:ring-2 resize-none"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-primary)',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                  }}
                  placeholder="Describe the session, key insights, and progress made..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  className="w-full p-3 rounded-lg border bg-black/20 focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-primary)',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                  }}
                  placeholder="anxiety, progress, breakthrough, homework"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Patient Mood (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newNote.mood}
                  onChange={(e) => setNewNote({ ...newNote, mood: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>1 (Low)</span>
                  <span className="font-semibold" style={{ color: 'var(--accent-gold)' }}>{newNote.mood}</span>
                  <span>10 (High)</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddNote}
                  className="action-button flex-1 py-3 rounded-lg font-semibold transition-all duration-200"
                  style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)' }}
                >
                  Save Note
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="action-button flex-1 py-3 rounded-lg font-semibold border transition-all duration-200"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
