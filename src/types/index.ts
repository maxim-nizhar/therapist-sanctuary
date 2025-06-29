export interface Patient {
  id: string
  name: string
  avatar: string
  lastSession: string
  nextSession?: string
  notes: Note[]
  moodData: MoodEntry[]
  progress: ProgressEntry[]
  sessionType: 'Individual' | 'Couples' | 'Family'
  status: 'Active' | 'Inactive' | 'Completed'
}

export interface Note {
  id: string
  date: string
  content: string
  tags: string[]
  mood?: number
}

export interface MoodEntry {
  date: string
  mood: number
  notes?: string
}

export interface ProgressEntry {
  date: string
  score: number
  area: string
}

export interface Appointment {
  id: string
  patientId: string
  name: string
  time: string
  type: 'Virtual' | 'In-Person'
  avatar: string
  duration?: number
  notes?: string
  status?: 'scheduled' | 'completed' | 'cancelled'
}

export interface FinancialRecord {
  id: string
  patientId: string
  patientName: string
  date: string
  amount: number
  type: 'session' | 'consultation' | 'assessment'
  status: 'paid' | 'pending' | 'overdue'
  sessionType: 'Individual' | 'Couples' | 'Family'
}
