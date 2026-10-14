import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Lock, CheckCircle2, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900 to-black p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-emerald-700/40">
              <img
                src="/images/zenith_crest.jpg"
                alt="Zenith FC Crest"
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback icon if image not found
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <Shield className="w-6 h-6 text-emerald-400 hidden" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-wider text-gray-900 group-hover:text-emerald-700 transition-colors uppercase">
                  Zenith FC
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Award className="w-3 h-3 text-emerald-700" />
                  Official Kit
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Season 2026/27 Jersey Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {isHome ? (
              <>
                <a
                  href="#gallery"
                  className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  Jersey Gallery
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  Price & Details
                </a>
                <a
                  href="#register"
                  className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  Register Now
                </a>
              </>
            ) : (
              <Link
                to="/"
                className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors"
              >
                ← Back to Homepage
              </Link>
            )}

            {/* Admin Access Button */}
            {currentUser && isAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 text-xs font-medium transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                Admin Portal
              </Link>
            )}

            {/* Quick Action Button */}
            {isHome && (
              <a
                href="#register"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md hover:shadow-emerald-900/20 active:scale-95 transition-all"
              >
                Reserve Your Jersey
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          {isHome ? (
            <>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Jersey Gallery
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Price & Details
              </a>
              <a
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-emerald-800 bg-emerald-50"
              >
                Register Jersey
              </a>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-emerald-50"
            >
              ← Back to Homepage
            </Link>
          )}

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {currentUser && isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-800 text-white font-semibold text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Go to Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm"
              >
                <Lock className="w-4 h-4 text-gray-500" />
                Club Admin Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
