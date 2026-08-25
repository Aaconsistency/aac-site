import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Flame, Droplet, Dumbbell, Home, UtensilsCrossed, ChevronRight, Check,
  Plus, Minus, Lock, Sun, Moon, User, ShieldAlert, Sparkles, X, Zap,
  Crown, Calendar, Snowflake, ArrowLeft, Shield, Gift, Medal, Mail, MailCheck,
  Pencil, RotateCcw, Trash2, Instagram, ExternalLink, MapPin, MessageSquare, LogOut
} from "lucide-react";

/* ═══════════════════════ DESIGN TOKENS ═══════════════════════ */
const THEME = {
  dark: {
    bg: "#0A090C", bgEl: "#161419", bgEl2: "#211E26", border: "#2E2A35",
    text: "#F6F2ED", muted: "#9E99A6", red: "#F0202F", redDeep: "#B00D19",
    redDim: "#3B0F14", redSoft: "#6B1219", glow: "rgba(240,32,47,.4)",
    turq: "#2ED9C3", turqDeep: "#12A794", turqDim: "#0C2E2B", turqGlow: "rgba(46,217,195,.32)",
    gold: "#F5B93B", green: "#3DD68C",
    muscle: "#5A4038", muscleLit: "#F0202F",
  },
  light: {
    bg: "#F7F4EF", bgEl: "#FFFFFF", bgEl2: "#EEE9E1", border: "#DED8CE",
    text: "#141216", muted: "#6A6570", red: "#D6101E", redDeep: "#9C0A15",
    redDim: "#FBDDDE", redSoft: "#F2B9BC", glow: "rgba(214,16,30,.25)",
    turq: "#0E9C8A", turqDeep: "#0A7568", turqDim: "#D6F3EE", turqGlow: "rgba(14,156,138,.25)",
    gold: "#C98A10", green: "#149A5C",
    muscle: "#D9B4A6", muscleLit: "#D6101E",
  },
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');`;

const IG_URL = "https://www.instagram.com/aac_allaboutconsistency?utm_source=qr";
const IG_HANDLE = "@aac_allaboutconsistency";

/* ═══════════════════════ AAC WORDMARK ═══════════════════════ */
function Logo({ c, size = 62, radius = 18, fontSize }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `linear-gradient(135deg,${c.red},${c.turq})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 8px 30px ${c.glow}`,
    }}>
      <span style={{
        fontFamily: "'Bebas Neue',sans-serif", color: "#fff",
        fontSize: fontSize || size * 0.42, letterSpacing: 1.5, lineHeight: 1,
        display: "inline-block", transform: "skewX(-8deg)",
      }}>AAC</span>
    </div>
  );
}

/* ═══════════════════════ PAYMENT CONFIG ═══════════════════════ */
const PAYMENT_CONFIG = {
  stripePublishableKey: "pk_test_REPLACE_ME",
  checkoutEndpoint: "/api/create-checkout-session",
  liveMode: false,
};

async function processPayment({ plan, card }) {
  if (PAYMENT_CONFIG.liveMode) {
    const res = await fetch(PAYMENT_CONFIG.checkoutEndpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan.priceId, email: card.email }),
    });
    if (!res.ok) throw new Error("Payment failed. Check your card details and try again.");
    return res.json();
  }
  await new Promise((r) => setTimeout(r, 1500));
  if (card.number.replace(/\s/g, "").endsWith("0000")) throw new Error("Card declined. Try a different card.");
  return { ok: true, demo: true, subscriptionId: "sub_demo_" + Date.now() };
}

/* ═══════════════════════ DATA ═══════════════════════ */
const COACHES = {
  male: { name: "Carl", skin: "#B87A4E", hair: "#1F1712" },
  female: { name: "Evonne", skin: "#8A5A38", hair: "#1A1210" },
};

const LEVELS = [
  { id: 1, name: "Foundation", tagline: "Show up. That's the whole rep.", xp: 20 },
  { id: 2, name: "Building", tagline: "Momentum is compounding.", xp: 30 },
  { id: 3, name: "Active", tagline: "Structured. Strong. Relentless.", xp: 40 },
  { id: 4, name: "Elite", tagline: "Earned, never given.", xp: 55 },
];

const GOAL_BODIES = [
  { id: "lean", label: "Lean & Defined", desc: "Visible tone, athletic silhouette", emoji: "⚡" },
  { id: "strong", label: "Strong & Powerful", desc: "Dense muscle, real-world strength", emoji: "🔨" },
  { id: "athletic", label: "Athletic & Conditioned", desc: "Endurance, speed, sport-ready", emoji: "🏃" },
  { id: "healthy", label: "Healthy & Mobile", desc: "Pain-free movement, energy, longevity", emoji: "🌱" },
];

const EVENTS = [
  { id: "wedding", label: "Wedding" }, { id: "vacation", label: "Vacation / Beach" },
  { id: "reunion", label: "Reunion" }, { id: "competition", label: "Competition / Race" },
  { id: "birthday", label: "Milestone Birthday" }, { id: "none", label: "No event — just me" },
];

const EQUIP = [
  { id: "none", label: "No Equipment" }, { id: "basic", label: "Home Basic" }, { id: "gym", label: "Full Gym" },
];

const REGIONS = [
  // Front
  { id: "neck", label: "Neck & Traps", side: "both" },
  { id: "shoulder", label: "Shoulders", side: "both" },
  { id: "chest", label: "Chest", side: "front" },
  { id: "bicep", label: "Biceps", side: "front" },
  { id: "elbow", label: "Elbows", side: "both" },
  { id: "forearm", label: "Forearms", side: "both" },
  { id: "wrist", label: "Wrists", side: "both" },
  { id: "abs", label: "Abs & Obliques", side: "front" },
  { id: "hip", label: "Hips & Hip Flexors", side: "both" },
  { id: "quad", label: "Quads", side: "front" },
  { id: "knee", label: "Knees (front)", side: "front" },
  { id: "shin", label: "Shins", side: "front" },
  { id: "ankle", label: "Ankles", side: "both" },
  { id: "foot", label: "Feet", side: "both" },
  // Back
  { id: "upper_back", label: "Upper Back & Lats", side: "back" },
  { id: "tricep", label: "Triceps", side: "back" },
  { id: "lower_back", label: "Lower Back", side: "back" },
  { id: "glute", label: "Glutes", side: "back" },
  { id: "hamstring", label: "Hamstrings", side: "back" },
  { id: "back_knee", label: "Back of Knees", side: "back" },
  { id: "calf", label: "Calves", side: "back" },
  { id: "achilles", label: "Achilles", side: "back" },
];
const regionLabel = (id) => REGIONS.find(r => r.id === id)?.label || id;

const WORKOUTS = {
  1: [
    { slot: "Lower Body", sets: "2 × 10", base: { none: "Bodyweight Squats", basic: "Goblet Squats", gym: "Leg Press (light)" },
      alt: { knee: "Seated Leg Extensions (band)", back_knee: "Glute Bridges", hip: "Glute Bridges", glute: "Wall Sit", quad: "Glute Bridges", ankle: "Seated Knee Extensions", foot: "Seated Knee Extensions", shin: "Glute Bridges", hamstring: "Wall Sit", lower_back: "Supported Sit-to-Stand" } },
    { slot: "Upper Body", sets: "2 × 10", base: { none: "Wall Push-Ups", basic: "Incline DB Press", gym: "Chest Press Machine" },
      alt: { shoulder: "Standing Chest Squeeze", wrist: "Fist Wall Push-Ups", forearm: "Isometric Chest Press", bicep: "Band Pull-Aparts", tricep: "Band Pull-Aparts", elbow: "Isometric Chest Press", chest: "Band Pull-Aparts", neck: "Supported Incline Press" } },
    { slot: "Core", sets: "2 × 30s", base: { none: "Standing Marches", basic: "Seated Band Rotations", gym: "Cable Woodchop (light)" },
      alt: { lower_back: "Pelvic Tilts", abs: "Pelvic Tilts", hip: "Supported Dead Bug", neck: "Supported Dead Bug" } },
    { slot: "Cardio", sets: "5 min", base: { none: "Walk in Place", basic: "Low Step-Ups", gym: "Recumbent Bike" },
      alt: { knee: "Seated Arm Cycle", back_knee: "Seated Arm Cycle", ankle: "Seated Arm Cycle", foot: "Seated Arm Cycle", achilles: "Seated Arm Cycle", shin: "Seated Arm Cycle", calf: "Recumbent Bike (low resistance)" } },
    { slot: "Mobility", sets: "2 min", base: { none: "Neck & Shoulder Rolls", basic: "Band Pull-Aparts", gym: "Foam Roll Full Body" },
      alt: { neck: "Gentle Shoulder Rolls Only", shoulder: "Gentle Neck Rolls Only" } },
  ],
  2: [
    { slot: "Lower Body", sets: "3 × 12", base: { none: "Split Squats", basic: "DB Romanian Deadlift", gym: "Smith Machine Squat" },
      alt: { knee: "Box Squats (high)", back_knee: "Hip Thrusts", hip: "Hip Thrusts", glute: "Leg Press (short range)", quad: "Hip Thrusts", hamstring: "Leg Press (short range)", ankle: "Seated Leg Press", foot: "Seated Leg Press", shin: "Seated Leg Press", lower_back: "Goblet Box Squat" } },
    { slot: "Push", sets: "3 × 10", base: { none: "Push-Ups", basic: "DB Bench Press", gym: "Chest Press Machine" },
      alt: { shoulder: "Neutral-Grip Floor Press", wrist: "Fist Push-Ups", forearm: "Machine Chest Press", tricep: "Incline DB Press (light)", bicep: "Machine Chest Press", elbow: "Machine Chest Press", chest: "Incline DB Press (light)", neck: "Supported Machine Press" } },
    { slot: "Pull", sets: "3 × 10", base: { none: "Band Rows", basic: "DB Bent-Over Rows", gym: "Seated Cable Row" },
      alt: { lower_back: "Chest-Supported Rows", upper_back: "Single-Arm Cable Row", bicep: "Straight-Arm Pulldown", forearm: "Chest-Supported Rows", wrist: "Straight-Arm Pulldown", elbow: "Straight-Arm Pulldown" } },
    { slot: "Core", sets: "3 × 40s", base: { none: "Plank", basic: "Weighted Dead Bug", gym: "Cable Crunch" },
      alt: { lower_back: "Dead Bug (bodyweight)", abs: "Dead Bug (bodyweight)", wrist: "Forearm Plank", shoulder: "Dead Bug (bodyweight)", neck: "Dead Bug (head supported)" } },
    { slot: "Cardio", sets: "12 min", base: { none: "Brisk Interval Walk", basic: "Jump Rope Intervals", gym: "Bike Intervals" },
      alt: { knee: "Rowing Machine", back_knee: "Rowing Machine", ankle: "Rowing Machine", foot: "Rowing Machine", achilles: "Rowing Machine", shin: "Rowing Machine", calf: "Bike Intervals (seated)" } },
  ],
  3: [
    { slot: "Lower Body", sets: "4 × 8", base: { none: "Bulgarian Split Squats", basic: "DB Front Squat", gym: "Barbell Back Squat" },
      alt: { knee: "Trap Bar Deadlift", back_knee: "Trap Bar Deadlift", hip: "Sumo Deadlift", glute: "Front Squat (moderate)", quad: "Trap Bar Deadlift", hamstring: "Front Squat (moderate)", ankle: "Leg Press", foot: "Leg Press", shin: "Leg Press", lower_back: "Belt Squat / Leg Press" } },
    { slot: "Push", sets: "4 × 8", base: { none: "Decline Push-Ups", basic: "DB Overhead Press", gym: "Barbell Bench Press" },
      alt: { shoulder: "Landmine Press", wrist: "Neutral-Grip DB Press", forearm: "Machine Press", tricep: "Incline Press (moderate)", bicep: "Machine Press", elbow: "Machine Press", chest: "Incline Press (moderate)", neck: "Seated Machine Press" } },
    { slot: "Pull", sets: "4 × 8", base: { none: "Towel Rows", basic: "Renegade Rows", gym: "Weighted Pull-Ups" },
      alt: { lower_back: "Chest-Supported T-Bar Row", upper_back: "Neutral-Grip Lat Pulldown", bicep: "Straight-Arm Pulldown", forearm: "Chest-Supported T-Bar Row", wrist: "Straight-Arm Pulldown", elbow: "Lat Pulldown (light)" } },
    { slot: "Rotation", sets: "3 × 12", base: { none: "Bicycle Crunches", basic: "Pallof Press", gym: "Cable Anti-Rotation" },
      alt: { lower_back: "Bird Dog", abs: "Bird Dog", hip: "Pallof Press (standing)", neck: "Pallof Press (standing)" } },
    { slot: "Conditioning", sets: "15 min", base: { none: "Sprint Intervals", basic: "Kettlebell Circuit", gym: "Assault Bike Intervals" },
      alt: { knee: "Row Intervals", back_knee: "Row Intervals", ankle: "Bike Intervals", foot: "Bike Intervals", achilles: "Bike Intervals", shin: "Bike Intervals", calf: "Row Intervals", glute: "Swim or Row Intervals", hip: "Swim or Row Intervals" } },
  ],
  4: [
    { slot: "Lower Body", sets: "5 × 5", base: { none: "Pistol Squat Progression", basic: "Heavy Bulgarian Split Squat", gym: "Barbell Back Squat (heavy)" },
      alt: { knee: "Hex Bar Deadlift", back_knee: "Hex Bar Deadlift", hip: "Sumo Deadlift (heavy)", glute: "Front Squat", quad: "Hex Bar Deadlift", hamstring: "Front Squat", ankle: "Leg Press (heavy)", foot: "Leg Press (heavy)", shin: "Leg Press (heavy)", lower_back: "Belt Squat" } },
    { slot: "Push", sets: "5 × 5", base: { none: "Plyo Push-Ups", basic: "Heavy DB Bench", gym: "Barbell Bench (heavy)" },
      alt: { shoulder: "Floor Press", wrist: "Neutral-Grip Floor Press", forearm: "Machine Chest Press", tricep: "Incline Bench (moderate)", bicep: "Machine Chest Press", elbow: "Slingshot Bench", chest: "Incline Bench (moderate)", neck: "Machine Chest Press" } },
    { slot: "Pull", sets: "5 × 5", base: { none: "Weighted Pull-Ups", basic: "Heavy Single-Arm Row", gym: "Barbell Row (heavy)" },
      alt: { lower_back: "Strict Pull-Ups", upper_back: "Chest-Supported Row", bicep: "Straight-Arm Pulldown", forearm: "Chest-Supported Row", wrist: "Lat Pulldown (heavy)", elbow: "Lat Pulldown (heavy)" } },
    { slot: "Power", sets: "5 × 3", base: { none: "Broad Jumps", basic: "Heavy KB Swings", gym: "Power Cleans" },
      alt: { knee: "Med Ball Slams", back_knee: "Med Ball Slams", ankle: "Med Ball Slams", foot: "Med Ball Slams", achilles: "Med Ball Slams", shin: "Med Ball Slams", quad: "Med Ball Slams", lower_back: "Med Ball Chest Throws", calf: "Med Ball Slams" } },
    { slot: "Conditioning", sets: "20 min", base: { none: "Sprint Intervals", basic: "Complex Circuit", gym: "Prowler + Bike Intervals" },
      alt: { knee: "Bike Sprints", back_knee: "Bike Sprints", ankle: "Bike Sprints", foot: "Bike Sprints", achilles: "Bike Sprints", shin: "Bike Sprints", calf: "Row Intervals", glute: "Row Intervals", hip: "Row Intervals" } },
  ],
};

/* ═══════════════════════ WORKOUT SUBSTITUTION LIBRARY ═══════════════════════ */
/* Options shown in the swap dropdown when customizing, grouped by slot type. */
const SUB_OPTIONS = {
  "Lower Body": ["Bodyweight Squats", "Goblet Squats", "Barbell Back Squat", "Front Squat", "Leg Press",
    "Split Squats", "Bulgarian Split Squats", "DB Romanian Deadlift", "Trap Bar Deadlift", "Sumo Deadlift",
    "Hip Thrusts", "Glute Bridges", "Box Squats (high)", "Wall Sit", "Step-Ups", "Seated Leg Extensions (band)"],
  "Push": ["Push-Ups", "Wall Push-Ups", "Incline DB Press", "DB Bench Press", "Barbell Bench Press",
    "Floor Press", "Chest Press Machine", "DB Overhead Press", "Landmine Press", "Standing Chest Squeeze"],
  "Pull": ["Band Rows", "DB Bent-Over Rows", "Seated Cable Row", "Chest-Supported Rows", "Barbell Row",
    "Weighted Pull-Ups", "Lat Pulldown", "Towel Rows", "Renegade Rows"],
  "Core": ["Plank", "Forearm Plank", "Dead Bug", "Bird Dog", "Bicycle Crunches", "Cable Crunch",
    "Pallof Press", "Seated Band Rotations", "Cable Woodchop", "Standing Marches", "Pelvic Tilts"],
  "Cardio": ["Brisk Interval Walk", "Walk in Place", "Jump Rope Intervals", "Bike Intervals", "Recumbent Bike",
    "Rowing Machine", "Row Intervals", "Sprint Intervals", "Assault Bike Intervals", "Kettlebell Circuit", "Low Step-Ups"],
  "Power": ["Broad Jumps", "Med Ball Slams", "Heavy KB Swings", "Power Cleans", "Plyo Push-Ups"],
  "Mobility": ["Neck & Shoulder Rolls", "Band Pull-Aparts", "Foam Roll Full Body", "Gentle Shoulder Rolls Only"],
};

function slotCategory(slot = "") {
  const s = slot.toLowerCase();
  if (/lower/.test(s)) return "Lower Body";
  if (/push|upper/.test(s)) return "Push";
  if (/pull/.test(s)) return "Pull";
  if (/core|rotation/.test(s)) return "Core";
  if (/cardio|conditioning/.test(s)) return "Cardio";
  if (/power/.test(s)) return "Power";
  if (/mobility/.test(s)) return "Mobility";
  return null; // custom slots get the full merged list
}

function subOptionsFor(slot) {
  const cat = slotCategory(slot);
  if (cat) return SUB_OPTIONS[cat];
  return Object.values(SUB_OPTIONS).flat();
}

/* Core is its own thing: a required finisher at the end of every workout. */
const CORE_FINISHERS = {
  1: [
    { slot: "Core Finisher", name: "Dead Bug", sets: "2 × 20s" },
    { slot: "Core Finisher", name: "Glute Bridge Hold", sets: "2 × 15s" },
  ],
  2: [
    { slot: "Core Finisher", name: "Plank", sets: "3 × 30s" },
    { slot: "Core Finisher", name: "Bird Dog", sets: "2 × 10/side" },
  ],
  3: [
    { slot: "Core Finisher", name: "Plank", sets: "3 × 45s" },
    { slot: "Core Finisher", name: "Bicycle Crunches", sets: "3 × 15" },
    { slot: "Core Finisher", name: "Pallof Press", sets: "2 × 12/side" },
  ],
  4: [
    { slot: "Core Finisher", name: "Weighted Plank", sets: "3 × 60s" },
    { slot: "Core Finisher", name: "Hanging Knee Raises", sets: "3 × 12" },
    { slot: "Core Finisher", name: "Cable Crunch", sets: "3 × 15" },
  ],
};

/* Core swap options — the finisher stays required, but the movements are yours. */
const CORE_SWAP_OPTIONS = [
  "Plank", "Forearm Plank", "Side Plank", "Weighted Plank", "Dead Bug", "Bird Dog",
  "Glute Bridge Hold", "Bicycle Crunches", "Cable Crunch", "Hanging Knee Raises",
  "Russian Twists", "Hollow Hold", "Mountain Climbers", "V-Ups", "Leg Raises",
  "Pallof Press", "Seated Band Rotations", "Cable Woodchop", "Suitcase Carry",
  "Standing Marches", "Pelvic Tilts",
];

