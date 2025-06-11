import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L&F</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                FindIt
              </span>
            </div>
            <p className="text-slate-400 mb-6">
              Connecting people with their lost belongings through our innovative platform. We're on a mission to make
              the world a more honest place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Download App
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="ml-3 text-slate-400">
                  123 Recovery Street
                  <br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span className="ml-3 text-slate-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span className="ml-3 text-slate-400">support@findit.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-slate-300">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-grow"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} FindIt. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
