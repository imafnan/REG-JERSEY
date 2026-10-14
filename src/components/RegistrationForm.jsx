import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle, Image as ImageIcon, X } from "lucide-react";
import { registerJersey, isValidBdPhone } from "../services/jerseyService";

const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function RegistrationForm({ settings, jerseyNumbers = {} }) {
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState("");
  const [jerseyName, setJerseyName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [jerseySize, setJerseySize] = useState("");
  const [notes, setNotes] = useState("");

  // Size chart modal state
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const minNum = settings?.minimumJerseyNumber ?? 0;
  const maxNum = settings?.maximumJerseyNumber ?? 99;
  const isRegistrationOpen = settings?.registrationOpen !== false;
  const price = settings?.jerseyPrice ?? 450;
  const currency = settings?.currencySymbol || "৳";

  // Real-time Number Status Inspection
  const parsedNum = parseInt(jerseyNumber, 10);
  const isValidNumberRange = !isNaN(parsedNum) && parsedNum >= minNum && parsedNum <= maxNum;

  let numberStatusInfo = null;
  if (jerseyNumber !== "" && isValidNumberRange) {
    const numData = jerseyNumbers[parsedNum];
    if (numData?.reserved) {
      numberStatusInfo = {
        type: "reserved",
        color: "text-red-700 bg-red-50 border-red-200",
        label: `Number ${parsedNum} is reserved by club management.`,
        canSubmit: false
      };
    } else if (numData?.allowMultiple) {
      numberStatusInfo = {
        type: "multiple",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        label: `Number ${parsedNum} is open (Multiple players allowed).`,
        canSubmit: true
      };
    } else if (numData?.occupied || (numData?.assignedCount || 0) > 0) {
      numberStatusInfo = {
        type: "occupied",
        color: "text-red-700 bg-red-50 border-red-200",
        label: `This jersey number is already registered. Please choose another number.`,
        canSubmit: false
      };
    } else {
      numberStatusInfo = {
        type: "available",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        label: `Number ${parsedNum} is available.`,
        canSubmit: true
      };
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isRegistrationOpen) {
      setErrorMessage("Registration is currently closed.");
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage("Please enter the player's full real name.");
      return;
    }

    if (!jerseyName.trim()) {
      setErrorMessage("Please enter the jersey print name.");
      return;
    }

    if (jerseyNumber === "" || isNaN(parsedNum)) {
      setErrorMessage("Please enter a valid jersey number.");
      return;
    }

    if (parsedNum < minNum || parsedNum > maxNum) {
      setErrorMessage(`Jersey number must be between ${minNum} and ${maxNum}.`);
      return;
    }

    if (numberStatusInfo && !numberStatusInfo.canSubmit) {
      setErrorMessage(numberStatusInfo.label);
      return;
    }

    if (!mobileNumber.trim() || !isValidBdPhone(mobileNumber)) {
      setErrorMessage("Please enter a valid Bangladeshi mobile number (e.g., 017XXXXXXXX).");
      return;
    }

    // Validate size input ignoring case and whitespace
    const normalizedSize = jerseySize ? jerseySize.trim().toUpperCase() : "";
    if (!normalizedSize || !ALLOWED_SIZES.includes(normalizedSize)) {
      setErrorMessage("Please enter a valid jersey size: XS, S, M, L, XL, XXL, or XXXL.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await registerJersey({
        fullName,
        jerseyName,
        jerseyNumber: parsedNum,
        mobileNumber,
        jerseySize: normalizedSize,
        notes
      });

      setSuccessMessage("Jersey registration submitted successfully!");

      // Navigate to success confirmation page
      setTimeout(() => {
        navigate("/registration-success", {
          state: { registration: result.data }
        });
      }, 500);

    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage(err.message || "Failed to register jersey. Please try again.");
      setSubmitting(false);
      // NOTE: We do not reset the form fields on error
    }
  };

  return (
    <div className="w-full">
      {/* Registration Closed Notice */}
      {!isRegistrationOpen && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 text-sm font-medium text-center">
          Registration is currently closed by Zenith FC administration.
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-sm">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="font-semibold">{successMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* 1. Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            disabled={!isRegistrationOpen || submitting}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter player's real name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        {/* 2. Jersey Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Jersey Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={14}
            disabled={!isRegistrationOpen || submitting}
            value={jerseyName}
            onChange={(e) => setJerseyName(e.target.value.toUpperCase())}
            placeholder="Name to print on jersey (max 14 characters)"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold uppercase tracking-wider text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        {/* 3. Jersey Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Jersey Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min={minNum}
            max={maxNum}
            disabled={!isRegistrationOpen || submitting}
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            placeholder={`Number to print (range ${minNum}–${maxNum})`}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100 ${
              numberStatusInfo?.type === "occupied" || numberStatusInfo?.type === "reserved"
                ? "border-red-400 focus:ring-red-500 bg-red-50/30"
                : numberStatusInfo?.type === "available"
                ? "border-emerald-400 focus:ring-emerald-600 bg-emerald-50/30"
                : "border-gray-300 focus:ring-emerald-700"
            }`}
          />

          {/* Real-time Number Status Indicator */}
          {numberStatusInfo && (
            <div
              className={`mt-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 ${numberStatusInfo.color}`}
            >
              <span>{numberStatusInfo.label}</span>
            </div>
          )}
        </div>

        {/* 4. Mobile Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            disabled={!isRegistrationOpen || submitting}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        {/* 5. Jersey Size (Text Input) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Jersey Size <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            disabled={!isRegistrationOpen || submitting}
            value={jerseySize}
            onChange={(e) => setJerseySize(e.target.value)}
            placeholder="Enter your jersey size (e.g., M, L, XL)"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all disabled:bg-gray-100 uppercase"
          />

          {/* Compact Size Guide & Size Chart Link */}
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
            <span>
              <strong>Available Sizes:</strong> XS, S, M, L, XL, XXL, XXXL
            </span>
            <button
              type="button"
              onClick={() => setShowSizeChart(true)}
              className="text-emerald-800 hover:text-emerald-950 font-semibold underline"
            >
              View Size Chart
            </button>
          </div>
        </div>

        {/* 6. Optional Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Optional Notes
          </label>
          <textarea
            rows={2}
            disabled={!isRegistrationOpen || submitting}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional jersey requirements (optional)"
            className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        {/* Price Total */}
        <div className="py-2.5 px-3.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">Registration Total:</span>
          <span className="font-bold text-gray-900 text-base">
            {currency}{price}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isRegistrationOpen || submitting || (numberStatusInfo && !numberStatusInfo.canSubmit)}
          className={`w-full py-3 px-4 rounded-lg font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-xs ${
            !isRegistrationOpen || (numberStatusInfo && !numberStatusInfo.canSubmit)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : submitting
              ? "bg-emerald-900 text-white cursor-wait opacity-90"
              : "bg-emerald-800 hover:bg-emerald-900 text-white active:scale-99"
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering...</span>
            </>
          ) : (
            <span>Register Jersey</span>
          )}
        </button>
      </form>

      {/* Size Chart Modal for /sizeli.jpeg */}
      {showSizeChart && (
        <div
          onClick={() => setShowSizeChart(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-800">
                Zenith FC Jersey Size Chart
              </span>
              <button
                type="button"
                onClick={() => setShowSizeChart(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close size chart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src="/sizeli.jpeg"
                alt="Zenith FC Jersey Size Chart"
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