const FoodArt = {
  eggToast: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#E8DCC8" />
      <ellipse cx="50" cy="62" rx="38" ry="7" fill="#00000018" />
      <rect x="18" y="26" width="64" height="32" rx="6" fill="#C98A4B" />
      <rect x="21" y="24" width="58" height="28" rx="5" fill="#E0A85E" />
      <path d="M26 40 Q38 30 50 38 Q62 46 74 36 L74 48 Q62 52 50 48 Q38 44 26 48 Z" fill="#7DBE5C" />
      <path d="M28 42 Q40 34 52 41" stroke="#5F9E45" strokeWidth="1.5" fill="none" />
      <ellipse cx="52" cy="34" rx="16" ry="11" fill="#FFFDF5" />
      <circle cx="52" cy="34" r="6" fill="#F5A623" />
      <circle cx="50" cy="32" r="2" fill="#FFC65C" opacity=".7" />
      <circle cx="34" cy="30" r="1" fill="#8B4513" /><circle cx="68" cy="45" r="1" fill="#8B4513" />
    </svg>
  ),
  chickenVeg: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#2B2620" />
      <ellipse cx="50" cy="38" rx="42" ry="26" fill="#3D3730" />
      <ellipse cx="50" cy="36" rx="38" ry="23" fill="#4A4239" />
      <ellipse cx="38" cy="32" rx="17" ry="12" fill="#C97B3C" />
      <ellipse cx="38" cy="30" rx="15" ry="10" fill="#E09A50" />
      <path d="M28 28 Q38 24 48 29" stroke="#A85E28" strokeWidth="2" fill="none" />
      <path d="M30 34 Q40 31 47 35" stroke="#A85E28" strokeWidth="1.5" fill="none" />
      <circle cx="65" cy="30" r="5" fill="#D4453A" /><circle cx="63" cy="28" r="2" fill="#E86A5E" opacity=".6" />
      <circle cx="74" cy="38" r="5" fill="#4E9E3E" /><circle cx="72" cy="36" r="2" fill="#6DBE5A" opacity=".6" />
      <circle cx="62" cy="44" r="4.5" fill="#E8A72C" /><circle cx="60" cy="42" r="1.8" fill="#F5C558" opacity=".6" />
      <ellipse cx="50" cy="47" rx="7" ry="3" fill="#6DBE5A" transform="rotate(-15 50 47)" />
      <ellipse cx="30" cy="44" rx="6" ry="3" fill="#4E9E3E" transform="rotate(20 30 44)" />
    </svg>
  ),
  yogurtBowl: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#EFE6DA" />
      <ellipse cx="50" cy="58" rx="34" ry="6" fill="#00000015" />
      <path d="M20 34 Q20 58 50 58 Q80 58 80 34 Z" fill="#D8CFC2" />
      <ellipse cx="50" cy="34" rx="30" ry="13" fill="#FFFCF6" />
      <ellipse cx="50" cy="33" rx="27" ry="11" fill="#FFFFFF" />
      <circle cx="40" cy="30" r="4" fill="#3E2A63" /><circle cx="38.5" cy="28.5" r="1.4" fill="#6B4E9E" opacity=".7" />
      <circle cx="49" cy="35" r="4" fill="#C42847" /><circle cx="47.5" cy="33.5" r="1.4" fill="#E85570" opacity=".7" />
      <circle cx="59" cy="30" r="3.5" fill="#2E5F8A" /><circle cx="58" cy="28.8" r="1.2" fill="#5B93C4" opacity=".7" />
      <circle cx="55" cy="38" r="3" fill="#3E2A63" />
      <ellipse cx="34" cy="36" rx="6" ry="3" fill="#C9A46B" transform="rotate(-12 34 36)" />
      <ellipse cx="66" cy="37" rx="5" ry="2.6" fill="#C9A46B" transform="rotate(14 66 37)" />
      <path d="M44 26 Q47 20 52 24" stroke="#4E9E3E" strokeWidth="2" fill="none" />
    </svg>
  ),
  turkeyWrap: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#F2EDE3" />
      <ellipse cx="50" cy="58" rx="36" ry="6" fill="#00000012" />
      <path d="M16 48 Q24 22 50 26 Q76 22 84 48 Q50 58 16 48 Z" fill="#5FA346" />
      <path d="M22 46 Q30 28 50 31 Q70 28 78 46 Q50 54 22 46 Z" fill="#7DC45E" />
      <path d="M30 42 Q40 34 50 38 Q60 42 70 38" stroke="#4E8A3A" strokeWidth="1.5" fill="none" />
      <ellipse cx="42" cy="40" rx="10" ry="5" fill="#E8B896" transform="rotate(-8 42 40)" />
      <ellipse cx="58" cy="41" rx="9" ry="4.5" fill="#EDC4A4" transform="rotate(10 58 41)" />
      <circle cx="36" cy="36" r="3" fill="#D4453A" /><circle cx="64" cy="37" r="2.6" fill="#D4453A" />
      <ellipse cx="50" cy="35" rx="5" ry="2" fill="#F0D060" />
    </svg>
  ),
  oats: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#E6DFD3" />
      <rect x="30" y="18" width="40" height="42" rx="5" fill="#D5CCBE" opacity=".5" />
      <rect x="32" y="20" width="36" height="38" rx="4" fill="#EFE9DE" opacity=".7" />
      <rect x="32" y="34" width="36" height="24" rx="3" fill="#D9C9A8" />
      <rect x="32" y="30" width="36" height="6" fill="#C9B58C" />
      <circle cx="40" cy="27" r="4" fill="#C42847" /><circle cx="38.8" cy="25.8" r="1.3" fill="#E85570" opacity=".7" />
      <circle cx="50" cy="24" r="3.6" fill="#3E2A63" /><circle cx="60" cy="27" r="3.6" fill="#2E5F8A" />
      <ellipse cx="55" cy="30" rx="5" ry="2.2" fill="#E8A72C" />
      <path d="M44 22 Q47 17 51 20" stroke="#4E9E3E" strokeWidth="1.8" fill="none" />
    </svg>
  ),
  salmon: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#33302B" />
      <ellipse cx="50" cy="38" rx="43" ry="27" fill="#45413A" />
      <ellipse cx="50" cy="36" rx="39" ry="24" fill="#514C43" />
      <path d="M24 30 L52 26 L56 42 L28 46 Z" fill="#E07856" />
      <path d="M26 31 L50 28 L53 40 L29 43 Z" fill="#F08E68" />
      <path d="M28 33 Q38 31 48 32" stroke="#FFC0A8" strokeWidth="1.6" fill="none" />
      <path d="M29 37 Q39 35 49 36" stroke="#FFC0A8" strokeWidth="1.6" fill="none" />
      <rect x="62" y="24" width="3" height="26" rx="1.5" fill="#4E9E3E" transform="rotate(8 63 37)" />
      <rect x="69" y="26" width="3" height="24" rx="1.5" fill="#5FB84C" transform="rotate(-6 70 38)" />
      <rect x="76" y="25" width="3" height="25" rx="1.5" fill="#4E9E3E" transform="rotate(12 77 37)" />
      <ellipse cx="63" cy="23" rx="2.6" ry="4" fill="#6DBE5A" />
      <ellipse cx="70" cy="25" rx="2.6" ry="4" fill="#7DCC68" />
      <ellipse cx="77" cy="24" rx="2.6" ry="4" fill="#6DBE5A" />
      <ellipse cx="45" cy="50" rx="6" ry="2.4" fill="#F0D060" />
    </svg>
  ),
  proteinPancake: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#EDE4D6" />
      <ellipse cx="50" cy="60" rx="32" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="52" rx="28" ry="8" fill="#C98A4B" />
      <ellipse cx="50" cy="49" rx="28" ry="8" fill="#DFA660" />
      <ellipse cx="50" cy="42" rx="26" ry="8" fill="#C98A4B" />
      <ellipse cx="50" cy="39" rx="26" ry="8" fill="#E5AE68" />
      <ellipse cx="50" cy="32" rx="24" ry="8" fill="#C98A4B" />
      <ellipse cx="50" cy="29" rx="24" ry="8" fill="#EBB873" />
      <path d="M30 28 Q40 36 50 28 Q60 22 70 30 L70 34 Q58 30 50 34 Q40 40 30 32 Z" fill="#B06A22" opacity=".75" />
      <circle cx="44" cy="24" r="3.4" fill="#C42847" /><circle cx="43" cy="23" r="1.2" fill="#E85570" opacity=".7" />
      <circle cx="55" cy="25" r="3" fill="#3E2A63" />
      <ellipse cx="50" cy="20" rx="4" ry="2.6" fill="#FFFDF5" />
    </svg>
  ),
  steakBowl: (
    <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="70" fill="#2E2823" />
      <ellipse cx="50" cy="38" rx="42" ry="26" fill="#403A33" />
      <ellipse cx="50" cy="36" rx="38" ry="23" fill="#4C453C" />
      <path d="M26 30 Q34 24 46 27 Q52 34 44 42 Q32 44 26 38 Z" fill="#7A3A2E" />
      <path d="M28 31 Q35 26 45 29 Q49 34 43 40 Q33 41 28 37 Z" fill="#98493A" />
      <path d="M31 33 Q37 31 43 33" stroke="#5E2A20" strokeWidth="1.4" fill="none" />
      <path d="M32 37 Q38 35 44 37" stroke="#5E2A20" strokeWidth="1.4" fill="none" />
      <ellipse cx="64" cy="32" rx="13" ry="9" fill="#E8DCC0" />
      <ellipse cx="64" cy="31" rx="11" ry="7.5" fill="#F2E9D4" />
      <circle cx="60" cy="30" r="1" fill="#D8CAA8" /><circle cx="67" cy="33" r="1" fill="#D8CAA8" />
      <ellipse cx="52" cy="46" rx="9" ry="4" fill="#4E9E3E" />
      <ellipse cx="52" cy="45" rx="7" ry="3" fill="#6DBE5A" />
      <circle cx="72" cy="44" r="4" fill="#D4453A" /><circle cx="70.5" cy="42.5" r="1.4" fill="#E86A5E" opacity=".6" />
    </svg>
  ),
};

const RECIPES = [
  { id: "r1", name: "Egg & Avocado Toast", art: "eggToast", tags: ["quick", "veg"], cal: 340, p: 18, prep: "5 min",
    ing: ["2 eggs", "1 slice sourdough", "½ avocado", "Chili flakes", "Salt & pepper"],
    steps: ["Toast the bread until golden.", "Mash avocado with salt, pepper, and chili flakes.", "Fry or poach eggs to your liking.", "Spread avocado, top with eggs, finish with flakes."] },
  { id: "r2", name: "One-Pan Chicken & Veg", art: "chickenVeg", tags: ["protein"], cal: 480, p: 42, prep: "20 min",
    ing: ["2 chicken breasts", "1 bell pepper", "1 zucchini", "1 tbsp olive oil", "Paprika, garlic powder"],
    steps: ["Heat oven to 425°F.", "Toss chopped veg and chicken in oil and spices.", "Spread on one sheet pan, don't crowd it.", "Roast 18–20 min until chicken hits 165°F."] },
  { id: "r3", name: "Greek Yogurt Power Bowl", art: "yogurtBowl", tags: ["quick", "veg", "protein"], cal: 310, p: 24, prep: "5 min",
    ing: ["1 cup Greek yogurt", "Mixed berries", "1 tbsp honey", "2 tbsp granola", "Mint"],
    steps: ["Spoon yogurt into a bowl.", "Layer berries across the top.", "Drizzle honey, scatter granola.", "Finish with mint."] },
  { id: "r4", name: "Turkey Lettuce Wraps", art: "turkeyWrap", tags: ["lowcarb", "protein"], cal: 390, p: 38, prep: "10 min",
    ing: ["1 lb ground turkey", "Butter lettuce leaves", "Diced tomato", "Soy sauce", "Sesame oil"],
    steps: ["Brown turkey over medium-high heat.", "Add soy sauce and sesame oil, cook 2 min more.", "Spoon into lettuce cups.", "Top with tomato and serve."] },
  { id: "r5", name: "Overnight Oats", art: "oats", tags: ["quick", "veg"], cal: 350, p: 16, prep: "5 min",
    ing: ["½ cup rolled oats", "½ cup milk", "1 tbsp chia seeds", "Berries", "Honey"],
    steps: ["Combine oats, milk, and chia in a jar.", "Stir well, seal, refrigerate overnight.", "Top with berries and honey in the morning."] },
  { id: "r6", name: "Sheet-Pan Salmon", art: "salmon", tags: ["protein", "lowcarb"], cal: 420, p: 40, prep: "18 min",
    ing: ["2 salmon fillets", "1 bunch asparagus", "Lemon", "Olive oil", "Garlic"],
    steps: ["Heat oven to 400°F.", "Lay salmon and asparagus on a lined sheet.", "Drizzle oil, add garlic and lemon slices.", "Bake 14–16 min until salmon flakes."] },
  { id: "r7", name: "Protein Pancakes", art: "proteinPancake", tags: ["quick", "veg", "protein"], cal: 380, p: 32, prep: "10 min",
    ing: ["1 scoop vanilla protein", "1 banana", "2 eggs", "½ cup oats", "Berries"],
    steps: ["Blend banana, eggs, oats, and protein until smooth.", "Pour onto a hot greased pan.", "Flip when bubbles form on top.", "Stack and top with berries."] },
  { id: "r8", name: "Steak & Rice Bowl", art: "steakBowl", tags: ["protein"], cal: 550, p: 46, prep: "15 min",
    ing: ["8 oz sirloin", "1 cup rice", "Broccoli", "Cherry tomatoes", "Soy glaze"],
    steps: ["Sear steak 3–4 min per side, then rest 5 min.", "Steam broccoli until bright green.", "Slice steak against the grain.", "Build the bowl and drizzle with glaze."] },
];

const RECIPE_FILTERS = [
  { id: "quick", label: "Quick" }, { id: "protein", label: "High-Protein" },
  { id: "veg", label: "Vegetarian" }, { id: "lowcarb", label: "Low-Carb" },
];

/* ═══════════════════════ HELPERS ═══════════════════════ */
const todayKey = () => new Date().toDateString();
const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toDateString(); };
const daysUntil = (s) => s ? Math.max(0, Math.ceil((new Date(s) - new Date()) / 86400000)) : null;

/* ═══════════════════════ EXERCISE DEMO ═══════════════════════ */
const POSES = {
  squat: {
    a: { head: [50, 15], neck: [50, 25], hip: [50, 58], knee: [51, 84], ankle: [50, 110], elbow: [42, 44], hand: [40, 60] },
    b: { head: [44, 30], neck: [45, 40], hip: [42, 70], knee: [58, 85], ankle: [50, 110], elbow: [44, 56], hand: [52, 66] },
  },
  hinge: {
    a: { head: [50, 15], neck: [50, 25], hip: [50, 58], knee: [50, 84], ankle: [50, 110], elbow: [48, 44], hand: [48, 62] },
    b: { head: [26, 40], neck: [32, 44], hip: [52, 58], knee: [54, 84], ankle: [50, 110], elbow: [32, 62], hand: [32, 78] },
  },
  push: {
    a: { head: [76, 52], neck: [68, 56], hip: [40, 68], knee: [26, 76], ankle: [14, 82], elbow: [68, 74], hand: [66, 92] },
    b: { head: [76, 66], neck: [68, 70], hip: [40, 78], knee: [26, 84], ankle: [14, 88], elbow: [78, 80], hand: [66, 92] },
  },
  press: {
    a: { head: [50, 18], neck: [50, 28], hip: [50, 62], knee: [50, 86], ankle: [50, 110], elbow: [36, 34], hand: [40, 22] },
    b: { head: [50, 18], neck: [50, 28], hip: [50, 62], knee: [50, 86], ankle: [50, 110], elbow: [44, 16], hand: [48, 2] },
  },
  pull: {
    a: { head: [30, 34], neck: [37, 38], hip: [58, 52], knee: [58, 82], ankle: [54, 110], elbow: [34, 60], hand: [33, 80] },
    b: { head: [30, 34], neck: [37, 38], hip: [58, 52], knee: [58, 82], ankle: [54, 110], elbow: [46, 54], hand: [44, 44] },
  },
  plank: {
    a: { head: [78, 56], neck: [70, 59], hip: [40, 68], knee: [26, 74], ankle: [12, 80], elbow: [70, 78], hand: [78, 82] },
    b: { head: [78, 58], neck: [70, 61], hip: [40, 71], knee: [26, 76], ankle: [12, 82], elbow: [70, 80], hand: [78, 84] },
  },
  core: {
    a: { head: [72, 70], neck: [64, 70], hip: [38, 74], knee: [24, 62], ankle: [14, 78], elbow: [64, 58], hand: [70, 50] },
    b: { head: [64, 58], neck: [58, 62], hip: [38, 74], knee: [30, 56], ankle: [22, 72], elbow: [56, 54], hand: [50, 50] },
  },
  rotation: {
    a: { head: [50, 18], neck: [50, 28], hip: [50, 62], knee: [48, 86], ankle: [48, 110], elbow: [58, 44], hand: [68, 46] },
    b: { head: [50, 18], neck: [50, 28], hip: [50, 62], knee: [52, 86], ankle: [52, 110], elbow: [40, 44], hand: [28, 42] },
  },
  cardio: {
    a: { head: [52, 14], neck: [52, 24], hip: [50, 56], knee: [62, 76], ankle: [66, 98], elbow: [38, 40], hand: [34, 54] },
    b: { head: [52, 14], neck: [52, 24], hip: [50, 56], knee: [36, 78], ankle: [26, 96], elbow: [64, 40], hand: [70, 52] },
  },
  power: {
    a: { head: [48, 32], neck: [48, 42], hip: [46, 70], knee: [58, 86], ankle: [50, 110], elbow: [34, 58], hand: [30, 74] },
    b: { head: [50, 8], neck: [50, 18], hip: [50, 48], knee: [52, 72], ankle: [52, 96], elbow: [56, 22], hand: [60, 8] },
  },
  mobility: {
    a: { head: [50, 16], neck: [50, 26], hip: [50, 60], knee: [50, 86], ankle: [50, 110], elbow: [36, 38], hand: [30, 26] },
    b: { head: [54, 18], neck: [52, 28], hip: [50, 60], knee: [50, 86], ankle: [50, 110], elbow: [66, 38], hand: [72, 26] },
  },
  /* Standing, hands on wall, leaning in and out */
  wallpush: {
    a: { head: [52, 16], neck: [52, 26], hip: [48, 62], knee: [49, 87], ankle: [48, 112], elbow: [64, 34], hand: [78, 40] },
    b: { head: [60, 22], neck: [59, 31], hip: [50, 64], knee: [50, 88], ankle: [48, 112], elbow: [68, 42], hand: [78, 40] },
  },
  /* Lying on back, pressing the bar up off the chest */
  bench: {
    a: { head: [18, 88], neck: [26, 88], hip: [54, 90], knee: [68, 76], ankle: [74, 96], elbow: [34, 78], hand: [30, 68] },
    b: { head: [18, 88], neck: [26, 88], hip: [54, 90], knee: [68, 76], ankle: [74, 96], elbow: [28, 64], hand: [28, 50] },
  },
  /* Seated machine/incline press, pressing forward */
  seatedpress: {
    a: { head: [38, 26], neck: [38, 36], hip: [40, 70], knee: [60, 72], ankle: [60, 102], elbow: [46, 46], hand: [44, 42] },
    b: { head: [38, 26], neck: [38, 36], hip: [40, 70], knee: [60, 72], ankle: [60, 102], elbow: [56, 44], hand: [72, 42] },
  },
  /* Standing isometric squeeze, hands pressed together with a small pulse */
  squeeze: {
    a: { head: [48, 16], neck: [48, 26], hip: [48, 62], knee: [48, 88], ankle: [48, 112], elbow: [58, 42], hand: [62, 40] },
    b: { head: [48, 16], neck: [48, 26], hip: [48, 62], knee: [48, 88], ankle: [48, 112], elbow: [56, 42], hand: [58, 40] },
  },
  /* Pallof / anti-rotation: press straight out from the chest */
  pressout: {
    a: { head: [46, 16], neck: [46, 26], hip: [46, 62], knee: [47, 88], ankle: [46, 112], elbow: [54, 40], hand: [52, 36] },
    b: { head: [46, 16], neck: [46, 26], hip: [46, 62], knee: [47, 88], ankle: [46, 112], elbow: [62, 40], hand: [78, 38] },
  },
  /* Seated trunk rotation, hands sweep side to side */
  seatedrot: {
    a: { head: [44, 26], neck: [44, 36], hip: [46, 70], knee: [64, 72], ankle: [64, 102], elbow: [56, 48], hand: [66, 50] },
    b: { head: [42, 26], neck: [43, 36], hip: [46, 70], knee: [64, 72], ankle: [64, 102], elbow: [32, 48], hand: [22, 50] },
  },
  /* Hanging pull-up: hands stay on the bar, body rises */
  pullup: {
    a: { head: [50, 36], neck: [50, 46], hip: [50, 76], knee: [53, 95], ankle: [51, 112], elbow: [55, 26], hand: [57, 12] },
    b: { head: [50, 24], neck: [50, 34], hip: [50, 64], knee: [57, 82], ankle: [53, 98], elbow: [62, 22], hand: [57, 12] },
  },
  /* Seated lat pulldown: bar pulled from overhead to the chest */
  pulldown: {
    a: { head: [44, 26], neck: [44, 36], hip: [46, 72], knee: [64, 74], ankle: [64, 104], elbow: [52, 20], hand: [56, 8] },
    b: { head: [44, 28], neck: [44, 38], hip: [46, 72], knee: [64, 74], ankle: [64, 104], elbow: [54, 42], hand: [58, 32] },
  },
  /* Seated row / rowing machine: reach forward, drive back and pull */
  rowmachine: {
    a: { head: [40, 34], neck: [41, 44], hip: [46, 80], knee: [62, 70], ankle: [76, 82], elbow: [52, 58], hand: [62, 60] },
    b: { head: [30, 30], neck: [33, 40], hip: [46, 80], knee: [66, 74], ankle: [80, 82], elbow: [36, 56], hand: [42, 58] },
  },
  /* Renegade row: plank position, one hand rows up */
  renegade: {
    a: { head: [78, 56], neck: [70, 59], hip: [40, 68], knee: [26, 74], ankle: [12, 80], elbow: [70, 78], hand: [72, 92] },
    b: { head: [78, 54], neck: [70, 57], hip: [40, 66], knee: [26, 73], ankle: [12, 80], elbow: [64, 64], hand: [60, 70] },
  },
  /* Glute bridge / hip thrust: lying, hips drive up */
  bridge: {
    a: { head: [16, 100], neck: [24, 101], hip: [50, 104], knee: [66, 88], ankle: [72, 108], elbow: [30, 106], hand: [38, 108] },
    b: { head: [16, 100], neck: [24, 100], hip: [52, 82], knee: [66, 82], ankle: [72, 108], elbow: [30, 106], hand: [38, 108] },
  },
  /* Pelvic tilt: lying supine, small controlled hip motion */
  supine: {
    a: { head: [16, 102], neck: [24, 102], hip: [50, 105], knee: [66, 90], ankle: [72, 108], elbow: [30, 107], hand: [38, 109] },
    b: { head: [16, 102], neck: [24, 102], hip: [50, 100], knee: [66, 88], ankle: [72, 108], elbow: [30, 107], hand: [38, 109] },
  },
  /* Dead bug: lying, opposite arm and leg extend away */
  deadbug: {
    a: { head: [16, 100], neck: [24, 100], hip: [48, 102], knee: [56, 84], ankle: [54, 68], elbow: [28, 86], hand: [28, 70] },
    b: { head: [16, 100], neck: [24, 100], hip: [48, 102], knee: [64, 90], ankle: [80, 86], elbow: [16, 90], hand: [6, 80] },
  },
  /* Bird dog: all fours, opposite arm and leg reach out */
  birddog: {
    a: { head: [78, 58], neck: [70, 61], hip: [42, 64], knee: [38, 84], ankle: [24, 88], elbow: [70, 76], hand: [72, 90] },
    b: { head: [80, 54], neck: [72, 57], hip: [42, 62], knee: [34, 68], ankle: [16, 60], elbow: [80, 58], hand: [94, 52] },
  },
  /* Standing march: knee drives up, opposite arm swings */
  march: {
    a: { head: [50, 14], neck: [50, 24], hip: [50, 58], knee: [53, 84], ankle: [51, 110], elbow: [44, 42], hand: [42, 56] },
    b: { head: [50, 14], neck: [50, 24], hip: [50, 58], knee: [62, 64], ankle: [58, 84], elbow: [57, 40], hand: [60, 52] },
  },
  /* Wall sit: seated hold against the wall, near-static */
  wallsit: {
    a: { head: [46, 34], neck: [46, 44], hip: [46, 76], knee: [66, 78], ankle: [66, 108], elbow: [42, 58], hand: [42, 72] },
    b: { head: [46, 35], neck: [46, 45], hip: [46, 77], knee: [66, 78], ankle: [66, 108], elbow: [42, 59], hand: [42, 73] },
  },
  /* Step-up: drive up onto the box */
  stepup: {
    a: { head: [44, 20], neck: [44, 30], hip: [44, 64], knee: [47, 89], ankle: [45, 112], elbow: [38, 46], hand: [36, 60] },
    b: { head: [54, 12], neck: [54, 22], hip: [54, 56], knee: [66, 74], ankle: [64, 94], elbow: [48, 38], hand: [50, 50] },
  },
  /* Seated leg/knee extension: shin swings out until straight */
  seatedext: {
    a: { head: [42, 28], neck: [42, 38], hip: [44, 72], knee: [62, 74], ankle: [60, 102], elbow: [38, 52], hand: [40, 66] },
    b: { head: [42, 28], neck: [42, 38], hip: [44, 72], knee: [62, 74], ankle: [88, 70], elbow: [38, 52], hand: [40, 66] },
  },
  /* Leg press: reclined seat, legs press away */
  legpress: {
    a: { head: [22, 50], neck: [28, 56], hip: [42, 80], knee: [56, 62], ankle: [60, 78], elbow: [34, 70], hand: [42, 78] },
    b: { head: [22, 50], neck: [28, 56], hip: [42, 80], knee: [64, 56], ankle: [84, 50], elbow: [34, 70], hand: [42, 78] },
  },
  /* Split squat / lunge: staggered stance, drop straight down */
  lunge: {
    a: { head: [50, 16], neck: [50, 26], hip: [50, 60], knee: [62, 82], ankle: [62, 110], elbow: [44, 44], hand: [42, 58] },
    b: { head: [50, 28], neck: [50, 38], hip: [50, 72], knee: [66, 88], ankle: [62, 110], elbow: [44, 54], hand: [44, 66] },
  },
  /* Med ball slam: ball from overhead down through the floor */
  slam: {
    a: { head: [48, 12], neck: [48, 22], hip: [50, 58], knee: [52, 84], ankle: [50, 110], elbow: [56, 14], hand: [58, 2] },
    b: { head: [38, 34], neck: [40, 43], hip: [52, 62], knee: [55, 86], ankle: [50, 110], elbow: [40, 58], hand: [36, 74] },
  },
  /* Jump rope: light bounce, hands turning at the sides */
  jumprope: {
    a: { head: [50, 16], neck: [50, 26], hip: [50, 60], knee: [52, 86], ankle: [50, 112], elbow: [60, 50], hand: [66, 58] },
    b: { head: [50, 10], neck: [50, 20], hip: [50, 54], knee: [53, 79], ankle: [50, 103], elbow: [62, 46], hand: [68, 54] },
  },
  /* Stationary bike: seated, legs turning the pedals */
  bike: {
    a: { head: [34, 32], neck: [36, 42], hip: [44, 74], knee: [62, 66], ankle: [70, 84], elbow: [46, 54], hand: [58, 58] },
    b: { head: [34, 32], neck: [36, 42], hip: [44, 74], knee: [58, 82], ankle: [62, 100], elbow: [46, 54], hand: [58, 58] },
  },
  /* Seated arm cycle: seated, arms turning the crank */
  armcycle: {
    a: { head: [40, 30], neck: [40, 40], hip: [44, 74], knee: [62, 76], ankle: [62, 104], elbow: [52, 50], hand: [62, 44] },
    b: { head: [40, 30], neck: [40, 40], hip: [44, 74], knee: [62, 76], ankle: [62, 104], elbow: [50, 58], hand: [58, 66] },
  },
  /* Prowler / sled push: leaning into the sled, legs driving */
  prowler: {
    a: { head: [70, 34], neck: [64, 40], hip: [44, 62], knee: [52, 86], ankle: [42, 110], elbow: [76, 48], hand: [86, 56] },
    b: { head: [70, 34], neck: [64, 40], hip: [46, 62], knee: [38, 84], ankle: [54, 108], elbow: [76, 48], hand: [86, 56] },
  },
  /* Foam rolling: body over the roller, slow shift along it */
  foamroll: {
    a: { head: [76, 72], neck: [68, 74], hip: [42, 84], knee: [30, 90], ankle: [18, 96], elbow: [72, 88], hand: [76, 98] },
    b: { head: [72, 72], neck: [64, 74], hip: [38, 84], knee: [26, 90], ankle: [14, 96], elbow: [68, 88], hand: [72, 98] },
  },
};

