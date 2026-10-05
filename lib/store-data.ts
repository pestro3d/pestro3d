export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  basePrice: number;
  featuredNote: string;
  variants: { id: string; label: string; size: string; price: number; turnaround: string }[];
  reviews: { name: string; title: string; quote: string }[];
  faqs: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    slug: "miniature-portrait",
    name: "Miniature Portrait",
    category: "Custom Keepsake",
    tagline: "Cherished moments, immortalized in miniature.",
    description:
      "Transform your favorite photograph into an exquisite hand-painted resin miniature. Each piece captures the essence of your cherished memory—preserved at a perfect 4-inch scale with meticulous attention to detail. Our streamlined preview process ensures your vision comes to life before production begins, giving you complete confidence in your bespoke keepsake.",
    basePrice: 4000,
    featuredNote: "Preview before production • Hand-painted finish • 4-inch scale • Gift-ready packaging",
    variants: [
      { id: "9cm", label: "9 cm", size: "9 cm", price: 4000, turnaround: "2-3 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 4700, turnaround: "2-3 weeks" },
      { id: "15cm", label: "15 cm", size: "15 cm", price: 5400, turnaround: "3 weeks" },
    ],
    reviews: [
      { name: "Aisha & Arjun", title: "Wedding gift", quote: "The preview made it feel personal. The piece looked exactly like the photo and meaningful. Such a unique way to celebrate our love." },
      { name: "Ritika N.", title: "Mother's day gift", quote: "The quality was excellent and delivery felt premium. Beautiful on display and special. She loved the hand-painted details." },
      { name: "Samarth P.", title: "Pet memorial mini", quote: "Craftsmanship was beautiful and preview process gave confidence before production. It's like having a piece of them with me." },
    ],
    faqs: [
      { question: "How does the preview process work?", answer: "After you place your order, we create a 3D concept of your photo and share it for approval before moving to production. This ensures we capture the essence of your memory perfectly." },
      { question: "Can I choose the finish or pose?", answer: "Yes! Share your preferences, preferred pose, and any special details in the order form. We work closely with you throughout the preview stage to ensure the final piece exceeds your expectations." },
      { question: "What kind of photos work best?", answer: "Clear portraits with good lighting and minimal background clutter work beautifully. We specialize in preserving the essence of your favorite moments." },
    ],
  },
];
