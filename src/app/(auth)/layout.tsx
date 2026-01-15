import Link from "next/link";
import { QrCode } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <QrCode className="w-4 h-4 text-background" />
          </div>
          <span className="font-semibold text-lg tracking-tight">QRMenum</span>
        </Link>
      </header>
      
      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* Minimal Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 QRMenum
        </p>
      </footer>
    </div>
  );
}
