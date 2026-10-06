"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileCode, ImageIcon, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

interface UploadZoneProps {
  onFileLoad: (url: string, name: string, type: "3d" | "image") => void;
  onClear: () => void;
}

export default function UploadZone({ onFileLoad, onClear }: UploadZoneProps) {
  const [fileDetails, setFileDetails] = useState<{ name: string; type: "3d" | "image" } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setErrorMsg(null);
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      let detectedType: "3d" | "image" | null = null;
      if (["obj", "stl"].includes(fileExtension || "")) {
        detectedType = "3d";
      } else if (["png", "jpg", "jpeg", "webp"].includes(fileExtension || "")) {
        detectedType = "image";
      } else {
        setErrorMsg("Unsupported file format! Please upload an image (.png, .jpg) or a 3D model (.obj, .stl)");
        return;
      }

      try {
        const objectUrl = URL.createObjectURL(file);
        setFileDetails({ name: file.name, type: detectedType });
        onFileLoad(objectUrl, file.name, detectedType);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to process the uploaded file.");
      }
    },
    [onFileLoad]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "application/octet-stream": [".obj", ".stl"],
    },
    multiple: false,
    maxSize: 40 * 1024 * 1024, // 40 MB max file size
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileDetails(null);
    setErrorMsg(null);
    onClear();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold uppercase tracking-wider text-[#4c1c5c]">
        Upload Reference / 3D Model
      </label>

      {fileDetails ? (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
              {fileDetails.type === "3d" ? <FileCode className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#4c1c5c] line-clamp-1 max-w-[180px] sm:max-w-xs">
                {fileDetails.name}
              </p>
              <p className="text-xs text-emerald-600 font-medium capitalize flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-3 w-3" /> Ready in 3D Workspace
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="rounded-full bg-white p-2 text-rose-500 shadow-sm border border-rose-100 hover:bg-rose-50 transition-all duration-200"
            title="Remove file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={[
            "group flex cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border-2 border-dashed px-5 py-8 text-center transition-all duration-300 outline-none",
            isDragActive
              ? "border-[#7c3aed] bg-violet-50/40"
              : "border-[#d4c4e8] bg-white/40 hover:border-[#7c3aed] hover:bg-white/60",
          ].join(" ")}
        >
          <input {...getInputProps()} />
          <div className="rounded-full bg-violet-100/70 p-4 text-[#7c3aed] group-hover:scale-110 transition-transform duration-300">
            <Upload className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-sm font-semibold text-[#4c1c5c]">
            {isDragActive ? "Drop the file here!" : "Drag & drop file here"}
          </h4>
          <p className="mt-1 text-xs text-[var(--color-muted)] max-w-xs">
            Supports portrait images (JPG, PNG) or 3D printable meshes (OBJ, STL) up to 40 MB
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
