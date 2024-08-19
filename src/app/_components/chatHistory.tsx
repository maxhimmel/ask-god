export interface Props {
  children: React.ReactNode;
}

export function ChatHistory({ children }: Props) {
  return (
    <div className="my-8 flex h-96 w-4/5 overflow-y-auto rounded-md border-2 border-base-200 p-4">
      <pre className="text-wrap font-sans">{children}</pre>
    </div>
  );
}
