import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Hash,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { subscribeToSettings, updateSiteSettings } from "../../services/jerseyService";

export default function AdminLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSettings((settings) => {
      setSiteSettings(settings);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const toggleRegistrationStatus = async () => {
    if (!siteSettings) return;
    setTogglingStatus(true);
    try {
      await updateSiteSettings({
        registrationOpen: !siteSettings.registrationOpen
      });
    } catch (err) {
      console.error("Error toggling registration status:", err);
      alert("Failed to update registration status: " + err.message);
    } finally {
      setTogglingStatus(false);
    }
  };

  const navItems = [
    { name: "Dashboard Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Registrations", path: "/admin/registrations", icon: Users },
    { name: "Jersey Numbers", path: "/admin/numbers", icon: Hash },
    { name: "Club Settings", path: "/admin/settings", icon: Settings },
  ];

  const isRegistrationOpen = siteSettings?.registrationOpen !== false;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-950 text-white border-r border-neutral-800 shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-black p-0.5 border border-emerald-600/40 flex items-center justify-center overflow-hidden">
            <img
              src="/images/zenith_crest.jpg"
              alt="Zenith FC"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg tracking-wider uppercase text-white leading-none">
              Zenith FC
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-950"
                    : "text-gray-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Website Link */}
        <div className="px-4 py-3 border-t border-neutral-800">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-gray-300 hover:text-white text-xs font-medium transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </Link>
        </div>

        {/* Admin User & Logout */}
        <div className="p-4 border-t border-neutral-800 bg-black/40">
          <div className="flex items-center justify-between mb-3">
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Signed in as
              </span>
              <p className="text-xs font-semibold text-gray-200 truncate">
                {currentUser?.email || "admin@zenithfc.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors border border-red-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-heading font-black text-lg text-gray-900 uppercase">
              Zenith FC Admin
            </span>
          </div>

          {/* Quick Registration Status Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-gray-600 tracking-wider">
              Registration System:
            </span>
            <button
              onClick={toggleRegistrationStatus}
              disabled={togglingStatus}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                isRegistrationOpen
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
              }`}
            >
              {togglingStatus ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isRegistrationOpen ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              )}
              <span>{isRegistrationOpen ? "Accepting Registrations (Open)" : "Closed to Public"}</span>
              <span className="text-[10px] text-gray-500 underline ml-1">
                (Click to toggle)
              </span>
            </button>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors md:hidden"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-72 max-w-full bg-neutral-950 text-white flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600/40 p-0.5 overflow-hidden">
                  <img
                    src="/images/zenith_crest.jpg"
                    alt="Zenith FC"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h3 className="font-heading font-black text-base uppercase text-white">
                  Zenith FC
                </h3>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "text-gray-400 hover:text-white hover:bg-neutral-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-neutral-800 space-y-3">
              <button
                onClick={toggleRegistrationStatus}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-gray-700 text-left flex items-center justify-between"
              >
                <span>Status:</span>
                <span className={isRegistrationOpen ? "text-emerald-400" : "text-red-400"}>
                  {isRegistrationOpen ? "Open" : "Closed"}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950 text-red-200 text-xs font-bold uppercase"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
