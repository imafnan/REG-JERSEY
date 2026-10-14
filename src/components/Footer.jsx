import { Link } from "react-router-dom";
import { Shield, Lock, Award, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white border-t border-emerald-950 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800">
          
          {/* Col 1: Club Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/50 p-0.5 overflow-hidden flex items-center justify-center">
                <img
                  src="/images/zenith_crest.jpg"
                  alt="Zenith FC"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <span className="font-heading font-black text-xl tracking-wider uppercase text-white">
                Zenith FC
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Official jersey registration and number reservation portal for Zenith Football Club. Empowering players and supporters with premium kits.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <Award className="w-4 h-4" />
              <span>Official Zenith FC Club Merchandise 2026/27</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Jersey Showcase
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing & Kit Specs
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-white transition-colors">
                  Jersey Registration
                </a>
              </li>
              <li>
                <Link to="/registration-success" className="hover:text-white transition-colors">
                  Check Previous Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Club Administration */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Management
            </h4>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Login</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Club Dashboard
                </Link>
              </li>
              <li>
                <span className="text-xs text-gray-500">
                  Firebase Realtime Database Secured
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} Zenith FC. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for <span className="text-emerald-400 font-semibold">Zenith FC Champions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
