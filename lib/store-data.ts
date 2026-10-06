export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  basePrice: number;
  featuredNote: string;
  image: string;
  imageAlt: string;
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
    description: "Transform your favorite photograph into an exquisite hand-painted resin miniature. Each piece captures the essence of your cherished memory at a perfect scale, with meticulous detail and a preview before production.",
    basePrice: 4000,
    featuredNote: "Preview before production • Hand-painted finish • 4-inch scale • Gift-ready packaging",
    image: "/images/bike-miniature-1.jpg",
    imageAlt: "Hand-painted bike miniature",
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
      { question: "How does the preview process work?", answer: "After you place your order, we create a 3D concept of your photo and share it for approval before moving to production." },
      { question: "Can I choose the finish or pose?", answer: "Yes. Share your preferences, preferred pose, and any special details in the order form. We work closely with you throughout the preview stage." },
      { question: "What kind of photos work best?", answer: "Clear portraits with good lighting and minimal background clutter work beautifully. We specialize in preserving the essence of your favorite moments." },
    ],
  },
  {
    slug: "baby-miniature",
    name: "Sleeping Baby Miniature",
    category: "Family Keepsake",
    tagline: "A tiny guardian, captured in a peaceful moment.",
    description: "A lovingly detailed 3D miniature of a sleeping baby, designed for gentle, meaningful display. Choose the finish and scale, then share any color or fabric details you would like included.",
    basePrice: 6500,
    featuredNote: "Hand-painted finish • Custom color details • Gift-ready packaging",
    image: "/images/stitch-products/commercial_product_photo_of_a_custom_3d_printed_baby_miniature_sleeping.png",
    imageAlt: "Custom 3D printed sleeping baby miniature",
    variants: [
      { id: "8cm", label: "8 cm", size: "8 cm", price: 6500, turnaround: "3-4 weeks" },
      { id: "10cm", label: "10 cm", size: "10 cm", price: 7500, turnaround: "3-4 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 8500, turnaround: "4 weeks" },
    ],
    reviews: [{ name: "Mira S.", title: "Baby shower gift", quote: "The tiny details were beautiful and the finish felt delicate and premium. It became the centerpiece of the gift box." }],
    faqs: [
      { question: "Can I personalize the baby miniature?", answer: "Yes. Share your preferred colors, clothing, accessories, and any details you want included in the reference or customization notes." },
      { question: "Is the image used for the final design?", answer: "The initial image helps us understand the concept. A production preview is created for your approval before the final miniature is manufactured." },
    ],
  },
  {
    slug: "pet-miniature",
    name: "Pet Portrait Miniature",
    category: "Pet Memorial",
    tagline: "Keep their little personality close.",
    description: "A custom 3D pet miniature shaped around the personality, expression, and favorite details of your companion. Designed to make a beautiful memorial or everyday keepsake.",
    basePrice: 5800,
    featuredNote: "Personalized pose • Pet details • Premium resin finish",
    image: "/images/stitch-products/commercial_product_photography_of_a_custom_3d_printed_pet_miniature_figurine_of.png",
    imageAlt: "Custom 3D printed pet miniature figurine",
    variants: [
      { id: "8cm", label: "8 cm", size: "8 cm", price: 5800, turnaround: "2-3 weeks" },
      { id: "10cm", label: "10 cm", size: "10 cm", price: 6800, turnaround: "2-3 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 7600, turnaround: "3 weeks" },
    ],
    reviews: [{ name: "Ananya R.", title: "Pet memorial", quote: "I was able to capture my pet's expression beautifully. It feels like a tiny piece of their personality in our home." }],
    faqs: [
      { question: "What photo should I send?", answer: "Send a clear, well-lit front-facing photo with the pet's expression and markings clearly visible." },
      { question: "Can the miniature include a collar or tag?", answer: "Yes. Add the details in your customization notes, and we will confirm feasibility during the preview stage." },
    ],
  },
  {
    slug: "full-body-miniature",
    name: "Full-Body Miniature",
    category: "Storytelling Sculptures",
    tagline: "A complete character, crafted in miniature.",
    description: "A handcrafted full-body 3D miniature with sculpted proportions, expressive details, and a polished finish. Ideal for characters, stories, and special collectibles.",
    basePrice: 8800,
    featuredNote: "Full-body sculpture • Hand-finished • Display-ready",
    image: "/images/stitch-products/commercial_product_photography_of_a_handcrafted_custom_3d_printed_full_body.png",
    imageAlt: "Handcrafted full-body custom 3D miniature",
    variants: [
      { id: "8cm", label: "8 cm", size: "8 cm", price: 8800, turnaround: "4 weeks" },
      { id: "10cm", label: "10 cm", size: "10 cm", price: 10500, turnaround: "4-5 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 12500, turnaround: "5 weeks" },
    ],
    reviews: [{ name: "Rohan K.", title: "Collectible gift", quote: "The level of detail was remarkable. It feels like a finished sculptural piece rather than a simple model." }],
    faqs: [
      { question: "How detailed can the full-body model be?", answer: "The model is crafted with fine surface detail, expressive features, and a durable hand-finished surface for display." },
      { question: "Can I provide a reference image?", answer: "Yes. A clear reference image helps us capture the character, pose, clothing, and accessory details you want." },
    ],
  },
  {
    slug: "group-miniature",
    name: "Family Group Miniature",
    category: "Family Keepsake",
    tagline: "The whole story, held in one small moment.",
    description: "A custom group miniature celebrating family members, close friends, or a special occasion. The composition can be arranged around a shared moment, celebration, or treasured memory.",
    basePrice: 7200,
    featuredNote: "Multi-person composition • Personal details • Display-ready",
    image: "/images/stitch-products/commercial_product_studio_photography_of_a_custom_3d_printed_group_miniature.png",
    imageAlt: "Custom 3D printed miniature group portrait",
    variants: [
      { id: "3-person", label: "3 people", size: "3 person", price: 7200, turnaround: "3-4 weeks" },
      { id: "4-person", label: "4 people", size: "4 person", price: 8500, turnaround: "4 weeks" },
      { id: "5-person", label: "5 people", size: "5 person", price: 9800, turnaround: "4-5 weeks" },
    ],
    reviews: [{ name: "Priya M.", title: "Family gift", quote: "The group details made the whole family's personalities feel perfect. It was a hit with everyone." }],
    faqs: [
      { question: "How many people can be included?", answer: "The group composition is available for three to five people, with additional arrangements quoted after review of your reference images." },
      { question: "Can I include pets or props?", answer: "Yes. Share the desired props, clothing, and setting details in your order notes for the design team to review." },
    ],
  },
  {
    slug: "solo-character-miniature",
    name: "Solo Character Miniature",
    category: "Character Art",
    tagline: "One character. One story. Endless detail.",
    description: "A crafted solo character miniature with thoughtful proportions, expressive features, and a striking hand-finished surface designed to stand out on any shelf.",
    basePrice: 5900,
    featuredNote: "Character design • Studio finish • Custom accessories",
    image: "/images/stitch-products/commercial_product_studio_photography_of_a_handcrafted_custom_3d_printed_solo.png",
    imageAlt: "Handcrafted solo custom 3D printed miniature",
    variants: [
      { id: "8cm", label: "8 cm", size: "8 cm", price: 5900, turnaround: "3 weeks" },
      { id: "10cm", label: "10 cm", size: "10 cm", price: 6900, turnaround: "3-4 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 7800, turnaround: "4 weeks" },
    ],
    reviews: [{ name: "Kartik S.", title: "Collector piece", quote: "The finish and character were exceptional. It feels like a small display piece with a lot of personality." }],
    faqs: [
      { question: "Can I choose the character pose?", answer: "Yes. The pose, expression, clothing, accessories, and color palette can be discussed during the concept review." },
      { question: "How long does production take?", answer: "Most designs are ready in three to four weeks, depending on the selected size and complexity." },
    ],
  },
  {
    slug: "couple-miniature",
    name: "Couple Miniature",
    category: "Romantic Keepsake",
    tagline: "A love story, preserved in two small figures.",
    description: "A romantic custom couple miniature that captures a shared pose, expression, and setting. A thoughtful gift for anniversaries, milestones, and celebrations of two.",
    basePrice: 7600,
    featuredNote: "Couple composition • Personal styling • Display-ready",
    image: "/images/stitch-products/commercial_studio_product_photography_of_a_custom_3d_printed_couple_miniature.png",
    imageAlt: "Custom 3D printed couple miniature",
    variants: [
      { id: "9cm", label: "9 cm", size: "9 cm", price: 7600, turnaround: "3 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 9000, turnaround: "3-4 weeks" },
      { id: "15cm", label: "15 cm", size: "15 cm", price: 10500, turnaround: "4 weeks" },
    ],
    reviews: [{ name: "Neha & Vikas", title: "Anniversary gift", quote: "The couple miniature felt incredibly personal and romantic. The finish was so polished that everyone wanted to know where it came from." }],
    faqs: [
      { question: "Can we choose the pose?", answer: "Yes. The pose, interaction, clothing, and setting can all be discussed before the production preview is approved." },
      { question: "Is this suitable for a wedding gift?", answer: "Absolutely. It is a distinctive option for wedding milestones, anniversaries, and newlywed couples." },
    ],
  },
  {
    slug: "wedding-miniature",
    name: "Indian Wedding Miniature",
    category: "Wedding Keepsake",
    tagline: "A celebration of your day, in miniature.",
    description: "A luxurious custom Indian wedding miniature featuring the couple, traditional attire, ceremonial details, and the cultural touches that made your day unforgettable.",
    basePrice: 10500,
    featuredNote: "Wedding details • Cultural styling • Premium finish",
    image: "/images/stitch-products/luxury_commercial_product_photography_of_a_custom_3d_printed_indian_wedding.png",
    imageAlt: "Luxury Indian wedding custom 3D miniature",
    variants: [
      { id: "10cm", label: "10 cm", size: "10 cm", price: 10500, turnaround: "4-5 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 12500, turnaround: "4-5 weeks" },
      { id: "15cm", label: "15 cm", size: "15 cm", price: 14500, turnaround: "5-6 weeks" },
    ],
    reviews: [{ name: "Aarav & Meera", title: "Wedding keepsake", quote: "The details captured the atmosphere of our wedding beautifully. It is now a treasured keepsake in our home." }],
    faqs: [
      { question: "Can traditional wedding attire be included?", answer: "Yes. Share clear photos of the attire, jewelry, accessories, and ceremony details so we can include them in the concept." },
      { question: "Does the miniature include a wedding setting?", answer: "A setting can be added based on the prescribed dimensions, available details, and your final design approval." },
    ],
  },
  {
    slug: "sculpture-miniature",
    name: "Sculpted Art Miniature",
    category: "Art & Sculpture",
    tagline: "A refined sculpture for your collection.",
    description: "A premium sculptural miniature finished with a refined surface treatment. A standout option for art lovers, collectors, and thoughtful gifts that deserve a distinctive display piece.",
    basePrice: 9400,
    featuredNote: "Sculpted finish • Collector-ready • Premium detailing",
    image: "/images/stitch-products/high_end_product_photography_of_a_custom_3d_printed_sculpture_finished_in.png",
    imageAlt: "High-end custom 3D printed sculptural miniature",
    variants: [
      { id: "8cm", label: "8 cm", size: "8 cm", price: 9400, turnaround: "3-4 weeks" },
      { id: "10cm", label: "10 cm", size: "10 cm", price: 11000, turnaround: "4 weeks" },
      { id: "12cm", label: "12 cm", size: "12 cm", price: 12800, turnaround: "4-5 weeks" },
    ],
    reviews: [{ name: "Sanjay R.", title: "Art collector", quote: "The finish was exceptional and the piece looked even better in person. A beautiful addition to my collection." }],
    faqs: [
      { question: "Can I choose a specific finish?", answer: "Yes. We offer a range of finishes and can discuss surface treatments during the concept review." },
      { question: "Is the sculpture display-ready?", answer: "Every piece is finished with care and is designed to be displayed prominently on a shelf or collection stand." },
    ],
  },
  {
    slug: "desk-nameplate",
    name: "Personalized Desk Nameplate",
    category: "Desk Décor",
    tagline: "Make your workspace unmistakably yours.",
    description: "A refined custom desk nameplate with personalized lettering and a premium sculpted finish. Ideal for your office, studio, or home workspace.",
    basePrice: 3400,
    featuredNote: "Personalized lettering • Desk-ready • Premium finish",
    image: "/images/stitch-products/high_end_studio_product_photography_of_a_custom_3d_printed_desk_nameplate_with.png",
    imageAlt: "Custom 3D printed personalized desk nameplate",
    variants: [
      { id: "standard", label: "Standard", size: "Standard", price: 3400, turnaround: "2 weeks" },
      { id: "large", label: "Large", size: "Large", price: 4800, turnaround: "2-3 weeks" },
      { id: "premium", label: "Premium", size: "Premium", price: 6000, turnaround: "3 weeks" },
    ],
    reviews: [{ name: "Meera P.", title: "Office gift", quote: "The nameplate looked very premium and the engraving was crisp. It was perfect for my new workspace." }],
    faqs: [
      { question: "Can I choose the wording?", answer: "Yes. You can include a name, title, initials, or short personal message." },
      { question: "Can the finish be customized?", answer: "Color and surface finish options are available for review before production." },
    ],
  },
  {
    slug: "car-mounted-miniature",
    name: "Car Mount Miniature",
    category: "Automotive Décor",
    tagline: "A miniature ride, built for your dashboard.",
    description: "A custom 3D miniature designed for a car mount, bringing a distinctive display piece to your dashboard, console, or interior shelf.",
    basePrice: 5400,
    featuredNote: "Car mount included • Custom details • Display-ready",
    image: "/images/stitch-products/product_studio_shot_of_a_custom_3d_miniature_figurine_installed_on_a_car.png",
    imageAlt: "Custom 3D miniature figurine installed on a car",
    variants: [
      { id: "small", label: "Small", size: "Small", price: 5400, turnaround: "2-3 weeks" },
      { id: "medium", label: "Medium", size: "Medium", price: 6400, turnaround: "3 weeks" },
      { id: "large", label: "Large", size: "Large", price: 7500, turnaround: "3-4 weeks" },
    ],
    reviews: [{ name: "Kunal S.", title: "Car enthusiast", quote: "It looked breathtaking on the dashboard and felt wonderfully detailed. The mount was secure and elegant." }],
    faqs: [
      { question: "Does the mount fit my car?", answer: "The mount is designed for standard dashboard and console surfaces. Share your vehicle model for a specific fit check." },
      { question: "Can I customize the vehicle?", answer: "Yes. The vehicle color, accessories, and finish can be discussed before the final concept is approved." },
    ],
  },
];
