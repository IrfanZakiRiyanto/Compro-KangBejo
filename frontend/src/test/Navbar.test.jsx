/**
 * Navbar.test.jsx — Unit test komponen Navbar
 * Modul 10: CI Pipeline — Frontend Testing
 */
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  const defaultProps = {
    activeSection: 'beranda',
    onNavClick: vi.fn(),
    isConnected: true,
    apiVersion: '0.2.0',
  }

  it('menampilkan brand "Kang Bejo"', () => {
    render(<Navbar {...defaultProps} />)
    expect(screen.getByText('Kang Bejo')).toBeInTheDocument()
  })

  it('menampilkan semua item navigasi', () => {
    render(<Navbar {...defaultProps} />)
    expect(screen.getByText('Beranda')).toBeInTheDocument()
    expect(screen.getByText('Tentang')).toBeInTheDocument()
    expect(screen.getByText('Fasilitas')).toBeInTheDocument()
    expect(screen.getByText('Kegiatan')).toBeInTheDocument()
  })

  it('memanggil onNavClick saat link diklik', () => {
    const mockClick = vi.fn()
    render(<Navbar {...defaultProps} onNavClick={mockClick} />)
    fireEvent.click(screen.getByText('Fasilitas'))
    expect(mockClick).toHaveBeenCalledWith('fasilitas')
  })

  it('menampilkan status API connected', () => {
    render(<Navbar {...defaultProps} isConnected={true} apiVersion="0.2.0" />)
    expect(screen.getByText(/API v0\.2\.0/)).toBeInTheDocument()
  })

  it('menampilkan status API offline', () => {
    render(<Navbar {...defaultProps} isConnected={false} />)
    expect(screen.getByText('API offline')).toBeInTheDocument()
  })

  it('memberi class "active" pada section aktif', () => {
    render(<Navbar {...defaultProps} activeSection="fasilitas" />)
    const link = screen.getByText('Fasilitas')
    expect(link).toHaveClass('active')
  })
})
