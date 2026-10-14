import { X, Ruler } from "lucide-react";

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sizeChart = [
    { size: "XS", chest: '34" - 36"', length: '26"', fit: "Youth / Extra Slim" },
    { size: "S", chest: '36" - 38"', length: '27"', fit: "Slim Athletic" },
    { size: "M", chest: '38" - 40"', length: '28"', fit: "Regular Athletic" },
    { size: "L", chest: '40" - 42"', length: '29"', fit: "Standard Fit" },
    { size: "XL", chest: '42" - 44"', length: '30"', fit: "Relaxed Fit" },
    { size: "XXL", chest: '44" - 46"', length: '31"', fit: "Comfort Plus" },
    { size: "XXXL", chest: '46" - 48"', length: '32"', fit: "Extra Plus" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-gray-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Zenith FC Size Chart
              </h3>
              <p className="text-xs text-gray-500">Official Jersey Dimensions (Inches)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-bold">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest (Width)</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Fit Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-emerald-50/40">
                  <td className="py-2.5 px-3 font-bold text-gray-900">{row.size}</td>
                  <td className="py-2.5 px-3 text-gray-600">{row.chest}</td>
                  <td className="py-2.5 px-3 text-gray-600">{row.length}</td>
                  <td className="py-2.5 px-3 text-emerald-800 font-medium">{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Tip:</strong> If you prefer a loose matchday fit or wear undershirts, we recommend ordering one size up.
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wider"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
