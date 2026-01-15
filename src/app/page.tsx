import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, Zap, Shield, ArrowRight, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">QRMenum</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/giris">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/kayit">
              <Button>Ücretsiz Başla</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Dijital menü devrimi
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Restoranınız için
            <span className="text-primary block mt-2">QR Kodlu Dijital Menü</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Dakikalar içinde profesyonel dijital menünüzü oluşturun. 
            Müşterileriniz telefonlarıyla QR kodu okutarak menünüze ulaşsın.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kayit">
              <Button size="lg" className="text-lg px-8 h-14">
                Ücretsiz Başla
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Demo Menü Gör
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden QRMenum?</h2>
            <p className="text-muted-foreground text-lg">Modern restoran yönetimi için gereken her şey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Anında Güncelleme"
              description="Fiyat değişikliği? Yeni ürün? Saniyeler içinde menünüzü güncelleyin, QR kod aynı kalsın."
            />
            <FeatureCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Mobil Uyumlu"
              description="Tüm cihazlarda mükemmel görünen, hızlı yüklenen dijital menü deneyimi."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Hijyenik Çözüm"
              description="Kağıt menülere dokunmaya gerek yok. Temassız, güvenli menü deneyimi."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Basit Fiyatlandırma</h2>
            <p className="text-muted-foreground text-lg">Gizli ücret yok, istediğin zaman iptal et</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="border rounded-2xl p-8 bg-card">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Ücretsiz</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₺0</span>
                  <span className="text-muted-foreground">/ay</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="1 restoran" />
                <PricingFeature text="50 ürüne kadar" />
                <PricingFeature text="QR kod oluşturma" />
                <PricingFeature text="Mobil uyumlu menü" />
              </ul>
              <Link href="/kayit" className="block">
                <Button variant="outline" className="w-full">Başla</Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="border-2 border-primary rounded-2xl p-8 bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Popüler
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₺99</span>
                  <span className="text-muted-foreground">/ay</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="Sınırsız restoran" />
                <PricingFeature text="Sınırsız ürün" />
                <PricingFeature text="Özel renk teması" />
                <PricingFeature text="Logo yükleme" />
                <PricingFeature text="Öncelikli destek" />
              </ul>
              <Link href="/kayit" className="block">
                <Button className="w-full">Pro'ya Geç</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Dijital menüye geçmeye hazır mısınız?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            5 dakikada menünüzü oluşturun, hemen kullanmaya başlayın.
          </p>
          <Link href="/kayit">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
              Ücretsiz Hesap Oluştur
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">QRMenum</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 QRMenum. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
        <Check className="w-3 h-3 text-primary" />
      </div>
      <span>{text}</span>
    </li>
  );
}