/* Maps each exercise name to its accurate movement pose.
   Specific matches are checked BEFORE generic ones — order matters. */
function patternFor(name = "") {
  const n = name.toLowerCase();
  // Push family — wall variants first, then floor push-ups, then benches, then machines
  if (/wall push/.test(n)) return "wallpush";
  if (/push-up|push up/.test(n)) return "push";
  if (/bench|floor press|slingshot/.test(n)) return "bench";
  if (/squeeze|isometric/.test(n)) return "squeeze";
  if (/chest press|machine press|incline press|incline db|supported incline/.test(n)) return "seatedpress";
  // Anti-rotation & rotation
  if (/pallof|anti-rotation|throw/.test(n)) return "pressout";
  if (/seated.*rotation/.test(n)) return "seatedrot";
  if (/woodchop|rotation|twist|oblique/.test(n)) return "rotation";
  // Pull family — vertical before horizontal, seated before standing
  if (/pull-up|pull up|chin/.test(n)) return "pullup";
  if (/pulldown/.test(n)) return "pulldown";
  if (/rowing|row machine|seated cable row|row intervals|swim or row/.test(n)) return "rowmachine";
  if (/renegade/.test(n)) return "renegade";
  if (/row/.test(n)) return "pull";
  // Floor & core work
  if (/bridge|thrust/.test(n)) return "bridge";
  if (/pelvic/.test(n)) return "supine";
  if (/dead bug/.test(n)) return "deadbug";
  if (/bird dog/.test(n)) return "birddog";
  if (/plank/.test(n)) return "plank";
  if (/crunch|sit-up/.test(n)) return "core";
  if (/march/.test(n)) return "march";
  // Lower body — specific positions before the generic squat
  if (/wall sit/.test(n)) return "wallsit";
  if (/step-up|step up/.test(n)) return "stepup";
  if (/extension/.test(n)) return "seatedext";
  if (/leg press/.test(n)) return "legpress";
  if (/bulgarian|split squat|lunge/.test(n)) return "lunge";
  if (/squat|sit-to-stand|pistol/.test(n)) return "squat";
  if (/deadlift|romanian|hinge|good morning|swing/.test(n)) return "hinge";
  // Power & conditioning — rope before jump, arm cycle before bike
  if (/slam/.test(n)) return "slam";
  if (/rope/.test(n)) return "jumprope";
  if (/jump|broad|plyo|clean/.test(n)) return "power";
  if (/overhead|landmine|press/.test(n)) return "press";
  if (/arm cycle/.test(n)) return "armcycle";
  if (/prowler|sled/.test(n)) return "prowler";
  if (/bike|cycle|recumbent/.test(n)) return "bike";
  if (/walk|run|sprint|interval|circuit|conditioning|cardio/.test(n)) return "cardio";
  // Mobility — foam rolling on the floor before standing rolls/stretches
  if (/foam roll/.test(n)) return "foamroll";
  if (/roll|stretch|circle|pull-apart|pull apart|mobility/.test(n)) return "mobility";
  return "core";
}

/* ═══════════════════════ EXERCISE EXPLANATIONS ═══════════════════════ */
/* Brief how-to for every workout, matched in the same priority order as the
   demos. Custom typed exercises fall back to a generic cue for their pattern. */
const EXPLAIN = [
  [/wall push/, "Hands on the wall at shoulder height, body straight. Bend your elbows to bring your chest toward the wall, then push back."],
  [/plyo/, "A push-up with pop — press up hard enough that your hands leave the floor, then land soft and go again."],
  [/push-up|push up/, "Hands under shoulders, body in one straight line. Lower your chest to the floor, press back up. No sagging hips."],
  [/bench|floor press|slingshot/, "Lie on your back, lower the weight to your chest with control, then press straight up until your arms lock out."],
  [/squeeze|isometric/, "Press your palms together at chest height as hard as you can and hold — keep the chest squeezing the whole time."],
  [/chest press|machine press|incline press|incline db|supported incline/, "Sit tall against the pad, press the handles forward until your arms are straight, return slowly."],
  [/pallof|anti-rotation/, "Hold the band at your chest and press it straight out. Its whole job is to twist you — don't let it."],
  [/throw/, "Explode the ball off your chest with full arm extension, retrieve, and repeat. Speed over everything."],
  [/seated.*rotation/, "Sit tall holding the band, rotate your torso side to side under control. Move from the trunk, not the arms."],
  [/woodchop/, "Pull the cable diagonally across your body from high to low, rotating through your trunk with straight-ish arms."],
  [/pull-up|pull up|chin/, "Hang from the bar, drive your elbows down to pull your chin over it, then lower all the way to a dead hang."],
  [/pulldown/, "Pull the bar down to your upper chest, squeeze your lats at the bottom, control the return overhead."],
  [/rowing|row machine|row intervals|swim or row/, "Legs, then body, then arms: drive with your legs, lean back, pull the handle to your ribs. Reverse it on the way back."],
  [/seated cable row/, "Sit tall, pull the handle to your stomach, squeeze your shoulder blades together, return slow."],
  [/renegade/, "In a push-up position, row one weight up to your hip while bracing hard so your hips don't rotate an inch."],
  [/chest-supported|t-bar/, "Chest against the pad so your lower back gets a break — row the weight up, squeeze, lower slow."],
  [/row/, "Hinge at the hips with a flat back, pull the weight to your lower ribs, lower it with control."],
  [/bridge|thrust/, "Knees bent, feet flat. Drive through your heels and squeeze your glutes to lift your hips, pause at the top, lower slow."],
  [/pelvic/, "Lying down, gently flatten your lower back into the floor by tilting your pelvis, then release. Small and controlled."],
  [/dead bug/, "On your back with arms and knees up. Lower your opposite arm and leg toward the floor without letting your lower back arch."],
  [/bird dog/, "On hands and knees, extend your opposite arm and leg until they're level with your back. Hold a beat, switch sides."],
  [/side plank/, "On your side, elbow under shoulder, lift your hips so your body makes one straight line. Hold, then switch sides."],
  [/plank/, "Elbows under shoulders, body in one straight line. Squeeze your glutes and abs the entire hold — no sagging hips."],
  [/russian/, "Seated, lean back slightly with feet up or planted, and rotate your torso side to side. Twist from the ribs, not the arms."],
  [/hollow/, "On your back, press your lower back into the floor and lift shoulders and legs a few inches. Hold the banana shape."],
  [/mountain climber/, "In a push-up position, drive your knees toward your chest one at a time, fast but controlled. Hips stay low."],
  [/v-up/, "Lying flat, fold in half — lift legs and torso at the same time to touch your toes, then lower with control."],
  [/leg raise/, "Lying flat, lift your legs to vertical without arching your lower back, then lower them slowly. The way down is the rep."],
  [/carry/, "Grab a heavy weight in one hand and walk tall. Don't lean — your core's job is to keep you dead straight."],
  [/bicycle/, "On your back, pedal your legs while bringing opposite elbow toward knee. Twist from the trunk, not the neck."],
  [/hanging knee/, "Hang from a bar and pull your knees up toward your chest without swinging. Lower them slow."],
  [/crunch/, "Curl your ribs toward your hips using your abs — not your neck. Slow up, slower down."],
  [/march/, "Stand tall and drive one knee up to hip height at a time, like marching in place. Keep your posture proud."],
  [/wall sit/, "Back flat against the wall, slide down until your thighs are parallel to the floor, and hold. Breathe."],
  [/step-up|step up/, "Step your whole foot onto the box and drive through that leg to stand tall. Step down with control — don't drop."],
  [/extension/, "Seated, straighten your knee until your leg is fully extended, squeeze the quad, lower slowly."],
  [/leg press/, "Feet flat on the platform, press until your legs are nearly straight — don't slam the lockout — and return with control."],
  [/bulgarian|split squat|lunge/, "Stagger your stance and drop your back knee straight down toward the floor. Front heel stays planted."],
  [/squat|sit-to-stand|pistol/, "Feet about shoulder-width, sit your hips back and down until your thighs reach parallel, then drive up through your heels."],
  [/swing/, "Hinge at the hips and snap them forward to swing the weight to chest height. The power comes from your hips, not your arms."],
  [/deadlift|romanian|good morning|hinge/, "Hinge at the hips with a flat back, push your hips back until your hamstrings load, then stand tall by squeezing your glutes."],
  [/slam/, "Reach the ball all the way overhead, then slam it into the floor as hard as you can using your whole body."],
  [/rope/, "Light bounces on the balls of your feet, wrists turning the rope. Stay relaxed — tension kills rhythm."],
  [/clean/, "Explosive pull from the floor, then catch the bar at your shoulders. Speed and technique before weight."],
  [/broad|jump/, "Swing your arms, jump as far as you can, and land soft with bent knees. Stick every landing."],
  [/overhead|landmine|shoulder press|press/, "From shoulder height, press the weight straight up until your arms lock out overhead. Lower with control."],
  [/arm cycle/, "Seated, turn the crank with your arms at a steady pace. Smooth circles, shoulders down — no shrugging."],
  [/prowler|sled/, "Lean into the sled with straight arms and drive it forward with powerful, punching steps."],
  [/sprint/, "Go hard for the work period, then walk until you can breathe again. Repeat. The effort is the whole point."],
  [/circuit/, "Move through each exercise back-to-back with minimal rest. Pace yourself to finish strong, not to die early."],
  [/bike|cycle|recumbent/, "Settle into the seat and pedal at a pace you can hold. Steady breathing, steady legs."],
  [/walk/, "Walk briskly enough that talking gets a little hard, ease off to recover, then pick it back up."],
  [/foam roll/, "Roll slowly over the tight areas, pausing on tender spots for a few breaths. Slow beats hard."],
  [/pull-apart|pull apart/, "Hold the band at shoulder height and pull it apart until it touches your chest. Squeeze between your shoulder blades."],
  [/roll|circle/, "Slow, gentle circles — release the tension, never force the range."],
  [/stretch|mobility/, "Ease into the stretch until you feel it, hold, and breathe. Never bounce, never force."],
];

const PATTERN_EXPLAIN = {
  squat: "Sit your hips back and down, chest up, then drive through your heels to stand.",
  hinge: "Push your hips back with a flat back, then squeeze your glutes to stand tall.",
  push: "Lower with control, press away hard, keep your body in one line.",
  press: "Press the weight overhead until lockout, lower with control.",
  pull: "Pull toward your body, squeeze your back, return slow.",
  plank: "Hold your body in one straight line — glutes and abs tight.",
  core: "Move slow, brace your abs, and don't let your lower back do the work.",
  rotation: "Rotate through your trunk under control — power comes from the middle.",
  cardio: "Find a pace you can sustain, breathe steady, and keep moving.",
  power: "Be explosive on the way up, soft and controlled on the landing.",
  mobility: "Slow and gentle — chase release, not pain.",
  wallpush: "Hands on the wall, lean in with a straight body, push back out.",
  bench: "Lower to your chest with control, press to lockout.",
  seatedpress: "Sit tall and press forward until your arms are straight.",
  squeeze: "Press and hold as hard as you can — the squeeze is the rep.",
  pressout: "Press straight out and resist anything that tries to twist you.",
  seatedrot: "Rotate side to side from the trunk, sitting tall.",
  pullup: "Pull your chin over the bar, lower to a full hang.",
  pulldown: "Pull the bar to your chest, control it back overhead.",
  rowmachine: "Legs, body, arms — then reverse it. Smooth strokes.",
  renegade: "Row from a plank without letting your hips twist.",
  bridge: "Drive your hips up, squeeze your glutes at the top.",
  supine: "Small, controlled motion — quality over range.",
  deadbug: "Opposite arm and leg, lower back glued to the floor.",
  birddog: "Opposite arm and leg out, level and steady.",
  march: "Knees up, posture proud, steady rhythm.",
  wallsit: "Thighs parallel, back flat on the wall, hold and breathe.",
  stepup: "Whole foot on the box, drive up through that leg.",
  seatedext: "Straighten the knee fully, lower slow.",
  legpress: "Press to almost-straight, return with control.",
  lunge: "Back knee straight down, front heel planted.",
  slam: "Overhead, then through the floor. Full effort.",
  jumprope: "Light bounces, relaxed wrists, steady rhythm.",
  bike: "Steady pedaling at a pace you can hold.",
  armcycle: "Smooth arm circles at a steady pace.",
  prowler: "Lean in and drive with powerful steps.",
  foamroll: "Roll slow, pause on the tender spots, breathe.",
};

function explainFor(name = "") {
  const n = name.toLowerCase();
  for (const [re, t] of EXPLAIN) if (re.test(n)) return t;
  return PATTERN_EXPLAIN[patternFor(name)] || PATTERN_EXPLAIN.core;
}

