-- =============================================================================
-- THERAPIST SANCTUARY DATABASE SEED DATA (CORRECTED UUIDS)
-- Populate the database with initial data based on existing mock data
-- =============================================================================

-- =============================================================================
-- INSERT BASIC LOOKUP DATA
-- =============================================================================

-- Session Types
INSERT INTO session_types (id, name, description, default_duration_minutes, default_rate) VALUES
(uuid_generate_v4(), 'Individual', 'One-on-one therapy session', 50, 150.00),
(uuid_generate_v4(), 'Couples', 'Therapy session for couples', 60, 200.00),
(uuid_generate_v4(), 'Family', 'Family therapy session', 60, 180.00);

-- Progress Areas
INSERT INTO progress_areas (id, name, description, category) VALUES
(uuid_generate_v4(), 'Anxiety Management', 'Managing anxiety symptoms and triggers', 'mental_health'),
(uuid_generate_v4(), 'Social Confidence', 'Building confidence in social situations', 'social'),
(uuid_generate_v4(), 'Work Performance', 'Improving workplace functioning and performance', 'behavioral'),
(uuid_generate_v4(), 'Communication', 'Enhancing communication skills', 'social'),
(uuid_generate_v4(), 'Relationship Satisfaction', 'Improving relationship quality and satisfaction', 'social'),
(uuid_generate_v4(), 'Stress Management', 'Developing healthy stress coping mechanisms', 'mental_health'),
(uuid_generate_v4(), 'Career Confidence', 'Building confidence in career and professional settings', 'behavioral'),
(uuid_generate_v4(), 'Depression Management', 'Managing depressive symptoms', 'mental_health'),
(uuid_generate_v4(), 'Sleep Quality', 'Improving sleep patterns and quality', 'behavioral'),
(uuid_generate_v4(), 'Emotional Regulation', 'Developing emotional regulation skills', 'mental_health');

-- Tags
INSERT INTO tags (id, name, color, description) VALUES
(uuid_generate_v4(), 'anxiety', '#F59E0B', 'Anxiety-related topics and interventions'),
(uuid_generate_v4(), 'social', '#10B981', 'Social situations and interactions'),
(uuid_generate_v4(), 'work', '#3B82F6', 'Work and career-related issues'),
(uuid_generate_v4(), 'childhood', '#8B5CF6', 'Childhood experiences and trauma'),
(uuid_generate_v4(), 'mindfulness', '#06B6D4', 'Mindfulness and meditation practices'),
(uuid_generate_v4(), 'couples', '#EC4899', 'Couples therapy and relationship work'),
(uuid_generate_v4(), 'communication', '#84CC16', 'Communication skills and patterns'),
(uuid_generate_v4(), 'conflict', '#EF4444', 'Conflict resolution and management'),
(uuid_generate_v4(), 'career', '#F97316', 'Career transitions and development'),
(uuid_generate_v4(), 'stress', '#6366F1', 'Stress management and coping'),
(uuid_generate_v4(), 'transition', '#14B8A6', 'Life transitions and changes');

-- =============================================================================
-- INSERT THERAPIST DATA
-- =============================================================================

-- Create a default therapist (this would normally be multiple therapists)
INSERT INTO therapists (id, email, first_name, last_name, title, license_number, phone, specializations, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'dr.therapist@therapistsanctuary.com', 'Dr. Sarah', 'Johnson', 'LCSW', 'LCSW-12345', '(555) 123-4567', ARRAY['Anxiety Disorders', 'Depression', 'Couples Therapy', 'Trauma'], true);

-- =============================================================================
-- INSERT PATIENT DATA (CONVERTED FROM MOCK DATA)
-- =============================================================================

-- Patient 1: Amelia Chen
INSERT INTO patients (id, first_name, last_name, email, phone, avatar_url, preferred_session_type, status, last_session_date, next_session_date, therapist_id, notes) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Amelia', 'Chen', 'amelia.chen@email.com', '(555) 234-5678', 'https://placehold.co/100x100/7a9e91/e0e8e5?text=AC', 'Individual', 'Active', '2025-06-25', '2025-06-30T11:00:00', '550e8400-e29b-41d4-a716-446655440000', 'Patient shows good progress with anxiety management techniques.');

-- Patient 2: Benjamin Carter
INSERT INTO patients (id, first_name, last_name, email, phone, avatar_url, preferred_session_type, status, last_session_date, next_session_date, therapist_id, notes) VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Benjamin', 'Carter', 'benjamin.carter@email.com', '(555) 345-6789', 'https://placehold.co/100x100/7a9e91/e0e8e5?text=BC', 'Couples', 'Active', '2025-06-26', '2025-06-30T09:00:00', '550e8400-e29b-41d4-a716-446655440000', 'Couples therapy with partner Sarah. Working on communication patterns.');

