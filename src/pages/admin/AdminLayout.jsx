// src/pages/admin/AdminLayout.jsx
import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, LogOut } from 'lucide-react'
import { logout } from '../../utils/api'

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // If user is not logged in and not already on the login page, redirect there
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true'
    const isLoginPage = location.pathname === '/admin/login'

    if (!isLoggedIn && !isLoginPage) {
      navigate('/admin/login', { replace: true })
    }
  }, [location.pathname, navigate])

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Even if the server call fails, clear local state
    }
    sessionStorage.removeItem('adminLoggedIn')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E8E9ED]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2E3340] bg-[#0B0C10]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-[#14B8A6]" />
            <span className="font-display font-semibold text-sm tracking-tight">Admin</span>
          </div>

          {location.pathname !== '/admin/login' && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-[#9AA0AB] hover:text-[#E8E9ED] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1A1D26] cursor-pointer"
            >
              <LogOut size={16} />
              Log out
            </button>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}