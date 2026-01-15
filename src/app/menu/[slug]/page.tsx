import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Phone, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) {
    return { title: "Menü Bulunamadı" };
  }

  return {
    title: `${restaurant.name} - Dijital Menü`,
    description: restaurant.description || `${restaurant.name} dijital menüsü`,
  };
}

export default async function MenuPage({ params }: PageProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header
        className="relative h-48 md:h-64 flex items-end"
        style={{ backgroundColor: restaurant.primaryColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="text-white/80">{restaurant.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-3 text-white/80 text-sm">
            {restaurant.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {restaurant.address}
              </span>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1 hover:text-white"
              >
                <Phone className="w-4 h-4" />
                {restaurant.phone}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {restaurant.categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Menü henüz hazırlanıyor...
          </div>
        ) : (
          <div className="space-y-10">
            {restaurant.categories.map((category) => (
              <section key={category.id}>
                <h2
                  className="text-xl font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: restaurant.primaryColor }}
                >
                  {category.name}
                </h2>
                {category.items.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Bu kategoride ürün bulunmuyor
                  </p>
                ) : (
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4 group"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div
                          className="font-bold whitespace-nowrap"
                          style={{ color: restaurant.primaryColor }}
                        >
                          ₺{item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground">
        <p>
          Powered by{" "}
          <a href="/" className="text-primary hover:underline">
            QRMenum
          </a>
        </p>
      </footer>
    </div>
  );
}
