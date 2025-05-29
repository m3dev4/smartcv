import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Auth',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full">{children}</div>;
}
