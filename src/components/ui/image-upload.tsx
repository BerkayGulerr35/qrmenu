"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = "menu-items", className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Sadece JPEG, PNG, WebP ve GIF formatları destekleniyor");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalı");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      onChange(data.url);
      toast.success("Görsel yüklendi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Yükleme başarısız");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
        disabled={isUploading}
      />

      {value ? (
        <div className="relative group">
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-secondary">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full h-9 px-4"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1" />
                  Değiştir
                </>
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="rounded-full h-9 w-9"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-square rounded-xl border-2 border-dashed border-border hover:border-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 bg-secondary/30"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Görsel Yükle</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
