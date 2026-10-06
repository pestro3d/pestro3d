"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

interface ThreeViewerProps {
  customization: {
    material: string;
    size: string;
    baseShape: string;
    finish: string;
    color: string;
    uploadedFileUrl: string | null;
    uploadedFileName: string | null;
    uploadedFileType: "3d" | "image" | null;
  };
}

export default function ThreeViewer({ customization }: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelContainerRef = useRef<THREE.Group | null>(null);
  const pedestalRef = useRef<THREE.Mesh | null>(null);
  const photoFrameRef = useRef<THREE.Group | null>(null);
  const defaultModelRef = useRef<THREE.Group | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbf8fd); // Elegant light background matching our theme
    scene.fog = new THREE.FogExp2(0xfbf8fd, 0.05);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(4, 3, 5);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5ea, 0.8);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.camera.near = 0.5;
    dirLight1.shadow.camera.far = 25;
    dirLight1.shadow.camera.left = -3;
    dirLight1.shadow.camera.right = 3;
    dirLight1.shadow.camera.top = 3;
    dirLight1.shadow.camera.bottom = -3;
    dirLight1.shadow.bias = -0.0005;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe0f0ff, 0.4);
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x7c3aed, 0.6, 10);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);

    // 5. Grid and Helpers
    const gridHelper = new THREE.GridHelper(10, 20, 0x7c3aed, 0xe2d5f3);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // 6. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't go too far below grid
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0.6, 0);

    // 7. Base/Pedestal Mesh
    const makePedestal = () => {
      if (pedestalRef.current) {
        scene.remove(pedestalRef.current);
      }

      // Material color selection
      let baseColor = 0xffffff; // white
      let metalness = 0.1;
      let roughness = 0.8;

      if (customization.material === "grey") {
        baseColor = 0x8e8e93;
        roughness = 0.5;
      } else if (customization.material === "matte-black") {
        baseColor = 0x1c1c1e;
        roughness = 0.9;
      } else if (customization.material === "bronze") {
        baseColor = 0xcd7f32;
        metalness = 0.8;
        roughness = 0.3;
      } else if (customization.material === "gold") {
        baseColor = 0xffd700;
        metalness = 0.9;
        roughness = 0.2;
      }

      // Base shape selection
      let geometry: THREE.BufferGeometry;
      if (customization.baseShape === "rectangle") {
        geometry = new THREE.BoxGeometry(1.6, 0.15, 1.2);
      } else if (customization.baseShape === "hexagon") {
        geometry = new THREE.CylinderGeometry(0.8, 0.85, 0.15, 6);
      } else {
        // default circle
        geometry = new THREE.CylinderGeometry(0.8, 0.85, 0.15, 32);
      }

      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: roughness,
        metalness: metalness,
      });

      const pedestal = new THREE.Mesh(geometry, material);
      pedestal.position.y = -0.075;
      pedestal.receiveShadow = true;
      pedestal.castShadow = true;
      scene.add(pedestal);
      pedestalRef.current = pedestal;
    };

    makePedestal();

    // 8. Model Container (to hold the loaded model or fallback)
    const modelContainer = new THREE.Group();
    scene.add(modelContainer);
    modelContainerRef.current = modelContainer;

    // Create Stylized Default Figure
    const createDefaultFigure = () => {
      const group = new THREE.Group();

      // Stylized head
      const headGeo = new THREE.SphereGeometry(0.2, 32, 32);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xebd3bc, roughness: 0.6 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.2;
      head.castShadow = true;
      group.add(head);

      // Stylized body
      const bodyGeo = new THREE.CylinderGeometry(0.18, 0.25, 0.6, 32);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4c1c5c, roughness: 0.7 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.75;
      body.castShadow = true;
      group.add(body);

      // Cute accessory - tiny hat
      const hatGeo = new THREE.CylinderGeometry(0, 0.15, 0.15, 4);
      const hatMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.5, roughness: 0.2 });
      const hat = new THREE.Mesh(hatGeo, hatMat);
      hat.position.y = 1.4;
      hat.rotation.y = Math.PI / 4;
      hat.castShadow = true;
      group.add(hat);

      // Stylish cape / pedestal backboard
      const baseStandGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
      const baseStandMat = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.5 });
      const baseStand = new THREE.Mesh(baseStandGeo, baseStandMat);
      baseStand.position.y = 0.2;
      group.add(baseStand);

      defaultModelRef.current = group;
      modelContainer.add(group);
    };

    createDefaultFigure();

    // 9. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      // Soft breathing idle animation for pedestal/figure
      if (modelContainerRef.current) {
        modelContainerRef.current.rotation.y += 0.003;
      }
      if (pedestalRef.current) {
        pedestalRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
    };
  }, []);

  // Update dynamic options (materials, base, models) on property change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Update pedestal material & shape dynamically
    let baseColor = 0xffffff;
    let metalness = 0.1;
    let roughness = 0.8;

    if (customization.material === "grey") {
      baseColor = 0x8e8e93;
      roughness = 0.5;
    } else if (customization.material === "matte-black") {
      baseColor = 0x1c1c1e;
      roughness = 0.9;
    } else if (customization.material === "bronze") {
      baseColor = 0xcd7f32;
      metalness = 0.8;
      roughness = 0.3;
    } else if (customization.material === "gold") {
      baseColor = 0xffd700;
      metalness = 0.9;
      roughness = 0.2;
    }

    if (pedestalRef.current) {
      scene.remove(pedestalRef.current);
      let geometry: THREE.BufferGeometry;
      if (customization.baseShape === "rectangle") {
        geometry = new THREE.BoxGeometry(1.6, 0.15, 1.2);
      } else if (customization.baseShape === "hexagon") {
        geometry = new THREE.CylinderGeometry(0.8, 0.85, 0.15, 6);
      } else {
        geometry = new THREE.CylinderGeometry(0.8, 0.85, 0.15, 32);
      }

      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: roughness,
        metalness: metalness,
      });

      const pedestal = new THREE.Mesh(geometry, material);
      pedestal.position.y = -0.075;
      pedestal.receiveShadow = true;
      pedestal.castShadow = true;
      scene.add(pedestal);
      pedestalRef.current = pedestal;
    }

    // Handle uploaded file loaders (3D or Image Projector)
    const handleUploadedContent = async () => {
      const modelContainer = modelContainerRef.current;
      if (!modelContainer) return;

      // Clear earlier loaded groups
      if (photoFrameRef.current) {
        modelContainer.remove(photoFrameRef.current);
        photoFrameRef.current = null;
      }

      setLoading(true);
      setError(null);

      // Hide default mannequin
      if (defaultModelRef.current) {
        defaultModelRef.current.visible = false;
      }

      try {
        if (customization.uploadedFileType === "image" && customization.uploadedFileUrl) {
          // IMAGE IN 3D SPACE: We create a lovely customized acrylic photo stand!
          const frameGroup = new THREE.Group();

          // Acrylic stand backing
          const backGeo = new THREE.BoxGeometry(1.2, 0.9, 0.05);
          const backMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.9,
          });
          const back = new THREE.Mesh(backGeo, backMat);
          back.position.y = 0.5;
          back.castShadow = true;
          frameGroup.add(back);

          // Wood feet/clips
          const clipGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);
          const clipMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
          const clipLeft = new THREE.Mesh(clipGeo, clipMat);
          clipLeft.position.set(-0.4, 0.05, 0.05);
          clipLeft.castShadow = true;
          frameGroup.add(clipLeft);

          const clipRight = clipLeft.clone();
          clipRight.position.x = 0.4;
          frameGroup.add(clipRight);

          // Texture Loader to project user image
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            customization.uploadedFileUrl,
            (texture) => {
              const photoGeo = new THREE.PlaneGeometry(1.1, 0.8);
              const photoMat = new THREE.MeshStandardMaterial({
                map: texture,
                side: THREE.DoubleSide,
                roughness: 0.4,
              });
              const photo = new THREE.Mesh(photoGeo, photoMat);
              photo.position.set(0, 0.5, 0.03);
              photo.castShadow = true;
              frameGroup.add(photo);
              setLoading(false);
            },
            undefined,
            () => {
              setError("Failed to load photo texture into 3D view");
              setLoading(false);
            }
          );

          modelContainer.add(frameGroup);
          photoFrameRef.current = frameGroup;

        } else if (customization.uploadedFileType === "3d" && customization.uploadedFileUrl) {
          // 3D FILE: OBJ or STL loader
          const url = customization.uploadedFileUrl;
          const fileName = customization.uploadedFileName || "";

          // Create standard material
          const customMat = new THREE.MeshStandardMaterial({
            color: customization.color ? parseInt(customization.color.replace("#", "0x")) : 0xd4c4e8,
            roughness: customization.finish === "glossy" ? 0.2 : 0.8,
            metalness: customization.finish === "metallic" ? 0.9 : 0.1,
          });

          if (fileName.toLowerCase().endsWith(".obj")) {
            const loader = new OBJLoader();
            loader.load(
              url,
              (obj) => {
                obj.traverse((child) => {
                  if (child instanceof THREE.Mesh) {
                    child.material = customMat;
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                });

                // Auto-center and fit model on pedestal
                const box = new THREE.Box3().setFromObject(obj);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 1.0 / maxDim; // scale to 1 unit
                obj.scale.set(scale, scale, scale);

                obj.position.x = -center.x * scale;
                obj.position.y = -box.min.y * scale; // sit flat on ground/pedestal
                obj.position.z = -center.z * scale;

                const loadedGroup = new THREE.Group();
                loadedGroup.add(obj);
                modelContainer.add(loadedGroup);
                photoFrameRef.current = loadedGroup; // store reference for deletion
                setLoading(false);
              },
              undefined,
              (err) => {
                console.error(err);
                setError("Could not parse OBJ 3D model properly.");
                setLoading(false);
              }
            );
          } else if (fileName.toLowerCase().endsWith(".stl")) {
            const loader = new STLLoader();
            loader.load(
              url,
              (geometry) => {
                const mesh = new THREE.Mesh(geometry, customMat);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Auto-center and fit STL model on pedestal
                geometry.computeBoundingBox();
                const box = geometry.boundingBox || new THREE.Box3();
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 1.0 / maxDim;
                mesh.scale.set(scale, scale, scale);

                mesh.position.x = -center.x * scale;
                mesh.position.y = -box.min.y * scale;
                mesh.position.z = -center.z * scale;

                const loadedGroup = new THREE.Group();
                loadedGroup.add(mesh);
                modelContainer.add(loadedGroup);
                photoFrameRef.current = loadedGroup;
                setLoading(false);
              },
              undefined,
              (err) => {
                console.error(err);
                setError("Could not parse STL 3D model properly.");
                setLoading(false);
              }
            );
          } else {
            setLoading(false);
          }
        } else {
          // Restore default figure if no files uploaded
          if (defaultModelRef.current) {
            defaultModelRef.current.visible = true;
          }
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading content");
        setLoading(false);
      }
    };

    handleUploadedContent();
  }, [customization]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl z-10 transition-all">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7c3aed] border-t-transparent"></div>
          <span className="mt-4 text-sm font-semibold text-[#4c1c5c] animate-pulse">
            Configuring 3D Studio...
          </span>
        </div>
      )}

      {/* Error Popup */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex items-center justify-between shadow-md">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-2 font-bold hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {/* Visual Controls Hints */}
      <div className="absolute top-4 left-4 pointer-events-none select-none bg-white/60 backdrop-blur-sm border border-violet-100 rounded-xl px-3 py-2 text-[10px] text-violet-800 space-y-1">
        <p className="font-semibold">✦ 3D Studio Viewer</p>
        <p>• Left Click + Drag to Rotate</p>
        <p>• Right Click + Drag to Pan</p>
        <p>• Scroll to Zoom</p>
      </div>
    </div>
  );
}
