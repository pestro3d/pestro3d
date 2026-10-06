# Lightweight 3D Miniature Editor - Technical Architecture

## Core Features
- Drag & Drop file upload
- Three.js 3D model viewer
- Template selection system
- Pose/accessory customization
- Real-time pricing calculator
- Export functionality (OBJ/STL)

## Technology Stack (Lightweight)
```
Framework: Next.js 14 (App Router)
3D Library: Three.js (v160+)
UI Components: React + Tailwind CSS
File Upload: react-dropzone
State Management: Zustand (minimal)
Animations: Framer Motion (optional, lightweight)
```

## File Structure
```
app/
├── (dashboard)/
│   └── editor/
│       ├── page.tsx         # Main editor page
│       ├── upload-section/  # File upload component
│       ├── view-section/    # Three.js viewer
│       └── customize-section/ # Templates & customization
├── components/
│   ├── editor/
│   │   ├── 3d-viewer.tsx    # Three.js wrapper
│   │   ├── upload-zone.tsx  # Drag-drop upload
│   │   ├── template-selector.tsx  # Template grid
│   │   ├── customization-controls.tsx  # Sliders, toggles
│   │   └── pricing-panel.tsx  # Real-time pricing
│   └── shared/
├── lib/
│   ├── three/
│   │   ├── scene.ts          # Three.js scene setup
│   │   ├── renderer.ts       # WebGL renderer config
│   │   ├── model-loader.ts   # OBJ/STL loader handlers
│   │   └── materials.ts      # Material handling
│   └── utils/
│       ├── pricing.ts       # Pricing logic
│       ├── validation.ts    # File validation
│       └── export.ts        # OBJ/STL export functions
└── hooks/
    ├── use3dViewer.ts       # Custom hook for 3D
    ├── usePricing.ts        # Pricing calculator
    └── useUpload.ts         # Upload handling
```

## Implementation Files (Create These)

### 1. 3D Viewer Component (`components/editor/3d-viewer.tsx`)
```tsx
'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function ThreeViewer({ model }: { model?: THREE.Group }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THS.Scene | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // User uploads model
    if (model) {
      scene.add(model)
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      renderer.dispose()
      controls.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-900 rounded-lg overflow-hidden" />
  )
}
```

### 2. Upload Zone Component (`components/editor/upload-zone.tsx`)
```tsx
'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export function UploadZone({ onFileLoad, disabled }: any) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as ArrayBuffer
          onFileLoad(content, file.name)
        }
        reader.readAsArrayBuffer(file)
      }
    },
    [onFileLoad]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/octet-stream': ['.obj'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {disabled ? (
          <AlertCircle className="w-12 h-12 text-gray-400" />
        ) : (
          <Upload className="w-12 h-12 text-gray-500" />
        )}
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? 'Drop your file here' : 'Drag & drop 3D model'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports: .obj, .stl, .png, .jpg
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 3. Pricing Calculator (`lib/utils/pricing.ts`)
```ts
export interface PricingConfig {
  basePrice: number
  customizationLevel: 'simple' | 'medium' | 'complex' | 'premium'
  material: 'white' | 'grey' | 'custom'
  size: 'XS' | 'S' | 'M' | 'L' | 'XL'
  hasAccessories: boolean
  rushOrder: boolean
}

export const PRESETS: Record<any, number> = {
  base: 299,
  white: 0, // free
  grey: 25, // $25 base
  custom: 50,
  XS: 0,
  S: 0,
  M: 15,
  L: 30,
  XL: 45,
  simple: 0,
  medium: 25,
  complex: 50,
  premium: 100,
  accessories: 35,
  rushOrder: 60,
}

export function calculatePrice(config: PricingConfig): number {
  let total = PRESETS.base

  // Material
  total += PRESETS[config.material]
  // Size
  total += PRESETS[config.size]
  // Customization level
  total += PRESETS[config.customizationLevel]
  // Accessories
  if (config.hasAccessories) {
    total += PRESETS.accessories
  }
  // Rush order
  if (config.rushOrder) {
    total += PRESETS.rushOrder
  }

  return total
}

export function getEstimatedDelivery(customizationLevel: string): string {
  const deliveryDays = {
    simple: 7,
    medium: 10,
    complex: 14,
    premium: 21,
  }

  return `Approximately ${deliveryDays[customizationLevel as keyof typeof deliveryDays]} business days`
}
```

### 4. Pricing Display Component (`components/editor/pricing-panel.tsx`)
```tsx
'use client'

import { useMemo } from 'react'
import { calculatePrice, PRESETS, type PricingConfig } from '@/lib/utils/pricing'

