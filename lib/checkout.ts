export type CartItem = {
  id: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
};

export const WELCOME_DISCOUNT_PERCENT = 10;
export const DEFAULT_WALLET_BALANCE = 1200;
export const SHIPPING_COST = 249;

export function calculateTotals({
  items,
  walletBalance = DEFAULT_WALLET_BALANCE,
  walletApplied = false,
  welcomeDiscount = true,
}: {
  items: CartItem[];
  walletBalance?: number;
  walletApplied?: boolean;
  welcomeDiscount?: boolean;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = welcomeDiscount ? (subtotal * WELCOME_DISCOUNT_PERCENT) / 100 : 0;
  const wallet = walletApplied ? Math.min(walletBalance, subtotal - discount) : 0;
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const total = Math.max(0, subtotal - discount - wallet + shipping);

  return {
    subtotal,
    welcomeDiscountValue: discount,
    walletValue: wallet,
    shipping,
    total,
    walletBalanceAfter: Math.max(0, walletBalance - wallet),
  };
}

export async function submitPayment({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) {
  const provider = process.env.PAYMENT_PROVIDER ?? "TODO";

  return {
    provider,
    orderId,
    amount,
    status: provider === "TODO" ? "pending_setup" : "pending",
    message:
      provider === "TODO"
        ? "Payment provider is not configured yet. This is a placeholder abstraction for later integration."
        : "Payment request created.",
  };
}
