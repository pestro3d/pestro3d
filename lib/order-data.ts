export type OrderStatus =
  | "placed"
  | "preview_in_progress"
  | "preview_ready"
  | "approved"
  | "changes_requested"
  | "in_production"
  | "shipped"
  | "delivered";

export type OrderTimeline = {
  key: OrderStatus;
  label: string;
  date: string;
  active?: boolean;
};

export const orderStatuses: Record<OrderStatus, string> = {
  placed: "Placed",
  preview_in_progress: "Preview in progress",
  preview_ready: "Preview ready",
  approved: "Approved",
  changes_requested: "Changes requested",
  in_production: "In production",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const sampleOrderTimeline: OrderTimeline[] = [
  { key: "placed", label: "Placed", date: "Sep 10" },
  { key: "preview_in_progress", label: "Preview in progress", date: "Sep 11" },
  { key: "preview_ready", label: "Preview ready", date: "Sep 12" },
  { key: "approved", label: "Approved", date: "Sep 13" },
  { key: "in_production", label: "In production", date: "Sep 15" },
  { key: "shipped", label: "Shipped", date: "Sep 18" },
  { key: "delivered", label: "Delivered", date: "Sep 22" },
];

export const sampleOrder = {
  id: "ORD-1001",
  item: "Miniature Portrait",
  status: "preview_ready" as OrderStatus,
  previewUrl: "/preview-visual.jpg",
  previewTitle: "Custom portrait preview",
  customerName: "Ritika Sharma",
  total: 4700,
  estimatedDelivery: "2-3 weeks",
};
