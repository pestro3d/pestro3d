export type OrderStatus = "placed" | "preview_in_progress" | "preview_ready" | "approved" | "changes_requested" | "in_production" | "shipped" | "delivered";

export type AdminOrder = {
  id: string;
  customer: string;
  item: string;
  status: OrderStatus;
  amount: number;
  previewStatus: "pending" | "ready" | "approved";
  walletCredit: number;
};

export const adminOrders: AdminOrder[] = [
  {
    id: "ORD-1001",
    customer: "Ritika Sharma",
    item: "Miniature Portrait",
    status: "preview_ready",
    amount: 4700,
    previewStatus: "ready",
    walletCredit: 0,
  },
  {
    id: "ORD-1002",
    customer: "Aisha & Arjun",
    item: "Miniature Portrait",
    status: "approved",
    amount: 5400,
    previewStatus: "approved",
    walletCredit: 350,
  },
  {
    id: "ORD-1003",
    customer: "Pranav Jain",
    item: "Miniature Portrait",
    status: "in_production",
    amount: 4000,
    previewStatus: "approved",
    walletCredit: 0,
  },
];

export const adminDiscounts = [
  { code: "WELCOME10", value: 10, active: true },
  { code: "BULK20", value: 20, active: false },
  { code: "ANNIVERSARY15", value: 15, active: true },
];
