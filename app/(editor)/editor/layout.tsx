import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Editeur CV',
  description: 'Editeur CV',
};

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default EditorLayout;
