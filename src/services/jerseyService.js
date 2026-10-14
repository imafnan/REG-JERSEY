import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  runTransaction,
  onValue,
  off
} from "firebase/database";
import { db } from "../lib/firebase";

export const DEFAULT_SETTINGS = {
  jerseyPrice: 450,
  currencySymbol: "৳",
  registrationOpen: true,
  minimumJerseyNumber: 0,
  maximumJerseyNumber: 99,
  availableSizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  clubName: "Zenith FC",
  subtitle: "Register your name and preferred jersey number.",
  announcement: "Limited Edition Official 2026 Season Kits — Order today to secure your custom number!",
  heroGallery: [
    {
      id: "1",
      title: "Zenith FC Official Home Jersey (Front View)",
      url: "/images/jerseys/jersey-front.jpg",
      tag: "Home Kit Front"
    },
    {
      id: "2",
      title: "Official Custom Name & Number Print (Back View)",
      url: "/images/jerseys/jersey-back.jpg",
      tag: "Back Print Detail"
    },
    {
      id: "3",
      title: "Zenith FC Crest & Premium Fabric Detail",
      url: "/images/jerseys/jersey-detail.jpg",
      tag: "Fabric & Badge Detail"
    }
  ]
};

// Validate Bangladeshi Mobile Number
export function isValidBdPhone(phone) {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/[\s-]/g, "");
  // Matches: 013-019XXXXXXXX, 88013-019XXXXXXXX, or +88013-019XXXXXXXX (11 digits local)
  return /^(?:\+?8801|01)[3-9]\d{8}$/.test(cleanPhone);
}

// Subscribe to Website Settings in Real-time
export function subscribeToSettings(callback) {
  const settingsRef = ref(db, "settings");
  const unsubscribe = onValue(
    settingsRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback(DEFAULT_SETTINGS);
      } else {
        callback({
          ...DEFAULT_SETTINGS,
          ...data,
          // Ensure arrays are maintained properly if Firebase converts empty to null
          availableSizes: data.availableSizes || DEFAULT_SETTINGS.availableSizes,
          heroGallery: data.heroGallery || DEFAULT_SETTINGS.heroGallery
        });
      }
    },
    (error) => {
      console.warn("Settings fetch fallback to defaults:", error);
      callback(DEFAULT_SETTINGS);
    }
  );

  return () => off(settingsRef, "value", unsubscribe);
}

// Subscribe to all Jersey Numbers status in Real-time
export function subscribeToJerseyNumbers(callback) {
  const numbersRef = ref(db, "jerseyNumbers");
  const unsubscribe = onValue(
    numbersRef,
    (snapshot) => {
      const data = snapshot.val() || {};
      callback(data);
    },
    (error) => {
      console.error("Error subscribing to jersey numbers:", error);
      callback({});
    }
  );

  return () => off(numbersRef, "value", unsubscribe);
}

