import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-8">
          <QrCode className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Menü Bulunamadı
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Aradığınız restoran menüsü mevcut değil veya kaldırılmış olabilir.
        </p>
        
        <Link href="/">
          <Button className="rounded-full h-11 px-6">
            <Home className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
