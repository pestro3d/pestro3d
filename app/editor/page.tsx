"use client";

import { useState } from "react";
import ThreeViewer from "@/components/editor/3d-viewer";
import UploadZone from "@/components/editor/upload-zone";
import TemplateSelector from "@/components/editor/template-selector";
import CustomizationControls from "@/components/customization-controls";
import PricingPanel from "@/components/editor/pricing-panel";

export default function EditorPage() {
  const [template, setTemplate] = useState<string | null>("miniature-portrait");
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string; type: "3d" | "image" } | null>(null);

  const [customization, setCustomization] = useState({
    material: "white",
    size: "S",
    baseShape: "circle",
    finish: "matte",
    color: "#4c1c5c",
    rushOrder: false,
    giftBox: false,
    notes: "",
    occasion: "Anniversary",
    giftMessage: "",
  });

  const handleTemplateSelect = (id: string, baseShape: "circle" | "rectangle" | "hexagon", material: "white" | "grey" | "matte-black") => {
    setTemplate(id);
    setCustomization((prev) => ({ ...prev, baseShape, material }));
  };

  const handleFileLoad = (url: string, name: string, type: "3d" | "image") => {
    setUploadedFile({ url, name, type });
  };

  const handleClearFile = () => {
    setUploadedFile(null);
  };

  const handleAddToCart = () => {
    alert("Added to cart successfully!");
  };

  return (
    <main className="min-h-screen bg-[#fbf8fd] p-6">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-[#4c1c5c] mb-8">Studio 3D Editor</h1>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Customization */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <TemplateSelector selectedId={template} onSelect={handleTemplateSelect} />
            <UploadZone onFileLoad={handleFileLoad} onClear={handleClearFile} />
            <CustomizationControls
              customization={customization}
              onUpdate={(updates) => setCustomization((prev) => ({ ...prev, ...updates }))}
            />
            <PricingPanel config={customization} onAddToCart={handleAddToCart} />
          </div>

          {/* Right Column - 3D Viewer */}
          <div className="col-span-12 lg:col-span-8 sticky top-6 h-[700px]">
            <div className="h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#d4c4e8]">
              <ThreeViewer
                customization={{
                  ...customization,
                  uploadedFileUrl: uploadedFile?.url || null,
                  uploadedFileName: uploadedFile?.name || null,
                  uploadedFileType: uploadedFile?.type || null,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
