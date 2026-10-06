"use client";

import { useMemo } from "react";
import { calculatePrice, PRESETS, getEstimatedDelivery, type PricingConfig } from "@/lib/utils/pricing";

export default function PricingPanel({ config, onAddToCart }: { config: PricingConfig; onAddToCart: () => void }) {
  const breakdown = useMemo(() => {
    const total = calculatePrice(config);
    return {
      total,
    };
  }, [config]);

  return (
    <div className="rounded-[1.7rem] border border-[#d4c4e8] bg-[rgba(244,236,250,0.5)] p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#4c1c5c] mb-5">Order Summary</h3>

      <div className="space-y-3 text-sm text-[var(--color-muted)]">
        <div className="flex justify-between">
          <span>Base miniature</span>
          <span className="font-semibold text-[#4c1c5c]">₹{PRESETS.base}</span>
        </div>
        <div className="flex justify-between">
          <span>Material ({config.material})</span>
          <span className="font-semibold text-[#4c1c5c]">+{PRESETS[config.material] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Size ({config.size})</span>
          <span className="font-semibold text-[#4c1c5c]">+{PRESETS[config.size] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Finish ({config.finish})</span>
          <span className="font-semibold text-[#4c1c5c]">+{PRESETS[config.finish] || 0}</span>
        </div>
        {config.rushOrder && (
          <div className="flex justify-between">
            <span>Rush Order</span>
            <span className="font-semibold text-[#4c1c5c]">+{PRESETS.rushOrder}</span>
          </div>
        )}
        {config.giftBox && (
          <div className="flex justify-between">
            <span>Gift Box</span>
            <span className="font-semibold text-[#4c1c5c]">+{PRESETS.giftBox}</span>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-[#d4c4e8] pt-5 flex items-center justify-between">
        <span className="text-lg font-bold text-[#4c1c5c]">Total</span>
        <span className="text-3xl font-bold text-[#4c1c5c]">₹{breakdown.total}</span>
      </div>

      <p className="mt-4 text-xs text-[var(--color-muted)] text-center">
        Estimated delivery: {getEstimatedDelivery(config.rushOrder)}
      </p>

      <button
        onClick={onAddToCart}
        className="w-full mt-6 rounded-full bg-[#4c1c5c] px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,28,92,0.2)] hover:-translate-y-0.5 hover:bg-[#6a2c8c] transition-all"
      >
        Add to Cart - ₹{breakdown.total}
      </button>
    </div>
  );
}
