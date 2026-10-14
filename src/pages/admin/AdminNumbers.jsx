import { useState, useEffect } from "react";
import {
  Hash,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  Ban,
  Share2,
  Search,
  Filter,
  X,
  AlertCircle,
  Loader2,
  Eye,
  ShieldAlert
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  subscribeToAllRegistrations,
  subscribeToJerseyNumbers,
  subscribeToSettings,
  updateJerseyNumberSetting
} from "../../services/jerseyService";

export default function AdminNumbers() {
  const [registrations, setRegistrations] = useState([]);
  const [jerseyNumbers, setJerseyNumbers] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'available', 'occupied', 'multiple', 'reserved'
  const [searchNumber, setSearchNumber] = useState("");

  // Inspect / Action Modal for a specific number
  const [activeNumber, setActiveNumber] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const minNum = settings?.minimumJerseyNumber ?? 0;
  const maxNum = settings?.maximumJerseyNumber ?? 99;

  // Map registrations by jersey number
  const playersByNumber = {};
  registrations.forEach((r) => {
    if (!playersByNumber[r.jerseyNumber]) {
      playersByNumber[r.jerseyNumber] = [];
    }
    playersByNumber[r.jerseyNumber].push(r);
  });

  // Build complete numbers array
  const allNumbers = [];
  for (let i = minNum; i <= maxNum; i++) {
    const statusData = jerseyNumbers[i] || {};
    const players = playersByNumber[i] || [];
    const count = players.length;
    const isReserved = statusData.reserved === true;
    const allowMultiple = statusData.allowMultiple === true;
    const isOccupied = count > 0 || statusData.occupied === true;

    let status = "available";
    if (isReserved) {
      status = "reserved";
    } else if (allowMultiple) {
      status = "multiple";
    } else if (isOccupied) {
      status = "occupied";
    }

    allNumbers.push({
      number: i,
      status,
      count,
      players,
      isReserved,
      allowMultiple
    });
  }

  // Filter numbers
  const filteredNumbers = allNumbers.filter((item) => {
    if (searchNumber.trim() && !item.number.toString().includes(searchNumber.trim())) {
      return false;
    }
    if (statusFilter === "available") return item.status === "available";
    if (statusFilter === "occupied") return item.status === "occupied";
    if (statusFilter === "multiple") return item.status === "multiple";
    if (statusFilter === "reserved") return item.status === "reserved";
    return true;
  });

  // Toggle Multiple Players permission for a number
  const handleToggleMultiple = async (num, currentVal) => {
    setUpdating(true);
    try {
      await updateJerseyNumberSetting(num, { allowMultiple: !currentVal });
      if (activeNumber && activeNumber.number === num) {
        setActiveNumber((prev) => ({ ...prev, allowMultiple: !currentVal }));
      }
    } catch (err) {
      alert("Failed to update number settings: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Toggle Reserved status for a number
  const handleToggleReserved = async (num, currentVal) => {
    setUpdating(true);
    try {
      await updateJerseyNumberSetting(num, { reserved: !currentVal });
      if (activeNumber && activeNumber.number === num) {
        setActiveNumber((prev) => ({ ...prev, isReserved: !currentVal }));
      }
    } catch (err) {
      alert("Failed to update number reservation: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-gray-950 tracking-tight">
              Jersey Number Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Control number availability, grant duplicate number overrides, and manage club reservations ({minNum}–{maxNum}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-xs">
              Total Slots: {allNumbers.length}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Status Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "all"
                  ? "bg-gray-950 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({allNumbers.length})
            </button>
            <button
              onClick={() => setStatusFilter("available")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "available"
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Available ({allNumbers.filter((n) => n.status === "available").length})
            </button>
            <button
              onClick={() => setStatusFilter("occupied")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "occupied"
                  ? "bg-gray-700 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Occupied ({allNumbers.filter((n) => n.status === "occupied").length})
            </button>
            <button
              onClick={() => setStatusFilter("multiple")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "multiple"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              Multi Allowed ({allNumbers.filter((n) => n.status === "multiple").length})
            </button>
            <button
              onClick={() => setStatusFilter("reserved")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "reserved"
                  ? "bg-red-600 text-white shadow"
                  : "bg-red-50 text-red-800 hover:bg-red-100"
              }`}
            >
              Reserved ({allNumbers.filter((n) => n.status === "reserved").length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-56">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jersey #..."
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
          <span className="font-bold uppercase text-gray-400 text-[11px]">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Available (0 registrations)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            Occupied (1 player assigned)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Allow Multiple (Override on)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Reserved (Club locked)
          </span>
        </div>

        {/* Numbers Grid */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filteredNumbers.map((item) => {
              let badgeColor = "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100";
              let label = "Available";

              if (item.status === "reserved") {
                badgeColor = "bg-red-50 border-red-300 text-red-900 hover:bg-red-100";
                label = "Reserved";
              } else if (item.status === "multiple") {
                badgeColor = "bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100";
                label = `Multi (${item.count})`;
              } else if (item.status === "occupied") {
                badgeColor = "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200";
                label = `Taken (${item.count})`;
              }

              return (
                <button
                  key={item.number}
                  onClick={() => setActiveNumber(item)}
                  className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs cursor-pointer ${badgeColor}`}
                >
                  <span className="font-display font-black text-3xl leading-none">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-bold mt-1 tracking-tight truncate max-w-full">
                    {label}
                  </span>

                  {item.players.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shadow">
                      {item.players.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* NUMBER MANAGEMENT & PLAYERS MODAL */}
      {activeNumber && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200">
            
            {/* Header */}
            <div className="bg-emerald-950 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-emerald-500/50 flex items-center justify-center">
                  <span className="font-display font-black text-3xl text-white">
                    #{activeNumber.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-black text-xl uppercase tracking-wider">
                    Jersey #{activeNumber.number} Settings
                  </h3>
                  <span className="text-xs text-emerald-400">
                    Status: {activeNumber.status.toUpperCase()} ({activeNumber.players.length} registered)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveNumber(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-5">
              
              {/* Control 1: Allow Multiple Players */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase block">
                    Allow Multiple Players
                  </span>
                  <p className="text-[11px] text-gray-500 max-w-[240px]">
                    Override single-assignment rule. Allows more than one player to claim this number.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleToggleMultiple(activeNumber.number, activeNumber.allowMultiple)
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shadow-xs ${
                    activeNumber.allowMultiple
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {activeNumber.allowMultiple ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Control 2: Reserve / Lock Number */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase block">
                    Reserve Number (Lock)
                  </span>
                  <p className="text-[11px] text-gray-500 max-w-[240px]">
                    Completely locks this number from public registration (e.g., retired or VIP kit).
                  </p>
                </div>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleToggleReserved(activeNumber.number, activeNumber.isReserved)
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shadow-xs ${
                    activeNumber.isReserved
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {activeNumber.isReserved ? "Reserved" : "Open"}
                </button>
              </div>

              {/* Registered Players List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Assigned Players ({activeNumber.players.length})
                </h4>

                {activeNumber.players.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
                    {activeNumber.players.map((p, idx) => (
                      <div key={p.id || idx} className="p-3 bg-white text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{p.fullName}</p>
                          <p className="text-gray-500 text-[11px]">
                            Print: <strong className="text-emerald-800 uppercase">{p.jerseyName}</strong> • Size: {p.jerseySize}
                          </p>
                        </div>
                        <span className="font-mono text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {p.mobileNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-500">
                    No players currently assigned to number #{activeNumber.number}.
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setActiveNumber(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
