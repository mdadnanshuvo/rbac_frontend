'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!email)                        e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password)                     e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #FF8C5A 0%, #F04E1F 40%, #D94010 70%, #C03008 100%)',
          }}
        />

        {/* Wave 1 */}
        <svg
          className="absolute bottom-0 left-0 w-full wave-1"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '45%' }}
        >
          <path
            fill="rgba(255,255,255,0.06)"
            d="M0,160 C180,220 360,80 540,160 C720,240 900,60 1080,140 C1260,220 1380,100 1440,120 L1440,320 L0,320 Z"
          />
        </svg>

        {/* Wave 2 */}
        <svg
          className="absolute bottom-0 left-0 w-full wave-2"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '35%' }}
        >
          <path
            fill="rgba(255,255,255,0.08)"
            d="M0,200 C240,120 480,280 720,200 C960,120 1200,260 1440,180 L1440,320 L0,320 Z"
          />
        </svg>

        {/* Wave 3 */}
        <svg
          className="absolute top-0 left-0 w-full wave-3"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '30%' }}
        >
          <path
            fill="rgba(0,0,0,0.05)"
            d="M0,0 L1440,0 L1440,100 C1200,180 960,40 720,120 C480,200 240,60 0,140 Z"
          />
        </svg>

        {/* Glow blobs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #FFB085 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #FF6030 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Logo ── */}
      <div className="absolute top-6 left-7 z-20 flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
          style={{
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2"  y="2"  width="6" height="6" rx="1.5" fill="white" />
            <rect x="10" y="2"  width="6" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
            <rect x="2"  y="10" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" />
          </svg>
        </div>
        <span
          className="text-white font-semibold text-lg tracking-tight"
          style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic' }}
        >
          Obliq
        </span>
      </div>

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div
          className="glass-card rounded-2xl px-8 py-9 shadow-login"
          style={{ border: '1px solid rgba(255,255,255,0.8)' }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <h1
              className="text-2xl font-medium text-gray-900 mb-1.5"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                letterSpacing: '-0.3px',
              }}
            >
              Login
            </h1>
            <p className="text-sm text-gray-400">
              Enter your details to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setErrors(p => ({ ...p, email: undefined }))
                }}
                placeholder="example@email.com"
                className={`input-ring w-full px-3.5 py-2.5 rounded-xl border text-sm
                  text-gray-900 placeholder:text-gray-300 bg-white transition-all
                  ${errors.email
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    setErrors(p => ({ ...p, password: undefined }))
                  }}
                  placeholder="Enter your password"
                  className={`input-ring w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm
                    text-gray-900 placeholder:text-gray-300 bg-white transition-all
                    ${errors.password
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center
                      ${remember
                        ? 'bg-brand-orange border-brand-orange'
                        : 'bg-white border-gray-300'
                      }`}
                  >
                    {remember && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500 select-none group-hover:text-gray-700 transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-sm font-medium text-brand-orange hover:text-brand-orangeDark transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-press w-full py-2.5 rounded-xl text-white text-sm font-semibold
                transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #FF6B3D 0%, #F04E1F 50%, #E03D10 100%)',
                boxShadow: '0 3px 12px rgba(240,78,31,0.38)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : 'Log in'}
            </button>
          </form>

          {/* Sign up */}
          <p className="text-center text-sm text-gray-400 mt-5">
            Don&apos;t have an account?{' '}
            <button className="font-semibold text-gray-800 hover:text-brand-orange transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}