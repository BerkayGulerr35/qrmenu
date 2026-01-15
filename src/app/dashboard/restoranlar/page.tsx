import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Plus, Eye, Settings, QrCode } from "lucide-react";

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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Restoranlarım</h1>
          <p className="text-muted-foreground">Tüm restoranlarınızı buradan yönetin</p>
        </div>
        <Link href="/dashboard/restoranlar/yeni">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Restoran
          </Button>
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Henüz restoran eklemediniz</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                İlk restoranınızı ekleyerek dijital menünüzü oluşturun ve müşterilerinize sunun
              </p>
              <Link href="/dashboard/restoranlar/yeni">
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Restoranı Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-24 flex items-center justify-center"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="h-16 w-16 object-contain rounded-lg bg-white p-2"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {restaurant.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {restaurant.categories.length} kategori • {restaurant.categories.reduce((a, c) => a + c.items.length, 0)} ürün
                </p>
                <div className="flex gap-2">
                  <Link href={`/menu/${restaurant.slug}`} target="_blank" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      Görüntüle
                    </Button>
                  </Link>
                  <Link href={`/dashboard/restoranlar/${restaurant.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-1" />
                      Düzenle
                    </Button>
                  </Link>
                  <Link href={`/dashboard/restoranlar/${restaurant.id}/qr`}>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
