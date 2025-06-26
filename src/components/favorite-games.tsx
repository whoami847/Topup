
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

interface TopUpCategoriesProps {
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
}

export function TopUpCategories({ selectedCategory, setSelectedCategory }: TopUpCategoriesProps) {
  const { mainCategories, topUpCategories } = useAppStore();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const getSubCategories = () => {
    if (!selectedCategory) return [];
    const mainCat = mainCategories.find((c) => c.id === selectedCategory);
    if (!mainCat) return [];
    return topUpCategories.filter((sub) => mainCat.subCategorySlugs.includes(sub.slug));
  };

  const subCategories = getSubCategories();

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container">
        <div className="flex items-center justify-center mb-8 md:mb-12 relative">
          {selectedCategory && (
            <div className="absolute left-0">
                <Button variant="ghost" onClick={handleBackClick}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline px-16">
            {selectedCategory
              ? mainCategories.find((c) => c.id === selectedCategory)?.title
              : "Choose a Category"}
          </h2>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-in fade-in-50 duration-500">
            {mainCategories.map((category) => (
              <div
                key={category.id}
                className="group block cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-primary/40 hover:shadow-lg hover:-translate-y-2 border-2 border-transparent hover:border-primary/80">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.imageHint}
                      />
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                          <h3 className="font-semibold text-center p-4 truncate text-lg text-primary-foreground">
                              {category.title}
                          </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 animate-in fade-in-20 slide-in-from-left-12 duration-500">
            {subCategories.map((category) => (
              <Link href={`/top-up/${category.slug}`} key={category.id} className="group block">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-primary/40 hover:shadow-lg hover:-translate-y-2 border-2 border-transparent hover:border-primary/80">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.imageHint}
                      />
                       <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                          <h3 className="font-semibold text-center p-3 sm:p-4 truncate text-sm sm:text-base text-primary-foreground">{category.title}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
