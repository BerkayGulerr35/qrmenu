import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, Plus, ArrowUpRight, QrCode, ExternalLink } from "lucide-react";

export default async function RestoranlarPage() {
  const session = await getServerSession(authOptions);
  
  const restaurants = await db.restaurant.findMany({
    where: { userId: session!.user.id },
    include: {
      categories: {
        include: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Restoranlar</h1>
            <p className="text-muted-foreground">
              Tüm restoranlarınızı görüntüleyin ve yönetin
            </p>
          </div>
          <Link href="/dashboard/restoranlar/yeni">
            <Button className="rounded-full h-10 px-5">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Restoran
            </Button>
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-card rounded-2xl p-12 shadow-apple text-center">
      <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Store className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Henüz restoran yok</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        İlk restoranınızı ekleyerek dijital menü oluşturmaya başlayın.
      </p>
      <Link href="/dashboard/restoranlar/yeni">
        <Button className="rounded-full h-11 px-6">
          <Plus className="w-4 h-4 mr-2" />
          İlk Restoranı Ekle
        </Button>
      </Link>
    </div>
  );
}

interface RestaurantWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categories: {
    items: { id: string }[];
  }[];
  createdAt: Date;
}

function RestaurantCard({ restaurant }: { restaurant: RestaurantWithDetails }) {
  const itemCount = restaurant.categories.reduce((a, c) => a + c.items.length, 0);
  
  return (
    <div className="bg-card rounded-2xl shadow-apple overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">
                qrmenuqr.vercel.app/menu/{restaurant.slug}
              </p>
            </div>
          </div>
        </div>
        
        {restaurant.description && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
            {restaurant.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>{restaurant.categories.length} kategori</span>
          <span>•</span>
          <span>{itemCount} ürün</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="border-t p-4 bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/restoranlar/${restaurant.id}/qr`}>
            <Button variant="outline" size="sm" className="rounded-full h-9 px-4">
              <QrCode className="w-4 h-4 mr-2" />
              QR Kod
            </Button>
          </Link>
          <Link href={`/menu/${restaurant.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="rounded-full h-9 px-4">
              <ExternalLink className="w-4 h-4 mr-2" />
              Menüyü Gör
            </Button>
          </Link>
        </div>
        <Link href={`/dashboard/restoranlar/${restaurant.id}`}>
          <Button size="sm" className="rounded-full h-9 px-4">
            Düzenle
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
