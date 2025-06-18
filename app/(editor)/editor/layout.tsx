import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editeur CV',
  description: 'Laisser votre imagination vous guider pour créer votre CV',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default EditorLayout;