function ExerciseDemo({ c, name, size = 84, playing = true }) {
  const [t, setT] = useState(0);
  const raf = useRef();
  const pattern = patternFor(name);
  const pose = POSES[pattern] || POSES.core;

  useEffect(() => {
    if (!playing) return;
    let start = null;
    const loop = (ts) => {
      if (start === null) start = ts;
      const cycle = 1800;
      const phase = ((ts - start) % cycle) / cycle;
      const raw = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      setT(raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, pattern]);

  const lerp = (k) => {
    const [ax, ay] = pose.a[k], [bx, by] = pose.b[k];
    return [ax + (bx - ax) * t, ay + (by - ay) * t];
  };
  const P = {
    head: lerp("head"), neck: lerp("neck"), hip: lerp("hip"),
    knee: lerp("knee"), ankle: lerp("ankle"), elbow: lerp("elbow"), hand: lerp("hand"),
  };
  const line = (a, b, w, col, op = 1) => (
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={w} strokeLinecap="round" opacity={op} />
  );

  return (
    <svg viewBox="0 0 100 120" style={{ width: size, height: size * 1.2, display: "block" }}>
      <g opacity=".18">
        {line(pose.b.neck, pose.b.hip, 9, c.muted)}
        {line(pose.b.hip, pose.b.knee, 7, c.muted)}
        {line(pose.b.knee, pose.b.ankle, 6, c.muted)}
        {line(pose.b.neck, pose.b.elbow, 6, c.muted)}
        {line(pose.b.elbow, pose.b.hand, 5, c.muted)}
        <circle cx={pose.b.head[0]} cy={pose.b.head[1]} r="8" fill={c.muted} />
      </g>
      <line x1="4" y1="114" x2="96" y2="114" stroke={c.border} strokeWidth="2" strokeLinecap="round" />
      {line([P.hip[0] - 3, P.hip[1]], [P.knee[0] - 6, P.knee[1]], 7, c.turqDeep, .55)}
      {line([P.knee[0] - 6, P.knee[1]], [P.ankle[0] - 6, P.ankle[1]], 6, c.turqDeep, .55)}
      {line(P.neck, P.hip, 10, c.red)}
      {line(P.hip, P.knee, 8, c.turq)}
      {line(P.knee, P.ankle, 6.5, c.turq)}
      {line(P.neck, P.elbow, 6.5, c.red)}
      {line(P.elbow, P.hand, 5.5, c.red)}
      <circle cx={P.head[0]} cy={P.head[1]} r="8.5" fill={c.text} />
    </svg>
  );
}

/* ═══════════════════════ ANATOMY DIAGRAM ═══════════════════════ */
function AnatomyPicker({ c, selected, onToggle }) {
  const fill = (id) => selected.includes(id) ? c.muscleLit : c.muscle;
  const R = ({ id, children }) => (
    <g onClick={() => onToggle(id)} style={{ cursor: "pointer" }}>
      <title>{regionLabel(id)}</title>
      {children}
    </g>
  );
  const skin = c.muscle, bone = c.bgEl2;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {/* ── FRONT ── */}
        <div style={{ flex: 1, maxWidth: 155 }}>
          <div style={{ fontFamily: "Inter", fontSize: 9.5, fontWeight: 800, letterSpacing: 1,
            color: c.muted, textAlign: "center", marginBottom: 4 }}>FRONT</div>
          <svg viewBox="0 0 100 210" style={{ width: "100%" }}>
            <ellipse cx="50" cy="16" rx="10" ry="12.5" fill={skin} opacity=".55" />
            <R id="neck">
              <rect x="44" y="26" width="12" height="8" rx="3" fill={fill("neck")} />
              <path d="M34 38 Q50 30 66 38 L62 42 Q50 36 38 42 Z" fill={fill("neck")} />
            </R>
            <R id="shoulder">
              <ellipse cx="30" cy="45" rx="9" ry="8.5" fill={fill("shoulder")} />
              <ellipse cx="70" cy="45" rx="9" ry="8.5" fill={fill("shoulder")} />
            </R>
            <R id="chest">
              <path d="M39 42 Q50 40 50 40 L50 60 Q42 62 37 56 Z" fill={fill("chest")} />
              <path d="M61 42 Q50 40 50 40 L50 60 Q58 62 63 56 Z" fill={fill("chest")} />
            </R>
            <R id="abs">
              {[0, 1, 2].map(i => (
                <React.Fragment key={i}>
                  <rect x="43" y={64 + i * 9} width="6.5" height="7" rx="2" fill={fill("abs")} />
                  <rect x="50.5" y={64 + i * 9} width="6.5" height="7" rx="2" fill={fill("abs")} />
                </React.Fragment>
              ))}
              <path d="M38 60 Q40 78 44 92 L40 92 Q35 76 35 60 Z" fill={fill("abs")} opacity=".85" />
              <path d="M62 60 Q60 78 56 92 L60 92 Q65 76 65 60 Z" fill={fill("abs")} opacity=".85" />
            </R>
            <R id="bicep">
              <ellipse cx="27" cy="60" rx="6.5" ry="12" fill={fill("bicep")} />
              <ellipse cx="73" cy="60" rx="6.5" ry="12" fill={fill("bicep")} />
            </R>
            <R id="elbow">
              <circle cx="25" cy="74" r="5" fill={fill("elbow")} />
              <circle cx="75" cy="74" r="5" fill={fill("elbow")} />
            </R>
            <R id="forearm">
              <ellipse cx="23" cy="88" rx="5.5" ry="11" fill={fill("forearm")} />
              <ellipse cx="77" cy="88" rx="5.5" ry="11" fill={fill("forearm")} />
            </R>
            <R id="wrist">
              <rect x="18" y="99" width="10" height="6" rx="3" fill={fill("wrist")} />
              <rect x="72" y="99" width="10" height="6" rx="3" fill={fill("wrist")} />
            </R>
            <ellipse cx="23" cy="111" rx="5" ry="6.5" fill={skin} opacity=".6" />
            <ellipse cx="77" cy="111" rx="5" ry="6.5" fill={skin} opacity=".6" />
            <R id="hip">
              <path d="M37 92 Q50 96 63 92 L60 106 Q50 110 40 106 Z" fill={fill("hip")} />
            </R>
            <R id="quad">
              <path d="M40 106 Q44 128 43 146 L34 146 Q34 124 38 106 Z" fill={fill("quad")} />
              <path d="M60 106 Q56 128 57 146 L66 146 Q66 124 62 106 Z" fill={fill("quad")} />
            </R>
            <R id="knee">
              <ellipse cx="39" cy="153" rx="7" ry="6.5" fill={fill("knee")} />
              <ellipse cx="61" cy="153" rx="7" ry="6.5" fill={fill("knee")} />
            </R>
            <R id="shin">
              <path d="M35 160 Q37 176 38 188 L44 188 Q43 174 43 160 Z" fill={fill("shin")} />
              <path d="M65 160 Q63 176 62 188 L56 188 Q57 174 57 160 Z" fill={fill("shin")} />
            </R>
            <R id="ankle">
              <rect x="34" y="189" width="11" height="7" rx="3.5" fill={fill("ankle")} />
              <rect x="55" y="189" width="11" height="7" rx="3.5" fill={fill("ankle")} />
            </R>
            <R id="foot">
              <ellipse cx="39" cy="201" rx="7" ry="4.5" fill={fill("foot")} />
              <ellipse cx="61" cy="201" rx="7" ry="4.5" fill={fill("foot")} />
            </R>
          </svg>
        </div>

        {/* ── BACK ── */}
        <div style={{ flex: 1, maxWidth: 155 }}>
          <div style={{ fontFamily: "Inter", fontSize: 9.5, fontWeight: 800, letterSpacing: 1,
            color: c.muted, textAlign: "center", marginBottom: 4 }}>BACK</div>
          <svg viewBox="0 0 100 210" style={{ width: "100%" }}>
            <ellipse cx="50" cy="16" rx="10" ry="12.5" fill={skin} opacity=".55" />
            <R id="neck">
              <rect x="44" y="26" width="12" height="8" rx="3" fill={fill("neck")} />
              <path d="M32 40 Q50 30 68 40 L58 52 Q50 46 42 52 Z" fill={fill("neck")} />
            </R>
            <R id="shoulder">
              <ellipse cx="30" cy="45" rx="9" ry="8.5" fill={fill("shoulder")} />
              <ellipse cx="70" cy="45" rx="9" ry="8.5" fill={fill("shoulder")} />
            </R>
            <R id="upper_back">
              <path d="M40 50 Q50 48 60 50 L64 76 Q50 82 36 76 Z" fill={fill("upper_back")} />
            </R>
            <rect x="48.5" y="40" width="3" height="52" rx="1.5" fill={bone} opacity=".9" />
            <R id="lower_back">
              <path d="M39 78 Q50 74 61 78 L58 94 Q50 98 42 94 Z" fill={fill("lower_back")} />
            </R>
            <R id="tricep">
              <ellipse cx="27" cy="60" rx="6.5" ry="12" fill={fill("tricep")} />
              <ellipse cx="73" cy="60" rx="6.5" ry="12" fill={fill("tricep")} />
            </R>
            <R id="elbow">
              <circle cx="25" cy="74" r="4.5" fill={fill("elbow")} />
              <circle cx="75" cy="74" r="4.5" fill={fill("elbow")} />
            </R>
            <R id="forearm">
              <ellipse cx="24" cy="88" rx="5.5" ry="11" fill={fill("forearm")} />
              <ellipse cx="76" cy="88" rx="5.5" ry="11" fill={fill("forearm")} />
            </R>
            <R id="wrist">
              <rect x="19" y="99" width="10" height="6" rx="3" fill={fill("wrist")} />
              <rect x="71" y="99" width="10" height="6" rx="3" fill={fill("wrist")} />
            </R>
            <R id="glute">
              <ellipse cx="42" cy="104" rx="10" ry="10" fill={fill("glute")} />
              <ellipse cx="58" cy="104" rx="10" ry="10" fill={fill("glute")} />
            </R>
            <R id="hamstring">
              <path d="M34 114 Q36 130 37 144 L45 144 Q45 128 44 114 Z" fill={fill("hamstring")} />
              <path d="M66 114 Q64 130 63 144 L55 144 Q55 128 56 114 Z" fill={fill("hamstring")} />
            </R>
            <R id="back_knee">
              <ellipse cx="40" cy="152" rx="7" ry="6" fill={fill("back_knee")} />
              <ellipse cx="60" cy="152" rx="7" ry="6" fill={fill("back_knee")} />
            </R>
            <R id="calf">
              <path d="M35 160 Q33 174 38 186 L45 186 Q46 172 44 160 Z" fill={fill("calf")} />
              <path d="M65 160 Q67 174 62 186 L55 186 Q54 172 56 160 Z" fill={fill("calf")} />
            </R>
            <R id="achilles">
              <rect x="37" y="187" width="7" height="8" rx="3" fill={fill("achilles")} />
              <rect x="56" y="187" width="7" height="8" rx="3" fill={fill("achilles")} />
            </R>
            <R id="foot">
              <ellipse cx="40" cy="199" rx="6.5" ry="4.5" fill={fill("foot")} />
              <ellipse cx="60" cy="199" rx="6.5" ry="4.5" fill={fill("foot")} />
            </R>
          </svg>
        </div>
      </div>

      <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
        Tap any muscle or joint that's a problem area — front or back.
      </div>

      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12, justifyContent: "center" }}>
          {selected.map(id => (
            <button key={id} onClick={() => onToggle(id)} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px",
              borderRadius: 999, border: `1px solid ${c.red}`, background: c.redDim,
              color: c.red, fontFamily: "Inter", fontSize: 11.5, fontWeight: 800, cursor: "pointer",
            }}>
              {regionLabel(id)} <X size={12} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ UI PRIMITIVES ═══════════════════════ */
const Chip = ({ active, onClick, children, c, tone = "red" }) => {
  const col = tone === "turq" ? c.turq : c.red;
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, fontFamily: "Inter",
      cursor: "pointer", whiteSpace: "nowrap", border: `1px solid ${active ? col : c.border}`,
      background: active ? col : "transparent", color: active ? "#fff" : c.muted, transition: "all .15s",
    }}>{children}</button>
  );
};

const Card = ({ c, children, style }) => (
  <div style={{ background: c.bgEl, border: `1px solid ${c.border}`, borderRadius: 18, padding: 18, ...style }}>{children}</div>
);

const Label = ({ c, children, style }) => (
  <div style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 800, letterSpacing: 1.3,
    textTransform: "uppercase", color: c.muted, marginBottom: 10, ...style }}>{children}</div>
);

const Disp = ({ c, children, size = 22, style }) => (
  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: size, letterSpacing: .6, color: c.text, lineHeight: 1, ...style }}>{children}</div>
);

const btn = (c, disabled, tone = "red") => {
  const col = tone === "turq" ? c.turq : c.red;
  const gl = tone === "turq" ? c.turqGlow : c.glow;
  return {
    padding: "16px 20px", borderRadius: 14, border: "none",
    background: disabled ? c.bgEl2 : col, color: disabled ? c.muted : "#fff",
    fontFamily: "Inter", fontWeight: 800, fontSize: 15, display: "flex",
    alignItems: "center", justifyContent: "center", gap: 8,
    cursor: disabled ? "not-allowed" : "pointer", width: "100%",
    boxShadow: disabled ? "none" : `0 6px 22px ${gl}`, transition: "all .15s",
  };
};

const inputSt = (c, style) => ({
  width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${c.border}`,
  background: c.bgEl2, color: c.text, fontFamily: "Inter", fontSize: 14, outline: "none", ...style,
});

const optCard = (c, active, tone = "red") => ({
  textAlign: "left", padding: "14px 16px", borderRadius: 14,
  border: `1.5px solid ${active ? (tone === "turq" ? c.turq : c.red) : c.border}`,
  background: active ? (tone === "turq" ? c.turqDim : c.redDim) : c.bgEl, cursor: "pointer", width: "100%",
});

const Field = ({ c, label, ...rest }) => (
  <div>
    <Label c={c}>{label}</Label>
    <input {...rest} style={inputSt(c, rest.style)} />
  </div>
);

/* ═══════════════════════ CONFETTI / TOAST ═══════════════════════ */
function Confetti({ c, fire }) {
  const [bits, setBits] = useState([]);
  useEffect(() => {
    if (!fire) return;
    const colors = [c.red, c.turq, c.gold, "#fff", c.green];
    setBits(Array.from({ length: 46 }, (_, i) => ({
      id: i + Math.random(), left: Math.random() * 100, delay: Math.random() * .35,
      color: colors[i % colors.length], rot: Math.random() * 360, dur: 1.1 + Math.random() * .9,
      w: 5 + Math.random() * 6,
    })));
    const t = setTimeout(() => setBits([]), 2400);
    return () => clearTimeout(t);
  }, [fire]);
  if (!bits.length) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 200, overflow: "hidden" }}>
      {bits.map(b => (
        <div key={b.id} style={{
          position: "absolute", top: -14, left: `${b.left}%`, width: b.w, height: b.w * 1.7,
          background: b.color, borderRadius: 2, transform: `rotate(${b.rot}deg)`,
          animation: `fall ${b.dur}s cubic-bezier(.3,.6,.5,1) ${b.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

const Toast = ({ c, toast }) => !toast ? null : (
  <div style={{
    position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
    background: c.bgEl2, border: `1px solid ${c.turq}`, borderRadius: 14, padding: "12px 18px",
    display: "flex", alignItems: "center", gap: 10, boxShadow: `0 8px 26px ${c.turqGlow}`,
    zIndex: 300, maxWidth: "88%", animation: "toastIn .25s ease",
  }}>
    <Sparkles size={16} color={c.turq} />
    <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 700, color: c.text }}>{toast}</span>
  </div>
);

/* ═══════════════════════ COACH ═══════════════════════ */
function Coach({ gender, mood = "idle", size = 120, c }) {
  const female = gender === "female";
  const cfg = COACHES[female ? "female" : "male"];
  const skin = cfg.skin, hair = cfg.hair;
  const kit = female ? c.turq : c.red;
  const kitDark = female ? c.turqDeep : c.redDeep;
  const anim = mood === "celebrate" ? "coachCheer .6s ease infinite alternate"
    : mood === "flex" ? "coachFlex 1.6s ease-in-out infinite"
    : "coachBreathe 3s ease-in-out infinite";

  return (
    <svg viewBox="0 0 120 160" style={{ width: size, height: size * 1.33, animation: anim, transformOrigin: "50% 90%" }}>
      <ellipse cx="60" cy="153" rx="30" ry="5" fill="#00000022" />
      <rect x="48" y="104" width="10" height="42" rx="5" fill="#2A2730" />
      <rect x="62" y="104" width="10" height="42" rx="5" fill="#332F3A" />
      <rect x="45" y="143" width="16" height="7" rx="3.5" fill={c.text} />
      <rect x="59" y="143" width="16" height="7" rx="3.5" fill={c.text} />
      {female ? (
        <>
          <path d="M44 64 Q60 58 76 64 L74 106 Q60 111 46 106 Z" fill={kit} />
          <path d="M44 64 Q60 58 76 64 L75 76 Q60 81 45 76 Z" fill={kitDark} opacity=".55" />
          <path d="M60 62 L60 106" stroke={kitDark} strokeWidth="1" opacity=".4" />
        </>
      ) : (
        <>
          <path d="M42 64 Q60 57 78 64 L76 108 Q60 113 44 108 Z" fill={kit} />
          <path d="M42 64 Q60 57 78 64 L77 78 Q60 84 43 78 Z" fill={kitDark} opacity=".55" />
          <path d="M52 66 Q60 72 68 66" stroke={kitDark} strokeWidth="1.4" fill="none" opacity=".5" />
        </>
      )}
      {mood === "flex" || mood === "celebrate" ? (
        <>
          <path d="M44 68 Q30 58 32 42" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M76 68 Q90 58 88 42" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
          <circle cx="32" cy="40" r="6" fill={skin} /><circle cx="88" cy="40" r="6" fill={skin} />
          <ellipse cx="38" cy="60" rx="5" ry="7" fill={skin} transform="rotate(-30 38 60)" />
          <ellipse cx="82" cy="60" rx="5" ry="7" fill={skin} transform="rotate(30 82 60)" />
        </>
      ) : (
        <>
          <path d="M43 68 Q34 86 36 104" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M77 68 Q86 86 84 104" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
          <circle cx="36" cy="107" r="5.5" fill={skin} /><circle cx="84" cy="107" r="5.5" fill={skin} />
        </>
      )}
      <rect x="55" y="52" width="10" height="10" fill={skin} />
      <ellipse cx="60" cy="38" rx="17" ry="19" fill={skin} />
      {female ? (
        <>
          <path d="M43 36 Q42 16 60 15 Q78 16 77 36 Q74 24 60 24 Q46 24 43 36 Z" fill={hair} />
          <path d="M43 34 Q38 54 42 66 Q47 54 45 38 Z" fill={hair} />
          <path d="M77 34 Q82 54 78 66 Q73 54 75 38 Z" fill={hair} />
        </>
      ) : (
        <path d="M43 34 Q44 17 60 17 Q76 17 77 34 Q72 26 60 26 Q48 26 43 34 Z" fill={hair} />
      )}
      <circle cx="53" cy="38" r="2.2" fill="#151013" />
      <circle cx="67" cy="38" r="2.2" fill="#151013" />
      <circle cx="53.7" cy="37.3" r=".7" fill="#fff" />
      <circle cx="67.7" cy="37.3" r=".7" fill="#fff" />
      <path d={mood === "celebrate" ? "M52 46 Q60 54 68 46" : "M53 46 Q60 50 67 46"}
        stroke="#6B3524" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="46" cy="43" rx="3" ry="2" fill="#A85B48" opacity=".3" />
      <ellipse cx="74" cy="43" rx="3" ry="2" fill="#A85B48" opacity=".3" />
    </svg>
  );
}

/* ═══════════════════════ STEP SHELL ═══════════════════════ */
function StepShell({ c, n, total, title, sub, children, onNext, onBack, ok = true, label = "Continue" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: c.muted }}>
            <ArrowLeft size={18} />
          </button>
        )}
        <div style={{ flex: 1, height: 5, borderRadius: 999, background: c.bgEl2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(n / total) * 100}%`,
            background: `linear-gradient(90deg,${c.red},${c.turq})`, borderRadius: 999, transition: "width .4s" }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: c.muted }}>{n}/{total}</span>
      </div>
      <Disp c={c} size={28} style={{ marginBottom: 6 }}>{title}</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 18, lineHeight: 1.5 }}>{sub}</div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      <button disabled={!ok} onClick={onNext} style={{ ...btn(c, !ok), marginTop: 14 }}>
        {label} <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ═══════════════════════ ONBOARDING ═══════════════════════ */
const TOTAL_STEPS = 7;

function Onboarding({ c, onDone }) {
  const [step, setStep] = useState(0);
  const [quick, setQuick] = useState(false);
  const [f, setF] = useState({
    name: "", email: "", phone: "", age: "", gender: "", heightFt: "", heightIn: "", weight: "",
    goalBodies: [], goalWeight: "", event: "", eventDate: "", level: null,
    equipment: "", injuries: [], daysPerWeek: 3,
  });

  /* Quick path keeps only what shapes the plan: goals → level → equipment (+days) → injuries */
  const total = quick ? 4 : TOTAL_STEPS;
  const qn = { 3: 1, 5: 2, 6: 3, 7: 4 };
  const stepN = (n) => quick ? qn[n] : n;

  const up = useCallback((k, v) => setF(p => ({ ...p, [k]: v })), []);
  const toggleArr = useCallback((k, id) => setF(p => ({
    ...p, [k]: p[k].includes(id) ? p[k].filter(x => x !== id) : [...p[k], id],
  })), []);

  const ACT = [
    { level: 1, label: "I rarely move on purpose", sub: "Sedentary — we start small and win early." },
    { level: 2, label: "I work out sometimes", sub: "Inconsistent — let's make it stick." },
    { level: 3, label: "I train regularly", sub: "2–4× a week, solid base." },
    { level: 4, label: "I train like an athlete", sub: "5+× a week, performance-driven." },
  ];

  if (step === 0) return (
    <div style={{ padding: "28px 22px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ marginTop: 18 }}>
        <div style={{ marginBottom: 22 }}><Logo c={c} size={62} /></div>
        <Disp c={c} size={52} style={{ lineHeight: .92, marginBottom: 12 }}>ALL ABOUT<br />CONSISTENCY</Disp>
        <div style={{ fontFamily: "Inter", fontSize: 15, color: c.muted, lineHeight: 1.55, maxWidth: 300 }}>
          The body you want isn't built in a week of heroics. It's built in the days you almost skipped.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        <Coach gender="male" mood="flex" size={86} c={c} />
        <Coach gender="female" mood="flex" size={86} c={c} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => { setQuick(false); setStep(1); }} style={btn(c)}>
          Create Your Profile <ChevronRight size={18} />
        </button>
        <button onClick={() => { setQuick(true); setStep(3); }} style={{
          width: "100%", padding: "13px 20px", borderRadius: 14, cursor: "pointer",
          border: `1px solid ${c.border}`, background: "transparent", color: c.muted,
          fontFamily: "Inter", fontWeight: 800, fontSize: 13.5,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          Skip — Just Pick My Plan <Zap size={15} />
        </button>
        <div style={{ fontFamily: "Inter", fontSize: 10.5, color: c.muted, textAlign: "center" }}>
          You can add your info anytime later in Profile.
        </div>
      </div>
    </div>
  );

  const back = () => setStep(s => s - 1);
  const fmtPhone = v => {
    const d = v.replace(/\D/g, "").slice(0, 10);
    if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return d;
  };

  return (
    <div style={{ padding: "22px 20px", height: "100%", boxSizing: "border-box" }}>
      {step === 1 && (
        <StepShell c={c} n={1} total={TOTAL_STEPS} title="LET'S MEET YOU"
          sub="This is your profile. It shapes everything the app builds for you."
          ok={f.name.trim() && f.email.includes("@") && f.age && f.gender}
          onNext={() => setStep(2)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field c={c} label="First Name" value={f.name} placeholder="Jordan"
              onChange={e => up("name", e.target.value)} />
            <Field c={c} label="Email" value={f.email} placeholder="you@email.com" type="email"
              onChange={e => up("email", e.target.value)} />
            <Field c={c} label="Phone (optional)" value={f.phone} placeholder="(555) 123-4567" inputMode="tel"
              onChange={e => up("phone", fmtPhone(e.target.value))} />
            <Field c={c} label="Age" value={f.age} placeholder="28" inputMode="numeric"
              onChange={e => up("age", e.target.value.replace(/\D/g, "").slice(0, 3))} />
            <div>
              <Label c={c}>Choose Your Coach</Label>
              <div style={{ display: "flex", gap: 10 }}>
                {["male", "female"].map(g => {
                  const on = f.gender === g, tone = g === "female" ? "turq" : "red";
                  return (
                    <button key={g} onClick={() => up("gender", g)} style={{
                      ...optCard(c, on, tone), flex: 1, padding: "10px 8px",
                      display: "flex", flexDirection: "column", alignItems: "center",
                    }}>
                      <Coach gender={g} mood={on ? "flex" : "idle"} size={56} c={c} />
                      <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 800, color: c.text, marginTop: 4 }}>
                        {COACHES[g].name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell c={c} n={2} total={TOTAL_STEPS} title="YOUR NUMBERS"
          sub="Private, editable anytime, and used only to calibrate your plan."
          ok={f.heightFt && f.weight} onNext={() => setStep(3)} onBack={back}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <Label c={c}>Height</Label>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={f.heightFt} placeholder="ft" inputMode="numeric" style={inputSt(c)}
                  onChange={e => up("heightFt", e.target.value.replace(/\D/g, "").slice(0, 1))} />
                <input value={f.heightIn} placeholder="in" inputMode="numeric" style={inputSt(c)}
                  onChange={e => up("heightIn", e.target.value.replace(/\D/g, "").slice(0, 2))} />
              </div>
            </div>
            <Field c={c} label="Current Weight (lbs)" value={f.weight} placeholder="180" inputMode="numeric"
              onChange={e => up("weight", e.target.value.replace(/\D/g, "").slice(0, 3))} />
            <Field c={c} label="Goal Weight (lbs) — optional" value={f.goalWeight} placeholder="165" inputMode="numeric"
              onChange={e => up("goalWeight", e.target.value.replace(/\D/g, "").slice(0, 3))} />
            <div>
              <Label c={c}>Days per week you'll commit to</Label>
              <div style={{ display: "flex", gap: 7 }}>
                {[2, 3, 4, 5, 6].map(d => (
                  <button key={d} onClick={() => up("daysPerWeek", d)} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer",
                    border: `1.5px solid ${f.daysPerWeek === d ? c.turq : c.border}`,
                    background: f.daysPerWeek === d ? c.turq : c.bgEl,
                    color: f.daysPerWeek === d ? "#fff" : c.text,
                    fontFamily: "'Bebas Neue'", fontSize: 19,
                  }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell c={c} n={stepN(3)} total={total} title="PICTURE THE RESULT"
          sub="Pick every result that matters to you — most people want more than one."
          ok={f.goalBodies.length > 0} onNext={() => setStep(quick ? 5 : 4)}
          onBack={() => quick ? setStep(0) : back()}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GOAL_BODIES.map(g => {
              const on = f.goalBodies.includes(g.id);
              return (
                <button key={g.id} onClick={() => toggleArr("goalBodies", g.id)} style={optCard(c, on, "turq")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 25 }}>{g.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 14, color: c.text }}>{g.label}</div>
                      <div style={{ fontFamily: "Inter", fontSize: 12, color: c.muted, marginTop: 2 }}>{g.desc}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                      border: `1.5px solid ${on ? c.turq : c.border}`, background: on ? c.turq : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {on && <Check size={13} color="#fff" strokeWidth={3.5} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {f.goalBodies.length > 1 && (
            <div style={{ marginTop: 12, fontFamily: "Inter", fontSize: 12, color: c.turq, fontWeight: 700 }}>
              {f.goalBodies.length} goals selected — your plan will blend them.
            </div>
          )}
        </StepShell>
      )}

      {step === 4 && (
        <StepShell c={c} n={4} total={TOTAL_STEPS} title="WHAT'S THE DEADLINE?"
          sub="A date turns a wish into a plan. Pick one, even a loose one."
          ok={f.event} onNext={() => setStep(5)} onBack={back}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {EVENTS.map(e => <Chip key={e.id} c={c} tone="turq" active={f.event === e.id} onClick={() => up("event", e.id)}>{e.label}</Chip>)}
          </div>
          {f.event && f.event !== "none" && (
            <Field c={c} label="Date" type="date" value={f.eventDate} onChange={e => up("eventDate", e.target.value)} />
          )}
        </StepShell>
      )}

      {step === 5 && (
        <StepShell c={c} n={stepN(5)} total={total} title="WHERE ARE YOU NOW?"
          sub="No wrong answer. This just sets your starting line."
          ok={f.level} onNext={() => setStep(6)} onBack={() => quick ? setStep(3) : back()}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ACT.map(o => (
              <button key={o.level} onClick={() => up("level", o.level)} style={optCard(c, f.level === o.level)}>
                <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 14, color: c.text }}>{o.label}</div>
                <div style={{ fontFamily: "Inter", fontSize: 12, color: c.muted, marginTop: 2 }}>{o.sub}</div>
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === 6 && (
        <StepShell c={c} n={6} total={TOTAL_STEPS} title="WHAT DO YOU HAVE?"
          sub="Your plan adapts to your setup. Change it anytime."
          ok={f.equipment} onNext={() => setStep(7)} onBack={back}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {EQUIP.map(o => (
              <button key={o.id} onClick={() => up("equipment", o.id)} style={optCard(c, f.equipment === o.id)}>
                <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 14, color: c.text }}>{o.label}</div>
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === 7 && (
        <StepShell c={c} n={7} total={TOTAL_STEPS} title="ANYTHING TO PROTECT?"
          sub="Tap the muscles or joints giving you trouble. We'll swap any exercise that stresses them."
          label="Create Account" onNext={() => onDone(f)} onBack={back}>
          <AnatomyPicker c={c} selected={f.injuries} onToggle={(id) => toggleArr("injuries", id)} />
        </StepShell>
      )}
    </div>
  );
}

/* ═══════════════════════ EMAIL CONFIRMATION ═══════════════════════ */
function ConfirmEmail({ c, profile, onConfirm }) {
  const [sent, setSent] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const coach = COACHES[profile.gender === "female" ? "female" : "male"];

  return (
    <div style={{ padding: "24px 20px", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
        <Mail size={17} color={c.turq} />
        <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 700, color: c.muted }}>
          Sent to {profile.email}
        </span>
      </div>

      <div style={{
        background: "#FFFFFF", borderRadius: 16, overflow: "hidden",
        border: `1px solid ${c.border}`, boxShadow: "0 10px 34px rgba(0,0,0,.22)", marginBottom: 20,
      }}>
        <div style={{
          background: `linear-gradient(135deg,#0A090C 0%,#1A1620 60%,#0E2E2B 100%)`,
          padding: "26px 22px 22px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -30, width: 130, height: 130, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(46,217,195,.22),transparent 70%)",
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: 13, margin: "0 auto 12px",
            background: "linear-gradient(135deg,#F0202F,#2ED9C3)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Bebas Neue'", color: "#fff", fontSize: 18, letterSpacing: 1.2 }}>AAC</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#fff", letterSpacing: 1.5, lineHeight: 1 }}>
            ALL ABOUT CONSISTENCY
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 9.5, color: "#2ED9C3", fontWeight: 800,
            letterSpacing: 2.2, marginTop: 7 }}>
            ACCOUNT CONFIRMATION
          </div>
        </div>

        <div style={{ padding: "26px 24px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 27, color: "#141216", letterSpacing: .5, lineHeight: 1.05 }}>
            CONGRATULATIONS ON YOUR<br />FITNESS JOURNEY
          </div>
          <div style={{ width: 42, height: 3, borderRadius: 2, margin: "14px auto",
            background: "linear-gradient(90deg,#F0202F,#2ED9C3)" }} />
          <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4A464E", lineHeight: 1.65, marginBottom: 22 }}>
            {profile.name ? `${profile.name}, your` : "Your"} account is ready and {coach.name} is standing by.
            Confirm your email to unlock your plan, your streak, and everything you build from here.
          </div>

          <button onClick={() => { setConfirming(true); setTimeout(onConfirm, 900); }} disabled={confirming} style={{
            padding: "15px 30px", borderRadius: 12, border: "none", cursor: confirming ? "default" : "pointer",
            background: confirming ? "#8A8890" : "linear-gradient(135deg,#F0202F,#C4101C)",
            color: "#fff", fontFamily: "Inter", fontWeight: 800, fontSize: 14.5,
            boxShadow: confirming ? "none" : "0 6px 20px rgba(240,32,47,.34)",
            display: "inline-flex", alignItems: "center", gap: 9, transition: "all .2s",
          }}>
            {confirming ? "Confirming…" : <>Confirm My Email <MailCheck size={17} /></>}
          </button>

          <div style={{ fontFamily: "Inter", fontSize: 11, color: "#8A8690", marginTop: 20, lineHeight: 1.6 }}>
            This link expires in 24 hours.<br />
            Didn't create this account? You can safely ignore this email.
          </div>
        </div>

        <div style={{ background: "#F4F1EC", padding: "15px 22px", textAlign: "center", borderTop: "1px solid #E4DFD7" }}>
          <div style={{ fontFamily: "Inter", fontSize: 10, color: "#8A8690", lineHeight: 1.7 }}>
            All About Consistency · Dedication over comfort<br />
            Manage preferences · Unsubscribe · Privacy
          </div>
        </div>
      </div>

      <button onClick={() => setSent(true)} disabled={sent} style={{
        background: "none", border: "none", cursor: sent ? "default" : "pointer",
        fontFamily: "Inter", fontSize: 12.5, fontWeight: 700,
        color: sent ? c.turq : c.muted, padding: 8, marginTop: "auto",
      }}>
        {sent ? "Confirmation resent ✓" : "Didn't get it? Resend email"}
      </button>
    </div>
  );
}

