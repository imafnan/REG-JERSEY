import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Printer, ArrowLeft } from "lucide-react";

export default function RegistrationSuccess() {
  const location = useLocation();
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    let regData = location.state?.registration;
    if (!regData) {
      try {
        const stored = sessionStorage.getItem("last_zenith_reg");
        if (stored) {
          regData = JSON.parse(stored);
        }
      } catch (e) {}
    }
    if (regData) {
      setRegistration(regData);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-8 h-8 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Registration Confirmed
          </h1>
          <p className="text-xs text-gray-500">
            Your Zenith FC jersey order and number have been registered.
          </p>
        </div>

        {registration ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Player Name:</span>
                <span className="font-bold text-gray-900">{registration.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Jersey Name:</span>
                <span className="font-bold uppercase text-gray-900">{registration.jerseyName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Jersey Number:</span>
                <span className="font-black text-emerald-800 text-base">#{registration.jerseyNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Jersey Size:</span>
                <span className="font-bold text-gray-900">{registration.jerseySize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Mobile Number:</span>
                <span className="font-medium text-gray-900">{registration.mobileNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Registration Total:</span>
                <span className="font-bold text-gray-900">
                  {registration.currencySymbol || "৳"}{registration.price || 450}
                </span>
              </div>
              {registration.notes && (
                <div className="pt-1 text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Notes: </span>
                  {registration.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Confirmation</span>
              </button>

              <Link
                to="/"
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Register Another</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-4">No active registration found.</p>
            <Link
              to="/"
              className="inline-block py-2 px-4 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
            >
              Go to Registration
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
