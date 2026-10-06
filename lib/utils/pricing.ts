export interface PricingConfig {
  material: string;
  size: string;
  finish: string;
  rushOrder: boolean;
  giftBox: boolean;
}

export const PRESETS: Record<string, number> = {
  // Base prices
  base: 4000,

  // Materials
  white: 0,
  grey: 500,
  "matte-black": 800,
  bronze: 1000,
  gold: 2000,

  // Sizes
  XS: 0,
  S: 700,
  M: 1400,
  L: 2100,

  // Finish
  matte: 0,
  glossy: 300,
  metallic: 500,

  // Add-ons
  rushOrder: 1000,
  giftBox: 350,
};

export function calculatePrice(config: PricingConfig): number {
  let total = PRESETS.base;

  total += PRESETS[config.material] || 0;
  total += PRESETS[config.size] || 0;
  total += PRESETS[config.finish] || 0;

  if (config.rushOrder) {
    total += PRESETS.rushOrder;
  }
  if (config.giftBox) {
    total += PRESETS.giftBox;
  }

  return total;
}

export function getEstimatedDelivery(rushOrder: boolean): string {
  return rushOrder ? "7-10 business days" : "2-4 weeks";
}
