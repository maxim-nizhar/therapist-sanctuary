-- =============================================================================
-- THERAPIST SANCTUARY DATABASE SCHEMA
-- A comprehensive PostgreSQL database for therapy practice management
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS AND TYPES
-- =============================================================================

-- Session Types
CREATE TYPE session_type_enum AS ENUM ('Individual', 'Couples', 'Family');

-- Patient Status
CREATE TYPE patient_status_enum AS ENUM ('Active', 'Inactive', 'Completed');

-- Appointment Status
CREATE TYPE appointment_status_enum AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Appointment Type
CREATE TYPE appointment_type_enum AS ENUM ('Virtual', 'In-Person');

-- Financial Record Type
CREATE TYPE financial_type_enum AS ENUM ('session', 'consultation', 'assessment', 'cancellation_fee');

-- Financial Status
CREATE TYPE financial_status_enum AS ENUM ('paid', 'pending', 'overdue', 'cancelled', 'refunded');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Therapists/Practitioners Table
CREATE TABLE therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(50), -- Dr., LCSW, LMFT, etc.
    license_number VARCHAR(50),
    phone VARCHAR(20),
    avatar_url TEXT,
    specializations TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    avatar_url TEXT,
    preferred_session_type session_type_enum DEFAULT 'Individual',
    status patient_status_enum DEFAULT 'Active',
    last_session_date DATE,
    next_session_date TIMESTAMP WITH TIME ZONE,
    therapist_id UUID REFERENCES therapists(id),
    notes TEXT, -- General patient notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Types Lookup Table
CREATE TABLE session_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    default_duration_minutes INTEGER DEFAULT 50,
    default_rate DECIMAL(10,2)
);

-- Progress Areas Lookup Table
CREATE TABLE progress_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) -- 'mental_health', 'behavioral', 'social', etc.
);

-- Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280', -- hex color
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- APPOINTMENT AND SESSION TABLES
-- =============================================================================

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(id),
    session_type_id UUID REFERENCES session_types(id),
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    appointment_type appointment_type_enum DEFAULT 'In-Person',
    status appointment_status_enum DEFAULT 'scheduled',
    meeting_url TEXT, -- for virtual sessions
    location TEXT, -- for in-person sessions
    preparation_notes TEXT,
    private_notes TEXT, -- therapist-only notes
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Notes Table
CREATE TABLE session_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(id),
    session_date DATE NOT NULL,
    content TEXT NOT NULL,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    session_goals TEXT,
    homework_assigned TEXT,
    next_session_focus TEXT,
    is_template BOOLEAN DEFAULT false, -- for reusable note templates
    template_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for notes and tags (many-to-many)
