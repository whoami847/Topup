
export default function TutorialPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-6 font-headline">How to Top Up</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-8">
          Follow this short video tutorial to learn how to quickly and securely top up your account and purchase your favorite in-game items.
        </p>
        <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl border bg-card">
          <iframe
            className="w-full h-full border-0"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
