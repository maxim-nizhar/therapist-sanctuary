import { Patient, Appointment, FinancialRecord } from '@/types'

export const mockPatients: Patient[] = [
  {
    id: 'p001',
    name: 'Amelia Chen',
    avatar: 'https://placehold.co/100x100/7a9e91/e0e8e5?text=AC',
    lastSession: '2025-06-25',
    nextSession: '2025-06-30T11:00:00',
    sessionType: 'Individual',
    status: 'Active',
    notes: [
      {
        id: 'n001',
        date: '2025-06-25',
        content: 'Amelia showed significant progress in managing her anxiety around social situations. We discussed coping strategies for upcoming work presentations.',
        tags: ['anxiety', 'social', 'work'],
        mood: 7
      },
      {
        id: 'n002',
        date: '2025-06-18',
        content: 'Explored childhood experiences that may contribute to current anxiety patterns. Introduced mindfulness exercises.',
        tags: ['childhood', 'mindfulness', 'anxiety'],
        mood: 5
      }
    ],
    moodData: [
      { date: '2025-06-25', mood: 7 },
      { date: '2025-06-18', mood: 5 },
      { date: '2025-06-11', mood: 6 },
      { date: '2025-06-04', mood: 4 },
      { date: '2025-05-28', mood: 5 },
      { date: '2025-05-21', mood: 6 }
    ],
    progress: [
      { date: '2025-06-25', score: 8, area: 'Anxiety Management' },
      { date: '2025-06-18', score: 6, area: 'Social Confidence' },
      { date: '2025-06-11', score: 7, area: 'Work Performance' }
    ]
  },
  {
    id: 'p002',
    name: 'Benjamin Carter',
    avatar: 'https://placehold.co/100x100/7a9e91/e0e8e5?text=BC',
    lastSession: '2025-06-26',
    nextSession: '2025-06-30T09:00:00',
    sessionType: 'Couples',
    status: 'Active',
    notes: [
      {
        id: 'n003',
        date: '2025-06-26',
        content: 'Couples session with partner Sarah. Worked on communication patterns and conflict resolution strategies.',
        tags: ['couples', 'communication', 'conflict'],
        mood: 6
      }
    ],
    moodData: [
      { date: '2025-06-26', mood: 6 },
      { date: '2025-06-19', mood: 5 },
      { date: '2025-06-12', mood: 7 },
      { date: '2025-06-05', mood: 4 },
      { date: '2025-05-29', mood: 6 }
    ],
    progress: [
      { date: '2025-06-26', score: 7, area: 'Communication' },
      { date: '2025-06-19', score: 6, area: 'Relationship Satisfaction' }
    ]
  },
  {
    id: 'p003',
    name: 'Chloe Davis',
    avatar: 'https://placehold.co/100x100/7a9e91/e0e8e5?text=CD',
    lastSession: '2025-06-27',
    nextSession: '2025-06-30T14:30:00',
    sessionType: 'Individual',
    status: 'Active',
    notes: [
      {
        id: 'n004',
        date: '2025-06-27',
        content: 'Discussed recent career transition and associated stress. Developed action plan for managing change.',
        tags: ['career', 'stress', 'transition'],
        mood: 8
      }
    ],
    moodData: [
      { date: '2025-06-27', mood: 8 },
      { date: '2025-06-20', mood: 6 },
      { date: '2025-06-13', mood: 7 },
      { date: '2025-06-06', mood: 5 }
    ],
    progress: [
      { date: '2025-06-27', score: 8, area: 'Stress Management' },
      { date: '2025-06-20', score: 7, area: 'Career Confidence' }
    ]
  }
]

export const mockAppointments: Appointment[] = [
  {
    id: 'a001',
    patientId: 'p002',
    name: 'Benjamin Carter',
    time: '2025-06-30T09:00:00',
    type: 'Virtual',
    avatar: 'https://placehold.co/100x100/7a9e91/e0e8e5?text=BC',
    duration: 60,
    status: 'scheduled'
  },
  {
    id: 'a002',
    patientId: 'p001',
    name: 'Amelia Chen',
    time: '2025-06-30T11:00:00',
    type: 'In-Person',
    avatar: 'https://placehold.co/100x100/7a9e91/e0e8e5?text=AC',
    duration: 50,
    status: 'scheduled'
  },
  {
    id: 'a003',
    patientId: 'p003',
    name: 'Chloe Davis',
    time: '2025-06-30T14:30:00',
    type: 'Virtual',
    avatar: 'https://placehold.co/100x100/7a9e91/e0e8e5?text=CD',
    duration: 60,
    status: 'scheduled'
  }
]

export const mockFinancialRecords: FinancialRecord[] = [
  {
    id: 'f001',
    patientId: 'p001',
    patientName: 'Amelia Chen',
    date: '2025-06-25',
    amount: 150,
    type: 'session',
    status: 'paid',
    sessionType: 'Individual'
  },
  {
    id: 'f002',
    patientId: 'p002',
    patientName: 'Benjamin Carter',
    date: '2025-06-26',
    amount: 200,
    type: 'session',
    status: 'paid',
    sessionType: 'Couples'
  },
  {
    id: 'f003',
    patientId: 'p003',
    patientName: 'Chloe Davis',
    date: '2025-06-27',
    amount: 150,
    type: 'session',
    status: 'pending',
    sessionType: 'Individual'
  },
  {
    id: 'f004',
    patientId: 'p001',
    patientName: 'Amelia Chen',
    date: '2025-06-18',
    amount: 150,
    type: 'session',
    status: 'paid',
    sessionType: 'Individual'
  },
  {
    id: 'f005',
    patientId: 'p002',
    patientName: 'Benjamin Carter',
    date: '2025-06-12',
    amount: 200,
    type: 'session',
    status: 'overdue',
    sessionType: 'Couples'
  }
]
