import React, { useState } from 'react'
import { useSubscribe } from '@/hooks/useSubscribe'

const Subscription = () => {
  const [email, setEmail] = useState('')
  const { mutate, isPending } = useSubscribe()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      mutate(email)
      setEmail('') 
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Subscribe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Dapatkan artikel dan update terbaru langsung ke email Anda.
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Subscription