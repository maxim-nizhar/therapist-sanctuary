#!/bin/bash

# =============================================================================
# THERAPIST SANCTUARY DATABASE SETUP SCRIPT
# This script creates and populates the PostgreSQL database
# =============================================================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Database configuration from environment
DB_NAME="${DB_NAME:-neondb}"
DB_USER="${DB_USER:-neondb_owner}"
DB_PASSWORD="${DB_PASSWORD:-npg_uQa02AnTHWsv}"
DB_HOST="${DB_HOST:-ep-old-grass-a1cn047m-pooler.ap-southeast-1.aws.neon.tech}"
DB_PORT="${DB_PORT:-5432}"

# Construct connection URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require&channel_binding=require"

print_status "==================================================================="
print_status "          THERAPIST SANCTUARY DATABASE SETUP"
print_status "==================================================================="
print_status "Database: $DB_NAME"
print_status "Host: $DB_HOST"
print_status "User: $DB_USER"
print_status "==================================================================="

# Check if PostgreSQL client is available
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL client (psql) is not installed or not in PATH."
    print_error "Please install PostgreSQL client tools and try again."
    exit 1
fi

# Test database connection
print_status "Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT 1;" &>/dev/null; then
    print_success "Database connection successful!"
else
    print_error "Failed to connect to the database."
    print_error "Please check your connection settings and try again."
    exit 1
fi

# Function to execute SQL file
execute_sql_file() {
    local file_path=$1
    local description=$2
    
    print_status "Executing $description..."
    
    if [ ! -f "$file_path" ]; then
        print_error "SQL file not found: $file_path"
        exit 1
    fi
    
    if psql "$DATABASE_URL" -f "$file_path"; then
        print_success "$description completed successfully!"
    else
        print_error "Failed to execute $description"
        exit 1
    fi
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_status "Script directory: $SCRIPT_DIR"
print_status "Project root: $PROJECT_ROOT"

# Check if SQL files exist
SCHEMA_FILE="$PROJECT_ROOT/database/schema.sql"
SEED_FILE="$PROJECT_ROOT/database/seed_data_corrected.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
    print_error "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

if [ ! -f "$SEED_FILE" ]; then
    print_error "Seed data file not found: $SEED_FILE"
    exit 1
fi

# Ask for confirmation before proceeding
print_warning "This will create/recreate the database schema and data."
print_warning "All existing data in the database will be lost!"
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Database setup cancelled."
    exit 0
fi

# Drop existing tables (optional - be careful!)
print_status "Cleaning up existing tables..."
psql "$DATABASE_URL" << 'EOF'
-- Drop all tables in dependency order to avoid foreign key constraints
DROP TABLE IF EXISTS note_tags CASCADE;
DROP TABLE IF EXISTS mood_entries CASCADE;
DROP TABLE IF EXISTS progress_entries CASCADE;
DROP TABLE IF EXISTS financial_records CASCADE;
DROP TABLE IF EXISTS session_notes CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS therapists CASCADE;
DROP TABLE IF EXISTS progress_areas CASCADE;
DROP TABLE IF EXISTS session_types CASCADE;
DROP TABLE IF EXISTS tags CASCADE;

-- Drop types
DROP TYPE IF EXISTS session_type_enum CASCADE;
DROP TYPE IF EXISTS patient_status_enum CASCADE;
DROP TYPE IF EXISTS appointment_status_enum CASCADE;
DROP TYPE IF EXISTS appointment_type_enum CASCADE;
DROP TYPE IF EXISTS financial_type_enum CASCADE;
DROP TYPE IF EXISTS financial_status_enum CASCADE;

-- Drop views
DROP VIEW IF EXISTS active_patients_with_appointments CASCADE;
DROP VIEW IF EXISTS upcoming_appointments CASCADE;
DROP VIEW IF EXISTS financial_summary CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_patient_summary(UUID) CASCADE;
EOF

if [ $? -eq 0 ]; then
    print_success "Existing tables cleaned up successfully!"
else
    print_warning "Some cleanup operations failed (this might be expected if tables don't exist)"
fi

# Execute schema creation
execute_sql_file "$SCHEMA_FILE" "database schema creation"

# Execute seed data insertion
execute_sql_file "$SEED_FILE" "seed data insertion"

# Verify the installation
print_status "Verifying database installation..."
psql "$DATABASE_URL" << 'EOF'
-- Verify tables exist and have data
SELECT 'Table verification:' AS status;
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

SELECT 'Row count verification:' AS status;
SELECT 'therapists' as table_name, COUNT(*) as row_count FROM therapists
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'session_notes', COUNT(*) FROM session_notes
UNION ALL
SELECT 'mood_entries', COUNT(*) FROM mood_entries
UNION ALL
SELECT 'progress_entries', COUNT(*) FROM progress_entries
UNION ALL
SELECT 'financial_records', COUNT(*) FROM financial_records
ORDER BY table_name;
EOF

if [ $? -eq 0 ]; then
    print_success "Database verification completed!"
else
    print_error "Database verification failed!"
    exit 1
fi

# Display sample queries
print_status "Running sample queries to verify functionality..."
psql "$DATABASE_URL" << 'EOF'
-- Sample query: Active patients with their next appointments
SELECT 'Sample Query: Active Patients with Next Appointments' AS query_title;
SELECT 
    full_name,
    next_session_date,
    therapist_name,
    total_sessions
FROM active_patients_with_appointments 
ORDER BY next_session_date 
LIMIT 5;

-- Sample query: Financial summary
SELECT 'Sample Query: Financial Summary' AS query_title;
SELECT 
    patient_name,
    total_paid,
    total_pending,
    total_overdue
FROM financial_summary
ORDER BY total_overdue DESC;
EOF

print_status "==================================================================="
print_success "          DATABASE SETUP COMPLETED SUCCESSFULLY!"
print_status "==================================================================="
print_success "✅ Schema created with all tables, indexes, and constraints"
print_success "✅ Sample data inserted (3 patients, appointments, notes, etc.)"
print_success "✅ Views and functions created for common queries"
print_success "✅ Database is ready for use!"
print_status "==================================================================="

print_status "Connection details:"
print_status "Database URL: $DATABASE_URL"
print_status ""
print_status "You can now connect to your database using:"
print_status "psql \"$DATABASE_URL\""
print_status ""
print_status "Or update your .env.local file with:"
print_status "DATABASE_URL=\"$DATABASE_URL\""