-- Patient 3: Chloe Davis
INSERT INTO patients (id, first_name, last_name, email, phone, avatar_url, preferred_session_type, status, last_session_date, next_session_date, therapist_id, notes) VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Chloe', 'Davis', 'chloe.davis@email.com', '(555) 456-7890', 'https://placehold.co/100x100/7a9e91/e0e8e5?text=CD', 'Individual', 'Active', '2025-06-27', '2025-06-30T14:30:00', '550e8400-e29b-41d4-a716-446655440000', 'Recent career transition creating stress. Developing coping strategies.');

-- =============================================================================
-- INSERT APPOINTMENTS
-- =============================================================================

INSERT INTO appointments (id, patient_id, therapist_id, session_type_id, scheduled_start, scheduled_end, appointment_type, status) VALUES
-- Benjamin Carter - Couples session
('d4e5f6a7-b8c9-0123-def0-234567890123', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM session_types WHERE name = 'Couples'), '2025-06-30T09:00:00', '2025-06-30T10:00:00', 'Virtual', 'scheduled'),

-- Amelia Chen - Individual session
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM session_types WHERE name = 'Individual'), '2025-06-30T11:00:00', '2025-06-30T11:50:00', 'In-Person', 'scheduled'),

-- Chloe Davis - Individual session
('f6a7b8c9-d0e1-2345-f012-456789012345', 'c3d4e5f6-a7b8-9012-cdef-123456789012', '550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM session_types WHERE name = 'Individual'), '2025-06-30T14:30:00', '2025-06-30T15:20:00', 'Virtual', 'scheduled');

-- =============================================================================
-- INSERT SESSION NOTES
-- =============================================================================

-- Session Note 1: Amelia Chen - June 25
INSERT INTO session_notes (id, patient_id, therapist_id, session_date, content, mood_rating, session_goals, next_session_focus) VALUES
('a0b1c2d3-e4f5-6789-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '550e8400-e29b-41d4-a716-446655440000', '2025-06-25', 'Amelia showed significant progress in managing her anxiety around social situations. We discussed coping strategies for upcoming work presentations.', 7, 'Practice anxiety management techniques for work presentations', 'Continue building confidence for workplace interactions');

-- Session Note 2: Amelia Chen - June 18
INSERT INTO session_notes (id, patient_id, therapist_id, session_date, content, mood_rating, homework_assigned) VALUES
('b1c2d3e4-f5a6-789a-bcde-f12345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '550e8400-e29b-41d4-a716-446655440000', '2025-06-18', 'Explored childhood experiences that may contribute to current anxiety patterns. Introduced mindfulness exercises.', 5, 'Practice daily mindfulness meditation for 10 minutes');

-- Session Note 3: Benjamin Carter - June 26
INSERT INTO session_notes (id, patient_id, therapist_id, session_date, content, mood_rating) VALUES
('c2d3e4f5-a6b7-89ab-cdef-123456789012', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '550e8400-e29b-41d4-a716-446655440000', '2025-06-26', 'Couples session with partner Sarah. Worked on communication patterns and conflict resolution strategies.', 6);

-- Session Note 4: Chloe Davis - June 27
INSERT INTO session_notes (id, patient_id, therapist_id, session_date, content, mood_rating, session_goals) VALUES
('d3e4f5a6-b7c8-9abc-def1-23456789012a', 'c3d4e5f6-a7b8-9012-cdef-123456789012', '550e8400-e29b-41d4-a716-446655440000', '2025-06-27', 'Discussed recent career transition and associated stress. Developed action plan for managing change.', 8, 'Develop concrete action steps for career transition management');

-- =============================================================================
-- INSERT NOTE TAGS (MANY-TO-MANY RELATIONSHIPS)
-- =============================================================================

-- Tags for Note 1 (Amelia - anxiety, social, work)
INSERT INTO note_tags (note_id, tag_id) VALUES
('a0b1c2d3-e4f5-6789-abcd-ef1234567890', (SELECT id FROM tags WHERE name = 'anxiety')),
('a0b1c2d3-e4f5-6789-abcd-ef1234567890', (SELECT id FROM tags WHERE name = 'social')),
('a0b1c2d3-e4f5-6789-abcd-ef1234567890', (SELECT id FROM tags WHERE name = 'work'));

-- Tags for Note 2 (Amelia - childhood, mindfulness, anxiety)
INSERT INTO note_tags (note_id, tag_id) VALUES
('b1c2d3e4-f5a6-789a-bcde-f12345678901', (SELECT id FROM tags WHERE name = 'childhood')),
('b1c2d3e4-f5a6-789a-bcde-f12345678901', (SELECT id FROM tags WHERE name = 'mindfulness')),
('b1c2d3e4-f5a6-789a-bcde-f12345678901', (SELECT id FROM tags WHERE name = 'anxiety'));

-- Tags for Note 3 (Benjamin - couples, communication, conflict)
INSERT INTO note_tags (note_id, tag_id) VALUES
('c2d3e4f5-a6b7-89ab-cdef-123456789012', (SELECT id FROM tags WHERE name = 'couples')),
('c2d3e4f5-a6b7-89ab-cdef-123456789012', (SELECT id FROM tags WHERE name = 'communication')),
('c2d3e4f5-a6b7-89ab-cdef-123456789012', (SELECT id FROM tags WHERE name = 'conflict'));

-- Tags for Note 4 (Chloe - career, stress, transition)
INSERT INTO note_tags (note_id, tag_id) VALUES
('d3e4f5a6-b7c8-9abc-def1-23456789012a', (SELECT id FROM tags WHERE name = 'career')),
('d3e4f5a6-b7c8-9abc-def1-23456789012a', (SELECT id FROM tags WHERE name = 'stress')),
('d3e4f5a6-b7c8-9abc-def1-23456789012a', (SELECT id FROM tags WHERE name = 'transition'));

-- =============================================================================
-- INSERT MOOD ENTRIES
-- =============================================================================

-- Amelia Chen mood data
INSERT INTO mood_entries (patient_id, entry_date, mood_rating, session_note_id, notes) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-25', 7, 'a0b1c2d3-e4f5-6789-abcd-ef1234567890', 'Feeling more confident about work presentation'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-18', 5, 'b1c2d3e4-f5a6-789a-bcde-f12345678901', 'Difficult session exploring childhood'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-11', 6, NULL, 'Practicing mindfulness techniques'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-04', 4, NULL, 'Stressful week at work'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-05-28', 5, NULL, 'Moderate anxiety levels'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-05-21', 6, NULL, 'Good day overall');

-- Benjamin Carter mood data
INSERT INTO mood_entries (patient_id, entry_date, mood_rating, session_note_id, notes) VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2025-06-26', 6, 'c2d3e4f5-a6b7-89ab-cdef-123456789012', 'Productive couples session'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2025-06-19', 5, NULL, 'Communication challenges with partner'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2025-06-12', 7, NULL, 'Better understanding of relationship patterns'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2025-06-05', 4, NULL, 'Conflict with partner'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2025-05-29', 6, NULL, 'Working on communication skills');

-- Chloe Davis mood data
INSERT INTO mood_entries (patient_id, entry_date, mood_rating, session_note_id, notes) VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2025-06-27', 8, 'd3e4f5a6-b7c8-9abc-def1-23456789012a', 'Feeling optimistic about career transition'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2025-06-20', 6, NULL, 'Processing career changes'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2025-06-13', 7, NULL, 'Good progress with stress management'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2025-06-06', 5, NULL, 'Uncertainty about career direction');

-- =============================================================================
-- INSERT PROGRESS ENTRIES
-- =============================================================================

-- Amelia Chen progress entries
INSERT INTO progress_entries (patient_id, progress_area_id, entry_date, score, session_note_id, notes, baseline_score, target_score) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', (SELECT id FROM progress_areas WHERE name = 'Anxiety Management'), '2025-06-25', 8, 'a0b1c2d3-e4f5-6789-abcd-ef1234567890', 'Significant improvement in managing work-related anxiety', 4, 8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', (SELECT id FROM progress_areas WHERE name = 'Social Confidence'), '2025-06-18', 6, 'b1c2d3e4-f5a6-789a-bcde-f12345678901', 'Building confidence gradually', 3, 8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', (SELECT id FROM progress_areas WHERE name = 'Work Performance'), '2025-06-11', 7, NULL, 'Better performance reviews at work', 5, 9);

-- Benjamin Carter progress entries
INSERT INTO progress_entries (patient_id, progress_area_id, entry_date, score, session_note_id, notes, baseline_score, target_score) VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', (SELECT id FROM progress_areas WHERE name = 'Communication'), '2025-06-26', 7, 'c2d3e4f5-a6b7-89ab-cdef-123456789012', 'Learning new communication techniques with partner', 4, 9),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', (SELECT id FROM progress_areas WHERE name = 'Relationship Satisfaction'), '2025-06-19', 6, NULL, 'Moderate improvement in relationship quality', 3, 8);

