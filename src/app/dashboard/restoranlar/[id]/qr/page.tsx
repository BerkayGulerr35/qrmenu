"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import QRCode from "qrcode";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  primaryColor: string;
}

export default function QRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    if (restaurant && canvasRef.current) {
      generateQR();
    }
  }, [restaurant]);

  async function fetchRestaurant() {
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
      }
    } catch {
      console.error("Error fetching restaurant");
    } finally {
      setLoading(false);
    }
  }

  async function generateQR() {
    if (!restaurant || !canvasRef.current) return;

    const menuUrl = `${window.location.origin}/menu/${restaurant.slug}`;
    
    await QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: restaurant.primaryColor,
        light: "#ffffff",
      },
    });
  }

  function downloadQR() {
    if (!canvasRef.current || !restaurant) return;

    const link = document.createElement("a");
    link.download = `${restaurant.slug}-qr-kod.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!restaurant) return null;

  const menuUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${restaurant.slug}`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href={`/dashboard/restoranlar/${id}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Link>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{restaurant.name} - QR Kod</CardTitle>
          <CardDescription>
            Bu QR kodu müşterilerinizin görebileceği bir yere yerleştirin
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <canvas ref={canvasRef} />
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">Menü Linki:</p>
            <code className="bg-muted px-3 py-2 rounded-lg text-sm break-all">
              {menuUrl}
            </code>
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadQR}>
              <Download className="w-4 h-4 mr-2" />
              QR Kodu İndir
            </Button>
            <Link href={`/menu/${restaurant.slug}`} target="_blank">
              <Button variant="outline">Menüyü Aç</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Print Template */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Kullanım Önerileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>✓ QR kodu masa üstü standlara yerleştirin</p>
          <p>✓ Menü kartlarının üzerine yapıştırın</p>
          <p>✓ Giriş kapısı veya vitrine asın</p>
          <p>✓ Sosyal medya hesaplarınızda paylaşın</p>
        </CardContent>
      </Card>
    </div>
  );
}
