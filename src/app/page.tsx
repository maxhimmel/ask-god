import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content">hello world</div>
      </main>
    </HydrateClient>
  );
}