/* ═══════════════════════ 1:1 SESSIONS (Instagram) ═══════════════════════ */
function SessionsScreen({ c, p }) {
  const level = LEVELS.find(l => l.id === p.level);
  const goals = GOAL_BODIES.filter(g => p.goalBodies?.includes(g.id));
  const equip = EQUIP.find(e => e.id === p.equipment);
  const evt = EVENTS.find(e => e.id === p.event);
  const dLeft = daysUntil(p.eventDate);

  const Row = ({ k, v }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
      <span style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, fontWeight: 600, flexShrink: 0 }}>{k}</span>
      <span style={{ fontFamily: "Inter", fontSize: 12.5, color: c.text, fontWeight: 700, textAlign: "right" }}>{v}</span>
    </div>
  );

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <Disp c={c} size={30} style={{ marginBottom: 4 }}>1:1 SESSIONS</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 18, lineHeight: 1.55 }}>
        The app handles the plan. For hands-on coaching, book an in-person session with the trainer.
      </div>

      {/* Hero */}
      <div style={{
        borderRadius: 20, padding: 22, marginBottom: 16, textAlign: "center", position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg,${c.redDeep} 0%,${c.red} 50%,${c.turqDeep} 120%)`,
        boxShadow: `0 10px 34px ${c.glow}`,
      }}>
        <div style={{
          position: "absolute", top: -50, right: -40, width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,255,255,.16),transparent 70%)",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 17, margin: "0 auto 14px",
            background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}>
            <Instagram size={27} color="#fff" />
          </div>
          <Disp c={c} size={28} style={{ color: "#fff", lineHeight: 1.05 }}>
            TRAIN WITH THE DOCTOR
          </Disp>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: "#FFE8EA", marginTop: 9, lineHeight: 1.6 }}>
            DM on Instagram to set up your personal, in-person session.
          </div>
        </div>
      </div>

      {/* The link */}
      <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{
        display: "flex", alignItems: "center", gap: 13, textDecoration: "none",
        padding: "16px 18px", borderRadius: 16, marginBottom: 16,
        background: c.red, boxShadow: `0 6px 22px ${c.glow}`,
      }}>
        <Instagram size={22} color="#fff" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 800, color: "#fff" }}>
            Message on Instagram
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 11.5, color: "#FFD9DC", marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {IG_HANDLE}
          </div>
        </div>
        <ExternalLink size={18} color="#fff" style={{ flexShrink: 0 }} />
      </a>

      {/* Screenshot-ready trainer card */}
      <div style={{
        borderRadius: 18, overflow: "hidden", marginBottom: 8,
        border: `1.5px solid ${c.turq}`, background: c.bgEl,
      }}>
        <div style={{
          background: `linear-gradient(135deg,${c.redDeep},${c.turqDeep})`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,.18)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Bebas Neue'", color: "#fff", fontSize: 13, letterSpacing: 1 }}>AAC</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: "#fff", letterSpacing: .8, lineHeight: 1 }}>
              TRAINER INTAKE CARD
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 9.5, color: "#EAFBF8", fontWeight: 700, letterSpacing: 1, marginTop: 3 }}>
              SCREENSHOT THIS · SEND IT IN THE DM
            </div>
          </div>
        </div>

        <div style={{ padding: "15px 16px", display: "flex", flexDirection: "column", gap: 9 }}>
          <Row k="Name" v={p.name || "—"} />
          <Row k="Age" v={p.age || "—"} />
          <Row k="Height" v={p.heightFt ? `${p.heightFt}'${p.heightIn || 0}"` : "—"} />
          <Row k="Current Weight" v={p.weight ? `${p.weight} lbs` : "—"} />
          <Row k="Goal Weight" v={p.goalWeight ? `${p.goalWeight} lbs` : "—"} />

          <div style={{ height: 1, background: c.border, margin: "3px 0" }} />

          <Row k="Training Level" v={`${level.name} (L${level.id})`} />
          <Row k="Days per Week" v={p.daysPerWeek} />
          <Row k="Equipment Access" v={equip ? equip.label : "—"} />
          <Row k="Sessions Logged" v={`${p.workouts} · ${p.streak}-day streak`} />

          <div style={{ height: 1, background: c.border, margin: "3px 0" }} />

          <div>
            <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, fontWeight: 600, marginBottom: 6 }}>Goals</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {goals.length ? goals.map(g => (
                <span key={g.id} style={{ background: c.turqDim, borderRadius: 7, padding: "4px 9px",
                  fontFamily: "Inter", fontSize: 11, fontWeight: 800, color: c.turq }}>
                  {g.emoji} {g.label}
                </span>
              )) : <span style={{ fontFamily: "Inter", fontSize: 12, color: c.muted }}>—</span>}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, fontWeight: 600, marginBottom: 6 }}>
              Areas to Protect
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.injuries.length ? p.injuries.map(id => (
                <span key={id} style={{ background: c.redDim, borderRadius: 7, padding: "4px 9px",
                  fontFamily: "Inter", fontSize: 11, fontWeight: 800, color: c.red }}>{regionLabel(id)}</span>
              )) : <span style={{ fontFamily: "Inter", fontSize: 12, color: c.muted }}>None flagged</span>}
            </div>
          </div>

          {evt && evt.id !== "none" && (
            <>
              <div style={{ height: 1, background: c.border, margin: "3px 0" }} />
              <Row k="Target Event" v={dLeft !== null ? `${evt.label} · ${dLeft} days out` : evt.label} />
            </>
          )}
        </div>
      </div>

      <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted, textAlign: "center",
        marginBottom: 16, lineHeight: 1.5 }}>
        Everything he needs to build your session, in one screenshot.
      </div>

      {/* How it works */}
      <Card c={c} style={{ marginBottom: 16 }}>
        <Label c={c}>How to book</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {[
            "Screenshot the intake card above.",
            "Tap the button to open Instagram.",
            "Send the screenshot as a DM and say you're an AAC app user.",
            "He'll confirm a time, location, and pricing directly in the DM.",
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8, flexShrink: 0, marginTop: 1,
                background: `linear-gradient(135deg,${c.red},${c.turq})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: "#fff",
              }}>{i + 1}</div>
              <span style={{ fontFamily: "Inter", fontSize: 13.5, color: c.text, lineHeight: 1.55 }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card c={c} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <MessageSquare size={17} color={c.turq} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 4 }}>
            Not sure what to say?
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 12.5, color: c.muted, lineHeight: 1.6 }}>
            "Hey — I'm using the AAC app and I'd like to book an in-person session. Sending my intake card
            below. What's your availability?"
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════ HOME ═══════════════════════ */
function HomeScreen({ c, p, water, cals, badges, quests, rewards, onTrain, onSessions, onRewards }) {
  const level = LEVELS.find(l => l.id === p.level);
  const xpIn = p.xp % 100;
  const done = p.lastDone === todayKey();
  const hyd = Math.min(water.oz / water.goal * 100, 100);
  const dayPct = Math.round(((done ? 1 : 0) + hyd / 100 + (cals.entries.length ? 1 : 0)) / 3 * 100);
  const goals = GOAL_BODIES.filter(g => p.goalBodies?.includes(g.id));
  const dLeft = daysUntil(p.eventDate);
  const evt = EVENTS.find(e => e.id === p.event);
  const qDone = quests.filter(q => q.done).length;
  const ring = 168, r = 74, circ = 2 * Math.PI * r;

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: c.muted, fontWeight: 700 }}>
            {p.name ? `Welcome back, ${p.name}` : "Welcome back"}
          </div>
          <Disp c={c} size={24}>{level.tagline}</Disp>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, background: c.turqDim, borderRadius: 10, padding: "5px 9px" }}>
            <Snowflake size={13} color={c.turq} />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: c.turq }}>{p.freezes}</span>
          </div>
          <div style={{ background: c.red, color: "#fff", borderRadius: 10, padding: "5px 10px",
            fontFamily: "'Bebas Neue'", fontSize: 17 }}>L{level.id}</div>
        </div>
      </div>

      <div style={{
        borderRadius: 20, padding: 18, marginBottom: 14, position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg,${c.redDeep} 0%,${c.red} 48%,${c.turqDeep} 118%)`,
        boxShadow: `0 10px 34px ${c.glow}`,
      }}>
        <div style={{ position: "absolute", right: -18, bottom: -14, opacity: .22 }}>
          <Coach gender={p.gender || "male"} mood="flex" size={120} c={c} />
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 900, letterSpacing: 1.6, color: "#FFD9DC" }}>
            YOU'RE BUILDING
          </div>
          <Disp c={c} size={goals.length > 1 ? 24 : 30} style={{ color: "#fff", margin: "5px 0 8px", lineHeight: 1.05 }}>
            {goals.length ? goals.map(g => g.label.toUpperCase()).join(" + ") : "YOUR BEST SELF"}
          </Disp>
          {dLeft !== null && evt && evt.id !== "none" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Calendar size={14} color="#CFF7F0" />
              <span style={{ fontFamily: "Inter", fontSize: 13, color: "#EAFBF8", fontWeight: 700 }}>
                {dLeft} days until your {evt.label.toLowerCase()}
              </span>
            </div>
          ) : (
            <span style={{ fontFamily: "Inter", fontSize: 13, color: "#EAFBF8", fontWeight: 600 }}>
              {p.workouts} sessions in. Keep stacking.
            </span>
          )}
          {p.goalWeight && p.weight && (
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 7, borderRadius: 999, background: "#ffffff30", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(p.workouts * 4, 100)}%`, background: "#fff", borderRadius: 999, transition: "width .6s" }} />
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 10, color: "#FFE4E6", marginTop: 5, fontWeight: 700 }}>
                {p.weight} lbs → {p.goalWeight} lbs target
              </div>
            </div>
          )}
        </div>
      </div>

      <Card c={c} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <div style={{ position: "relative", width: ring, height: ring, flexShrink: 0, marginLeft: -14 }}>
          <svg width={ring} height={ring} style={{ transform: "rotate(-90deg)" }}>
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={c.red} /><stop offset="100%" stopColor={c.turq} />
              </linearGradient>
            </defs>
            <circle cx={ring / 2} cy={ring / 2} r={r} stroke={c.bgEl2} strokeWidth={12} fill="none" />
            <circle cx={ring / 2} cy={ring / 2} r={r} stroke="url(#ringGrad)" strokeWidth={12} fill="none"
              strokeDasharray={circ} strokeDashoffset={circ - (dayPct / 100) * circ} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset .6s", filter: `drop-shadow(0 0 ${8 + p.streak}px ${c.glow})` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Flame size={24} color={c.red} fill={p.streak > 0 ? c.red : "transparent"}
              style={{ animation: p.streak > 0 ? "flicker 1.8s ease-in-out infinite" : "none" }} />
            <Disp c={c} size={34} style={{ marginTop: 3 }}>{p.streak}</Disp>
            <div style={{ fontFamily: "Inter", fontSize: 10, color: c.muted, fontWeight: 800, letterSpacing: .8 }}>DAY STREAK</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Label c={c}>Today</Label>
          <Disp c={c} size={22} style={{ marginBottom: 10 }}>{dayPct}% DONE</Disp>
          <Mini c={c} label="Workout" ok={done} />
          <Mini c={c} label="Hydration" ok={hyd >= 100} />
          <Mini c={c} label="Nutrition" ok={cals.entries.length > 0} />
        </div>
      </Card>

      <Card c={c} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Label c={c} style={{ marginBottom: 0 }}>Daily Quests</Label>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
            color: qDone === quests.length ? c.turq : c.muted }}>{qDone}/{quests.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {quests.map(q => (
            <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: q.done ? c.turq : c.bgEl2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {q.done ? <Check size={15} color="#fff" strokeWidth={3.5} /> : <q.icon size={14} color={c.muted} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 700,
                  color: q.done ? c.muted : c.text, textDecoration: q.done ? "line-through" : "none" }}>{q.label}</div>
                <div style={{ height: 5, borderRadius: 999, background: c.bgEl2, marginTop: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${q.pct}%`, background: q.done ? c.turq : c.red, transition: "width .5s" }} />
                </div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: c.gold, fontWeight: 700 }}>+{q.xp}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card c={c} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <Label c={c} style={{ marginBottom: 0 }}>Rank Progress</Label>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: c.muted }}>{p.xp} XP</span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: c.bgEl2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${xpIn}%`, background: `linear-gradient(90deg,${c.red},${c.turq})`, transition: "width .6s" }} />
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted, marginTop: 6 }}>{100 - xpIn} XP to next rank</div>
      </Card>

      <button onClick={onTrain} style={{
        width: "100%", padding: "16px 18px", borderRadius: 16, border: "none",
        background: done ? c.bgEl2 : c.red, color: done ? c.text : "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14,
        boxShadow: done ? "none" : `0 6px 22px ${c.glow}`,
      }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "Inter", fontSize: 11, opacity: .85, fontWeight: 800, letterSpacing: 1 }}>
            {done ? "COMPLETED TODAY" : "TODAY'S SESSION"}
          </div>
          <Disp c={c} size={21} style={{ color: done ? c.text : "#fff", marginTop: 2 }}>
            {done ? "Handled. See you tomorrow." : `${level.name} Workout`}
          </Disp>
        </div>
        {done ? <Check size={22} /> : <ChevronRight size={22} />}
      </button>

      <button onClick={onSessions} style={{
        width: "100%", padding: 14, borderRadius: 16, cursor: "pointer",
        border: `1px solid ${c.border}`, background: c.bgEl,
        display: "flex", alignItems: "center", gap: 12, marginBottom: 18, textAlign: "left",
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: `linear-gradient(135deg,${c.red},${c.turq})`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Instagram size={18} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 800, color: c.text }}>Book a 1:1 session</div>
          <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted }}>DM the trainer on Instagram</div>
        </div>
        <ChevronRight size={18} color={c.muted} />
      </button>

      <button onClick={onRewards} style={{
        width: "100%", padding: 14, borderRadius: 16, cursor: "pointer",
        border: `1px solid ${rewards.on ? c.gold : c.border}`, background: c.bgEl,
        display: "flex", alignItems: "center", gap: 12, marginBottom: 18, textAlign: "left",
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: rewards.on ? c.gold : c.bgEl2,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Gift size={18} color={rewards.on ? "#1A1408" : c.muted} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 800, color: c.text }}>My Rewards</div>
          <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted }}>
            {rewards.on
              ? `${rewards.list.length} treat${rewards.list.length === 1 ? "" : "s"} on the line — keep the streak alive`
              : "Treat yourself for showing up · optional"}
          </div>
        </div>
        <ChevronRight size={18} color={c.muted} />
      </button>

      <Label c={c}>Achievements</Label>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
        {badges.map(b => (
          <div key={b.id} style={{ minWidth: 74, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: b.on ? 1 : .32 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15,
              background: b.on ? `linear-gradient(135deg,${c.red},${c.turq})` : c.bgEl2,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: b.on ? `0 4px 16px ${c.glow}` : "none" }}>
              {b.on ? <Medal size={23} color="#fff" /> : <Lock size={17} color={c.muted} />}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 9.5, color: c.muted, textAlign: "center", fontWeight: 700 }}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Mini = ({ c, label, ok }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
    <div style={{ width: 16, height: 16, borderRadius: 5, border: `1.5px solid ${ok ? c.turq : c.border}`,
      background: ok ? c.turq : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {ok && <Check size={11} color="#fff" strokeWidth={3.5} />}
    </div>
    <span style={{ fontFamily: "Inter", fontSize: 12, color: ok ? c.text : c.muted, fontWeight: 600 }}>{label}</span>
  </div>
);

/* ═══════════════════════ TRAIN ═══════════════════════ */
function TrainScreen({ c, p, setP, toast, celebrate, custom, setCustom }) {
  const [checked, setChecked] = useState([]);
  const [coreChecked, setCoreChecked] = useState([]);
  const [editing, setEditing] = useState(false);
  const [openDemo, setOpenDemo] = useState(null);
  const [openCoreDemo, setOpenCoreDemo] = useState(null);
  const [showBody, setShowBody] = useState(false);
  const done = p.lastDone === todayKey();

  const coreKey = `core-${p.level}`;
  const coreList = custom[coreKey] || CORE_FINISHERS[p.level];
  const isCoreCustom = !!custom[coreKey];
  const [editingCore, setEditingCore] = useState(false);
  const coreDone = coreChecked.length === coreList.length;

  const writeCore = (next) => { setCustom(cs => ({ ...cs, [coreKey]: next })); setCoreChecked([]); };
  const editCoreRow = (i, patch) => writeCore(coreList.map((r, n) => n === i ? { ...r, ...patch } : r));
  const removeCoreRow = (i) => { if (coreList.length > 1) writeCore(coreList.filter((_, n) => n !== i)); };
  const addCoreRow = () => writeCore([...coreList, { slot: "Core Finisher", name: "Plank", sets: "2 × 30s" }]);
  const resetCore = () => {
    setCustom(cs => { const n = { ...cs }; delete n[coreKey]; return n; });
    setCoreChecked([]);
    toast("Core finisher reset to your plan");
  };

  // New level = new session: clear today's checkmarks
  useEffect(() => { setChecked([]); setCoreChecked([]); setOpenDemo(null); setOpenCoreDemo(null); setEditingCore(false); }, [p.level]);

  const generated = WORKOUTS[p.level].map(s => {
    let name = s.base[p.equipment] || s.base.none, mod = false;
    for (const i of p.injuries) if (s.alt?.[i]) { name = s.alt[i]; mod = true; }
    return { slot: s.slot, sets: s.sets, name, mod };
  });
  const key = `${p.level}`;
  const session = custom[key] || generated;
  const isCustom = !!custom[key];

  const writeSession = (next) => setCustom(cs => ({ ...cs, [key]: next }));
  const editRow = (i, patch) => writeSession(session.map((r, n) => n === i ? { ...r, ...patch, mod: false } : r));
  const removeRow = (i) => writeSession(session.filter((_, n) => n !== i));
  const addRow = () => writeSession([...session, { slot: "Custom", sets: "3 × 10", name: "New Exercise", mod: false }]);
  const resetSession = () => { setCustom(cs => { const n = { ...cs }; delete n[key]; return n; }); toast("Workout reset to your plan"); };

  const complete = () => {
    if (done || !coreDone) return;
    setP(prev => {
      const cont = prev.lastDone === yesterdayKey();
      const st = cont ? prev.streak + 1 : 1;
      const lvl = LEVELS.find(l => l.id === prev.level);
      return { ...prev, xp: prev.xp + lvl.xp + Math.min(st * 2, 24), streak: st,
        best: Math.max(prev.best, st), lastDone: todayKey(), workouts: prev.workouts + 1 };
    });
    celebrate();
    toast(`+${LEVELS.find(l => l.id === p.level).xp} XP — Session locked in 🔥`);
  };

  const toggleRegion = (id) => setP(x => ({
    ...x, injuries: x.injuries.includes(id) ? x.injuries.filter(y => y !== id) : [...x.injuries, id],
  }));

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <Disp c={c} size={30} style={{ marginBottom: 4 }}>TRAIN</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 18 }}>
        Built around your gear, your level, and what you're protecting.
      </div>

      <Label c={c}>Level</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {LEVELS.map(l => <Chip key={l.id} c={c} active={p.level === l.id} onClick={() => setP(x => ({ ...x, level: l.id }))}>{l.name}</Chip>)}
      </div>
      <Label c={c}>Equipment</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {EQUIP.map(e => <Chip key={e.id} c={c} tone="turq" active={p.equipment === e.id} onClick={() => setP(x => ({ ...x, equipment: e.id }))}>{e.label}</Chip>)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Label c={c} style={{ marginBottom: 0 }}>Protecting</Label>
        <button onClick={() => setShowBody(s => !s)} style={{
          background: "none", border: "none", cursor: "pointer", color: c.turq,
          fontFamily: "Inter", fontSize: 11.5, fontWeight: 800, padding: 0,
        }}>{showBody ? "Hide diagram" : "Open diagram"}</button>
      </div>

      {showBody ? (
        <Card c={c} style={{ marginBottom: 14 }}>
          <AnatomyPicker c={c} selected={p.injuries} onToggle={toggleRegion} />
        </Card>
      ) : (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
          {p.injuries.length === 0 ? (
            <span style={{ fontFamily: "Inter", fontSize: 12.5, color: c.muted }}>Nothing flagged.</span>
          ) : p.injuries.map(id => (
            <span key={id} style={{ background: c.redDim, borderRadius: 999, padding: "6px 11px",
              fontFamily: "Inter", fontSize: 11.5, fontWeight: 800, color: c.red }}>{regionLabel(id)}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 6 }}>
        <Label c={c} style={{ marginBottom: 0 }}>Today's Session</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isCustom && (
            <button onClick={resetSession} style={{ background: "none", border: "none", cursor: "pointer",
              color: c.muted, display: "flex", alignItems: "center", gap: 4, padding: 0,
              fontFamily: "Inter", fontSize: 11.5, fontWeight: 700 }}>
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <button onClick={() => { if (!isCustom) writeSession(generated); setEditing(e => !e); }} style={{
            background: "none", border: "none", cursor: "pointer", color: editing ? c.turq : c.muted,
            display: "flex", alignItems: "center", gap: 4, padding: 0,
            fontFamily: "Inter", fontSize: 11.5, fontWeight: 800,
          }}>
            <Pencil size={12} /> {editing ? "Done" : "Customize"}
          </button>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
            color: checked.length === session.length ? c.turq : c.muted }}>{checked.length}/{session.length}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
        {session.map((e, i) => {
          const on = checked.includes(i);
          if (editing) return (
            <Card key={i} c={c} style={{ padding: 13 }}>
              <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 9 }}>
                <input value={e.slot} onChange={ev => editRow(i, { slot: ev.target.value })}
                  style={inputSt(c, { flex: 1, minWidth: 0, padding: "9px 11px", fontSize: 12, fontWeight: 700 })} />
                <input value={e.sets} onChange={ev => editRow(i, { sets: ev.target.value })}
                  style={inputSt(c, { width: 82, flex: "none", padding: "9px 11px", fontSize: 12 })} />
                <button onClick={() => removeRow(i)} style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0, cursor: "pointer",
                  border: `1px solid ${c.border}`, background: "transparent", color: c.red,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><Trash2 size={15} /></button>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 800, letterSpacing: .8,
                color: c.muted, marginBottom: 5 }}>SWAP FOR</div>
              <select
                value={subOptionsFor(e.slot).includes(e.name) ? e.name : ""}
                onChange={ev => { if (ev.target.value) editRow(i, { name: ev.target.value }); }}
                style={{ ...inputSt(c, { marginBottom: 9, fontWeight: 700, cursor: "pointer" }), appearance: "auto" }}>
                <option value="">— choose a workout —</option>
                {subOptionsFor(e.slot).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 800, letterSpacing: .8,
                color: c.muted, marginBottom: 5 }}>OR TYPE YOUR OWN</div>
              <input value={e.name} onChange={ev => editRow(i, { name: ev.target.value })}
                style={inputSt(c, { fontWeight: 700 })} />
            </Card>
          );
          return (
            <div key={i} style={{
              background: on ? c.turqDim : c.bgEl, border: `1px solid ${on ? c.turq : c.border}`,
              borderRadius: 16, padding: 13, transition: "all .18s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <button onClick={() => setChecked(pv => pv.includes(i) ? pv.filter(x => x !== i) : [...pv, i])} style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, cursor: "pointer", padding: 0,
                  border: `1.5px solid ${on ? c.turq : c.border}`, background: on ? c.turq : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{on && <Check size={15} color="#fff" strokeWidth={3.5} />}</button>

                <button onClick={() => setOpenDemo(openDemo === i ? null : i)} style={{
                  width: 52, height: 58, borderRadius: 11, flexShrink: 0, cursor: "pointer", padding: 0,
                  border: `1px solid ${c.border}`, background: c.bgEl2, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ExerciseDemo c={c} name={e.name} size={44} />
                </button>

                <button onClick={() => setOpenDemo(openDemo === i ? null : i)} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, minWidth: 0,
                }}>
                  <div style={{ fontFamily: "Inter", fontSize: 10, color: c.muted, fontWeight: 800, letterSpacing: .8 }}>
                    {e.slot.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 800, color: c.text, marginTop: 2 }}>{e.name}</div>
                  {e.mod && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5,
                      background: c.bgEl2, borderRadius: 7, padding: "3px 7px" }}>
                      <ShieldAlert size={11} color={c.red} />
                      <span style={{ fontFamily: "Inter", fontSize: 9.5, color: c.red, fontWeight: 800 }}>MODIFIED FOR YOU</span>
                    </span>
                  )}
                </button>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, color: c.red, fontWeight: 700, flexShrink: 0 }}>{e.sets}</span>
              </div>

              {openDemo === i && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}`,
                  display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ background: c.bgEl2, borderRadius: 13, padding: 6 }}>
                    <ExerciseDemo c={c} name={e.name} size={92} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 800, letterSpacing: 1,
                      color: c.turq, marginBottom: 5 }}>MOVEMENT DEMO</div>
                    <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, lineHeight: 1.55 }}>
                      {explainFor(e.name)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <button onClick={addRow} style={{
          width: "100%", padding: "13px 16px", borderRadius: 14, marginBottom: 14, cursor: "pointer",
          border: `1.5px dashed ${c.border}`, background: "transparent", color: c.muted,
          fontFamily: "Inter", fontSize: 13, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}><Plus size={16} /> Add Exercise</button>
      )}

      {/* ═══ CORE FINISHER — its own thing, required to complete ═══ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Label c={c} style={{ marginBottom: 0 }}>Core Finisher</Label>
          <span style={{ background: c.red, color: "#fff", borderRadius: 6, padding: "3px 8px",
            fontFamily: "Inter", fontSize: 9, fontWeight: 900, letterSpacing: 1 }}>REQUIRED</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isCoreCustom && (
            <button onClick={resetCore} style={{ background: "none", border: "none", cursor: "pointer",
              color: c.muted, display: "flex", alignItems: "center", gap: 4, padding: 0,
              fontFamily: "Inter", fontSize: 11.5, fontWeight: 700 }}>
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <button onClick={() => { if (!isCoreCustom) writeCore(coreList); setEditingCore(e2 => !e2); }} style={{
            background: "none", border: "none", cursor: "pointer", color: editingCore ? c.turq : c.muted,
            display: "flex", alignItems: "center", gap: 4, padding: 0,
            fontFamily: "Inter", fontSize: 11.5, fontWeight: 800,
          }}>
            <Pencil size={12} /> {editingCore ? "Done" : "Customize"}
          </button>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
            color: coreDone ? c.turq : c.red }}>{coreChecked.length}/{coreList.length}</span>
        </div>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: c.muted, marginBottom: 10, lineHeight: 1.5 }}>
        Every session ends here. Core holds everything else together — finish it to log the workout.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
        {coreList.map((e, i) => {
          const on = coreChecked.includes(i);
          if (editingCore) return (
            <Card key={i} c={c} style={{ padding: 13, borderLeft: `3px solid ${c.red}` }}>
              <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 9 }}>
                <div style={{ flex: 1, fontFamily: "Inter", fontSize: 10, color: c.red, fontWeight: 800, letterSpacing: .8 }}>
                  CORE FINISHER
                </div>
                <input value={e.sets} onChange={ev => editCoreRow(i, { sets: ev.target.value })}
                  style={inputSt(c, { width: 92, flex: "none", padding: "9px 11px", fontSize: 12 })} />
                <button onClick={() => removeCoreRow(i)} disabled={coreList.length === 1} style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  cursor: coreList.length === 1 ? "not-allowed" : "pointer",
                  border: `1px solid ${c.border}`, background: "transparent",
                  color: coreList.length === 1 ? c.muted : c.red, opacity: coreList.length === 1 ? .45 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><Trash2 size={15} /></button>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 800, letterSpacing: .8,
                color: c.muted, marginBottom: 5 }}>SWAP FOR</div>
              <select
                value={CORE_SWAP_OPTIONS.includes(e.name) ? e.name : ""}
                onChange={ev => { if (ev.target.value) editCoreRow(i, { name: ev.target.value }); }}
                style={{ ...inputSt(c, { marginBottom: 9, fontWeight: 700, cursor: "pointer" }), appearance: "auto" }}>
                <option value="">— choose a core workout —</option>
                {CORE_SWAP_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 800, letterSpacing: .8,
                color: c.muted, marginBottom: 5 }}>OR TYPE YOUR OWN</div>
              <input value={e.name} onChange={ev => editCoreRow(i, { name: ev.target.value })}
                style={inputSt(c, { fontWeight: 700 })} />
            </Card>
          );
          return (
            <div key={i} style={{
              background: on ? c.redDim : c.bgEl,
              border: `1px solid ${on ? c.red : c.border}`,
              borderLeft: `3px solid ${c.red}`,
              borderRadius: 16, padding: 13, transition: "all .18s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <button onClick={() => setCoreChecked(pv => pv.includes(i) ? pv.filter(x => x !== i) : [...pv, i])} style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, cursor: "pointer", padding: 0,
                  border: `1.5px solid ${on ? c.red : c.border}`, background: on ? c.red : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{on && <Check size={15} color="#fff" strokeWidth={3.5} />}</button>

                <button onClick={() => setOpenCoreDemo(openCoreDemo === i ? null : i)} style={{
                  width: 52, height: 58, borderRadius: 11, flexShrink: 0, cursor: "pointer", padding: 0,
                  border: `1px solid ${c.border}`, background: c.bgEl2, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ExerciseDemo c={c} name={e.name} size={44} />
                </button>

                <button onClick={() => setOpenCoreDemo(openCoreDemo === i ? null : i)} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, minWidth: 0,
                }}>
                  <div style={{ fontFamily: "Inter", fontSize: 10, color: c.red, fontWeight: 800, letterSpacing: .8 }}>
                    CORE FINISHER
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 800, color: c.text, marginTop: 2 }}>{e.name}</div>
                </button>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, color: c.red, fontWeight: 700, flexShrink: 0 }}>{e.sets}</span>
              </div>

              {openCoreDemo === i && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}`,
                  display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ background: c.bgEl2, borderRadius: 13, padding: 6 }}>
                    <ExerciseDemo c={c} name={e.name} size={92} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 800, letterSpacing: 1,
                      color: c.turq, marginBottom: 5 }}>MOVEMENT DEMO</div>
                    <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, lineHeight: 1.55 }}>
                      {explainFor(e.name)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingCore && (
        <button onClick={addCoreRow} style={{
          width: "100%", padding: "13px 16px", borderRadius: 14, marginBottom: 14, cursor: "pointer",
          border: `1.5px dashed ${c.red}`, background: "transparent", color: c.red,
          fontFamily: "Inter", fontSize: 13, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}><Plus size={16} /> Add Core Exercise</button>
      )}

      <button onClick={complete} disabled={done || !coreDone} style={btn(c, done || !coreDone)}>
        {done ? <>Completed Today <Check size={18} /></>
          : !coreDone ? <>Finish Your Core to Complete <ShieldAlert size={18} /></>
          : <>Complete Workout <Zap size={18} /></>}
      </button>
    </div>
  );
}

/* ═══════════════════════ TRACK ═══════════════════════ */
function TrackScreen({ c, water, setWater, cals, setCals, toast }) {
  const [fn, setFn] = useState(""); const [fc, setFc] = useState("");
  const hyd = Math.min(water.oz / water.goal * 100, 100);
  const total = cals.entries.reduce((s, e) => s + e.cal, 0);
  const calPct = Math.min(total / cals.goal * 100, 100);

  const addW = (oz) => setWater(w => {
    const next = Math.max(0, w.oz + oz);
    if (oz > 0 && w.oz < w.goal && next >= w.goal) toast("Hydration goal hit 💧 +15 XP");
    return { ...w, oz: next };
  });

  const addFood = () => {
    if (!fn.trim() || !fc) return;
    setCals(c2 => ({ ...c2, entries: [...c2.entries, { id: Date.now(), name: fn, cal: +fc }] }));
    setFn(""); setFc("");
  };

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <Disp c={c} size={30} style={{ marginBottom: 18 }}>TRACK</Disp>

      <Card c={c} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Droplet size={16} color={c.turq} /><Label c={c} style={{ marginBottom: 0 }}>Hydration Station</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
            <svg width={90} height={90} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={45} cy={45} r={38} stroke={c.bgEl2} strokeWidth={10} fill="none" />
              <circle cx={45} cy={45} r={38} stroke={c.turq} strokeWidth={10} fill="none"
                strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - hyd / 100)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset .45s",
                  filter: hyd >= 100 ? `drop-shadow(0 0 8px ${c.turqGlow})` : "none" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: c.text }}>{Math.round(hyd)}%</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: c.text, fontWeight: 800 }}>{water.oz} / {water.goal} oz</div>
            <div style={{ display: "flex", gap: 7, marginTop: 11, flexWrap: "wrap" }}>
              {[8, 16, 24].map(oz => (
                <button key={oz} onClick={() => addW(oz)} style={{
                  padding: "8px 11px", borderRadius: 9, border: "none", background: c.turqDim, color: c.turq,
                  fontFamily: "Inter", fontSize: 12, fontWeight: 800, cursor: "pointer",
                }}>+{oz}oz</button>
              ))}
              <button onClick={() => addW(-8)} style={{
                padding: "8px 10px", borderRadius: 9, border: `1px solid ${c.border}`, background: "transparent",
                color: c.muted, cursor: "pointer", display: "flex", alignItems: "center",
              }}><Minus size={13} /></button>
            </div>
          </div>
        </div>
      </Card>

      <Card c={c}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <UtensilsCrossed size={16} color={c.red} /><Label c={c} style={{ marginBottom: 0 }}>Calorie Counter</Label>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: c.bgEl2, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${calPct}%`, background: `linear-gradient(90deg,${c.red},${c.turq})`, transition: "width .45s" }} />
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: c.muted, marginBottom: 14 }}>{total} / {cals.goal} cal</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={fn} onChange={e => setFn(e.target.value)} placeholder="Food" style={inputSt(c, { flex: 1, minWidth: 0 })} />
          <input value={fc} onChange={e => setFc(e.target.value.replace(/\D/g, ""))} placeholder="Cal" inputMode="numeric" style={inputSt(c, { width: 68, flex: "none" })} />
          <button onClick={addFood} style={{ width: 46, borderRadius: 12, border: "none", background: c.red, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Plus size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {!cals.entries.length && <div style={{ fontFamily: "Inter", fontSize: 12, color: c.muted }}>Nothing logged yet today.</div>}
          {cals.entries.map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Inter", fontSize: 13, color: c.text }}>{e.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: c.muted }}>{e.cal} cal</span>
                <button onClick={() => setCals(c2 => ({ ...c2, entries: c2.entries.filter(x => x.id !== e.id) }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: c.muted, padding: 0 }}><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════ MEALS ═══════════════════════ */
function MealsScreen({ c, tier, onUpgrade, onLog }) {
  const [filters, setFilters] = useState([]);
  const [open, setOpen] = useState(null);
  const locked = tier === "free";
  const list = RECIPES.filter(r => filters.every(f => r.tags.includes(f)));

  if (open) {
    const r = open;
    return (
      <div style={{ padding: "0 0 100px" }}>
        <div style={{ height: 190, position: "relative" }}>
          {FoodArt[r.art]}
          <button onClick={() => setOpen(null)} style={{
            position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: "50%",
            border: "none", background: "#00000070", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
          }}><ArrowLeft size={17} /></button>
        </div>
        <div style={{ padding: "18px 18px 0" }}>
          <Disp c={c} size={28} style={{ marginBottom: 8 }}>{r.name.toUpperCase()}</Disp>
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            {[["Calories", r.cal], ["Protein", r.p + "g"], ["Prep", r.prep]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 700, color: c.turq }}>{v}</div>
                <div style={{ fontFamily: "Inter", fontSize: 10, color: c.muted, fontWeight: 700 }}>{k}</div>
              </div>
            ))}
          </div>
          <Label c={c}>Ingredients</Label>
          <div style={{ marginBottom: 20 }}>
            {r.ing.map((i, n) => (
              <div key={n} style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.turq }} />
                <span style={{ fontFamily: "Inter", fontSize: 13.5, color: c.text }}>{i}</span>
              </div>
            ))}
          </div>
          <Label c={c}>Method</Label>
          <div style={{ marginBottom: 20 }}>
            {r.steps.map((s, n) => (
              <div key={n} style={{ display: "flex", gap: 11, marginBottom: 11 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: c.redDim, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: c.red }}>{n + 1}</div>
                <span style={{ fontFamily: "Inter", fontSize: 13.5, color: c.text, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { onLog(r); setOpen(null); }} style={btn(c, false, "turq")}>
            Log This Meal <Plus size={17} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <Disp c={c} size={30} style={{ marginBottom: 4 }}>MEALS</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 16 }}>Real food. Minimal effort. No sad chicken.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {RECIPE_FILTERS.map(f => (
          <Chip key={f.id} c={c} tone="turq" active={filters.includes(f.id)}
            onClick={() => setFilters(x => x.includes(f.id) ? x.filter(y => y !== f.id) : [...x, f.id])}>{f.label}</Chip>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {list.map(r => (
          <button key={r.id} onClick={() => setOpen(r)} style={{
            background: c.bgEl, border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden",
            cursor: "pointer", padding: 0, textAlign: "left",
          }}>
            <div style={{ height: 86 }}>{FoodArt[r.art]}</div>
            <div style={{ padding: 11 }}>
              <div style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 800, color: c.text, lineHeight: 1.3 }}>{r.name}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, color: c.turq, fontWeight: 700 }}>{r.cal} cal</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, color: c.muted }}>{r.p}g P</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Card c={c} style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Label c={c} style={{ marginBottom: 0 }}>Weekly Meal Prep Plan</Label>
          {locked && <Crown size={14} color={c.gold} />}
        </div>
        <div style={{ filter: locked ? "blur(5px)" : "none", pointerEvents: locked ? "none" : "auto" }}>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: c.text, lineHeight: 1.85 }}>
            <strong>Sunday:</strong> Grill 6 chicken breasts, jar 4 overnight oats, chop veg for Mon–Wed.<br />
            <strong>Wednesday:</strong> Refresh greens, portion 3 yogurt bowls, cook rice batch.<br />
            <strong>List:</strong> oats, Greek yogurt, chicken, salmon, greens, asparagus, berries, rice.
          </div>
        </div>
        {locked && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button onClick={onUpgrade} style={{
              padding: "11px 18px", borderRadius: 12, border: "none", background: c.red, color: "#fff",
              fontFamily: "Inter", fontWeight: 800, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7, boxShadow: `0 6px 22px ${c.glow}`,
            }}><Crown size={14} /> Unlock with Premium</button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════ CHECKOUT ═══════════════════════ */
function Checkout({ c, plan, email, onBack, onSuccess }) {
  const [card, setCard] = useState({ email: email || "", number: "", exp: "", cvc: "", name: "", zip: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const up = (k, v) => setCard(p => ({ ...p, [k]: v }));
  const fmtNum = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  const valid = card.email.includes("@") && card.number.replace(/\s/g, "").length === 16
    && card.exp.length === 5 && card.cvc.length >= 3 && card.name.trim() && card.zip.length >= 5;

  const pay = async () => {
    setErr(""); setBusy(true);
    try { await processPayment({ plan, card }); onSuccess(plan); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer",
        color: c.muted, display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={17} /><span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>Back</span>
      </button>
      <Disp c={c} size={30} style={{ marginBottom: 4 }}>CHECKOUT</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 18 }}>
        {plan.name} — {plan.price}. Cancel anytime.
      </div>

      <Card c={c} style={{ marginBottom: 14, background: c.turqDim, border: `1px solid ${c.turq}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 800, color: c.text }}>{plan.name}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, marginTop: 3 }}>7-day free trial, then billed monthly</div>
          </div>
          <Disp c={c} size={26} style={{ color: c.turq }}>{plan.price}</Disp>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <Field c={c} label="Email" value={card.email} placeholder="you@email.com" onChange={e => up("email", e.target.value)} />
        <Field c={c} label="Card Number" value={card.number} placeholder="4242 4242 4242 4242" inputMode="numeric"
          onChange={e => up("number", fmtNum(e.target.value))} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Field c={c} label="Expiry" value={card.exp} placeholder="MM/YY" inputMode="numeric" onChange={e => up("exp", fmtExp(e.target.value))} />
          </div>
          <div style={{ flex: 1 }}>
            <Field c={c} label="CVC" value={card.cvc} placeholder="123" inputMode="numeric"
              onChange={e => up("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} />
          </div>
        </div>
        <Field c={c} label="Name on Card" value={card.name} placeholder="Jordan Reyes" onChange={e => up("name", e.target.value)} />
        <Field c={c} label="ZIP" value={card.zip} placeholder="90210" inputMode="numeric"
          onChange={e => up("zip", e.target.value.replace(/\D/g, "").slice(0, 5))} />
      </div>

      {err && (
        <div style={{ background: c.redDim, border: `1px solid ${c.red}`, borderRadius: 12, padding: 12, marginBottom: 14,
          fontFamily: "Inter", fontSize: 12.5, color: c.red, fontWeight: 600 }}>{err}</div>
      )}

      <button onClick={pay} disabled={!valid || busy} style={btn(c, !valid || busy)}>
        {busy ? "Processing…" : <>Start Free Trial <Shield size={17} /></>}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, justifyContent: "center" }}>
        <Lock size={12} color={c.muted} />
        <span style={{ fontFamily: "Inter", fontSize: 11, color: c.muted }}>
          {PAYMENT_CONFIG.liveMode ? "Secured by Stripe" : "Demo mode — no card is charged"}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════ REWARDS (optional, toggle anytime) ═══════════════════════ */
