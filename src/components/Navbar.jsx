
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useSelector } from "react-redux";
import NavProfile from "./NavProfile";
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user, loaded } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm transition-all duration-300 ${isScrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L&F</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                FindIt
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#testimonials" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium">
              Success Stories
            </a>
            <a href="#faq" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium">
              FAQ
            </a>
          </nav>

          {/* CTA Buttons */}
          {!loaded && !user ? (
            <div className="flex items-center justify-center px-5 h-10">
              <ArrowPathIcon className="h-6 w-6 text-cyan-600 animate-spin" />
            </div>
          ) : user && loaded ? (
            <NavProfile />
          ) : (
            <div className="flex items-center justify-between px-5">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-slate-50"
              >
                Sign In
              </a>
              <Link
                to={"/login"}
                className="block ml-3 px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-cyan-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-slate-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-slate-50"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-slate-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Success Stories
            </a>
            <a
              href="#faq"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-slate-50"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200">
            {user && loaded ? (
              <NavProfile />
            ) : (
              <div className="flex items-center justify-between px-5">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-slate-50"
                >
                  Sign In
                </a>
                <Link to={'/login'}
                  className="block ml-3 px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
