"use client";

import { Sparkles, Zap, Gift } from "lucide-react";

interface Customization {
  material: string;
  size: string;
  baseShape: string;
  finish: string;
  color: string;
  rushOrder: boolean;
  giftBox: boolean;
  notes: string;
  occasion: string;
  giftMessage: string;
}

interface CustomizationControlsProps {
  customization: Customization;
  onUpdate: (updater: Partial<Customization>) => void;
}

const BASE_SHAPES = [
  { id: "circle", label: "Circular" },
  { id: "rectangle", label: "Rectangular" },
  { id: "hexagon", label: "Hexagonal" },
];

const MATERIALS = [
  { id: "white", label: "White Acrylic" },
  { id: "grey", label: "Grey Resin" },
  { id: "matte-black", label: "Matte Black Wood" },
  { id: "bronze", label: "Antique Bronze (+₹1,000)" },
  { id: "gold", label: "Polished Gold (+₹2,000)" },
];

const FINISHES = [
  { id: "matte", label: "Classic Matte" },
  { id: "glossy", label: "Varnish Glossy" },
  { id: "metallic", label: "Shimmering Metallic" },
];

const SIZES = [
  { id: "XS", label: "XS (9 cm)", desc: "Perfect for office desks" },
  { id: "S", label: "S (12 cm)", desc: "Most popular bedside size" },
  { id: "M", label: "M (15 cm)", desc: "Fabulous shelf display" },
  { id: "L", label: "L (18 cm)", desc: "Premium showstopper centerpiece (+₹1,500)" },
];

const COLOR_SWATCHES = [
  "#4c1c5c", // Royal Purple (Primary)
  "#10b981", // Emerald
  "#3b82f6", // Sky Blue
  "#f59e0b", // Honey Amber
  "#ef4444", // Crimson Red
  "#111827", // Charcoal Black
];

export default function CustomizationControls({ customization, onUpdate }: CustomizationControlsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Size / Dimensions Selection */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold uppercase tracking-wider text-[#4c1c5c]">
          Scale & Dimensions
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {SIZES.map((sz) => {
            const isSelected = customization.size === sz.id;
            return (
              <button
                key={sz.id}
                type="button"
                onClick={() => onUpdate({ size: sz.id })}
                className={[
                  "rounded-xl border p-2.5 text-left transition-all duration-250 outline-none",
                  isSelected
                    ? "border-[#4c1c5c] bg-[#d4c4e8]/20 text-[#4c1c5c] ring-1 ring-[#4c1c5c]/40"
                    : "border-[#d4c4e8] bg-white/40 hover:border-[#7c3aed] hover:bg-white/50",
                ].join(" ")}
              >
                <div className="text-xs font-bold">{sz.label}</div>
                <div className="text-[9px] text-[var(--color-muted)] mt-0.5">{sz.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Base Pedestal Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="base-shape" className="block text-xs font-bold uppercase text-[var(--color-muted)]">
            Pedestal Shape
          </label>
          <select
            id="base-shape"
            value={customization.baseShape}
            onChange={(e) => onUpdate({ baseShape: e.target.value })}
            className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[#7c3aed]"
          >
            {BASE_SHAPES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="base-finish" className="block text-xs font-bold uppercase text-[var(--color-muted)]">
            Miniature Finish
          </label>
          <select
            id="base-finish"
            value={customization.finish}
            onChange={(e) => onUpdate({ finish: e.target.value })}
            className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[#7c3aed]"
          >
            {FINISHES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Base/Accent Material Choice */}
      <div className="space-y-2">
        <label htmlFor="ped-material" className="block text-xs font-bold uppercase text-[var(--color-muted)]">
          Pedestal Material/Finish
        </label>
        <select
          id="ped-material"
          value={customization.material}
          onChange={(e) => onUpdate({ material: e.target.value })}
          className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[#7c3aed]"
        >
          {MATERIALS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Swatch color picker for accents/pedestal */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-[var(--color-muted)]">
          Base Accent Color
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onUpdate({ color: c })}
                className={[
                  "h-6 w-6 rounded-full border border-white shadow-sm transition-all duration-200 hover:scale-110",
                  customization.color === c ? "ring-2 ring-[#7c3aed]" : "",
                ].join(" ")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] text-[var(--color-muted)]">Custom:</span>
            <input
              type="color"
              value={customization.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </div>
        </div>
      </div>

      {/* 5. Occasion & Messages */}
      <div className="grid gap-3 sm:grid-cols-2 border-t border-violet-100 pt-4">
        <div className="space-y-1.5">
          <label htmlFor="occasion-select" className="block text-xs font-bold text-[#4c1c5c]">Occasion</label>
          <select
            id="occasion-select"
            value={customization.occasion}
            onChange={(e) => onUpdate({ occasion: e.target.value })}
            className="w-full rounded-[0.8rem] border border-[var(--color-border)] bg-white/40 px-2.5 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[#7c3aed]"
          >
            <option>Anniversary</option>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Memorial</option>
            <option>Corporate</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="gift-msg-input" className="block text-xs font-bold text-[#4c1c5c]">Gift Message</label>
          <input
            id="gift-msg-input"
            value={customization.giftMessage}
            onChange={(e) => onUpdate({ giftMessage: e.target.value })}
            placeholder="Happy Anniversary!"
            className="w-full rounded-[0.8rem] border border-[var(--color-border)] bg-white/40 px-2.5 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[#7c3aed]"
          />
        </div>
      </div>

      {/* 6. Special Instructions */}
      <div className="space-y-1.5">
        <label htmlFor="spec-notes" className="block text-xs font-bold text-[#4c1c5c]">Design & Sculpting Notes</label>
        <textarea
          id="spec-notes"
          rows={3}
          value={customization.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="e.g. Please capture the dog's white patch on its chest. Make the jacket look navy blue."
          className="w-full rounded-[1rem] border border-[var(--color-border)] bg-white/40 px-3 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[#7c3aed]"
        />
      </div>

      {/* 7. Premium Options toggles */}
      <div className="space-y-2 border-t border-violet-100 pt-4">
        <div className="flex items-center justify-between rounded-xl bg-violet-50/40 border border-violet-100 p-2.5 hover:bg-violet-50/60 transition-all duration-200">
          <div className="flex gap-2">
            <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#4c1c5c]">Priority Rush Order</p>
              <p className="text-[9px] text-[var(--color-muted)]">Cuts production time in half (+₹1,000)</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={customization.rushOrder}
            onChange={(e) => onUpdate({ rushOrder: e.target.checked })}
            className="h-4 w-4 accent-[#4c1c5c] cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-violet-50/40 border border-violet-100 p-2.5 hover:bg-violet-50/60 transition-all duration-200">
          <div className="flex gap-2">
            <Gift className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#4c1c5c]">Premium Velvet Gifting Box</p>
              <p className="text-[9px] text-[var(--color-muted)]">Arrives hand-painted & beautifully padded (+₹350)</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={customization.giftBox}
            onChange={(e) => onUpdate({ giftBox: e.target.checked })}
            className="h-4 w-4 accent-[#4c1c5c] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
