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
    category: "Custom keepsake",
    tagline: "A photo reimagined as a hand-painted keepsake.",
    description:
      "Turn a favorite portrait into a premium miniature figurine. We build a preview before production.",
    basePrice: 4000,
    featuredNote: "Preview before production • Hand-painted finish • 4 inch scale",
    variants: [
      { id: "9cm", label: "9 cm", size: "9 cm", price: 4000, turnaround: "2-3 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 4700, turnaround: "2-3 weeks" },
      { id: "15cm", label: "15 cm", size: "15 cm", price: 5400, turnaround: "3 weeks" },
    ],
    reviews: [
      { name: "Aisha & Arjun", title: "Wedding gift", quote: "The preview made it feel personal. The piece looked exactly like the photo and meaningful." },
      { name: "Ritika N.", title: "Mother's day gift", quote: "The quality was excellent and delivery felt premium. Beautiful on display and special." },
      { name: "Samarth P.", title: "Pet memorial mini", quote: "Craftsmanship was beautiful and preview process gave confidence before production." },
    ],
    faqs: [
      {
        question: "How does the preview process work?",
        answer: "After order, we create a 3D concept and share it for approval before production.",
      },
      {
        question: "Can I choose the finish or pose?",
        answer: "Share notes, preferred pose, and details in the form. We review them with preview.",
      },
      {
        question: "What kind of photos work best?",
        answer: "Portraits with clear faces, good lighting, and polished background.",
      },
    ],
  },
];