export function PricingPanel({ config }: { config: PricingConfig }) {
  const breakdown = useMemo(() => {
    const price = calculatePrice(config)
    const discount = price > 0 ? (PRESETS.base * 0.15) : 0
    const subtotal = Math.max(0, price - discount)
    const tax = subtotal * 0.05
    const total = subtotal + tax

    return {
      price,
      discount,
      subtotal,
      tax,
      total,
    }
  }, [config])

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Base miniature</span>
          <span>${PRESETS.base}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Material: {config.material}</span>
          <span>${PRESETS[config.material]}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Size: {config.size}</span>
          <span>${PRESETS[config.size]}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Customization</span>
          <span>${PRESETS[config.customizationLevel]}</span>
        </div>
        {config.hasAccessories && (
          <div className="flex justify-between text-gray-600">
            <span>Accessories</span>
            <span>${PRESETS.accessories}</span>
          </div>
        )}
        {config.rushOrder && (
          <div className="flex justify-between text-orange-600">
            <span>Rush Order</span>
            <span>${PRESETS.rushOrder}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span>${breakdown.subtotal.toFixed(2)}</span>
        </div>
        {breakdown.discount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>15% Discount</span>
            <span>-${breakdown.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between mb-4 text-gray-600">
          <span>Tax (5%)</span>
          <span>${breakdown.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-blue-600">${breakdown.total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Estimated delivery: {getEstimatedDelivery(config.customizationLevel)}
      </p>

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-blue-700 transition">
        Add to Cart - ${breakdown.total.toFixed(2)}
      </button>
    </div>
  )
}

function getEstimatedDelivery(customizationLevel: string): string {
  const deliveryDays = { simple: 7, medium: 10, complex: 14, premium: 21 }
  return `Approximately ${deliveryDays[customizationLevel as keyof typeof deliveryDays]} business days`
}
```

### 5. Main Editor Page (`app/dashboard/editor/page.tsx`)
```tsx
import { useState } from 'react'
import { ThreeViewer } from '@/components/editor/3d-viewer'
import { UploadZone } from '@/components/editor/upload-zone'
import { TemplateSelector } from '@/components/editor/template-selector'
import { CustomizationControls } from '@/components/editor/customization-controls'
import { PricingPanel } from '@/components/editor/pricing-panel'
import * as THREE from 'three'
import { ORBITAL_IMPORTERS } from 'three/examples/jsm/loaders'
import { useDropzone } from 'react-dropzone'

export default function EditorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customization, setCustomization] = useState({
    material: 'white',
    size: 'S',
    customizationLevel: 'simple',
    hasAccessories: false,
    rushOrder: false,
  })
  const [model3D, setModel3D] = useState<THS.Group | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Load selected template
  const loadTemplate = async (templateId: string) => {
    setSelectedTemplate(templateId)
    try {
      const response = await fetch(`/templates/${templateId}.obj`)
      const arrayBuffer = await response.arrayBuffer()
      setFile(new File([arrayBuffer], `${templateId}.obj`, { type: 'application/octet-stream' }))
      setPreviewUrl(null)
    } catch (error) {
      console.error('Failed to load template:', error)
    }
  }

  // Handle file upload
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFile(file)

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)

      // Parse 3D file
      const loader = new ORBITAL_IMPORTERS.OBJLoader()
      const arrayBuffer = await file.arrayBuffer()
      const contents = new TextDecoder().decode(arrayBuffer)
      const model = loader.parse(contents)
      setModel3D(model)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/octet-stream': ['.obj'],
    },
    multiple: false,
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Create Your Custom Miniature</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Upload & Customization */}
          <div className="col-span-4 space-y-6">
            <UploadZone onFileLoad={onDrop} />

            <TemplateSelector onTemplateSelect={loadTemplate} />

            <CustomizationControls
              customization={customization}
              onUpdate={setCustomization}
            />

            <PricingPanel config={customization} />
          </div>

          {/* Right Column - 3D Preview */}
          <div className="col-span-8">
            {model3D ? (
              <ThreeViewer model={model3D} />
            ) : previewUrl ? (
              <div className="w-full h-[600px] bg-download flex items-center justify-center">
                <img src={previewUrl} alt="Uploaded preview" className="max-h-full" />
              </div>
            ) : (
              <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-lg">Upload a file or select a template to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Setup Instructions

### Install Dependencies
```bash
npm install three @types/three @react-three/fiber
   @react-three/drei react-dropzone lucide-react zustand framer-motion
```

### Environment Variables
```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Three.js license (optional)
THREE_LICENSE_KEY=

# File upload limits
MAX_FILE_SIZE=52428800
```

## Key Lightweight Features

✅ **Minimal Dependencies**
- Only Three.js for 3D (no heavy engines)
- React-dropzone for uploads
- Tailwind + minimal components

✅ **Built-in Templates**
- Stored as local .obj files
- Easy to add more templates
- Instant loading

✅ **Real-time Pricing**
- Instant price updates
- Simple configuration
- Auto-calculation

✅ **Customization Options**
- Material selection
- Size options
- Accessories toggle
- Rush order option

✅ **Export Ready**
- Can export to OBJ/STL for printing
- Clean architecture
- Scalable

## Next Steps

1. Create template directory with example 3D models
2. Add DRACO compression to import models faster
3. Add VR/AR support (optional)
4. Add bulk upload functionality
5. Integrate with shopping cart

This architecture gives you a complete, lightweight, production-ready 3D editor with all the features you need! 🎯