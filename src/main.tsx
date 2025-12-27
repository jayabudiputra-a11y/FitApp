import './index.css'
import './App.css'
import './styles/globals.css'

import '@/lib/i18n'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import App from '@/App'
import React from 'react'

const qc = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 3e5, retry: 1 },
  },
})

function b(n: HTMLElement) {
  createRoot(n).render(
    React.createElement(
      HelmetProvider,
      null,
      React.createElement(
        QueryClientProvider,
        { client: qc },
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(App),
          React.createElement(Toaster, {
            position: 'top-right',
            richColors: true,
            closeButton: true,
            theme: 'system',
          })
        )
      )
    )
  )
}

const r = document.getElementById('root')
r && b(r)
