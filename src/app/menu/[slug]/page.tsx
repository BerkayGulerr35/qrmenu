import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MapPin, Phone, Clock } from "lucide-react";

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
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const hasItems = restaurant.categories.some((c) => c.items.length > 0);

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

      {/* Category Navigation */}
      {hasItems && (
        <nav className="sticky top-0 z-40 glass border-b overflow-x-auto">
          <div className="flex items-center gap-2 px-6 py-3">
            {restaurant.categories
              .filter((c) => c.items.length > 0)
              .map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {category.name}
                </a>
              ))}
          </div>
        </nav>
      )}

      {/* Menu Content */}
      <main className="px-6 py-8 max-w-3xl mx-auto">
        {!hasItems ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Menü hazırlanıyor</h2>
            <p className="text-muted-foreground">
              Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {restaurant.categories
              .filter((c) => c.items.length > 0)
              .map((category) => (
                <section key={category.id} id={category.id}>
                  {/* Category Title */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {category.name}
                    </h2>
                    <div className="h-0.5 w-12 bg-foreground mt-2 rounded-full" />
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>

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

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
  };
}

function MenuItem({ item }: MenuItemProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-apple hover-lift">
      <div className="flex gap-4">
        {/* Image */}
        {item.image ? (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-muted-foreground/10 rounded-lg" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
            <span className="font-bold text-lg whitespace-nowrap">
              ₺{item.price.toFixed(2)}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
