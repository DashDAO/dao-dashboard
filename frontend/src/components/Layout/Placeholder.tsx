import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function Placeholder({ children }: Props) {
  return (
    <div className="text-center min-h-full w-full flex items-center justify-center text-3xl font-bold">
      {children}
    </div>
  );
}
