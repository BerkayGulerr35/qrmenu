"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Store, Globe, FileText, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function YeniRestoranPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [slug, setSlug] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string || undefined,
      address: formData.get("address") as string || undefined,
      phone: formData.get("phone") as string || undefined,
    };

    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Bir hata oluştu");
        return;
      }

      toast.success("Restoran oluşturuldu!");
      router.push(`/dashboard/restoranlar/${result.id}`);
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard/restoranlar" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Restoranlar
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Yeni Restoran</h1>
          <p className="text-muted-foreground">
            Restoran bilgilerini girerek dijital menünüzü oluşturun
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-card rounded-2xl p-6 shadow-apple space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">Temel Bilgiler</h2>
                <p className="text-sm text-muted-foreground">Restoran adı ve URL adresi</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Restoran Adı
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Örn: Cafe Milano"
                  required
                  disabled={isLoading}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  URL Adresi
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    qrmenuqr.vercel.app/menu/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cafe-milano"
                    required
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sadece küçük harf, rakam ve tire kullanın
                </p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-card rounded-2xl p-6 shadow-apple space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">Detaylar</h2>
                <p className="text-sm text-muted-foreground">Opsiyonel bilgiler</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Restoranınız hakkında kısa bir açıklama..."
                  rows={3}
                  disabled={isLoading}
                  className="rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adres
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Örn: Kadıköy, İstanbul"
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Örn: 0532 123 45 67"
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/dashboard/restoranlar">
              <Button type="button" variant="outline" className="rounded-full h-11 px-6">
                İptal
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="rounded-full h-11 px-8" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Restoran Oluştur"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
