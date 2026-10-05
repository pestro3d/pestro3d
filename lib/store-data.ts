export type ProductVariant = {
  id: string;
  label: string;
  size: string;
  price: number;
  turnaround: string;
};

export type Review = {
  name: string;
  title: string;
  quote: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  basePrice: number;
  featuredNote: string;
  variants: ProductVariant[];
  reviews: Review[];
  faqs: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    slug: "miniature-portrait",
    name: "Miniature Portrait",
    category: "Custom keepsake",
    tagline: "A treasured photo, reimagined as a hand-painted keepsake.",
    description:
      "Turn a favorite portrait, couple shot, or pet photo into a premium miniature figurine. We build a preview before production so the result feels personal, intentional, and gift-ready.",
    basePrice: 4000,
    featuredNote: "Preview before production • Hand-painted finish • 4 inch scale",
    variants: [
      { id: "9cm", label: "9 cm", size: "9 cm", price: 4000, turnaround: "2-3 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 4700, turnaround: "2-3 weeks" },
      { id: "15cm", label: "15 cm", size: "15 cm", price: 5400, turnaround: "3 weeks" },
    ],
    reviews: [
      {
        name: "Aisha & Arjun",
        title: "Wedding gift",
        quote: "The preview made the experience feel personal from the start. The finished piece looked exactly like the photo and felt incredibly meaningful.",
      },
      {
        name: "Ritika N.",
        title: "Mother's day gift",
        quote: "The quality was excellent and the delivery felt premium. It looked beautiful on display and made the moment feel really special.",
      },
      {
        name: "Samarth P.",
        title: "Pet memorial mini",
        quote: "The craftsmanship was beautiful and the preview process gave me confidence before production started.",
      },
    ],
    faqs: [
      {
        question: "How does the preview process work?",
        answer: "After your order is placed, we create a 3D concept and share it for approval before beginning production.",
      },
      {
        question: "Can I choose the finish or pose?",
        answer: "Yes. You can share your notes, preferred pose, and any details in the form, and we review them with the preview process.",
      },
      {
        question: "What kind of photos work best?",
        answer: "Portraits with clear faces, good lighting, and a polished background usually produce the best miniature details.",
      },
    ],
  },
];
