import { AskGod } from "~/app/_components/askGod";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex flex-col">
          <h1 className="text-4xl font-extralight">
            Ask a Higher Power for help.
          </h1>
          <AskGod />
        </div>
      </main>
    </HydrateClient>
  );
}
