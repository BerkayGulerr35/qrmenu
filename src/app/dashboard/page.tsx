import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, QrCode, Eye, Plus } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Merhaba, {session?.user.name}! 👋</h1>
          <p className="text-muted-foreground">İşte restoranlarınızın özeti</p>
        </div>
        <Link href="/dashboard/restoranlar/yeni">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Restoran
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{restaurants.length}</p>
                <p className="text-sm text-muted-foreground">Restoran</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{restaurants.length}</p>
                <p className="text-sm text-muted-foreground">QR Kod</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-muted-foreground">Ürün</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle>Restoranlarınız</CardTitle>
          <CardDescription>En son eklenen restoranlar</CardDescription>
        </CardHeader>
        <CardContent>
          {restaurants.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Henüz restoran eklemediniz</h3>
              <p className="text-muted-foreground mb-4">
                İlk restoranınızı ekleyerek dijital menünüzü oluşturun
              </p>
              <Link href="/dashboard/restoranlar/yeni">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Restoran Ekle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: restaurant.primaryColor }}
                    >
                      {restaurant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {restaurant.categories.reduce((a, c) => a + c.items.length, 0)} ürün
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/menu/${restaurant.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Görüntüle
                      </Button>
                    </Link>
                    <Link href={`/dashboard/restoranlar/${restaurant.id}`}>
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
