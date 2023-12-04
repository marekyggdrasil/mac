import { ReactNode } from "react";

export const MinaValue = ({ children }: { children: ReactNode }) => {
  return <code className="rounded-md bg-primary p-1">{children}</code>;
};

export const MinaBlockchainLength = ({ children }: { children: ReactNode }) => {
  return <code className="rounded-md bg-accent p-1">{children}</code>;
};

export const MinaSecretValue = ({ children }: { children: ReactNode }) => {
  return (
    <code className="rounded-md bg-secondary p-1 blurred">{children}</code>
  );
};