CREATE TABLE note_tags (
    note_id UUID REFERENCES session_notes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

-- =============================================================================
-- PROGRESS TRACKING TABLES
-- =============================================================================

-- Mood Entries Table
CREATE TABLE mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    session_note_id UUID REFERENCES session_notes(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL,
    mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
    notes TEXT,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress Entries Table
CREATE TABLE progress_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    progress_area_id UUID REFERENCES progress_areas(id),
    session_note_id UUID REFERENCES session_notes(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
    notes TEXT,
    baseline_score INTEGER CHECK (baseline_score >= 1 AND baseline_score <= 10),
    target_score INTEGER CHECK (target_score >= 1 AND target_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- FINANCIAL TABLES
-- =============================================================================

-- Financial Records Table
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    therapist_id UUID NOT NULL REFERENCES therapists(id),
    record_date DATE NOT NULL,
    transaction_date DATE,
    amount DECIMAL(10,2) NOT NULL,
    record_type financial_type_enum NOT NULL,
    status financial_status_enum DEFAULT 'pending',
    session_type session_type_enum,
    description TEXT,
    invoice_number VARCHAR(50),
    payment_method VARCHAR(50), -- 'cash', 'check', 'credit_card', 'insurance', etc.
    insurance_claim_id VARCHAR(100),
    late_fee DECIMAL(10,2) DEFAULT 0,
    discount_applied DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    due_date DATE,
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Patient indexes
CREATE INDEX idx_patients_therapist_id ON patients(therapist_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_last_session ON patients(last_session_date);
CREATE INDEX idx_patients_next_session ON patients(next_session_date);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

-- Appointment indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX idx_appointments_scheduled_start ON appointments(scheduled_start);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_patient ON appointments(DATE(scheduled_start), patient_id);

-- Session notes indexes
CREATE INDEX idx_session_notes_patient_id ON session_notes(patient_id);
CREATE INDEX idx_session_notes_therapist_id ON session_notes(therapist_id);
CREATE INDEX idx_session_notes_date ON session_notes(session_date);
CREATE INDEX idx_session_notes_appointment_id ON session_notes(appointment_id);

-- Mood entries indexes
CREATE INDEX idx_mood_entries_patient_id ON mood_entries(patient_id);
CREATE INDEX idx_mood_entries_date ON mood_entries(entry_date);
CREATE INDEX idx_mood_entries_patient_date ON mood_entries(patient_id, entry_date);

-- Progress entries indexes
CREATE INDEX idx_progress_entries_patient_id ON progress_entries(patient_id);
CREATE INDEX idx_progress_entries_area_id ON progress_entries(progress_area_id);
CREATE INDEX idx_progress_entries_date ON progress_entries(entry_date);

-- Financial records indexes
CREATE INDEX idx_financial_records_patient_id ON financial_records(patient_id);
CREATE INDEX idx_financial_records_status ON financial_records(status);
CREATE INDEX idx_financial_records_date ON financial_records(record_date);
CREATE INDEX idx_financial_records_due_date ON financial_records(due_date);
CREATE INDEX idx_financial_records_type ON financial_records(record_type);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables with updated_at columns
CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON therapists
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_session_notes_updated_at BEFORE UPDATE ON session_notes
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_financial_records_updated_at BEFORE UPDATE ON financial_records
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- Active patients with next appointment
CREATE VIEW active_patients_with_appointments AS
SELECT 
    p.id,
    p.first_name || ' ' || p.last_name AS full_name,
    p.email,
    p.phone,
    p.avatar_url,
    p.last_session_date,
    p.next_session_date,
    p.preferred_session_type,
    p.status,
    t.first_name || ' ' || t.last_name AS therapist_name,
    COUNT(sn.id) AS total_sessions
FROM patients p
LEFT JOIN therapists t ON p.therapist_id = t.id
LEFT JOIN session_notes sn ON p.id = sn.patient_id
WHERE p.status = 'Active'
GROUP BY p.id, p.first_name, p.last_name, p.email, p.phone, p.avatar_url, 
         p.last_session_date, p.next_session_date, p.preferred_session_type, 
         p.status, t.first_name, t.last_name;

-- Upcoming appointments view
CREATE VIEW upcoming_appointments AS
SELECT 
    a.id,
    a.scheduled_start,
    a.scheduled_end,
    a.appointment_type,
    a.status,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.avatar_url AS patient_avatar,
    t.first_name || ' ' || t.last_name AS therapist_name,
    st.name AS session_type_name,
    st.default_duration_minutes
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN therapists t ON a.therapist_id = t.id
LEFT JOIN session_types st ON a.session_type_id = st.id
WHERE a.scheduled_start >= NOW()
AND a.status = 'scheduled'
ORDER BY a.scheduled_start;

-- Financial summary view
CREATE VIEW financial_summary AS
SELECT 
    p.id AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    COUNT(fr.id) AS total_records,
    SUM(CASE WHEN fr.status = 'paid' THEN fr.amount ELSE 0 END) AS total_paid,
    SUM(CASE WHEN fr.status = 'pending' THEN fr.amount ELSE 0 END) AS total_pending,
    SUM(CASE WHEN fr.status = 'overdue' THEN fr.amount ELSE 0 END) AS total_overdue,
    SUM(fr.amount) AS total_amount
FROM patients p
LEFT JOIN financial_records fr ON p.id = fr.patient_id
GROUP BY p.id, p.first_name, p.last_name;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE therapists IS 'Therapists and practitioners in the system';
COMMENT ON TABLE patients IS 'Patient records with basic information and status';
COMMENT ON TABLE appointments IS 'Scheduled therapy sessions';
COMMENT ON TABLE session_notes IS 'Therapy session notes and documentation';
COMMENT ON TABLE mood_entries IS 'Patient mood tracking data';
COMMENT ON TABLE progress_entries IS 'Patient progress tracking in specific areas';
COMMENT ON TABLE financial_records IS 'Billing, payments, and financial transactions';
COMMENT ON TABLE tags IS 'Tags for categorizing session notes';
COMMENT ON TABLE note_tags IS 'Junction table linking notes to tags';
COMMENT ON TABLE session_types IS 'Types of therapy sessions (Individual, Couples, Family)';
COMMENT ON TABLE progress_areas IS 'Standardized areas for tracking patient progress';

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
