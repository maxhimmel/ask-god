import Link from "next/link";
import { SignInOutSplit } from "~/app/_components/userDisplays";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex h-screen w-screen flex-col gap-6 bg-base-200">
          <div className="flex flex-col gap-4 px-52 text-center">
            <h1 className="text-6xl font-semibold">
              {/* Have a chat with your own conception of a Higher Power */}
              If you could ask God one question, what would it be?
            </h1>
            <p className="text-2xl font-extralight">
              Get started using AI to chat with your own conception of a Higher
              Power.
            </p>
          </div>
          <SignInOutSplit>
            <Link href="/chat" className="btn btn-primary mx-auto">
              Start Chatting
            </Link>
            <Link href="/api/auth/signin" className="btn btn-primary mx-auto">
              Get Started
            </Link>
          </SignInOutSplit>
        </div>
      </main>
    </HydrateClient>
  );
}
