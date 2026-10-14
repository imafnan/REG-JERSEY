import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Hash,
  CheckCircle2,
  Share2,
  Shirt,
  Calendar,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Download
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  subscribeToAllRegistrations,
  subscribeToJerseyNumbers,
  subscribeToSettings
} from "../../services/jerseyService";

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [jerseyNumbers, setJerseyNumbers] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Compute Statistics
  const minNum = settings?.minimumJerseyNumber ?? 0;
  const maxNum = settings?.maximumJerseyNumber ?? 99;
  const totalPossibleNumbers = maxNum - minNum + 1;

  const totalRegistrations = registrations.length;

  // Unique jersey numbers assigned
  const assignedNumbersSet = new Set(registrations.map((r) => r.jerseyNumber));
  const uniqueNumbersAssigned = assignedNumbersSet.size;

  // Numbers assigned to multiple players (count > 1)
  const numberCountMap = {};
  registrations.forEach((r) => {
    numberCountMap[r.jerseyNumber] = (numberCountMap[r.jerseyNumber] || 0) + 1;
  });
  const numbersWithMultiplePlayers = Object.keys(numberCountMap).filter(
    (num) => numberCountMap[num] > 1
  ).length;

  // Available jersey numbers
  let availableNumbersCount = 0;
  for (let i = minNum; i <= maxNum; i++) {
    const statusData = jerseyNumbers[i] || {};
    const isReserved = statusData.reserved === true;
    const isOccupied = statusData.occupied === true || (statusData.assignedCount || 0) > 0;
    const allowMultiple = statusData.allowMultiple === true;

    if (!isReserved && (!isOccupied || allowMultiple)) {
      availableNumbersCount++;
    }
  }

  // Size Distribution
  const sizeCounts = {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0
  };
  registrations.forEach((r) => {
    if (r.jerseySize && sizeCounts[r.jerseySize] !== undefined) {
      sizeCounts[r.jerseySize]++;
    }
  });

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    const headers = [
      "Serial",
      "Registration ID",
      "Player Full Name",
      "Jersey Name",
      "Jersey Number",
      "Mobile Number",
      "Jersey Size",
      "Registration Date",
      "Price",
      "Special Notes"
    ];

    const rows = registrations.map((r, index) => [
      index + 1,
      r.id,
      `"${r.fullName?.replace(/"/g, '""')}"`,
      `"${r.jerseyName?.replace(/"/g, '""')}"`,
      r.jerseyNumber,
      `"${r.mobileNumber}"`,
      r.jerseySize,
      new Date(r.createdAt || Date.now()).toLocaleString(),
      `${r.currencySymbol || "৳"}${r.price || 450}`,
      `"${(r.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Zenith_FC_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recent 5 registrations
  const recentRegistrations = [...registrations]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Top Welcome & Actions Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-gray-950 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Real-time monitoring of Zenith FC jersey sales, player registrations, and number allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export CSV</span>
            </button>

            <Link
              to="/admin/registrations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
            >
              <span>Manage All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. Total Registrations */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Total Orders
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Shirt className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-3xl sm:text-4xl text-gray-950">
                {totalRegistrations}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Confirmed player registrations</p>
            </div>
          </div>

          {/* 2. Unique Numbers Assigned */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Unique Numbers
              </span>
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                <Hash className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-3xl sm:text-4xl text-gray-950">
                {uniqueNumbersAssigned}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Numbers claimed out of {totalPossibleNumbers}</p>
            </div>
          </div>

          {/* 3. Available Jersey Numbers */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Available Numbers
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-3xl sm:text-4xl text-emerald-700">
                {availableNumbersCount}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Numbers open for allocation</p>
            </div>
          </div>

          {/* 4. Numbers Assigned to Multiple Players */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Multi-Assigned
              </span>
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-3xl sm:text-4xl text-blue-900">
                {numbersWithMultiplePlayers}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Shared by 2+ players</p>
            </div>
          </div>

          {/* 5. Revenue Total */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Total Revenue
              </span>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-3xl sm:text-4xl text-gray-950">
                ৳{(totalRegistrations * (settings?.jerseyPrice || 450)).toLocaleString()}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">@ ৳{settings?.jerseyPrice || 450} each</p>
            </div>
          </div>

        </div>

        {/* Middle Section: Size Breakdown & Quick Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Size Breakdown Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-heading font-bold text-base text-gray-900 uppercase">
                Registrations by Jersey Size
              </h2>
              <span className="text-xs font-semibold text-gray-500">
                Total Ordered: {totalRegistrations}
              </span>
            </div>

            <div className="space-y-3">
              {Object.keys(sizeCounts).map((size) => {
                const count = sizeCounts[size];
                const percentage =
                  totalRegistrations > 0
                    ? Math.round((count / totalRegistrations) * 100)
                    : 0;

                return (
                  <div key={size} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700 w-12 font-bold">{size}</span>
                      <span className="text-gray-500">{percentage}%</span>
                      <span className="text-gray-900 font-bold w-16 text-right">
                        {count} {count === 1 ? "jersey" : "jerseys"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions & Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900 uppercase border-b border-gray-100 pb-3 mb-4">
                Club Quick Actions
              </h2>

              <div className="space-y-2.5">
                <Link
                  to="/admin/numbers"
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-xs font-bold text-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Hash className="w-4 h-4 text-emerald-700" />
                    <span>Jersey Number Controls (0–99)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  to="/admin/registrations"
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-xs font-bold text-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Search, Edit & Delete Players</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-xs font-bold text-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Shirt className="w-4 h-4 text-emerald-700" />
                    <span>Price & Gallery Customization</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Firebase Realtime Database
              </span>
              <p className="text-xs text-gray-300">
                All numbers and transactions synchronize instantly across all devices.
              </p>
            </div>
          </div>

        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900 uppercase">
                Recent Player Registrations
              </h2>
              <p className="text-xs text-gray-500">Showing the latest 5 orders</p>
            </div>

            <Link
              to="/admin/registrations"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              View Full Table ({registrations.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Player Name</th>
                  <th className="py-3 px-4">Jersey Print</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRegistrations.length > 0 ? (
                  recentRegistrations.map((reg, idx) => (
                    <tr key={reg.id || idx} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-4 text-gray-400 font-mono font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{reg.fullName}</td>
                      <td className="py-3 px-4 font-black uppercase text-emerald-800 tracking-wider">
                        {reg.jerseyName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-display font-black text-base text-gray-950 bg-gray-100 px-2 py-0.5 rounded-md">
                          #{reg.jerseyNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-700">{reg.jerseySize}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{reg.mobileNumber}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(reg.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No registrations recorded yet. Once players register, they will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
