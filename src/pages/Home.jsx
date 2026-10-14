import { useState, useEffect } from "react";
import JerseyGallery from "../components/JerseyGallery";
import RegistrationForm from "../components/RegistrationForm";
import {
  subscribeToSettings,
  subscribeToJerseyNumbers,
  DEFAULT_SETTINGS
} from "../services/jerseyService";

export default function Home() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [jerseyNumbers, setJerseyNumbers] = useState({});

  useEffect(() => {
    // Subscribe to settings
    const unsubSettings = subscribeToSettings((newSettings) => {
      setSettings(newSettings);
    });

    // Subscribe to jersey numbers status
    const unsubNumbers = subscribeToJerseyNumbers((numbers) => {
      setJerseyNumbers(numbers);
    });

    return () => {
      unsubSettings();
      unsubNumbers();
    };
  }, []);

  const price = settings?.jerseyPrice ?? 450;
  const currency = settings?.currencySymbol || "৳";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* 1. Three Jersey Images at Top */}
        <JerseyGallery />

        {/* 2. Jersey Price Heading */}
        <div className="text-center pt-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Zenith FC Jersey — {currency}{price}
          </h1>
        </div>

        {/* 3. Single Jersey Registration Form */}
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-xs">
          <RegistrationForm settings={settings} jerseyNumbers={jerseyNumbers} />
        </div>

      </div>
    </div>
  );
}
