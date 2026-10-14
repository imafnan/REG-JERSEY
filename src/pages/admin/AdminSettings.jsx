import { useState, useEffect } from "react";
import {
  Save,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Tag,
  Hash,
  Shirt,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Plus,
  Trash2
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  subscribeToSettings,
  updateSiteSettings,
  DEFAULT_SETTINGS
} from "../../services/jerseyService";

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Form states
  const [jerseyPrice, setJerseyPrice] = useState(450);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [minimumJerseyNumber, setMinimumJerseyNumber] = useState(0);
  const [maximumJerseyNumber, setMaximumJerseyNumber] = useState(99);
  const [subtitle, setSubtitle] = useState("Register your name and preferred jersey number.");
  const [announcement, setAnnouncement] = useState("");
  const [availableSizes, setAvailableSizes] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  const [heroGallery, setHeroGallery] = useState(DEFAULT_SETTINGS.heroGallery);

  useEffect(() => {
    const unsub = subscribeToSettings((data) => {
      setSettings(data);
      setJerseyPrice(data.jerseyPrice ?? 450);
      setRegistrationOpen(data.registrationOpen !== false);
      setMinimumJerseyNumber(data.minimumJerseyNumber ?? 0);
      setMaximumJerseyNumber(data.maximumJerseyNumber ?? 99);
      setSubtitle(data.subtitle || "Register your name and preferred jersey number.");
      setAnnouncement(data.announcement || "");
      if (data.availableSizes && data.availableSizes.length > 0) {
        setAvailableSizes(data.availableSizes);
      }
      if (data.heroGallery && data.heroGallery.length > 0) {
        setHeroGallery(data.heroGallery);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const minNum = parseInt(minimumJerseyNumber, 10);
      const maxNum = parseInt(maximumJerseyNumber, 10);
      const priceNum = parseInt(jerseyPrice, 10);

      if (isNaN(minNum) || isNaN(maxNum) || minNum < 0 || maxNum < minNum) {
        throw new Error("Invalid number range: minimum must be >= 0 and less than maximum.");
      }
      if (isNaN(priceNum) || priceNum < 0) {
        throw new Error("Price must be a valid positive number.");
      }

      await updateSiteSettings({
        jerseyPrice: priceNum,
        registrationOpen,
        minimumJerseyNumber: minNum,
        maximumJerseyNumber: maxNum,
        subtitle: subtitle.trim(),
        announcement: announcement.trim(),
        availableSizes,
        heroGallery
      });

      setStatusMessage({
        type: "success",
        text: "Club settings updated successfully in Firebase Realtime Database!"
      });

      setTimeout(() => {
        setStatusMessage({ type: "", text: "" });
      }, 4000);

    } catch (err) {
      console.error("Save settings error:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to update settings."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryChange = (index, field, value) => {
    const updated = [...heroGallery];
    updated[index] = { ...updated[index], [field]: value };
    setHeroGallery(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-gray-950 tracking-tight">
              Website & Registration Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Configure jersey pricing, open/close registration windows, number ranges, and gallery display.
            </p>
          </div>
        </div>

        {/* Status notification */}
        {statusMessage.text && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border animate-in fade-in ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-red-50 text-red-900 border-red-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Card 1: Registration Status & Price */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
            <h2 className="font-heading font-black text-lg text-gray-950 uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-700" />
              Registration & Pricing Controls
            </h2>

            {/* Registration Open/Closed Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 gap-4">
              <div>
                <span className="font-bold text-sm text-gray-900 uppercase block">
                  Public Registration Status
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  When closed, the public homepage displays a "Registration Closed" banner and disables new jersey submissions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRegistrationOpen(!registrationOpen)}
                  className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                    registrationOpen
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {registrationOpen ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Registration OPEN</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Registration CLOSED</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Price & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Official Jersey Price (৳ BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={0}
                    required
                    value={jerseyPrice}
                    onChange={(e) => setJerseyPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 font-display font-black text-xl text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Default price is ৳450 per jersey. Updates immediately on the homepage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Homepage Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Register your name and preferred jersey number."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Displayed beneath the jersey price heading.
                </p>
              </div>
            </div>

            {/* Announcement Banner */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Top Announcement Bar (Optional)
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Official 2026 Season Kits — Orders close Friday 11:59 PM!"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Leave empty to hide the announcement ticker banner.
              </p>
            </div>

          </div>

          {/* Card 2: Number Allocation Range & Sizes */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
            <h2 className="font-heading font-black text-lg text-gray-950 uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-700" />
              Number Range & Sizes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Minimum Jersey Number
                </label>
                <input
                  type="number"
                  min={0}
                  value={minimumJerseyNumber}
                  onChange={(e) => setMinimumJerseyNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">Standard lowest allowed number (default: 0)</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Maximum Jersey Number
                </label>
                <input
                  type="number"
                  max={999}
                  value={maximumJerseyNumber}
                  onChange={(e) => setMaximumJerseyNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">Standard highest allowed number (default: 99)</p>
              </div>
            </div>

            {/* Sizes tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Available Jersey Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <span
                    key={size}
                    className="px-3.5 py-1.5 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 text-xs font-bold uppercase"
                  >
                    {size}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                Standard Zenith FC kit options: XS, S, M, L, XL, XXL, XXXL.
              </p>
            </div>
          </div>

          {/* Card 3: Hero Gallery Images Configuration */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
            <h2 className="font-heading font-black text-lg text-gray-950 uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-700" />
              Homepage Hero Gallery Images (3 Prominent Slots)
            </h2>

            <div className="space-y-4">
              {heroGallery.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-2 aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 border border-gray-300">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="sm:col-span-10 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleGalleryChange(idx, "title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={item.tag}
                          onChange={(e) => handleGalleryChange(idx, "tag", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500">
                        Image URL / Path
                      </label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleGalleryChange(idx, "url", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950 active:scale-98 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving to Firebase...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
