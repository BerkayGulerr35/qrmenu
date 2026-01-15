"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Loader2,
  QrCode,
  Eye,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  primaryColor: string;
  categories: Category[];
}

export default function RestoranDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  async function fetchRestaurant() {
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
      } else {
        toast.error("Restoran bulunamadı");
        router.push("/dashboard/restoranlar");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function updateRestaurant(data: Partial<Restaurant>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Kaydedildi");
        fetchRestaurant();
      } else {
        toast.error("Bir hata oluştu");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function addCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const res = await fetch(`/api/restaurants/${id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success("Kategori eklendi");
        setCategoryDialogOpen(false);
        fetchRestaurant();
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function deleteCategory(categoryId: string) {
    if (!confirm("Bu kategori ve içindeki tüm ürünler silinecek. Emin misiniz?")) return;

    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Kategori silindi");
        fetchRestaurant();
      } else {
        toast.error("Bir hata oluştu");
      }
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
    };

    try {
      const res = await fetch(`/api/categories/${selectedCategoryId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Ürün eklendi");
        setItemDialogOpen(false);
        fetchRestaurant();
      } else {
        const result = await res.json();
        toast.error(result.error);
      }
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function deleteItem(itemId: string) {
    if (!confirm("Bu ürün silinecek. Emin misiniz?")) return;

    try {
      const res = await fetch(`/api/items/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Ürün silindi");
        fetchRestaurant();
      } else {
        toast.error("Bir hata oluştu");
      }
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function toggleItemAvailability(itemId: string, isAvailable: boolean) {
    try {
      await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });
      fetchRestaurant();
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/restoranlar"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/menu/${restaurant.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Menüyü Gör
            </Button>
          </Link>
          <Link href={`/dashboard/restoranlar/${id}/qr`}>
            <Button variant="outline" size="sm">
              <QrCode className="w-4 h-4 mr-1" />
              QR Kod
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: restaurant.primaryColor }}
        >
          {restaurant.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">/{restaurant.slug}</p>
        </div>
      </div>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList>
          <TabsTrigger value="menu">Menü</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Kategoriler & Ürünler</h2>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Kategori Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kategori</DialogTitle>
                  <DialogDescription>
                    Menünüze yeni bir kategori ekleyin
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Kategori Adı</Label>
                    <Input
                      id="categoryName"
                      name="name"
                      placeholder="Örn: Ana Yemekler"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Kategori Ekle
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {restaurant.categories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Henüz kategori eklenmemiş
                </p>
                <Button onClick={() => setCategoryDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Kategoriyi Ekle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {restaurant.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          ({category.items.length} ürün)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setItemDialogOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ürün Ekle
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {category.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Bu kategoride henüz ürün yok
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              !item.isAvailable ? "opacity-50" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">
                                ₺{item.price.toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleItemAvailability(item.id, item.isAvailable)
                                }
                              >
                                {item.isAvailable ? "Gizle" : "Göster"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Add Item Dialog */}
          <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Ürün</DialogTitle>
                <DialogDescription>Kategoriye yeni bir ürün ekleyin</DialogDescription>
              </DialogHeader>
              <form onSubmit={addItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Ürün Adı</Label>
                  <Input
                    id="itemName"
                    name="name"
                    placeholder="Örn: Köfte Porsiyon"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Açıklama</Label>
                  <Textarea
                    id="itemDescription"
                    name="description"
                    placeholder="Ürün açıklaması"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemPrice">Fiyat (₺)</Label>
                  <Input
                    id="itemPrice"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Ürün Ekle
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Restoran Ayarları</CardTitle>
              <CardDescription>
                Restoranınızın bilgilerini düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateRestaurant({
                    name: formData.get("name") as string,
                    description: formData.get("description") as string,
                    address: formData.get("address") as string,
                    phone: formData.get("phone") as string,
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Restoran Adı</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={restaurant.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={restaurant.description || ""}
                    rows={3}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={restaurant.address || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={restaurant.phone || ""}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Kaydet
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