-- Chloe Davis progress entries
INSERT INTO progress_entries (patient_id, progress_area_id, entry_date, score, session_note_id, notes, baseline_score, target_score) VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', (SELECT id FROM progress_areas WHERE name = 'Stress Management'), '2025-06-27', 8, 'd3e4f5a6-b7c8-9abc-def1-23456789012a', 'Excellent progress with stress management techniques', 4, 8),
('c3d4e5f6-a7b8-9012-cdef-123456789012', (SELECT id FROM progress_areas WHERE name = 'Career Confidence'), '2025-06-20', 7, NULL, 'Growing confidence in career transition', 3, 9);

-- =============================================================================
-- INSERT FINANCIAL RECORDS
-- =============================================================================

INSERT INTO financial_records (id, patient_id, therapist_id, record_date, amount, record_type, status, session_type, description, payment_method, paid_date) VALUES
-- Amelia Chen - June 25 session (paid)
('f0a1b2c3-d4e5-f678-90ab-cdef12345678', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '550e8400-e29b-41d4-a716-446655440000', '2025-06-25', 150.00, 'session', 'paid', 'Individual', 'Individual therapy session', 'credit_card', '2025-06-25'),

-- Benjamin Carter - June 26 session (paid)
('f1b2c3d4-e5f6-a789-01bc-def123456789', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '550e8400-e29b-41d4-a716-446655440000', '2025-06-26', 200.00, 'session', 'paid', 'Couples', 'Couples therapy session', 'check', '2025-06-27'),