// Atomic Jersey Registration with Transactional Concurrency Lock
export async function registerJersey({
  fullName,
  jerseyName,
  jerseyNumber,
  mobileNumber,
  jerseySize,
  notes = ""
}) {
  const trimmedName = fullName?.trim();
  const trimmedJerseyName = jerseyName?.trim().toUpperCase();
  const num = parseInt(jerseyNumber, 10);
  const cleanMobile = mobileNumber?.trim().replace(/[\s-]/g, "");

  if (!trimmedName) throw new Error("Player Full Name is required.");
  if (!trimmedJerseyName) throw new Error("Jersey Name to print is required.");
  if (isNaN(num)) throw new Error("Jersey Number must be a valid number.");
  if (!cleanMobile || !isValidBdPhone(cleanMobile)) {
    throw new Error("Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX).");
  }
  const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const normalizedSize = jerseySize ? jerseySize.trim().toUpperCase() : "";
  if (!normalizedSize || !ALLOWED_SIZES.includes(normalizedSize)) {
    throw new Error("Please enter a valid jersey size (XS, S, M, L, XL, XXL, XXXL).");
  }

  // Check current settings first
  const settingsSnapshot = await get(ref(db, "settings"));
  const settings = settingsSnapshot.val() || DEFAULT_SETTINGS;

  if (settings.registrationOpen === false) {
    throw new Error("Registration is currently closed. Please check back later.");
  }

  const minNum = settings.minimumJerseyNumber ?? 0;
  const maxNum = settings.maximumJerseyNumber ?? 99;
  if (num < minNum || num > maxNum) {
    throw new Error(`Jersey number must be between ${minNum} and ${maxNum}.`);
  }

  // ATOMIC TRANSACTION: Check availability and increment reservation count atomically
  const numberRef = ref(db, `jerseyNumbers/${num}`);
  let transactionError = null;

  const txResult = await runTransaction(numberRef, (currentData) => {
    // If not set yet in DB
    if (currentData === null) {
      return {
        occupied: true,
        allowMultiple: false,
        reserved: false,
        assignedCount: 1,
        lastAssignedAt: Date.now()
      };
    }

    // If reserved by administrator
    if (currentData.reserved === true) {
      transactionError = `Jersey number ${num} has been reserved by club management and is unavailable.`;
      return undefined; // Aborts transaction
    }

    // If already occupied and NOT allowed multiple
    const count = currentData.assignedCount || 0;
    if (!currentData.allowMultiple && (currentData.occupied === true || count > 0)) {
      transactionError = `Jersey number ${num} is already registered. Please choose another number.`;
      return undefined; // Aborts transaction
    }

    // Otherwise, number can be assigned!
    return {
      ...currentData,
      occupied: true,
      assignedCount: count + 1,
      lastAssignedAt: Date.now()
    };
  });

  if (!txResult.committed) {
    throw new Error(
      transactionError ||
      `Jersey number ${num} is unavailable or was claimed by another player at this exact moment. Please select another number.`
    );
  }

  // Create Registration record
  const registrationsRef = ref(db, "registrations");
  const newRegRef = push(registrationsRef);
  const regId = newRegRef.key;

  const registrationRecord = {
    id: regId,
    fullName: trimmedName,
    jerseyName: trimmedJerseyName,
    jerseyNumber: num,
    mobileNumber: cleanMobile,
    jerseySize: normalizedSize,
    notes: notes.trim(),
    price: settings.jerseyPrice ?? 450,
    currencySymbol: settings.currencySymbol || "৳",
    status: "confirmed",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  try {
    await set(newRegRef, registrationRecord);
  } catch (writeErr) {
    // Rollback atomic count on error
    await runTransaction(numberRef, (curr) => {
      if (!curr) return null;
      const count = Math.max(0, (curr.assignedCount || 1) - 1);
      return {
        ...curr,
        assignedCount: count,
        occupied: count > 0
      };
    });
    throw writeErr;
  }

  // Store in session storage so confirmation page has access even without admin login
  try {
    sessionStorage.setItem("last_zenith_reg", JSON.stringify(registrationRecord));
  } catch (e) {
    // Ignore storage quota errors
  }

  return {
    success: true,
    registrationId: regId,
    data: registrationRecord
  };
}

// Fetch single registration by ID
export async function getRegistrationById(id) {
  if (!id) return null;
  // Check session storage first
  try {
    const cached = sessionStorage.getItem("last_zenith_reg");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.id === id) return parsed;
    }
  } catch (e) {}

  const regRef = ref(db, `registrations/${id}`);
  const snap = await get(regRef);
  if (snap.exists()) {
    return snap.val();
  }
  return null;
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

// Subscribe to all registrations in real-time
export function subscribeToAllRegistrations(callback) {
  const registrationsRef = ref(db, "registrations");
  const unsubscribe = onValue(
    registrationsRef,
    (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        ...data[key],
        id: key
      }));
      callback(list);
    },
    (err) => {
      console.error("Error fetching registrations:", err);
      callback([]);
    }
  );

  return () => off(registrationsRef, "value", unsubscribe);
}

