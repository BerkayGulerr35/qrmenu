"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  QrCode,
  ExternalLink,
  Store,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Item {
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
  items: Item[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  categories: Category[];
}

export default function RestoranDuzenlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "settings">("menu");

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurant();
  }, [resolvedParams.id]);

  async function fetchRestaurant() {
    try {
      const res = await fetch(`/api/restaurants/${resolvedParams.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRestaurant(data);
      setName(data.name);
      setSlug(data.slug);
      setDescription(data.description || "");
      setAddress(data.address || "");
      setPhone(data.phone || "");
    } catch {
      toast.error("Restoran bulunamadı");
      router.push("/dashboard/restoranlar");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSettings() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/restaurants/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, address, phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Değişiklikler kaydedildi");
      fetchRestaurant();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRestaurant() {
    if (!confirm("Bu restoranı silmek istediğinize emin misiniz?")) return;
    
    try {
      await fetch(`/api/restaurants/${resolvedParams.id}`, { method: "DELETE" });
      toast.success("Restoran silindi");
      router.push("/dashboard/restoranlar");
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  // Category functions
  async function saveCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("categoryName") as string;

    try {
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
        toast.success("Kategori güncellendi");
      } else {
        await fetch(`/api/restaurants/${resolvedParams.id}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
        toast.success("Kategori eklendi");
      }
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      fetchRestaurant();
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Bu kategoriyi ve içindeki tüm ürünleri silmek istediğinize emin misiniz?")) return;
    
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      toast.success("Kategori silindi");
      fetchRestaurant();
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  // Item functions
  async function saveItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get("itemName") as string,
      description: formData.get("itemDescription") as string || null,
      price: parseFloat(formData.get("itemPrice") as string),
      image: formData.get("itemImageUrl") as string || null,
    };

    try {
      if (editingItem) {
        await fetch(`/api/items/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
        toast.success("Ürün güncellendi");
      } else {
        await fetch(`/api/categories/${selectedCategoryId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
        toast.success("Ürün eklendi");
      }
      setItemDialogOpen(false);
      setEditingItem(null);
      setSelectedCategoryId(null);
      fetchRestaurant();
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      toast.success("Ürün silindi");
      fetchRestaurant();
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  async function toggleItemAvailability(item: Item) {
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      fetchRestaurant();
    } catch {
      toast.error("Bir hata oluştu");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/restoranlar" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Restoranlar
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                <Store className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{restaurant.name}</h1>
                <p className="text-muted-foreground">/{restaurant.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/menu/${restaurant.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="rounded-full h-9 px-4">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Menüyü Gör
                </Button>
              </Link>
              <Link href={`/dashboard/restoranlar/${resolvedParams.id}/qr`}>
                <Button size="sm" className="rounded-full h-9 px-4">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Kod
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl w-fit mb-8">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "menu" 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Menü
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "settings" 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ayarlar
          </button>
        </div>

        {/* Content */}
        {activeTab === "menu" ? (
          <div className="space-y-6">
            {/* Add Category Button */}
            <div className="flex justify-end">
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="rounded-full h-10 px-5"
                    onClick={() => setEditingCategory(null)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kategori
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={saveCategory} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Kategori Adı</Label>
                      <Input
                        id="categoryName"
                        name="categoryName"
                        defaultValue={editingCategory?.name}
                        placeholder="Örn: Ana Yemekler"
                        required
                        className="h-12 rounded-xl bg-secondary/50 border-0"
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl">
                      {editingCategory ? "Güncelle" : "Ekle"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Categories */}
            {restaurant.categories.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 shadow-apple text-center">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Henüz kategori yok</h3>
                <p className="text-muted-foreground mb-6">
                  İlk kategorinizi ekleyerek menünüzü oluşturmaya başlayın.
                </p>
              </div>
            ) : (
              restaurant.categories.map((category) => (
                <div key={category.id} className="bg-card rounded-2xl shadow-apple overflow-hidden">
                  {/* Category Header */}
                  <div className="p-5 border-b flex items-center justify-between bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <h3 className="font-semibold">{category.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({category.items.length} ürün)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-8 px-3"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setEditingItem(null);
                          setItemDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ürün Ekle
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryDialogOpen(true);
                            }}
                            className="rounded-lg"
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteCategory(category.id)}
                            className="text-destructive focus:text-destructive rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Items */}
                  {category.items.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Bu kategoride henüz ürün yok
                    </div>
                  ) : (
                    <div className="divide-y">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 flex items-center gap-4 ${
                            !item.isAvailable ? "opacity-50" : ""
                          }`}
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                          
                          {/* Item Image */}
                          <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-muted-foreground/20 rounded-lg" />
                            )}
                          </div>

                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold">₺{Number(item.price).toFixed(2)}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full h-8 w-8"
                              onClick={() => toggleItemAvailability(item)}
                            >
                              {item.isAvailable ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full h-8 w-8"
                              onClick={() => {
                                setEditingItem(item);
                                setSelectedCategoryId(category.id);
                                setItemDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Settings Tab */
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-apple space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Restoran Adı</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl bg-secondary/50 border-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Adresi</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      qrmenuqr.vercel.app/menu/
                    </span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="rounded-xl bg-secondary/50 border-0 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="rounded-full h-11 px-6"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card rounded-2xl p-6 shadow-apple border border-destructive/20">
              <h3 className="font-semibold text-destructive mb-2">Tehlikeli Alan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bu restoranı sildiğinizde tüm kategoriler ve ürünler de silinecektir.
              </p>
              <Button
                variant="outline"
                className="text-destructive border-destructive/50 hover:bg-destructive/10 rounded-full"
                onClick={deleteRestaurant}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Restoranı Sil
              </Button>
            </div>
          </div>
        )}

        {/* Item Dialog */}
        <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Ürün Düzenle" : "Yeni Ürün"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={saveItem} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Ürün Adı</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  defaultValue={editingItem?.name}
                  placeholder="Örn: Margherita Pizza"
                  required
                  className="h-12 rounded-xl bg-secondary/50 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemDescription">Açıklama</Label>
                <Textarea
                  id="itemDescription"
                  name="itemDescription"
                  defaultValue={editingItem?.description || ""}
                  placeholder="Ürün açıklaması..."
                  rows={2}
                  className="rounded-xl bg-secondary/50 border-0 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemPrice">Fiyat (₺)</Label>
                <Input
                  id="itemPrice"
                  name="itemPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingItem?.price}
                  placeholder="0.00"
                  required
                  className="h-12 rounded-xl bg-secondary/50 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemImageUrl">Görsel URL (opsiyonel)</Label>
                <Input
                  id="itemImageUrl"
                  name="itemImageUrl"
                  type="url"
                  defaultValue={editingItem?.image || ""}
                  placeholder="https://..."
                  className="h-12 rounded-xl bg-secondary/50 border-0"
                />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl">
                {editingItem ? "Güncelle" : "Ekle"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
