import '@testing-library/jest-dom'
import React from 'react'

// ── Buat React tersedia sebagai global ──────────────────────────────────
// Diperlukan karena komponen-komponen menggunakan JSX tanpa `import React`
// (React 18 automatic JSX transform tidak membutuhkan import, tapi
//  react-dom development build masih memerlukan React sebagai global)
global.React = React

// Mock window.location agar tidak error di test environment
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
})