// Admin Edit Registration
export async function updateRegistration(id, updatedData, oldJerseyNumber) {
  if (!id) throw new Error("Registration ID is required.");
  const newNum = parseInt(updatedData.jerseyNumber, 10);
  const oldNum = parseInt(oldJerseyNumber, 10);

  // If jersey number is changed, safely reallocate
  if (!isNaN(newNum) && newNum !== oldNum) {
    // Check new number availability with transaction
    const newNumRef = ref(db, `jerseyNumbers/${newNum}`);
    let txErr = null;

    const txResult = await runTransaction(newNumRef, (curr) => {
      if (!curr) {
        return {
          occupied: true,
          allowMultiple: false,
          reserved: false,
          assignedCount: 1,
          lastAssignedAt: Date.now()
        };
      }
      if (curr.reserved) {
        txErr = `Jersey number ${newNum} is reserved by admin.`;
        return undefined;
      }
      const count = curr.assignedCount || 0;
      if (!curr.allowMultiple && (curr.occupied || count > 0)) {
        txErr = `Jersey number ${newNum} is already occupied.`;
        return undefined;
      }
      return {
        ...curr,
        occupied: true,
        assignedCount: count + 1,
        lastAssignedAt: Date.now()
      };
    });

    if (!txResult.committed) {
      throw new Error(txErr || `Cannot reassign to number ${newNum}.`);
    }

    // Release old number slot
    if (!isNaN(oldNum)) {
      const oldNumRef = ref(db, `jerseyNumbers/${oldNum}`);
      await runTransaction(oldNumRef, (curr) => {
        if (!curr) return null;
        const count = Math.max(0, (curr.assignedCount || 1) - 1);
        return {
          ...curr,
          assignedCount: count,
          occupied: count > 0
        };
      });
    }
  }

  // Update registration record
  const regRef = ref(db, `registrations/${id}`);
  await update(regRef, {
    fullName: updatedData.fullName.trim(),
    jerseyName: updatedData.jerseyName.trim().toUpperCase(),
    jerseyNumber: newNum,
    mobileNumber: updatedData.mobileNumber.trim(),
    jerseySize: updatedData.jerseySize,
    notes: (updatedData.notes || "").trim(),
    updatedAt: Date.now()
  });

  return { success: true };
}

// Admin Delete Registration
export async function deleteRegistration(id, jerseyNumber) {
  if (!id) throw new Error("Registration ID is required.");
  const num = parseInt(jerseyNumber, 10);

  // 1. Remove registration
  const regRef = ref(db, `registrations/${id}`);
  await remove(regRef);

  // 2. Decrement atomic count for jersey number
  if (!isNaN(num)) {
    const numRef = ref(db, `jerseyNumbers/${num}`);
    await runTransaction(numRef, (curr) => {
      if (!curr) return null;
      const count = Math.max(0, (curr.assignedCount || 1) - 1);
      return {
        ...curr,
        assignedCount: count,
        occupied: count > 0
      };
    });
  }

  return { success: true };
}

// Admin Update Jersey Number Settings (allowMultiple, reserved)
export async function updateJerseyNumberSetting(number, settings) {
  const num = parseInt(number, 10);
  if (isNaN(num)) throw new Error("Valid jersey number required.");

  const numRef = ref(db, `jerseyNumbers/${num}`);
  await runTransaction(numRef, (curr) => {
    const base = curr || {
      occupied: false,
      assignedCount: 0,
      allowMultiple: false,
      reserved: false
    };
    return {
      ...base,
      allowMultiple: settings.allowMultiple !== undefined ? settings.allowMultiple : base.allowMultiple,
      reserved: settings.reserved !== undefined ? settings.reserved : base.reserved
    };
  });

  return { success: true };
}

// Admin Update Site Settings
export async function updateSiteSettings(newSettings) {
  const settingsRef = ref(db, "settings");
  await update(settingsRef, {
    ...newSettings,
    updatedAt: Date.now()
  });
  return { success: true };
}

// Seed initial settings if database is empty
export async function seedInitialSettings() {
  const settingsRef = ref(db, "settings");
  const snap = await get(settingsRef);
  if (!snap.exists()) {
    await set(settingsRef, DEFAULT_SETTINGS);
  }
}
