import React, { useState, useEffect, useMemo } from "react";
import {
  listenToJerseyNumbers,
  listenToRegistrations,
  listenToSettings,
  updateNumberRules
} from "../../services/jerseyService";
import {
  Hash,
  Search,
  Filter,
  CheckCircle2,
  Users,
  ShieldAlert,
  UserCheck,
  Lock,
  Unlock,
  Copy,
  Info,
  ChevronDown
} from "lucide-react";

export default function AdminJerseyNumbers() {
  const [jerseyNumbers, setJerseyNumbers] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchNumber, setSearchNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, AVAILABLE, OCCUPIED, MULTIPLE, RESERVED
  const [updatingNum, setUpdatingNum] = useState(null);

  // Modal to inspect players for a number
  const [inspectNumber, setInspectNumber] = useState(null);

  useEffect(() => {
    const unsubNums = listenToJerseyNumbers((data) => {
      setJerseyNumbers(data);
      setLoading(false);
    });

    const unsubRegs = listenToRegistrations((data) => {
      setRegistrations(data);
    });

    const unsubSettings = listenToSettings((s) => {
      setSettings(s);
    });

    return () => {
      if (typeof unsubNums === "function") unsubNums();
      if (typeof unsubRegs === "function") unsubRegs();
      if (typeof unsubSettings === "function") unsubSettings();
    };
  }, []);

  const minNum = settings?.minimumJerseyNumber ?? 0;
  const maxNum = settings?.maximumJerseyNumber ?? 99;

  // Map registrations by jersey number for quick lookup
  const registrationsByNumber = useMemo(() => {
    const map = {};
    registrations.forEach((reg) => {
      const num = parseInt(reg.jerseyNumber, 10);
      if (!isNaN(num)) {
        if (!map[num]) map[num] = [];
        map[num].push(reg);
      }
    });
    return map;
  }, [registrations]);

  // Generate complete list of numbers from min to max
  const allNumbers = useMemo(() => {
    const list = [];
    for (let i = minNum; i <= maxNum; i++) {
      const meta = jerseyNumbers[i] || {};
      const regList = registrationsByNumber[i] || [];
      const count = regList.length || meta.count || 0;
      const isReserved = Boolean(meta.reserved);
      const isMultipleAllowed = Boolean(meta.allowMultiple);

      let status = "AVAILABLE";
      if (isReserved) {
        status = "RESERVED";
      } else if (isMultipleAllowed) {
        status = "MULTIPLE";
      } else if (count > 0) {
        status = "OCCUPIED";
      }

      list.push({
        number: i,
        count,
        reserved: isReserved,
        allowMultiple: isMultipleAllowed,
        status,
        players: regList
      });
    }

    return list;
  }, [minNum, maxNum, jerseyNumbers, registrationsByNumber]);

  // Filter numbers
  const filteredNumbers = useMemo(() => {
    return allNumbers.filter((item) => {
      // Search
      if (searchNumber.trim() !== "") {
        if (!item.number.toString().includes(searchNumber.trim())) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [allNumbers, searchNumber, statusFilter]);

  // Toggle Multiple Players
  const handleToggleMultiple = async (num, currentVal) => {
    setUpdatingNum(num);
    try {
      await updateNumberRules(num, { allowMultiple: !currentVal });
    } catch (err) {
      console.error("Failed to update multiple allowance:", err);
      alert("Error: " + err.message);
    } finally {
      setUpdatingNum(null);
    }
  };

  // Toggle Reserved
  const handleToggleReserved = async (num, currentVal) => {
    setUpdatingNum(num);
    try {
      await updateNumberRules(num, { reserved: !currentVal });
    } catch (err) {
      console.error("Failed to update reservation:", err);
      alert("Error: " + err.message);
    } finally {
      setUpdatingNum(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Squad Allocations</span>
          <h1 className="text-2xl sm:text-3xl font-black font-athletic uppercase text-neutral-900 tracking-wide">
            Jersey Number Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Configure single-player exclusivity, allow duplicate number assignments, or reserve squad numbers.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">Available</span>
          <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-white">Occupied</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">Multiple Allowed</span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">Reserved</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search by number */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Search number (e.g., 7)..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: `All (${allNumbers.length})` },
            { id: "AVAILABLE", label: `Available (${allNumbers.filter(n => n.status === "AVAILABLE").length})` },
            { id: "OCCUPIED", label: `Occupied (${allNumbers.filter(n => n.status === "OCCUPIED").length})` },
            { id: "MULTIPLE", label: `Multiple (${allNumbers.filter(n => n.status === "MULTIPLE").length})` },
            { id: "RESERVED", label: `Reserved (${allNumbers.filter(n => n.status === "RESERVED").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-athletic font-bold uppercase tracking-wider transition-all ${
                statusFilter === tab.id
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNumbers.map((item) => {
          const isBusy = updatingNum === item.number;

          // Status Badge styling
          let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
          let statusText = "Available";

          if (item.status === "RESERVED") {
            badgeClass = "bg-rose-100 text-rose-800 border-rose-200";
            statusText = "Reserved";
          } else if (item.status === "MULTIPLE") {
            badgeClass = "bg-amber-100 text-amber-900 border-amber-200";
            statusText = `Multiple Allowed (${item.count})`;
          } else if (item.status === "OCCUPIED") {
            badgeClass = "bg-neutral-900 text-white border-neutral-900";
            statusText = `Occupied (1 Player)`;
          }

          return (
            <div
              key={item.number}
              className={`bg-white rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                item.reserved
                  ? "border-rose-300 bg-rose-50/20"
                  : item.allowMultiple
                  ? "border-amber-300 bg-amber-50/20"
                  : item.count > 0
                  ? "border-neutral-300"
                  : "border-neutral-200 hover:border-emerald-300"
              }`}
            >
              <div>
                {/* Card Top: Number & Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white font-athletic font-black text-2xl flex items-center justify-center shadow-xs">
                    {item.number}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                    {statusText}
                  </span>
                </div>

                {/* Players List Preview if registered */}
                <div className="min-h-[44px]">
                  {item.players.length > 0 ? (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Assigned Players ({item.players.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.players.map((p) => (
                          <span
                            key={p.id}
                            onClick={() => setInspectNumber(item)}
                            className="inline-block px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 cursor-pointer text-[11px] font-bold text-neutral-800 truncate max-w-[140px]"
                            title={p.fullName}
                          >
                            {p.jerseyName || p.fullName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400 italic">No registrations for this number.</span>
                  )}
                </div>
              </div>

              {/* Controls Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                
                {/* Toggle Allow Multiple */}
                <button
                  disabled={isBusy}
                  onClick={() => handleToggleMultiple(item.number, item.allowMultiple)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 ${
                    item.allowMultiple
                      ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }`}
                  title={item.allowMultiple ? "Disable multiple players" : "Allow multiple players to pick this number"}
                >
                  <Copy className="w-3 h-3" />
                  <span>{item.allowMultiple ? "Multi: ON" : "Multi: OFF"}</span>
                </button>

                {/* Toggle Reserved */}
                <button
                  disabled={isBusy}
                  onClick={() => handleToggleReserved(item.number, item.reserved)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 ${
                    item.reserved
                      ? "bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300"
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }`}
                  title={item.reserved ? "Release number for public registration" : "Reserve this number (block registration)"}
                >
                  {item.reserved ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{item.reserved ? "Reserved" : "Open"}</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Players for a Number Modal */}
      {inspectNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-athletic font-bold text-xl flex items-center justify-center">
                  {inspectNumber.number}
                </div>
                <div>
                  <h3 className="font-athletic text-base font-bold uppercase tracking-wider text-neutral-900">
                    Players with Jersey #{inspectNumber.number}
                  </h3>
                  <p className="text-xs text-neutral-500">{inspectNumber.players.length} total assignment(s)</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto">
              {inspectNumber.players.map((p) => (
                <div key={p.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-neutral-900">{p.fullName}</h5>
                    <p className="text-neutral-500">
                      Print: <span className="font-athletic uppercase font-bold text-emerald-800">{p.jerseyName}</span> • Size: {p.jerseySize}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-neutral-700 block">{p.mobileNumber}</span>
                    <span className="text-[10px] text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectNumber(null)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
