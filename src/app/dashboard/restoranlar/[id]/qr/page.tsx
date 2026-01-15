"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Copy, Check, ExternalLink, Printer } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

export default function QRPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const menuUrl = restaurant ? `https://qrmenuqr.vercel.app/menu/${restaurant.slug}` : "";

  useEffect(() => {
    fetchRestaurant();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (restaurant && canvasRef.current) {
      generateQR();
    }
  }, [restaurant]);

  async function fetchRestaurant() {
    try {
      const res = await fetch(`/api/restaurants/${resolvedParams.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRestaurant(data);
    } catch {
      toast.error("Restoran bulunamadı");
      router.push("/dashboard/restoranlar");
    } finally {
      setIsLoading(false);
    }
  }

  async function generateQR() {
    if (!canvasRef.current || !restaurant) return;
    
    await QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  }

  function downloadQR() {
    if (!canvasRef.current || !restaurant) return;
    
    const link = document.createElement("a");
    link.download = `${restaurant.slug}-qr.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    toast.success("QR kod indirildi");
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success("Link kopyalandı");
    setTimeout(() => setCopied(false), 2000);
  }

  function printQR() {
    if (!canvasRef.current) return;
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${restaurant?.name} - QR Kod</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            img {
              width: 300px;
              height: 300px;
            }
            p {
              margin-top: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>${restaurant?.name}</h1>
          <img src="${canvasRef.current.toDataURL("image/png")}" alt="QR Code" />
          <p>Menümüzü görmek için QR kodu okutun</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href={`/dashboard/restoranlar/${resolvedParams.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {restaurant.name}
        </Link>

        {/* QR Card */}
        <div className="bg-card rounded-3xl shadow-apple p-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2">{restaurant.name}</h1>
          <p className="text-muted-foreground mb-8">
            Bu QR kodu müşterilerinizin görebileceği bir yere yerleştirin
          </p>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 inline-block shadow-sm mb-8">
            <canvas ref={canvasRef} className="block" />
          </div>

          {/* URL */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Menü Linki</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-sm font-mono">{menuUrl}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={copyUrl}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={downloadQR}
              className="w-full sm:w-auto rounded-full h-11 px-6"
            >
              <Download className="w-4 h-4 mr-2" />
              PNG İndir
            </Button>
            <Button
              variant="outline"
              onClick={printQR}
              className="w-full sm:w-auto rounded-full h-11 px-6"
            >
              <Printer className="w-4 h-4 mr-2" />
              Yazdır
            </Button>
            <Link href={`/menu/${restaurant.slug}`} target="_blank" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full rounded-full h-11 px-6"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Menüyü Gör
              </Button>
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-secondary/30 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">💡 İpuçları</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• QR kodu masa numaranızın yanına yerleştirin</li>
            <li>• Yeterince büyük boyutta yazdırın (en az 3x3 cm)</li>
            <li>• Laminasyon ile uzun ömürlü kullanın</li>
            <li>• Menüyü güncellediğinizde QR kod değişmez</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
