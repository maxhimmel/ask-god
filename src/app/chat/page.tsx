import { GodChat } from "~/app/_components/godChat";
import { HydrateClient } from "~/trpc/server";

export default function Chat() {
  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex flex-col">
          <h1 className="text-4xl font-extralight">
            Converse with a Higher Power about anything on your mind.
          </h1>
          <GodChat />
        </div>
      </main>
    </HydrateClient>
  );
}
