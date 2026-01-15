import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MapPin, Phone, Clock } from "lucide-react";
import { MenuClient } from "./menu-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          items: {
            where: { isAvailable: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const hasItems = restaurant.categories.some((c) => c.items.length > 0);

  // Serialize data for client component
  const serializedRestaurant = {
    ...restaurant,
    createdAt: restaurant.createdAt.toISOString(),
    updatedAt: restaurant.updatedAt.toISOString(),
    categories: restaurant.categories.map((cat) => ({
      ...cat,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
      items: cat.items.map((item) => ({
        ...item,
        price: Number(item.price),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative bg-foreground text-background">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="relative px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="text-lg opacity-80 max-w-md mx-auto">
              {restaurant.description}
            </p>
          )}
          
          {/* Contact Info */}
          {(restaurant.address || restaurant.phone) && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm opacity-70">
              {restaurant.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Menu Content */}
      {!hasItems ? (
        <main className="px-6 py-8 max-w-3xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Menü hazırlanıyor</h2>
            <p className="text-muted-foreground">
              Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        </main>
      ) : (
        <MenuClient restaurant={serializedRestaurant} />
      )}

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <a 
            href="https://qrmenuqr.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            QRMenum
          </a>
        </p>
      </footer>
    </div>
  );
}
