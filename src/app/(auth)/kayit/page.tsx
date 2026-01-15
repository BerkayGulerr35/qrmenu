"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check } from "lucide-react";

export default function KayitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Kayıt başarısız");
        return;
      }

      // Otomatik giriş
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      toast.success("Hesabınız oluşturuldu!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Hesap oluşturun</h1>
        <p className="text-muted-foreground">
          5 dakikada ilk menünüzü oluşturun
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            İsim
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Adınız"
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            E-posta
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ornek@email.com"
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Şifre
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="En az 6 karakter"
            required
            minLength={6}
            disabled={isLoading}
            className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-foreground"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl text-base font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Hesap Oluştur
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Benefits */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3" />
          </div>
          Ücretsiz başlangıç, kredi kartı gerekmez
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3" />
          </div>
          Dakikalar içinde menünüzü yayınlayın
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link 
            href="/giris" 
            className="text-foreground font-medium hover:underline"
          >
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
