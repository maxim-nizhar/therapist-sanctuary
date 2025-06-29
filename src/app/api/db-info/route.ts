import { NextResponse } from 'next/server';
import { getDatabaseInfo, getTables } from '@/lib/db-utils';

export async function GET() {
  try {
    const [dbInfo, tables] = await Promise.all([
      getDatabaseInfo(),
      getTables()
    ]);

    return NextResponse.json({
      success: true,
      databaseInfo: {
        version: dbInfo.version,
        database: dbInfo.database,
        user: dbInfo.user,
        connectedAt: dbInfo.timestamp
      },
      tables: tables,
      tableCount: tables.length
    });

  } catch (error) {
    console.error('Database info error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get database info',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
