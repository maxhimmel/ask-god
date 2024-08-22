import { getServerAuthSession } from "~/server/auth";

export type HasUser = React.ReactNode;
export type NoUser = React.ReactNode;

export async function UserSplit({ children }: { children: [HasUser, NoUser] }) {
  const session = await getServerAuthSession();

  if (session?.user) {
    return <>{children[0]}</>;
  } else {
    return <>{children[1]}</>;
  }
}

interface Props {
  children: React.ReactNode;
}

export async function HasUser({ children }: Props) {
  const session = await getServerAuthSession();

  if (session?.user) {
    return <>{children}</>;
  }
}

export async function NoUser({ children }: Props) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return <>{children}</>;
  }
}
