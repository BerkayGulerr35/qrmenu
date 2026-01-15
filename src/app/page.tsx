import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, Zap, Smartphone, Shield, ArrowRight, Check, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - Apple style glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">QRMenum</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/giris">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Giriş
              </Button>
            </Link>
            <Link href="/kayit">
              <Button size="sm" className="rounded-full px-4">
                Başla
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Clean & Minimal */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Dijital menü çözümü
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Menünüzü
            <br />
            <span className="gradient-text">dijitale taşıyın</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            QR kod ile erişilebilen modern dijital menü sistemi. 
            Dakikalar içinde oluşturun, anında güncelleyin.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/kayit">
              <Button size="lg" className="rounded-full px-8 h-12 text-base">
                Ücretsiz Başla
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                Demo İncele
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Apple Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Neden QRMenum?
            </h2>
            <p className="text-muted-foreground text-lg">
              Modern restoran yönetimi için tasarlandı
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="Anında Güncelleme"
              description="Fiyat değişikliği veya yeni ürün ekleme saniyeler içinde. QR kod hiç değişmez."
            />
            <FeatureCard
              icon={<Smartphone className="w-5 h-5" />}
              title="Her Cihazda Mükemmel"
              description="Mobil öncelikli tasarım. Her ekran boyutunda kusursuz deneyim."
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="Temassız & Hijyenik"
              description="Kağıt menülere elveda. Müşterileriniz için güvenli deneyim."
            />
          </div>
        </div>
      </section>

      {/* Pricing - Clean Cards */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Basit fiyatlandırma
            </h2>
            <p className="text-muted-foreground text-lg">
              Gizli ücret yok. İstediğiniz zaman iptal edin.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card rounded-2xl p-8 shadow-apple hover-lift">
              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground mb-2">Ücretsiz</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₺0</span>
                  <span className="text-muted-foreground">/ay</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="1 restoran" />
                <PricingFeature text="50 ürüne kadar" />
                <PricingFeature text="QR kod oluşturma" />
                <PricingFeature text="Mobil uyumlu menü" />
              </ul>
              <Link href="/kayit" className="block">
                <Button variant="outline" className="w-full rounded-full h-11">
                  Başla
                </Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-foreground text-background rounded-2xl p-8 shadow-apple hover-lift relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-background text-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Popüler
                </span>
              </div>
              <div className="mb-8">
                <p className="text-sm font-medium opacity-70 mb-2">Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₺99</span>
                  <span className="opacity-70">/ay</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Sınırsız restoran" inverted />
                <PricingFeature text="Sınırsız ürün" inverted />
                <PricingFeature text="Özel tema renkleri" inverted />
                <PricingFeature text="Logo yükleme" inverted />
                <PricingFeature text="Öncelikli destek" inverted />
              </ul>
              <Link href="/kayit" className="block">
                <Button variant="secondary" className="w-full rounded-full h-11 bg-background text-foreground hover:bg-background/90">
                  Pro'ya Geç
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Hemen başlayın
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            5 dakikada ilk menünüzü oluşturun.
          </p>
          <Link href="/kayit">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg">
              Ücretsiz Hesap Oluştur
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center">
              <QrCode className="w-3 h-3 text-background" />
            </div>
            <span className="font-medium text-sm">QRMenum</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 QRMenum. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-apple hover-lift">
      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function PricingFeature({ text, inverted = false }: { text: string; inverted?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${inverted ? 'bg-background/20' : 'bg-secondary'}`}>
        <Check className={`w-3 h-3 ${inverted ? 'text-background' : 'text-foreground'}`} />
      </div>
      <span className={inverted ? 'opacity-90' : ''}>{text}</span>
    </li>
  );
}
