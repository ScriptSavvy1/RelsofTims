import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/customers', label: 'Customers', icon: UserGroupIcon },
    { path: '/orders', label: 'Orders', icon: ShoppingBagIcon },
  ]

  return (
    <header className="bg-slate-50 dark:bg-slate-900 shadow-sm border-b border-slate-300 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#004e98] dark:text-[#00a8e8] transition-colors duration-300">
              Relsoft TIMS
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-white bg-[#004e98] dark:bg-[#00a8e8] shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#004e98] dark:hover:text-[#00a8e8] hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Hamburger Menu Button (Mobile) */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-slate-300 dark:border-slate-700 mt-2 pt-4 transition-all duration-300 ease-in-out">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
                    isActive(item.path)
                      ? 'text-white bg-[#004e98] dark:bg-[#00a8e8] shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header