-- Chloe Davis - June 27 session (pending)
('f2c3d4e5-f6a7-b890-12cd-ef1234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789012', '550e8400-e29b-41d4-a716-446655440000', '2025-06-27', 150.00, 'session', 'pending', 'Individual', 'Individual therapy session', NULL, NULL),

-- Amelia Chen - June 18 session (paid)
('f3d4e5f6-a7b8-c901-23de-f12345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '550e8400-e29b-41d4-a716-446655440000', '2025-06-18', 150.00, 'session', 'paid', 'Individual', 'Individual therapy session', 'insurance', '2025-06-20'),

-- Benjamin Carter - June 12 session (overdue)
('f4e5f6a7-b8c9-d012-34ef-123456789012', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '550e8400-e29b-41d4-a716-446655440000', '2025-06-12', 200.00, 'session', 'overdue', 'Couples', 'Couples therapy session', NULL, NULL);

-- =============================================================================
-- UPDATE PATIENT LAST SESSION DATES
-- =============================================================================

-- Update patients with their actual last session dates from the notes
UPDATE patients SET last_session_date = '2025-06-25' WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
UPDATE patients SET last_session_date = '2025-06-26' WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
UPDATE patients SET last_session_date = '2025-06-27' WHERE id = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

-- =============================================================================
-- CREATE ADDITIONAL HELPFUL FUNCTIONS
-- =============================================================================

-- Function to get patient summary
CREATE OR REPLACE FUNCTION get_patient_summary(patient_uuid UUID)
RETURNS TABLE (
    patient_name TEXT,
    total_sessions BIGINT,
    latest_mood INTEGER,
    avg_mood NUMERIC,
    total_amount_owed NUMERIC,
    next_appointment TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.first_name || ' ' || p.last_name,
        COUNT(sn.id),
        (SELECT mood_rating FROM mood_entries WHERE patient_id = patient_uuid ORDER BY entry_date DESC LIMIT 1),
        (SELECT AVG(mood_rating) FROM mood_entries WHERE patient_id = patient_uuid),
        COALESCE(SUM(CASE WHEN fr.status IN ('pending', 'overdue') THEN fr.amount ELSE 0 END), 0),
        (SELECT scheduled_start FROM appointments WHERE patient_id = patient_uuid AND status = 'scheduled' ORDER BY scheduled_start LIMIT 1)
    FROM patients p
    LEFT JOIN session_notes sn ON p.id = sn.patient_id
    LEFT JOIN financial_records fr ON p.id = fr.patient_id
    WHERE p.id = patient_uuid
    GROUP BY p.id, p.first_name, p.last_name;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VERIFY DATA INSERTION
-- =============================================================================

-- Display summary of inserted data
SELECT 'Data Insertion Summary' AS status;
SELECT 'Therapists: ' || COUNT(*) AS summary FROM therapists;
SELECT 'Patients: ' || COUNT(*) AS summary FROM patients;
SELECT 'Session Types: ' || COUNT(*) AS summary FROM session_types;
SELECT 'Progress Areas: ' || COUNT(*) AS summary FROM progress_areas;
SELECT 'Tags: ' || COUNT(*) AS summary FROM tags;
SELECT 'Appointments: ' || COUNT(*) AS summary FROM appointments;
SELECT 'Session Notes: ' || COUNT(*) AS summary FROM session_notes;
SELECT 'Note Tags: ' || COUNT(*) AS summary FROM note_tags;
SELECT 'Mood Entries: ' || COUNT(*) AS summary FROM mood_entries;
SELECT 'Progress Entries: ' || COUNT(*) AS summary FROM progress_entries;
SELECT 'Financial Records: ' || COUNT(*) AS summary FROM financial_records;

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================
