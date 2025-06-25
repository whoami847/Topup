import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const favoriteGames = [
  { id: 1, title: "Free Fire", imageUrl: "https://placehold.co/400x500.png", hint: "fire character" },
  { id: 2, title: "Mobile Legends", imageUrl: "https://placehold.co/400x500.png", hint: "fantasy warrior" },
  { id: 3, title: "PUBG Mobile", imageUrl: "https://placehold.co/400x500.png", hint: "soldier helmet" },
  { id: 4, title: "Genshin Impact", imageUrl: "https://placehold.co/400x500.png", hint: "anime adventure" },
  { id: 5, title: "Valorant", imageUrl: "https://placehold.co/400x500.png", hint: "sci-fi agent" },
  { id: 6, title: "Call of Duty: Mobile", imageUrl: "https://placehold.co/400x500.png", hint: "modern warfare" },
];

export function FavoriteGames() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
          Favourite Games
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {favoriteGames.map((game) => (
            <Link href={`/top-up/${game.id}`} key={game.id} className="group block">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-primary/40 hover:shadow-lg hover:-translate-y-2 border-2 border-transparent hover:border-primary/80 bg-secondary">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={game.imageUrl}
                      alt={game.title}
                      fill
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={game.hint}
                    />
                  </div>
                  <h3 className="font-semibold text-center p-4 truncate">{game.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
