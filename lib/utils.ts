/**
 * Generate deterministic placeholder color from a seed string.
 * Uses a simple hash function for consistent color generation.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Generate a subtle gradient background for product placeholders.
 */
export function getProductPlaceholderGradient(name: string): string {
  const hash = hashString(name);
  const hue1 = hash % 360;
  const hue2 = (hash * 2 + 120) % 360;
  
  return `linear-gradient(135deg, hsl(${hue1}, 30%, 70%), hsl(${hue2}, 25%, 50%))`;
}

/**
 * Generate a soft glow effect for images.
 */
export function getGlowEffect(color: string, opacity: number = 0.2): string {
  return `0 20px 40px rgba(${color.replace('hsl', '').split(',').map(Number).slice(0, 3).join(',')}, ${opacity})`;
}
