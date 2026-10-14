import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import JerseyGallery from "../components/JerseyGallery";
import PriceBanner from "../components/PriceBanner";
import JerseyRegistrationForm from "../components/JerseyRegistrationForm";
import Footer from "../components/Footer";
import {
  listenToSettings,
  ensureInitialSettings
} from "../services/jerseyService";

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed initial settings if database is empty
    ensureInitialSettings().then((initial) => {
      setSettings(initial);
      setLoading(false);
    });

    // Real-time listener for any admin settings changes
    const unsubscribe = listenToSettings((updatedSettings) => {
      setSettings(updatedSettings);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-emerald-900 selection:text-white">
      {/* Navigation */}
      <Navbar settings={settings} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* 1. Hero Gallery Section */}
        <JerseyGallery images={settings?.galleryImages} />

        {/* 2. Prominent Price Section */}
        <PriceBanner settings={settings} />

        {/* 3. Official Jersey Registration Form */}
        <JerseyRegistrationForm settings={settings} />
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
