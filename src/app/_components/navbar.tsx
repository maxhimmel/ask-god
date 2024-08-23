import Link from "next/link";
import { UserSplit } from "~/app/_components/userDisplays";

export async function Navbar() {
  return (
    <div className="navbar border-b-4 border-neutral bg-primary text-primary-content">
      <div className="w-full justify-between px-4">
        <div className="flex">
          <Link href="/" className="btn btn-ghost text-2xl font-bold">
            Ask God
          </Link>
        </div>
        <div className="flex">
          <UserSplit>
            <Link href="/api/auth/signout" className="btn btn-neutral">
              Sign Out
            </Link>
            <Link href="/api/auth/signin" className="btn btn-neutral">
              Sign In
            </Link>
          </UserSplit>
        </div>
      </div>
    </div>
  );
}
