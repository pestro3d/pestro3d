"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  defaultBaseShape: "circle" | "rectangle" | "hexagon";
  defaultMaterial: "white" | "grey" | "matte-black";
}

const TEMPLATES: Template[] = [
  {
    id: "miniature-portrait",
    name: "Signature Portrait Mini",
    description: "Classic standalone figure portrait, hand-painted from your photo.",
    image: "/images/bike-miniature-1.jpg",
    defaultBaseShape: "circle",
    defaultMaterial: "white",
  },
  {
    id: "pet-portrait",
    name: "Pet Portrait Memorial",
    description: "Loyal companion portrait, tailored around markings and personality.",
    image: "/images/stitch-products/commercial_product_photography_of_a_custom_3d_printed_pet_miniature_figurine_of.png",
    defaultBaseShape: "circle",
    defaultMaterial: "grey",
  },
  {
    id: "sleeping-baby",
    name: "Sleeping Baby Mini",
    description: "Delicate baby sculpture, great for warm, meaningful memories.",
    image: "/images/stitch-products/commercial_product_photo_of_a_custom_3d_printed_baby_miniature_sleeping.png",
    defaultBaseShape: "rectangle",
    defaultMaterial: "white",
  },
  {
    id: "full-body",
    name: "Full-Body Character",
    description: "Action pose, fully sculpted custom gaming or storytelling figure.",
    image: "/images/stitch-products/commercial_product_photography_of_a_handcrafted_custom_3d_printed_full_body.png",
    defaultBaseShape: "hexagon",
    defaultMaterial: "matte-black",
  },
];

interface TemplateSelectorProps {
  selectedId: string | null;
  onSelect: (id: string, baseShape: "circle" | "rectangle" | "hexagon", material: "white" | "grey" | "matte-black") => void;
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold uppercase tracking-wider text-[#4c1c5c]">
        Select Design Template
      </label>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedId === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id, tpl.defaultBaseShape, tpl.defaultMaterial)}
              className={[
                "group relative flex flex-col items-start overflow-hidden rounded-[1.4rem] border text-left outline-none transition-all duration-300",
                isSelected
                  ? "border-[#4c1c5c] bg-violet-100/30 ring-1 ring-[#4c1c5c]/40"
                  : "border-[#d4c4e8] bg-white/40 hover:border-[#7c3aed] hover:bg-white/60",
              ].join(" ")}
            >
              {/* Thumbnail Container */}
              <div className="relative h-24 w-full overflow-hidden bg-violet-50/50">
                <Image
                  src={tpl.image}
                  alt={tpl.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c1c5c] text-white shadow">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Text Meta */}
              <div className="p-3 space-y-0.5">
                <h5 className="text-xs font-semibold text-[#4c1c5c] line-clamp-1">{tpl.name}</h5>
                <p className="text-[10px] text-[var(--color-muted)] leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
