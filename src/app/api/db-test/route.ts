import { NextRequest, NextResponse } from 'next/server';
import { testConnection, query } from '@/lib/db';

export async function GET() {
  try {
    // Test the connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Run a simple query to get database info
    const result = await query(`
      SELECT 
        version() as version,
        current_database() as database,
        current_user as user,
        NOW() as timestamp
    `);

    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
