export default function TopUpPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4 font-headline">Top Up Game</h1>
      <p className="text-muted-foreground text-lg">
        This is the top-up page for game with ID: <span className="text-primary font-mono">{params.id}</span>.
      </p>
      <p className="text-muted-foreground text-lg">Content will be added here soon.</p>
    </div>
  );
}
