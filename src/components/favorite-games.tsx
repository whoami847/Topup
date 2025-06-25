import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { topUpCategories } from "@/lib/products";

export function FavoriteGames() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
          Favourite Games & Top Ups
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {topUpCategories.map((category) => (
            <Link href={`/top-up/${category.slug}`} key={category.id} className="group block">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-primary/40 hover:shadow-lg hover:-translate-y-2 border-2 border-transparent hover:border-primary/80 bg-secondary">
                <CardContent className="p-0">
                  <div className="aspect-[1/1] relative">
                    <Image
                      src={category.imageUrl}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.imageHint}
                    />
                  </div>
                  <h3 className="font-semibold text-center p-3 sm:p-4 truncate text-sm sm:text-base">{category.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
