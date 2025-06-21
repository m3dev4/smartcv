import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SmartCV - Dashboard',
  description: 'Prenez le controle de votre CV avec votre dashboard',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    }
  },
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className=" w-full">{children}</div>;
};

export default DashboardLayout;