const REWARD_PRESETS = [
  { days: 3, treat: "Sweet treat this weekend" },
  { days: 7, treat: "Movie night, my pick" },
  { days: 14, treat: "New workout gear" },
];

function RewardsScreen({ c, p, rewards, setRewards, onBack, onClaim, toast }) {
  const streak = p.streak;
  const [days, setDays] = useState(3);
  const [treat, setTreat] = useState("");

  const progOf = (r) => {
    const effBase = r.base <= streak ? r.base : 0; // streak reset heals the baseline
    return Math.max(0, Math.min(streak - effBase, r.days));
  };
  const eligible = (r) => progOf(r) >= r.days;

  const addReward = (d, t) => {
    if (!t.trim()) return;
    setRewards(rw => ({ ...rw, list: [...rw.list, {
      id: Date.now() + Math.random(), days: d, treat: t.trim(), base: streak, earned: 0,
    }] }));
    setTreat("");
    toast("Reward added — now go earn it 🎁");
  };

  const claim = (r) => {
    setRewards(rw => ({ ...rw, list: rw.list.map(x =>
      x.id === r.id ? { ...x, earned: x.earned + 1, base: streak } : x) }));
    onClaim(r);
  };

  const remove = (id) => setRewards(rw => ({ ...rw, list: rw.list.filter(x => x.id !== id) }));
  const totalEarned = rewards.list.reduce((s, r) => s + r.earned, 0);

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <Disp c={c} size={30} style={{ marginBottom: 4 }}>MY REWARDS</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 18, lineHeight: 1.55 }}>
        Pick a treat, pick the streak that earns it. Totally optional — turn it on or off whenever you want.
      </div>

      {!rewards.on ? (
        <Card c={c} style={{ textAlign: "center", padding: 26 }}>
          <div style={{ width: 58, height: 58, borderRadius: 17, margin: "0 auto 14px",
            background: c.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gift size={27} color="#1A1408" />
          </div>
          <Disp c={c} size={24} style={{ marginBottom: 8 }}>EARN YOUR TREATS</Disp>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, lineHeight: 1.6, marginBottom: 18 }}>
            3 days of consistency = a sweet treat this weekend. 7 days = movie night.
            You set the deal, the streak keeps the score, and cashing in feels earned.
          </div>
          <button onClick={() => setRewards(rw => ({ ...rw, on: true }))} style={btn(c)}>
            Turn On Rewards <Gift size={17} />
          </button>
          <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted, marginTop: 12 }}>
            Change your mind anytime — nothing is lost when you switch it off.
          </div>
        </Card>
      ) : (
        <>
          {/* Stats strip */}
          <Card c={c} style={{ marginBottom: 14, display: "flex", justifyContent: "space-around" }}>
            {[["Streak", `${streak}d`], ["Active", rewards.list.length], ["Earned", totalEarned]].map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 19, fontWeight: 700, color: c.gold }}>{v}</div>
                <div style={{ fontFamily: "Inter", fontSize: 10, color: c.muted, fontWeight: 700, marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </Card>

          {/* Active rewards */}
          {rewards.list.length > 0 && (
            <>
              <Label c={c}>On The Line</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {rewards.list.map(r => {
                  const prog = progOf(r), ready = eligible(r);
                  return (
                    <Card key={r.id} c={c} style={{
                      padding: 14, border: `1.5px solid ${ready ? c.gold : c.border}`,
                      boxShadow: ready ? `0 6px 22px rgba(245,185,59,.25)` : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 800, color: c.text }}>{r.treat}</div>
                          <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted, marginTop: 3 }}>
                            {r.days}-day streak{r.earned > 0 ? ` · earned ${r.earned}×` : ""}
                          </div>
                        </div>
                        <button onClick={() => remove(r.id)} style={{
                          background: "none", border: "none", cursor: "pointer", color: c.muted, padding: 2, flexShrink: 0,
                        }}><Trash2 size={14} /></button>
                      </div>
                      <div style={{ height: 9, borderRadius: 999, background: c.bgEl2, overflow: "hidden", marginBottom: 8 }}>
                        <div style={{ height: "100%", width: `${(prog / r.days) * 100}%`,
                          background: ready ? c.gold : `linear-gradient(90deg,${c.red},${c.gold})`,
                          borderRadius: 999, transition: "width .5s" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
                          color: ready ? c.gold : c.muted }}>
                          {ready ? "READY TO CLAIM" : `${prog}/${r.days} days`}
                        </span>
                        {ready && (
                          <button onClick={() => claim(r)} style={{
                            padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                            background: c.gold, color: "#1A1408", fontFamily: "Inter", fontWeight: 900, fontSize: 12,
                            boxShadow: "0 4px 14px rgba(245,185,59,.4)",
                          }}>Claim It 🎉</button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* Quick presets */}
          <Label c={c}>Quick Add</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {REWARD_PRESETS.map(pr => (
              <button key={pr.treat} onClick={() => addReward(pr.days, pr.treat)} style={{
                display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 13,
                border: `1px dashed ${c.border}`, background: "transparent", cursor: "pointer", textAlign: "left",
              }}>
                <Plus size={15} color={c.gold} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: "Inter", fontSize: 13, fontWeight: 700, color: c.text }}>{pr.treat}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: c.muted, fontWeight: 700 }}>{pr.days}d</span>
              </button>
            ))}
          </div>

          {/* Custom reward */}
          <Label c={c}>Make Your Own</Label>
          <Card c={c} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 800, letterSpacing: .8, color: c.muted, marginBottom: 6 }}>
              DAYS OF CONSISTENCY
            </div>
            <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
              {[3, 5, 7, 14, 30].map(d => (
                <button key={d} onClick={() => setDays(d)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 11, cursor: "pointer",
                  border: `1.5px solid ${days === d ? c.gold : c.border}`,
                  background: days === d ? c.gold : c.bgEl,
                  color: days === d ? "#1A1408" : c.text,
                  fontFamily: "'Bebas Neue'", fontSize: 17,
                }}>{d}</button>
              ))}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 800, letterSpacing: .8, color: c.muted, marginBottom: 6 }}>
              THE TREAT
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={treat} onChange={e => setTreat(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addReward(days, treat)}
                placeholder="Ice cream, new shoes, lazy Sunday…"
                style={inputSt(c, { flex: 1, minWidth: 0 })} />
              <button onClick={() => addReward(days, treat)} style={{
                width: 46, borderRadius: 12, border: "none", background: c.gold, color: "#1A1408",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
              }}><Plus size={18} /></button>
            </div>
          </Card>

          <button onClick={() => setRewards(rw => ({ ...rw, on: false }))} style={{
            width: "100%", padding: "13px 16px", borderRadius: 13, cursor: "pointer",
            border: `1px solid ${c.border}`, background: "transparent", color: c.muted,
            fontFamily: "Inter", fontWeight: 700, fontSize: 12.5,
          }}>
            Turn Off Rewards (your list is saved)
          </button>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════ PROFILE ═══════════════════════ */
function ProfileScreen({ c, p, setP, dark, setDark, onCheckout, onSignOut, onProgress, toast, onAdmin }) {
  const [edit, setEdit] = useState(false);

  const handleSave = (draft) => {
    // Reward progress: did the gap between weight and goal weight shrink?
    const oldGap = (p.weight && p.goalWeight) ? Math.abs(+p.weight - +p.goalWeight) : null;
    const newGap = (draft.weight && draft.goalWeight) ? Math.abs(+draft.weight - +draft.goalWeight) : null;
    setP(x => ({ ...x, ...draft }));
    setEdit(false);
    if (oldGap !== null && newGap !== null && newGap < oldGap) {
      onProgress(oldGap - newGap);
    } else {
      toast("Profile updated ✓");
    }
  };

  if (edit) return <ProfileEditor c={c} p={p} onSave={handleSave} onCancel={() => setEdit(false)} />;

  const level = LEVELS.find(l => l.id === p.level);
  const goals = GOAL_BODIES.filter(g => p.goalBodies?.includes(g.id));
  const dLeft = daysUntil(p.eventDate);
  const evt = EVENTS.find(e => e.id === p.event);
  const coach = COACHES[p.gender === "female" ? "female" : "male"];

  const PLANS = [
    { id: "free", name: "Free", price: "$0", f: ["Basic workouts", "Streaks & badges"] },
    { id: "premium", name: "Premium", price: "$9.99/mo", priceId: "price_premium_monthly", f: ["Full adaptive programming", "Meal prep plans", "Streak freezes", "No ads"] },
    { id: "elite", name: "Elite", price: "$19.99/mo", priceId: "price_elite_monthly", f: ["Everything in Premium", "Advanced analytics", "Priority program drops"] },
  ];

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Disp c={c} size={30}>PROFILE</Disp>
        <button onClick={() => setEdit(true)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 11,
          border: `1px solid ${c.turq}`, background: c.turqDim, color: c.turq, cursor: "pointer",
          fontFamily: "Inter", fontWeight: 800, fontSize: 12,
        }}>
          <Pencil size={13} /> Edit
        </button>
      </div>

      <Card c={c} style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 62, height: 62, borderRadius: 16, background: c.bgEl2, overflow: "hidden",
          display: "flex", alignItems: "flex-end", justifyContent: "center", flexShrink: 0 }}>
          <Coach gender={p.gender || "male"} mood="idle" size={52} c={c} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 16, color: c.text }}>{p.name || "Athlete"}</div>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: c.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ background: c.redDim, borderRadius: 7, padding: "3px 8px",
              fontFamily: "Inter", fontSize: 10.5, fontWeight: 800, color: c.red }}>
              {level.name.toUpperCase()} · {p.tier.toUpperCase()}
            </span>
            <span style={{ background: c.turqDim, borderRadius: 7, padding: "3px 8px",
              fontFamily: "Inter", fontSize: 10.5, fontWeight: 800, color: c.turq }}>
              COACH {coach.name.toUpperCase()}
            </span>
          </div>
        </div>
      </Card>

      {goals.length > 0 && (
        <Card c={c} style={{ marginBottom: 14 }}>
          <Label c={c}>Your Goals</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: dLeft !== null ? 12 : 0 }}>
            {goals.map(g => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 800, color: c.text }}>{g.label}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 11, color: c.muted }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {dLeft !== null && evt?.id !== "none" && (
            <div style={{ background: c.turqDim, borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Inter", fontSize: 12.5, color: c.text, fontWeight: 700 }}>{evt?.label}</span>
              <Disp c={c} size={20} style={{ color: c.turq }}>{dLeft} DAYS</Disp>
            </div>
          )}
        </Card>
      )}

      <Card c={c} style={{ marginBottom: 14 }}>
        <Label c={c}>Areas You're Protecting</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {p.injuries.length === 0 ? (
            <span style={{ fontFamily: "Inter", fontSize: 12.5, color: c.muted }}>Nothing flagged.</span>
          ) : p.injuries.map(id => (
            <span key={id} style={{ background: c.redDim, borderRadius: 999, padding: "5px 11px",
              fontFamily: "Inter", fontSize: 11.5, fontWeight: 800, color: c.red }}>{regionLabel(id)}</span>
          ))}
        </div>
      </Card>

      <Card c={c} style={{ marginBottom: 14 }}>
        <Label c={c}>Stats</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[["Workouts", p.workouts], ["Best", p.best], ["XP", p.xp], ["Freezes", p.freezes]].map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 19, fontWeight: 700, color: c.turq }}>{v}</div>
              <div style={{ fontFamily: "Inter", fontSize: 9.5, color: c.muted, marginTop: 2, fontWeight: 700 }}>{k}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card c={c} style={{ marginBottom: 14 }}>
        <Label c={c}>Your Numbers</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["Age", p.age], ["Height", `${p.heightFt}'${p.heightIn || 0}"`], ["Weight", `${p.weight} lbs`],
            ["Goal Weight", p.goalWeight ? `${p.goalWeight} lbs` : "—"], ["Phone", p.phone || "—"],
            ["Days / week", p.daysPerWeek]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter", fontSize: 13, color: c.muted }}>{k}</span>
              <span style={{ fontFamily: "Inter", fontSize: 13, color: c.text, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card c={c} style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {dark ? <Moon size={18} color={c.turq} /> : <Sun size={18} color={c.turq} />}
          <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, color: c.text }}>Dark Mode</span>
        </div>
        <button onClick={() => setDark(d => !d)} style={{
          width: 48, height: 27, borderRadius: 999, border: "none", cursor: "pointer",
          background: dark ? c.turq : c.bgEl2, position: "relative", transition: "background .2s",
        }}>
          <div style={{ width: 21, height: 21, borderRadius: "50%", background: "#fff",
            position: "absolute", top: 3, left: dark ? 24 : 3, transition: "left .2s" }} />
        </button>
      </Card>

      <Label c={c}>Subscription</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {PLANS.map(pl => {
          const cur = p.tier === pl.id;
          return (
            <Card key={pl.id} c={c} style={{ padding: 15, border: `1.5px solid ${cur ? c.turq : c.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  {pl.id === "elite" && <Crown size={14} color={c.gold} />}
                  <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 15, color: c.text }}>{pl.name}</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: c.red, fontWeight: 700 }}>{pl.price}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.muted, marginBottom: 11, lineHeight: 1.5 }}>
                {pl.f.join(" · ")}
              </div>
              {cur ? (
                <div style={{ fontFamily: "Inter", fontSize: 12, color: c.turq, fontWeight: 800 }}>Current Plan</div>
              ) : pl.id === "free" ? (
                <button onClick={() => setP(x => ({ ...x, tier: "free" }))} style={{
                  padding: "9px 15px", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent",
                  color: c.muted, fontFamily: "Inter", fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}>Downgrade</button>
              ) : (
                <button onClick={() => onCheckout(pl)} style={{
                  padding: "9px 15px", borderRadius: 10, border: "none", background: c.red, color: "#fff",
                  fontFamily: "Inter", fontWeight: 800, fontSize: 12, cursor: "pointer",
                }}>Start 7-Day Free Trial</button>
              )}
            </Card>
          );
        })}
      </div>

      <Label c={c}>Program Packs</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[{ name: "6-Week Marathon Prep", price: "$9.99", priceId: "price_marathon" },
          { name: "High-Protein Recipe Pack", price: "$4.99", priceId: "price_recipes" },
          { name: "Mobility & Joint Rescue", price: "$6.99", priceId: "price_mobility" }].map(pk => (
          <Card key={pk.name} c={c} style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Gift size={16} color={c.turq} />
              <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 700, color: c.text }}>{pk.name}</span>
            </div>
            <button onClick={() => onCheckout({ ...pk, id: "pack" })} style={{
              padding: "7px 13px", borderRadius: 9, border: `1px solid ${c.turq}`, background: "transparent",
              color: c.turq, fontFamily: "Inter", fontWeight: 800, fontSize: 12, cursor: "pointer", flexShrink: 0,
            }}>{pk.price}</button>
          </Card>
        ))}
      </div>

      <button onClick={onAdmin} style={{
        width: "100%", marginTop: 18, padding: "13px 16px", borderRadius: 13, cursor: "pointer",
        border: `1px solid ${c.border}`, background: "transparent", color: c.muted,
        fontFamily: "Inter", fontWeight: 700, fontSize: 12.5,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Shield size={14} /> Admin Access
      </button>

      <SignOutButton c={c} onSignOut={onSignOut} />
    </div>
  );
}

/* ═══════════════════════ PROFILE EDITOR — everything editable ═══════════════════════ */
function ProfileEditor({ c, p, onSave, onCancel }) {
  const [d, setD] = useState({
    name: p.name, email: p.email, phone: p.phone, age: p.age, gender: p.gender,
    heightFt: p.heightFt, heightIn: p.heightIn, weight: p.weight, goalWeight: p.goalWeight,
    daysPerWeek: p.daysPerWeek, goalBodies: [...(p.goalBodies || [])],
    event: p.event, eventDate: p.eventDate,
  });
  const up = (k, v) => setD(x => ({ ...x, [k]: v }));
  const toggleGoal = (id) => setD(x => ({
    ...x, goalBodies: x.goalBodies.includes(id) ? x.goalBodies.filter(g => g !== id) : [...x.goalBodies, id],
  }));
  const fmtPhone = v => {
    const dg = v.replace(/\D/g, "").slice(0, 10);
    if (dg.length > 6) return `(${dg.slice(0, 3)}) ${dg.slice(3, 6)}-${dg.slice(6)}`;
    if (dg.length > 3) return `(${dg.slice(0, 3)}) ${dg.slice(3)}`;
    return dg;
  };
  const ok = d.name.trim() && d.email.includes("@") && d.age && d.heightFt && d.weight && d.goalBodies.length > 0;

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Disp c={c} size={30}>EDIT PROFILE</Disp>
        <button onClick={onCancel} style={{
          background: "none", border: "none", cursor: "pointer", color: c.muted,
          fontFamily: "Inter", fontWeight: 700, fontSize: 13, padding: 4,
        }}>Cancel</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        <Field c={c} label="First Name" value={d.name} placeholder="Jordan"
          onChange={e => up("name", e.target.value)} />
        <Field c={c} label="Email" value={d.email} placeholder="you@email.com" type="email"
          onChange={e => up("email", e.target.value)} />
        <Field c={c} label="Phone" value={d.phone} placeholder="(555) 123-4567" inputMode="tel"
          onChange={e => up("phone", fmtPhone(e.target.value))} />
        <Field c={c} label="Age" value={d.age} placeholder="28" inputMode="numeric"
          onChange={e => up("age", e.target.value.replace(/\D/g, "").slice(0, 3))} />

        <div>
          <Label c={c}>Height</Label>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={d.heightFt} placeholder="ft" inputMode="numeric" style={inputSt(c)}
              onChange={e => up("heightFt", e.target.value.replace(/\D/g, "").slice(0, 1))} />
            <input value={d.heightIn} placeholder="in" inputMode="numeric" style={inputSt(c)}
              onChange={e => up("heightIn", e.target.value.replace(/\D/g, "").slice(0, 2))} />
          </div>
        </div>

        <Field c={c} label="Current Weight (lbs)" value={d.weight} placeholder="180" inputMode="numeric"
          onChange={e => up("weight", e.target.value.replace(/\D/g, "").slice(0, 3))} />
        <Field c={c} label="Goal Weight (lbs)" value={d.goalWeight} placeholder="165" inputMode="numeric"
          onChange={e => up("goalWeight", e.target.value.replace(/\D/g, "").slice(0, 3))} />

        <div>
          <Label c={c}>Days per week</Label>
          <div style={{ display: "flex", gap: 7 }}>
            {[2, 3, 4, 5, 6].map(day => (
              <button key={day} onClick={() => up("daysPerWeek", day)} style={{
                flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer",
                border: `1.5px solid ${d.daysPerWeek === day ? c.turq : c.border}`,
                background: d.daysPerWeek === day ? c.turq : c.bgEl,
                color: d.daysPerWeek === day ? "#fff" : c.text,
                fontFamily: "'Bebas Neue'", fontSize: 19,
              }}>{day}</button>
            ))}
          </div>
        </div>

        <div>
          <Label c={c}>Your Coach</Label>
          <div style={{ display: "flex", gap: 10 }}>
            {["male", "female"].map(g => {
              const on = d.gender === g, tone = g === "female" ? "turq" : "red";
              return (
                <button key={g} onClick={() => up("gender", g)} style={{
                  ...optCard(c, on, tone), flex: 1, padding: "10px 8px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  <Coach gender={g} mood={on ? "flex" : "idle"} size={50} c={c} />
                  <span style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 800, color: c.text, marginTop: 4 }}>
                    {COACHES[g].name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label c={c}>Goals (pick every one that matters)</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GOAL_BODIES.map(g => {
              const on = d.goalBodies.includes(g.id);
              return (
                <button key={g.id} onClick={() => toggleGoal(g.id)} style={{ ...optCard(c, on, "turq"), padding: "11px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{g.emoji}</span>
                    <span style={{ flex: 1, fontFamily: "Inter", fontWeight: 800, fontSize: 13, color: c.text }}>{g.label}</span>
                    <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: `1.5px solid ${on ? c.turq : c.border}`, background: on ? c.turq : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {on && <Check size={12} color="#fff" strokeWidth={3.5} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label c={c}>Target Event</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: d.event && d.event !== "none" ? 10 : 0 }}>
            {EVENTS.map(e => (
              <Chip key={e.id} c={c} tone="turq" active={d.event === e.id} onClick={() => up("event", e.id)}>{e.label}</Chip>
            ))}
          </div>
          {d.event && d.event !== "none" && (
            <input type="date" value={d.eventDate} onChange={e => up("eventDate", e.target.value)} style={inputSt(c)} />
          )}
        </div>
      </div>

      <button disabled={!ok} onClick={() => onSave(d)} style={btn(c, !ok)}>
        Save Changes <Check size={17} />
      </button>
    </div>
  );
}

function SignOutButton({ c, onSignOut }) {
  const [arming, setArming] = useState(false);
  useEffect(() => {
    if (!arming) return;
    const t = setTimeout(() => setArming(false), 4000);
    return () => clearTimeout(t);
  }, [arming]);
  return (
    <button onClick={() => arming ? onSignOut() : setArming(true)} style={{
      width: "100%", marginTop: 18, padding: "14px 16px", borderRadius: 14, cursor: "pointer",
      border: `1px solid ${arming ? c.red : c.border}`, background: arming ? c.redDim : "transparent",
      color: arming ? c.red : c.muted, fontFamily: "Inter", fontWeight: 800, fontSize: 13,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .2s",
    }}>
      <LogOut size={15} />
      {arming ? "Tap again to confirm — this clears your saved profile" : "Sign Out"}
    </button>
  );
}

/* ═══════════════════════ MODAL ═══════════════════════ */
function LevelUp({ c, data, onClose, gender }) {
  if (!data) return null;
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, background: "#000000BB", zIndex: 250,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 28,
      animation: "fadeIn .2s ease", backdropFilter: "blur(3px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: c.bgEl, border: `1.5px solid ${c.turq}`, borderRadius: 24, padding: 26,
        textAlign: "center", width: "100%", boxShadow: `0 16px 50px ${c.turqGlow}`,
        animation: "popIn .35s cubic-bezier(.2,1.4,.4,1)",
      }}>
        <Coach gender={gender || "male"} mood="celebrate" size={96} c={c} />
        <Disp c={c} size={30} style={{ color: c.turq, marginTop: 6 }}>{data.title}</Disp>
        <div style={{ fontFamily: "Inter", fontSize: 13.5, color: c.muted, marginTop: 10, lineHeight: 1.55 }}>{data.body}</div>
        <button onClick={onClose} style={{ ...btn(c), marginTop: 20 }}>Keep Going <Flame size={17} /></button>
      </div>
    </div>
  );
}

/* ═══════════════════════ ADMIN ═══════════════════════ */
/* Reached from Profile with the access code. NOTE: this reads only what is
   stored on THIS device — there is no server, so it cannot see other users. */
const ADMIN_CODE = "6161";

function AdminScreen({ c, p, water, cals, rewards, custom, onBack, toast }) {
  const [code, setCode] = useState("");
  const [ok, setOk] = useState(false);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    if (!ok) return;
    (async () => {
      try {
        const r = await window.storage.get("aac-state");
        setRaw(r?.value || null);
      } catch (e) { setRaw(null); }
    })();
  }, [ok]);

  if (!ok) return (
    <div style={{ padding: "18px 18px 100px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer",
        color: c.muted, display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={17} /><span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>Back</span>
      </button>
      <Disp c={c} size={30} style={{ marginBottom: 6 }}>ADMIN</Disp>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: c.muted, marginBottom: 20, lineHeight: 1.55 }}>
        Enter the access code to view account tools.
      </div>
      <Card c={c}>
        <Label c={c}>Access Code</Label>
        <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
          onKeyDown={e => { if (e.key === "Enter" && code === ADMIN_CODE) setOk(true); }}
          placeholder="••••" inputMode="numeric" type="password"
          style={inputSt(c, { fontFamily: "'JetBrains Mono'", fontSize: 20, letterSpacing: 6, textAlign: "center" })} />
        <button onClick={() => code === ADMIN_CODE ? setOk(true) : toast("Incorrect code")}
          style={{ ...btn(c, !code), marginTop: 14 }}>
          Unlock <Shield size={17} />
        </button>
      </Card>
    </div>
  );

  const level = LEVELS.find(l => l.id === p.level);
  const dLeft = daysUntil(p.eventDate);
  const Row = ({ k, v }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0",
      borderBottom: `1px solid ${c.border}` }}>
      <span style={{ fontFamily: "Inter", fontSize: 12.5, color: c.muted }}>{k}</span>
      <span style={{ fontFamily: "Inter", fontSize: 12.5, color: c.text, fontWeight: 700, textAlign: "right" }}>{v}</span>
    </div>
  );

  const copyData = () => {
    try {
      navigator.clipboard.writeText(raw || "no data");
      toast("Account data copied to clipboard");
    } catch (e) { toast("Copy not supported on this device"); }
  };

  return (
    <div style={{ padding: "18px 18px 100px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer",
        color: c.muted, display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={17} /><span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>Back</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
        <Disp c={c} size={30}>ADMIN</Disp>
        <span style={{ background: c.turq, color: "#06231F", borderRadius: 6, padding: "3px 8px",
          fontFamily: "Inter", fontSize: 9, fontWeight: 900, letterSpacing: 1 }}>UNLOCKED</span>
      </div>

      <div style={{ background: c.redDim, border: `1px solid ${c.red}`, borderRadius: 13, padding: 13,
        marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <ShieldAlert size={16} color={c.red} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontFamily: "Inter", fontSize: 11.5, color: c.text, lineHeight: 1.55 }}>
          This device only. The app has no server yet, so it can't show other people's accounts.
          Cross-user tracking needs logins and a database — see the notes below.
        </div>
      </div>

      <Label c={c}>This Account</Label>
      <Card c={c} style={{ marginBottom: 16, paddingBlock: 8 }}>
        <Row k="Name" v={p.name || "—"} />
        <Row k="Email" v={p.email || "—"} />
        <Row k="Phone" v={p.phone || "—"} />
        <Row k="Plan" v={p.tier.toUpperCase()} />
        <Row k="Level" v={`${level.name} (L${level.id})`} />
        <Row k="Coach" v={COACHES[p.gender === "female" ? "female" : "male"].name} />
        <Row k="Event" v={dLeft !== null ? `${EVENTS.find(e => e.id === p.event)?.label} · ${dLeft}d` : "—"} />
      </Card>

      <Label c={c}>Activity</Label>
      <Card c={c} style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[["Workouts", p.workouts], ["Streak", p.streak], ["Best", p.best],
            ["XP", p.xp], ["Freezes", p.freezes], ["Rewards", rewards.list.length]].map(([k, v]) => (
            <div key={k} style={{ textAlign: "center", background: c.bgEl2, borderRadius: 11, padding: "10px 4px" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 17, fontWeight: 700, color: c.turq }}>{v}</div>
              <div style={{ fontFamily: "Inter", fontSize: 9, color: c.muted, marginTop: 3, fontWeight: 700 }}>{k}</div>
            </div>
          ))}
        </div>
        <Row k="Last workout" v={p.lastDone || "never"} />
        <Row k="Water today" v={`${water.oz} / ${water.goal} oz`} />
        <Row k="Meals logged" v={cals.entries.length} />
        <Row k="Custom workouts" v={Object.keys(custom).length} />
        <Row k="Flagged areas" v={p.injuries.length ? p.injuries.map(regionLabel).join(", ") : "none"} />
      </Card>

      <Label c={c}>Tools</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        <button onClick={copyData} style={{
          padding: "13px 16px", borderRadius: 13, cursor: "pointer", textAlign: "left",
          border: `1px solid ${c.border}`, background: c.bgEl, color: c.text,
          fontFamily: "Inter", fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Mail size={15} color={c.turq} /> Copy this account's data
        </button>
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{
          padding: "13px 16px", borderRadius: 13, textDecoration: "none",
          border: `1px solid ${c.border}`, background: c.bgEl, color: c.text,
          fontFamily: "Inter", fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Instagram size={15} color={c.turq} /> Open booking inbox
        </a>
      </div>

      <Label c={c}>To Track All Users</Label>
      <Card c={c}>
        <div style={{ fontFamily: "Inter", fontSize: 12.5, color: c.muted, lineHeight: 1.7 }}>
          Real user tracking needs three pieces added to the app:<br /><br />
          <strong style={{ color: c.text }}>1. Accounts</strong> — email login so a person is the same person on every device.<br />
          <strong style={{ color: c.text }}>2. A database</strong> — profiles and streaks saved to the cloud instead of the phone.<br />
          <strong style={{ color: c.text }}>3. This screen, connected</strong> — a live list of every user, their plan, and their activity.<br /><br />
          Until then, this page shows only the account on this device.
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════ NAV ═══════════════════════ */
function Nav({ c, active, set }) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "train", icon: Dumbbell, label: "Train" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "sessions", icon: Instagram, label: "1:1" },
    { id: "track", icon: Droplet, label: "Track" },
    { id: "meals", icon: UtensilsCrossed, label: "Meals" },
    { id: "profile", icon: User, label: "You" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 74, background: c.bgEl,
      borderTop: `1px solid ${c.border}`, display: "flex", alignItems: "center",
      justifyContent: "space-around", paddingBottom: 8, zIndex: 50, paddingInline: 2,
    }}>
      {tabs.map(t => {
        const on = active === t.id, I = t.icon;
        return (
          <button key={t.id} onClick={() => set(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", display: "flex",
            flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 1px", flex: 1, minWidth: 0,
            transform: on ? "translateY(-2px)" : "none", transition: "transform .18s",
          }}>
            <I size={18} color={on ? c.turq : c.muted} />
            <span style={{ fontFamily: "Inter", fontSize: 8.5, fontWeight: 800, color: on ? c.turq : c.muted, whiteSpace: "nowrap" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════ APP ═══════════════════════ */
export default function App() {
  const [dark, setDark] = useState(true);
  const c = dark ? THEME.dark : THEME.light;

  const [stage, setStage] = useState("onboarding");
  const [tab, setTab] = useState("home");
  const [toastMsg, setToastMsg] = useState(null);
  const [confetti, setConfetti] = useState(0);
  const [modal, setModal] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [custom, setCustom] = useState({});

  const [p, setP] = useState({
    name: "", email: "", phone: "", age: "", gender: "male", heightFt: "", heightIn: "", weight: "",
    goalBodies: [], goalWeight: "", event: "", eventDate: "", daysPerWeek: 3,
    level: 1, equipment: "none", injuries: [], xp: 0, streak: 0, best: 0,
    lastDone: null, tier: "free", workouts: 0, freezes: 2,
  });
  const [water, setWater] = useState({ goal: 64, oz: 0 });
  const [cals, setCals] = useState({ goal: 2000, entries: [] });
  /* Optional reward system: on/off anytime, list of user-defined treats */
  const [rewards, setRewards] = useState({ on: false, list: [] });

  const prevXp = useRef(0);
  const lastStreak = useRef(0);
  const toast = (m) => { setToastMsg(m); clearTimeout(toast._t); toast._t = setTimeout(() => setToastMsg(null), 2600); };
  const celebrate = () => setConfetti(n => n + 1);

  /* ── Persistent profile: load once on launch ──
     Saved state lives in device storage under one key. Returning users skip
     straight to the app; water and calorie logs reset on a new day. */
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("aac-state");
        if (res?.value) {
          const s = JSON.parse(res.value);
          if (s.p) setP(prev => ({ ...prev, ...s.p }));
          if (s.custom) setCustom(s.custom);
          if (s.rewards) setRewards(s.rewards);
          if (typeof s.dark === "boolean") setDark(s.dark);
          if (s.stage === "app") setStage("app");
          if (s.day === todayKey()) {
            if (s.water) setWater(s.water);
            if (s.cals) setCals(s.cals);
          } else {
            if (s.water) setWater({ ...s.water, oz: 0 });
            if (s.cals) setCals({ ...s.cals, entries: [] });
          }
        }
      } catch (e) { /* first visit — nothing saved yet */ }
      setLoaded(true);
    })();
  }, []);

  /* ── Auto-save whenever anything meaningful changes (debounced) ── */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try {
        await window.storage.set("aac-state", JSON.stringify({
          stage: stage === "app" ? "app" : "onboarding",
          p, custom, dark, water, cals, rewards, day: todayKey(),
        }));
      } catch (e) { console.error("Could not save profile", e); }
    }, 400);
    return () => clearTimeout(t);
  }, [loaded, stage, p, custom, dark, water, cals, rewards]);

  /* ── Sign out: wipe saved data and return to onboarding ── */
  const signOut = async () => {
    try { await window.storage.delete("aac-state"); } catch (e) { /* already gone */ }
    setP({
      name: "", email: "", phone: "", age: "", gender: "male", heightFt: "", heightIn: "", weight: "",
      goalBodies: [], goalWeight: "", event: "", eventDate: "", daysPerWeek: 3,
      level: 1, equipment: "none", injuries: [], xp: 0, streak: 0, best: 0,
      lastDone: null, tier: "free", workouts: 0, freezes: 2,
    });
    setWater({ goal: 64, oz: 0 });
    setCals({ goal: 2000, entries: [] });
    setCustom({});
    setRewards({ on: false, list: [] });
    setTab("home");
    setStage("onboarding");
  };

  /* Pop-up when an edited profile shows the gap to goal weight shrinking */
  const onProgress = (lbs) => {
    setModal({
      title: `${lbs} ${lbs === 1 ? "LB" : "LBS"} CLOSER!`,
      body: `The gap just shrank. The scoreboard moved because YOU moved. Don't stop now.`,
    });
    celebrate();
  };

  /* Pop-up when a reward is claimed */
  const onRewardClaim = (r) => {
    setModal({
      title: "REWARD UNLOCKED! 🎁",
      body: `${r.treat} — ${r.days} days straight, zero excuses. Go enjoy it. You paid for it in sweat.`,
    });
    celebrate();
  };

  useEffect(() => {
    if (stage === "app" && Math.floor(p.xp / 100) > Math.floor(prevXp.current / 100)) {
      setModal({ title: "RANK UP!", body: `You just crossed ${Math.floor(p.xp / 100) * 100} XP. That's not luck — that's ${p.workouts} sessions of choosing dedication over comfort.` });
      celebrate();
    }
    prevXp.current = p.xp;
  }, [p.xp, stage]);

  useEffect(() => {
    if (p.streak > lastStreak.current && [3, 7, 14, 30, 60, 100].includes(p.streak)) {
      setModal({ title: `${p.streak}-DAY STREAK`, body: `Most people quit before day three. You're on ${p.streak}. Protect this.` });
      celebrate();
    }
    lastStreak.current = p.streak;
  }, [p.streak]);

  const badges = useMemo(() => ([
    { id: "b1", name: "First Rep", on: p.workouts >= 1 },
    { id: "b2", name: "3-Day Spark", on: p.best >= 3 },
    { id: "b3", name: "Week Warrior", on: p.best >= 7 },
    { id: "b4", name: "Hydrated", on: water.oz >= water.goal },
    { id: "b5", name: "Double Digits", on: p.workouts >= 10 },
    { id: "b6", name: "Unstoppable", on: p.best >= 30 },
  ]), [p.workouts, p.best, water.oz, water.goal]);

  const quests = useMemo(() => {
    const done = p.lastDone === todayKey();
    return [
      { id: "q1", label: "Complete today's workout", icon: Dumbbell, done, pct: done ? 100 : 0, xp: 30 },
      { id: "q2", label: `Drink ${water.goal}oz of water`, icon: Droplet, done: water.oz >= water.goal,
        pct: Math.min(water.oz / water.goal * 100, 100), xp: 15 },
      { id: "q3", label: "Log a meal", icon: UtensilsCrossed, done: cals.entries.length > 0,
        pct: cals.entries.length ? 100 : 0, xp: 10 },
    ];
  }, [p.lastDone, water, cals]);

  const finishOnboard = (f) => { setP(prev => ({ ...prev, ...f })); setStage("confirm"); };
  const emailConfirmed = () => { setStage("app"); celebrate(); toast(`Welcome, ${p.name}. Your plan is live 🔥`); };

  const goCheckout = (plan) => { setCheckoutPlan(plan); setTab("checkout"); };
  const paySuccess = (plan) => {
    if (plan.id !== "pack") setP(x => ({ ...x, tier: plan.id, freezes: x.freezes + 3 }));
    setCheckoutPlan(null); setTab("profile"); celebrate();
    toast(plan.id === "pack" ? `${plan.name} unlocked 🎁` : `${plan.name} active — trial started`);
  };

  const logMeal = (r) => {
    setCals(x => ({ ...x, entries: [...x.entries, { id: Date.now(), name: r.name, cal: r.cal }] }));
    setP(x => ({ ...x, xp: x.xp + 10 }));
    toast(`${r.name} logged — +10 XP`);
  };

  return (
    <div style={{
      width: "100%", maxWidth: 420, height: 800, margin: "0 auto", position: "relative",
      background: c.bg, borderRadius: 34, overflow: "hidden", border: `1px solid ${c.border}`,
      fontFamily: "Inter, sans-serif", boxShadow: "0 24px 70px rgba(0,0,0,.4)",
    }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        @keyframes toastIn { from { opacity:0; transform: translate(-50%,-8px) } to { opacity:1; transform: translate(-50%,0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn { from { opacity:0; transform: scale(.85) } to { opacity:1; transform: scale(1) } }
        @keyframes fall { to { transform: translateY(840px) rotate(720deg); opacity:0 } }
        @keyframes flicker { 0%,100% { transform: scale(1) } 50% { transform: scale(1.14) } }
        @keyframes coachBreathe { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-2px) scale(1.012) } }
        @keyframes coachFlex { 0%,100% { transform: scale(1) rotate(0deg) } 50% { transform: scale(1.04) rotate(-1.5deg) } }
        @keyframes coachCheer { from { transform: translateY(0) } to { transform: translateY(-8px) } }
        input::placeholder, textarea::placeholder { color: ${c.muted}; opacity: .8 }
        input[type="date"] { color-scheme: ${dark ? "dark" : "light"} }
        button:focus-visible, a:focus-visible { outline: 2px solid ${c.turq}; outline-offset: 2px }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important } }
      `}</style>

      <Toast c={c} toast={toastMsg} />
      <Confetti c={c} fire={confetti} key={confetti} />
      <LevelUp c={c} data={modal} gender={p.gender} onClose={() => setModal(null)} />

      <div style={{ height: "100%", overflowY: "auto" }}>
        {!loaded ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Logo c={c} size={70} />
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: c.muted, letterSpacing: 1.5 }}>
              LOADING YOUR PROFILE…
            </div>
          </div>
        ) : (
          <>
            {stage === "onboarding" && <Onboarding c={c} onDone={finishOnboard} />}
        {stage === "confirm" && <ConfirmEmail c={c} profile={p} onConfirm={emailConfirmed} />}
        {stage === "app" && (
          <>
            {tab === "home" && <HomeScreen c={c} p={p} water={water} cals={cals} badges={badges}
              quests={quests} rewards={rewards} onTrain={() => setTab("train")}
              onSessions={() => setTab("sessions")} onRewards={() => setTab("rewards")} />}
            {tab === "rewards" && <RewardsScreen c={c} p={p} rewards={rewards} setRewards={setRewards}
              onBack={() => setTab("home")} onClaim={onRewardClaim} toast={toast} />}
            {tab === "train" && <TrainScreen c={c} p={p} setP={setP} toast={toast} celebrate={celebrate}
              custom={custom} setCustom={setCustom} />}
            {tab === "sessions" && <SessionsScreen c={c} p={p} />}
            {tab === "track" && <TrackScreen c={c} water={water} setWater={setWater} cals={cals} setCals={setCals} toast={toast} />}
            {tab === "meals" && <MealsScreen c={c} tier={p.tier} onLog={logMeal} onUpgrade={() => setTab("profile")} />}
            {tab === "profile" && <ProfileScreen c={c} p={p} setP={setP} dark={dark} setDark={setDark}
              onCheckout={goCheckout} onSignOut={signOut} onProgress={onProgress} toast={toast}
              onRewards={() => setTab("rewards")} rewards={rewards} onAdmin={() => setTab("admin")} />}
            {tab === "admin" && <AdminScreen c={c} p={p} water={water} cals={cals} rewards={rewards}
              custom={custom} onBack={() => setTab("profile")} toast={toast} />}
            {tab === "checkout" && checkoutPlan && (
              <Checkout c={c} plan={checkoutPlan} email={p.email} onBack={() => setTab("profile")} onSuccess={paySuccess} />
            )}
          </>
        )}
          </>
        )}
      </div>

      {stage === "app" && tab !== "checkout" && tab !== "admin" && <Nav c={c} active={tab} set={setTab} />}
    </div>
  );
}
