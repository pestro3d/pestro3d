type ProductImagePlaceholderProps = {
  variant?: "card" | "detail";
  label?: string;
};

export default function ProductImagePlaceholder({
  variant = "card",
  label = "Product preview",
}: ProductImagePlaceholderProps) {
  if (variant === "detail") {
    return (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(145deg,#f2e7dd_0%,#e8d3ba_36%,#7b4a3b_100%)] p-5">
        <div className="relative flex h-full w-full items-center justify-center rounded-[1.25rem] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.45),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(0,0,0,0.08))]">
          <div className="absolute inset-x-6 bottom-5 top-10 rounded-[2rem] border border-white/20 bg-white/6" />
          <div className="relative flex flex-col items-center gap-4 text-center text-[var(--color-foreground)]">
            <div className="h-24 w-24 rounded-[44%_56%_46%_54%/42%_47%_53%_58%] border border-white/25 bg-[linear-gradient(180deg,#f3ddbc_0%,#c68252_52%,#4b2e2b_100%)] shadow-[0_24px_28px_rgba(30,18,14,0.18)]" />
            <div className="rounded-full border border-white/25 bg-[rgba(255,255,255,0.12)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
              {label}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.15rem] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.34),rgba(0,0,0,0.16)),linear-gradient(160deg,#d8a36d_0%,#7d4d39_55%,#2a2725_100%)] p-3">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_38%,rgba(0,0,0,0.08))]" />
      <div className="relative flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center text-white/90">
          <div className="h-16 w-16 rounded-[44%_56%_46%_54%/42%_47%_53%_58%] border border-white/25 bg-[linear-gradient(180deg,#f0d5a8_0%,#c47d53_55%,#4d2e2b_100%)] shadow-[0_18px_18px_rgba(29,17,11,0.18)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{label}</span>
        </div>
      </div>
    </div>
  );
}
