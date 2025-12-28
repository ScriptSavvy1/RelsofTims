import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ShoppingBagIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '../contexts/DarkModeContext'
import Tooltip from './Tooltip'

function Header() {
  const location = useLocation()
  const { isDark, toggleDarkMode } = useDarkMode()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/customers', label: 'Customers', icon: UserGroupIcon },
    { path: '/orders', label: 'Orders', icon: ShoppingBagIcon },
  ]

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#004e98] dark:text-[#00a8e8] transition-colors duration-300">
              Relsoft TIMS
            </h1>
          </div>
          <div className="flex items-center space-x-4">
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
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#004e98] dark:hover:text-[#00a8e8] hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
                  isActive(item.path)
                    ? 'text-white bg-[#004e98] dark:bg-[#00a8e8] shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Header


