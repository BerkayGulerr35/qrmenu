"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

interface Restaurant {
  name: string;
  categories: Category[];
}

interface MenuClientProps {
  restaurant: Restaurant;
}

export function MenuClient({ restaurant }: MenuClientProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <>
      {/* Category Navigation */}
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

      {/* Menu Items */}
      <main className="px-6 py-8 max-w-3xl mx-auto">
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
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full text-left bg-card rounded-2xl p-4 shadow-apple hover-lift transition-all active:scale-[0.98]"
                    >
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
                    </button>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedItem(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          
          {/* Modal */}
          <div 
            className="relative bg-background w-full max-w-lg mx-4 rounded-t-3xl sm:rounded-3xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Image */}
            {selectedItem.image ? (
              <div className="w-full aspect-square bg-secondary">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-secondary flex items-center justify-center">
                <div className="w-20 h-20 bg-muted-foreground/10 rounded-2xl" />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                <span className="text-2xl font-bold text-primary whitespace-nowrap">
                  ₺{selectedItem.price.toFixed(2)}
                </span>
              </div>
              
              {selectedItem.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>

            {/* Bottom Safe Area for Mobile */}
            <div className="h-6 sm:hidden" />
          </div>
        </div>
      )}
    </>
  );
}
