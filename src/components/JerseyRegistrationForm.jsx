import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkNumberAvailability,
  registerPlayerJersey
} from "../services/jerseyService";
import JerseyCardPreview from "./JerseyCardPreview";
import SizeGuideModal from "./SizeGuideModal";
import confetti from "canvas-confetti";
import {
  User,
  Tag,
  Hash,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Shirt,
  Sparkles,
  ArrowRight,
  ShieldBan
} from "lucide-react";

export default function JerseyRegistrationForm({ settings }) {
  const navigate = useNavigate();

  // Settings values
  const isRegistrationOpen = settings?.registrationOpen !== false;
  const minNumber = settings?.minimumJerseyNumber ?? 0;
  const maxNumber = settings?.maximumJerseyNumber ?? 99;
  const availableSizes = settings?.availableSizes || ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const price = settings?.jerseyPrice || 450;
  const currency = settings?.currency || "৳";

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    jerseyName: "",
    jerseyNumber: "",
    mobileNumber: "",
    jerseySize: "L",
    notes: ""
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  // Real-time Number Availability state
  const [numberStatus, setNumberStatus] = useState({
    checked: false,
    checking: false,
    available: null,
    status: "",
    message: ""
  });

  // Real-time number checking with debounce
  useEffect(() => {
    if (formData.jerseyNumber === "") {
      setNumberStatus({ checked: false, checking: false, available: null, status: "", message: "" });
      return;
    }

    const timer = setTimeout(async () => {
      setNumberStatus((prev) => ({ ...prev, checking: true }));
      const result = await checkNumberAvailability(formData.jerseyNumber, settings);
      setNumberStatus({
        checked: true,
        checking: false,
        available: result.available,
        status: result.status,
        message: result.message
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.jerseyNumber, settings]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-uppercase for Jersey Print Name
    let formattedValue = value;
    if (name === "jerseyName") {
      formattedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Player's real full name is required.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    // Jersey name
    if (!formData.jerseyName.trim()) {
      newErrors.jerseyName = "Jersey print name is required.";
    } else if (formData.jerseyName.trim().length > 14) {
      newErrors.jerseyName = "Jersey name cannot exceed 14 characters.";
    }

    // Jersey number
    if (formData.jerseyNumber === "") {
      newErrors.jerseyNumber = "Jersey number is required.";
    } else {
      const num = parseInt(formData.jerseyNumber, 10);
      if (isNaN(num)) {
        newErrors.jerseyNumber = "Enter a valid integer number.";
      } else if (num < minNumber || num > maxNumber) {
        newErrors.jerseyNumber = `Jersey number must be between ${minNumber} and ${maxNumber}.`;
      } else if (numberStatus.checked && !numberStatus.available) {
        newErrors.jerseyNumber = numberStatus.message || "This jersey number is not available.";
      }
    }

    // Mobile number validation (Bangladeshi formats: 013-019 followed by 8 digits, total 11 digits)
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    const cleanPhone = formData.mobileNumber.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      newErrors.mobileNumber = "Mobile contact number is required.";
    } else if (!bdPhoneRegex.test(cleanPhone)) {
      newErrors.mobileNumber = "Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01712345678).";
    }

    // Size
    if (!formData.jerseySize) {
      newErrors.jerseySize = "Please select your jersey size.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!isRegistrationOpen) {
      setSubmitError("Registration is currently closed by the club administration.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Execute concurrency-safe registration in Firebase
      const cleanPhone = formData.mobileNumber.replace(/[\s-]/g, "");
      const registrationPayload = {
        ...formData,
        mobileNumber: cleanPhone
      };

      const result = await registerPlayerJersey(registrationPayload, settings);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Pass created registration to success screen
      navigate("/registration-success", { state: { registration: result } });
    } catch (err) {
      console.error("Registration submission failed:", err);
      setSubmitError(err.message || "Failed to submit registration. Please try again.");
      
      // If error indicates number conflict, highlight number input
      if (err.message && err.message.toLowerCase().includes("jersey number")) {
        setErrors((prev) => ({
          ...prev,
          jerseyNumber: err.message
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-12 sm:py-16 bg-neutral-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Registration Closed Alert if closed */}
        {!isRegistrationOpen && (
          <div className="mb-10 p-6 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start space-x-4 shadow-sm">
            <ShieldBan className="w-8 h-8 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-black font-athletic uppercase tracking-wider text-rose-950">
                Official Registration is Currently Closed
              </h3>
              <p className="mt-1 text-sm text-rose-800">
                New jersey registrations have been paused by the Zenith FC club management. Existing orders are being processed. Please contact club administration for urgent inquiries.
              </p>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider uppercase mb-3">
            <Shirt className="w-3.5 h-3.5" />
            <span>Player Kit Enrollment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-athletic uppercase tracking-wide text-neutral-900">
            Register Your Jersey
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            Fill in your details below to reserve your unique squad number and customize your official match kit.
          </p>
        </div>

        {/* Main Grid: Form (Left) & Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Registration Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-200">
            
            {submitError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center space-x-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span className="font-medium">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Field 1: Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  1. Full Name (Player's Real Name) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    disabled={!isRegistrationOpen || submitting}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g., Tanvir Ahmed"
                    className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                        : "border-neutral-200 focus:ring-emerald-200 focus:border-emerald-600 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Field 2 & 3: Jersey Name & Jersey Number (2-Column on Tablet/Desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Jersey Name */}
                <div>
                  <label htmlFor="jerseyName" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    2. Jersey Name (Back Print) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Tag className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="jerseyName"
                      name="jerseyName"
                      maxLength={14}
                      disabled={!isRegistrationOpen || submitting}
                      value={formData.jerseyName}
                      onChange={handleChange}
                      placeholder="e.g., TANVIR"
                      className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-2 transition-all ${
                        errors.jerseyName
                          ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                          : "border-neutral-200 focus:ring-emerald-200 focus:border-emerald-600 focus:bg-white"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-neutral-400">
                    <span>Max 14 uppercase characters</span>
                    <span>{formData.jerseyName.length}/14</span>
                  </div>
                  {errors.jerseyName && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      <span>{errors.jerseyName}</span>
                    </p>
                  )}
                </div>

                {/* Jersey Number */}
                <div>
                  <label htmlFor="jerseyNumber" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    3. Jersey Number ({minNumber}-{maxNumber}) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      id="jerseyNumber"
                      name="jerseyNumber"
                      min={minNumber}
                      max={maxNumber}
                      disabled={!isRegistrationOpen || submitting}
                      value={formData.jerseyNumber}
                      onChange={handleChange}
                      placeholder="e.g., 10"
                      className={`w-full pl-10 pr-10 py-3 bg-neutral-50 border rounded-xl text-sm font-bold tracking-wider focus:outline-none focus:ring-2 transition-all ${
                        errors.jerseyNumber
                          ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                          : "border-neutral-200 focus:ring-emerald-200 focus:border-emerald-600 focus:bg-white"
                      }`}
                    />
                    
                    {/* Status Icon Inside Input */}
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                      {numberStatus.checking && (
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {!numberStatus.checking && numberStatus.checked && numberStatus.available && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {!numberStatus.checking && numberStatus.checked && !numberStatus.available && (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                  </div>

                  {/* Realtime Availability Feedback Banner */}
                  {numberStatus.checked && !numberStatus.checking && (
                    <div className={`mt-1.5 text-xs font-medium flex items-center space-x-1.5 ${
                      numberStatus.available ? (numberStatus.status === 'multiple' ? 'text-amber-700' : 'text-emerald-700') : 'text-rose-600'
                    }`}>
                      <span>• {numberStatus.message}</span>
                    </div>
                  )}

                  {errors.jerseyNumber && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      <span>{errors.jerseyNumber}</span>
                    </p>
                  )}
                </div>

              </div>

              {/* Field 4: Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  4. Mobile Number (Bangladeshi Contact) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    disabled={!isRegistrationOpen || submitting}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="017XXXXXXXX or 01XXXXXXXXX"
                    className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                      errors.mobileNumber
                        ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                        : "border-neutral-200 focus:ring-emerald-200 focus:border-emerald-600 focus:bg-white"
                    }`}
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Must be a valid 11-digit Bangladeshi mobile number for order verification & delivery notifications.
                </p>
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>

              {/* Field 5: Jersey Size with Size Guide Modal Button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    5. Jersey Size <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSizeModalOpen(true)}
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center space-x-1 underline decoration-dotted underline-offset-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>View Size Chart Guide</span>
                  </button>
                </div>

                {/* Size Selection Buttons */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={!isRegistrationOpen || submitting}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, jerseySize: size }));
                        if (errors.jerseySize) setErrors((prev) => ({ ...prev, jerseySize: "" }));
                      }}
                      className={`py-2.5 rounded-xl text-xs sm:text-sm font-athletic font-bold tracking-wider transition-all border ${
                        formData.jerseySize === size
                          ? "bg-emerald-900 border-emerald-900 text-white shadow-sm ring-2 ring-emerald-200"
                          : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.jerseySize && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.jerseySize}</p>
                )}
              </div>

              {/* Field 6: Optional Notes */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  6. Optional Notes / Special Requests
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  disabled={!isRegistrationOpen || submitting}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g., Short sleeves preferred, extra length request, etc."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Pricing & Submit Summary */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-neutral-500 font-medium">Payable Amount:</span>
                  <div className="text-2xl font-black font-athletic text-neutral-900">
                    {currency}{price} <span className="text-xs font-normal text-neutral-500">BDT</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isRegistrationOpen || submitting}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-athletic text-base font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md ${
                    !isRegistrationOpen
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      : submitting
                      ? "bg-emerald-800 text-white opacity-80 cursor-wait"
                      : "bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] text-white shadow-emerald-950/20 hover:shadow-lg"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Securing Your Jersey...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Jersey</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-neutral-400">
                  By clicking Register Jersey, your preferred squad number is reserved instantly in the database.
                </p>
              </div>

            </form>
          </div>

          {/* Right Column: Live Interactive Jersey Mockup Preview */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Live Kit Visualization</span>
              <h3 className="text-xl font-bold font-athletic uppercase text-neutral-900">
                Your Customized Jersey
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Real-time preview of heat-pressed typography and sizing.
              </p>
            </div>

            <JerseyCardPreview
              jerseyName={formData.jerseyName}
              jerseyNumber={formData.jerseyNumber}
              jerseySize={formData.jerseySize}
            />

            {/* Club Authentic Guarantee Box */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="font-athletic text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Zenith FC Quality Standard
                </span>
              </div>
              <ul className="text-xs text-neutral-600 space-y-1.5 pl-1">
                <li>• Moisture-wicking aerodynamic polyester match fabric</li>
                <li>• High-density woven club crest badge</li>
                <li>• Durable polyurethane player lettering (heat-sealed)</li>
                <li>• Direct official club fulfillment with proof voucher</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        currentSize={formData.jerseySize}
        onSelectSize={(size) => setFormData((prev) => ({ ...prev, jerseySize: size }))}
      />
    </section>
  );
}
