'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../../components/Layout/Header'
import Footer from '../../../components/Layout/Footer'
import api from '../../../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailNotFound, setEmailNotFound] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const trimmedEmail = email.trim()
      
      if (!trimmedEmail) {
        toast.error('Please enter your email address')
        setLoading(false)
        return
      }

      // Call the forgot password API
      await api.post('/auth/forgot-password', { email: trimmedEmail })
      
      toast.success('Password reset link has been sent to your email!')
      setEmailSent(true)
      setEmailNotFound(false)
    } catch (error) {
      // Check if email doesn't exist
      if (error.response?.status === 404 && error.response?.data?.error === 'EMAIL_NOT_FOUND') {
        setEmailNotFound(true)
        toast.error(error.response?.data?.message || 'Email not found')
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.errors?.[0]?.msg ||
                            'Failed to send password reset email. Please try again.'
        toast.error(errorMessage)
        setEmailNotFound(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-logo-beige">
      <Header />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {!emailSent ? (
            <form className="mt-8 space-y-6 bg-logo-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      emailNotFound ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailNotFound(false)
                    }}
                  />
                </div>
                {emailNotFound && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-2">
                      <strong>Email not found:</strong> This email address is not registered in our system.
                    </p>
                    <p className="text-sm text-red-700 mb-3">
                      Would you like to create a new account?
                    </p>
                    <Link
                      href="/auth/register"
                      className="inline-block w-full text-center py-2 px-4 border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium text-sm"
                    >
                      Sign Up Now
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Back to Sign in
                </Link>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6 bg-logo-white p-8 rounded-xl shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Check Your Email
              </h3>
              <p className="text-sm text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please check your inbox and click on the link to reset your password.
                The link will expire in 1 hour.
              </p>
              <div className="pt-4 space-y-3">
                <Link
                  href="/auth/login"
                  className="block w-full py-3 px-4 border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium text-center"
                >
                  Back to Sign in
                </Link>
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                  }}
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

