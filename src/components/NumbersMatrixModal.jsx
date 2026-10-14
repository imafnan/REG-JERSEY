import { useState } from "react";
import { X, Search, CheckCircle, Ban, Users, Lock, Sparkles } from "lucide-react";

export default function NumbersMatrixModal({
  isOpen,
  onClose,
  jerseyNumbers = {},
  minNumber = 0,
  maxNumber = 99,
  onSelectNumber,
  selectedNumber
}) {
  const [filter, setFilter] = useState("all"); // 'all', 'available', 'multiple'
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  // Build array of numbers
  const numbersList = [];
  for (let i = minNumber; i <= maxNumber; i++) {
    const statusData = jerseyNumbers[i] || {};
    const isReserved = statusData.reserved === true;
    const allowMultiple = statusData.allowMultiple === true;
    const isOccupied = statusData.occupied === true || (statusData.assignedCount || 0) > 0;

    let status = "available";
    if (isReserved) {
      status = "reserved";
    } else if (allowMultiple) {
      status = "multiple";
    } else if (isOccupied) {
      status = "occupied";
    }

    numbersList.push({
      number: i,
      status,
      count: statusData.assignedCount || 0,
      isReserved,
      allowMultiple
    });
  }

  // Filter numbers
  const filteredNumbers = numbersList.filter((item) => {
    if (search && !item.number.toString().includes(search)) return false;
    if (filter === "available") return item.status === "available";
    if (filter === "multiple") return item.status === "multiple";
    return true;
  });

  const availableCount = numbersList.filter((n) => n.status === "available" || n.status === "multiple").length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-gray-900">
                Jersey Number Registry ({minNumber}–{maxNumber})
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select an available number to fill into your registration form. {availableCount} numbers open!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 bg-white border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-gray-900 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Numbers ({numbersList.length})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "available"
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Available Only ({numbersList.filter((n) => n.status === "available").length})
            </button>
            <button
              onClick={() => setFilter("multiple")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "multiple"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              Multiple Allowed ({numbersList.filter((n) => n.status === "multiple").length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-48">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600"></span>
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600"></span>
            Multiple Allowed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400"></span>
            Taken / Occupied
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></span>
            Reserved
          </span>
        </div>

        {/* Number Matrix Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
            {filteredNumbers.map((item) => {
              const isSelected = selectedNumber === item.number;
              const isClickable = item.status === "available" || item.status === "multiple";

              let badgeBg = "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:scale-105";
              if (item.status === "multiple") {
                badgeBg = "bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100 hover:scale-105";
              } else if (item.status === "occupied") {
                badgeBg = "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60";
              } else if (item.status === "reserved") {
                badgeBg = "bg-red-50 border-red-200 text-red-400 cursor-not-allowed opacity-60";
              }

              if (isSelected) {
                badgeBg = "ring-4 ring-emerald-500 bg-emerald-700 text-white font-black scale-105";
              }

              return (
                <button
                  key={item.number}
                  disabled={!isClickable}
                  onClick={() => {
                    onSelectNumber(item.number);
                    onClose();
                  }}
                  title={
                    item.status === "available"
                      ? `Number ${item.number} is Available!`
                      : item.status === "multiple"
                      ? `Number ${item.number} allows multiple registrations (${item.count} registered)`
                      : item.status === "reserved"
                      ? `Number ${item.number} is Reserved by Club`
                      : `Number ${item.number} is already Taken`
                  }
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${badgeBg}`}
                >
                  <span className="font-display font-black text-xl sm:text-2xl leading-none">
                    {item.number}
                  </span>
                  <span className="text-[9px] font-bold mt-0.5 truncate max-w-full">
                    {item.status === "available" && "Open"}
                    {item.status === "multiple" && `Multi (${item.count})`}
                    {item.status === "occupied" && "Taken"}
                    {item.status === "reserved" && "Lock"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Numbers update in real time via Zenith FC Realtime Database.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
