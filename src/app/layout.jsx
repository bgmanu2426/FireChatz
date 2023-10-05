"use client"

import { UserProvider } from '../context/authContext'
import './globals.css'
import { StrictMode } from 'react'
import ToastMessage from '../components/ToastMessage'

const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <StrictMode>
      <html lang="en">
        <body>
          <UserProvider>
            <ToastMessage/>
            {children}
          </UserProvider>
        </body>
      </html>
    </StrictMode>
  )
}
