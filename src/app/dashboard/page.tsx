import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, QrCode, Eye, Plus, ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
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

  const totalItems = restaurants.reduce(
    (acc, r) => acc + r.categories.reduce((a, c) => a + c.items.length, 0),
    0
  );

  const totalCategories = restaurants.reduce(
    (acc, r) => acc + r.categories.length,
    0
  );

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Hoş geldiniz{session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Restoranlarınızı ve menülerinizi yönetin
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            title="Restoranlar"
            value={restaurants.length}
            icon={<Store className="w-5 h-5" />}
          />
          <StatCard
            title="Kategoriler"
            value={totalCategories}
            icon={<QrCode className="w-5 h-5" />}
          />
          <StatCard
            title="Ürünler"
            value={totalItems}
            icon={<Eye className="w-5 h-5" />}
          />
        </div>

        {/* Restaurant List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Restoranlarınız</h2>
          <Link href="/dashboard/restoranlar/yeni">
            <Button className="rounded-full h-9 px-4">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ekle
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

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-apple">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
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
}

function RestaurantCard({ restaurant }: { restaurant: RestaurantWithDetails }) {
  const itemCount = restaurant.categories.reduce((a, c) => a + c.items.length, 0);
  
  return (
    <Link href={`/dashboard/restoranlar/${restaurant.id}`}>
      <div className="bg-card rounded-2xl p-6 shadow-apple hover-lift group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">
                  /{restaurant.slug}
                </p>
              </div>
            </div>
            {restaurant.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {restaurant.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>{restaurant.categories.length} kategori</span>
              <span>•</span>
              <span>{itemCount} ürün</span>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </Link>
  );
}
