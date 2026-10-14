import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert } from "lucide-react";

export default function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-400 font-medium tracking-wide">Verifying Administrator Credentials...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 bg-red-950 border border-red-800 rounded-full flex items-center justify-center mb-4 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-athletic tracking-wider mb-2">Access Restricted</h2>
        <p className="text-neutral-400 max-w-md mb-6">
          Your account ({currentUser.email}) does not have Zenith FC administrator privileges.
        </p>
        <button
          onClick={() => window.location.href = "/admin/login"}
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Sign In with Authorized Account
        </button>
      </div>
    );
  }

  return children;
}
