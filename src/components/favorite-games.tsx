
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.imageHint}
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="p-4">
                    <CardTitle className="text-center text-lg">{category.title}</CardTitle>
                  </CardHeader>
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.imageHint}
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-center text-sm sm:text-base truncate">{category.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
