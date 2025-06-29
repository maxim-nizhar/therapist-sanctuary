'use client'

import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Filter, Download, Calendar, User } from 'lucide-react'
import Header from '@/components/Header'
import { mockFinancialRecords } from '@/data/mockData'
import { FinancialRecord } from '@/types'

export default function Financial() {
  const [records] = useState(mockFinancialRecords)
  const [filteredRecords, setFilteredRecords] = useState(mockFinancialRecords)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    // Animate cards
    gsap.fromTo('.financial-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    )
    
    gsap.fromTo('.record-item', 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.05, delay: 0.3, ease: "power2.out" }
    )
  }, [])

  useEffect(() => {
    let filtered = records

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus)
    }

    if (selectedPeriod !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (selectedPeriod) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
      }
      
      filtered = filtered.filter(record => new Date(record.date) >= filterDate)
    }

    setFilteredRecords(filtered)
  }, [selectedPeriod, selectedStatus, records])

  // Calculate summary statistics
  const totalRevenue = filteredRecords.reduce((sum, record) => sum + record.amount, 0)
  const paidRevenue = filteredRecords
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0)
  const pendingRevenue = filteredRecords
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.amount, 0)
  const overdueRevenue = filteredRecords
    .filter(record => record.status === 'overdue')
    .reduce((sum, record) => sum + record.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
      case 'pending':
        return <Clock className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
      case 'overdue':
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'var(--accent-green)'
      case 'pending':
        return 'var(--accent-gold)'
      case 'overdue':
        return 'var(--accent-red)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      
      <main className="p-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
              Financial Overview
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Track your practice revenue and manage patient payments
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="action-button flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)' }}>
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="financial-card detail-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Total Revenue
              </h3>
              <DollarSign className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {formatCurrency(totalRevenue)}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
              <span className="text-sm" style={{ color: 'var(--accent-green)' }}>
                +12.5% from last month
              </span>
            </div>
          </div>

          <div className="financial-card detail-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Paid Revenue
              </h3>
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--accent-green)' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {formatCurrency(paidRevenue)}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {((paidRevenue / totalRevenue) * 100).toFixed(1)}% of total
              </span>
            </div>
          </div>

          <div className="financial-card detail-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Pending Revenue
              </h3>
              <Clock className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {formatCurrency(pendingRevenue)}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {filteredRecords.filter(r => r.status === 'pending').length} invoices
              </span>
            </div>
          </div>

          <div className="financial-card detail-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Overdue Revenue
              </h3>
              <AlertCircle className="w-8 h-8" style={{ color: 'var(--accent-red)' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {formatCurrency(overdueRevenue)}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
              <span className="text-sm" style={{ color: 'var(--accent-red)' }}>
                Needs attention
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Records */}
        <div className="detail-card p-6">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>Filters:</span>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-black/20 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(0,0,0,0.2)'
                }}
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-black/20 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(0,0,0,0.2)'
                }}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Session Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="record-item border-b transition-colors hover:bg-black/10" 
                    style={{ borderColor: 'var(--border-color)' }}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <User className="w-8 h-8 p-1 rounded-full" style={{ backgroundColor: 'var(--accent-green)', color: 'var(--bg-main)' }} />
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {record.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>
                          {formatDate(record.date)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize" style={{ color: 'var(--text-primary)' }}>
                        {record.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-lg" style={{ color: 'var(--text-heading)' }}>
                        {formatCurrency(record.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="capitalize font-medium" style={{ color: getStatusColor(record.status) }}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: 'var(--accent-green)', 
                          color: 'var(--bg-main)',
                          opacity: 0.8
                        }}>
                        {record.sessionType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <h3 className="text-xl mb-2" style={{ color: 'var(--text-heading)' }}>No Records Found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                No financial records match your current filters.
              </p>
            </div>
          )}
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="detail-card p-6 mt-8">
          <h3 className="text-2xl mb-6" style={{ color: 'var(--text-heading)' }}>
            Revenue Trends
          </h3>
          <div className="h-64 flex items-center justify-center rounded-lg" 
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent-gold)' }} />
              <h4 className="text-xl mb-2" style={{ color: 'var(--text-heading)' }}>
                Revenue Chart
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Interactive revenue trends would be displayed here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
