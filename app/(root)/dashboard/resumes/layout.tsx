import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartCV - Dashboard",
  description: "Dashboard",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className=" w-full">{children}</div>;
};

export default DashboardLayout;
