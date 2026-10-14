import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  Download,
  Printer,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ShieldCheck,
  User,
  Shirt,
  Hash,
  Phone,
  FileText
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  subscribeToAllRegistrations,
  updateRegistration,
  deleteRegistration,
  subscribeToJerseyNumbers,
  subscribeToSettings
} from "../../services/jerseyService";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [jerseyNumbers, setJerseyNumbers] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc"); // 'date-desc', 'date-asc', 'num-asc', 'num-desc', 'name-asc'

  // Modals state
  const [viewingReg, setViewingReg] = useState(null);
  const [editingReg, setEditingReg] = useState(null);
  const [deletingReg, setDeletingReg] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    jerseyName: "",
    jerseyNumber: "",
    mobileNumber: "",
    jerseySize: "L",
    notes: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const unsubReg = subscribeToAllRegistrations((data) => {
      setRegistrations(data);
      setLoading(false);
    });

    const unsubNum = subscribeToJerseyNumbers((nums) => {
      setJerseyNumbers(nums);
    });

    const unsubSet = subscribeToSettings((sets) => {
      setSettings(sets);
    });

    return () => {
      unsubReg();
      unsubNum();
      unsubSet();
    };
  }, []);

  // Filter and Sort Registrations
  const filteredRegistrations = registrations
    .filter((r) => {
      // Size filter
      if (sizeFilter !== "all" && r.jerseySize !== sizeFilter) return false;

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = r.fullName?.toLowerCase().includes(query);
        const jNameMatch = r.jerseyName?.toLowerCase().includes(query);
        const numMatch = r.jerseyNumber?.toString().includes(query);
        const mobileMatch = r.mobileNumber?.includes(query);
        return nameMatch || jNameMatch || numMatch || mobileMatch;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortBy === "date-asc") return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortBy === "num-asc") return (a.jerseyNumber || 0) - (b.jerseyNumber || 0);
      if (sortBy === "num-desc") return (b.jerseyNumber || 0) - (a.jerseyNumber || 0);
      if (sortBy === "name-asc") return (a.fullName || "").localeCompare(b.fullName || "");
      return 0;
    });

  // Handle Edit Click
  const handleOpenEdit = (reg) => {
    setEditingReg(reg);
    setEditError("");
    setEditFormData({
      fullName: reg.fullName || "",
      jerseyName: reg.jerseyName || "",
      jerseyNumber: reg.jerseyNumber ?? "",
      mobileNumber: reg.mobileNumber || "",
      jerseySize: reg.jerseySize || "L",
      notes: reg.notes || ""
    });
  };

  // Submit Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editFormData.fullName.trim()) {
      setEditError("Player name is required.");
      return;
    }
    if (!editFormData.jerseyName.trim()) {
      setEditError("Jersey name is required.");
      return;
    }
    const newNum = parseInt(editFormData.jerseyNumber, 10);
    if (isNaN(newNum)) {
      setEditError("Valid jersey number is required.");
      return;
    }

    setEditLoading(true);

    try {
      await updateRegistration(editingReg.id, editFormData, editingReg.jerseyNumber);
      setEditingReg(null);
    } catch (err) {
      console.error("Failed to update registration:", err);
      setEditError(err.message || "Failed to update registration.");
    } finally {
      setEditLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingReg) return;
    setDeleteLoading(true);
    try {
      await deleteRegistration(deletingReg.id, deletingReg.jerseyNumber);
      setDeletingReg(null);
    } catch (err) {
      alert("Failed to delete registration: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registrations match your current filter.");
      return;
    }

    const headers = [
      "Serial",
      "Player Full Name",
      "Jersey Name",
      "Jersey Number",
      "Mobile Number",
      "Jersey Size",
      "Registration Date",
      "Special Notes"
    ];

    const rows = filteredRegistrations.map((r, i) => [
      i + 1,
      `"${r.fullName?.replace(/"/g, '""')}"`,
      `"${r.jerseyName?.replace(/"/g, '""')}"`,
      r.jerseyNumber,
      `"${r.mobileNumber}"`,
      r.jerseySize,
      new Date(r.createdAt || Date.now()).toLocaleDateString(),
      `"${(r.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Zenith_FC_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableSizes = settings?.availableSizes || ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-gray-950 tracking-tight">
              Jersey Registrations
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage player rosters, search registrations, update sizes/numbers, and download manufacturing lists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Roster CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, jersey, number, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Size Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase">Size:</span>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="all">All Sizes</option>
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="num-asc">Jersey # (Ascending)</option>
                <option value="num-desc">Jersey # (Descending)</option>
                <option value="name-asc">Player Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
              {filteredRegistrations.length} Players Found
            </span>
          </div>

        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Player Full Name</th>
                  <th className="py-3 px-4">Jersey Print</th>
                  <th className="py-3 px-4">Jersey #</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg, index) => (
                    <tr
                      key={reg.id || index}
                      className="hover:bg-emerald-50/40 transition-colors group"
                    >
                      <td className="py-3 px-4 text-gray-400 font-mono font-medium">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block text-sm">
                          {reg.fullName}
                        </span>
                        {reg.notes && (
                          <span className="text-[11px] text-gray-400 italic truncate max-w-xs block">
                            Note: {reg.notes}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-black uppercase tracking-wider text-emerald-900 font-heading text-sm">
                        {reg.jerseyName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-display font-black text-lg text-gray-950 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200 shadow-xs inline-block">
                          #{reg.jerseyNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-gray-700 font-medium">
                        {reg.mobileNumber}
                      </td>

                      <td className="py-3 px-4 font-bold">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                          {reg.jerseySize}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(reg.createdAt || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setViewingReg(reg)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="View Player Pass"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit registration */}
                          <button
                            onClick={() => handleOpenEdit(reg)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Edit Registration"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete registration */}
                          <button
                            onClick={() => setDeletingReg(reg)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      No registrations matched your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* VIEW MODAL */}
      {viewingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-heading font-black text-lg uppercase tracking-wider">
                  Registration Details
                </h3>
              </div>
              <button
                onClick={() => setViewingReg(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center">
                {/* Visual mini-jersey preview */}
                <div className="w-48 aspect-[4/5] rounded-2xl bg-gradient-to-b from-[#02331b] to-[#012211] p-3 flex flex-col items-center justify-between border-2 border-emerald-600 text-white shadow-lg">
                  <span className="text-[9px] font-bold tracking-widest text-emerald-300 uppercase">
                    ZENITH FC 26
                  </span>
                  <div className="text-center">
                    <span className="font-display font-black text-xl uppercase tracking-wider block">
                      {viewingReg.jerseyName}
                    </span>
                    <span
                      className="font-display font-black text-6xl leading-none text-white"
                      style={{
                        textShadow:
                          "0 0 1px #d4af37, 2px 2px 0px #000, 3px 3px 0px #d4af37"
                      }}
                    >
                      {viewingReg.jerseyNumber}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-300">
                    SIZE: {viewingReg.jerseySize}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100">
                <div>
                  <span className="text-gray-400 uppercase font-semibold block">Full Name</span>
                  <span className="font-bold text-gray-900 text-sm">{viewingReg.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold block">Mobile</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">
                    {viewingReg.mobileNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold block">Registered On</span>
                  <span className="font-medium text-gray-700">
                    {new Date(viewingReg.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold block">Total Price</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {viewingReg.currencySymbol || "৳"}{viewingReg.price || 450}
                  </span>
                </div>
              </div>

              {viewingReg.notes && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
                  <span className="font-bold block text-gray-800 mb-0.5">Player Notes:</span>
                  {viewingReg.notes}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingReg(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-black text-lg uppercase tracking-wider">
                  Edit Registration
                </h3>
              </div>
              <button
                onClick={() => setEditingReg(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs font-medium">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Player Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, fullName: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Jersey Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={editFormData.jerseyName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        jerseyName: e.target.value.toUpperCase()
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-black uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    required
                    value={editFormData.jerseyNumber}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, jerseyNumber: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-black focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Original: #{editingReg.jerseyNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editFormData.mobileNumber}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, mobileNumber: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Jersey Size
                  </label>
                  <select
                    value={editFormData.jerseySize}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, jerseySize: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    {availableSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Special Notes
                </label>
                <textarea
                  rows={2}
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReg(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  {editLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="p-3 bg-red-100 text-red-800 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-black text-xl text-gray-900 uppercase">
                Delete Registration?
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Are you sure you want to delete registration for{" "}
                <strong className="text-gray-900">{deletingReg.fullName}</strong> (Jersey #{deletingReg.jerseyNumber})?
              </p>
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-left">
                <strong>Automatic Slot Release:</strong> Jersey number #{deletingReg.jerseyNumber} will be safely released and made available for other players unless locked.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingReg(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
