import { AppLayout } from '@/components/layout';

interface CriancasLayoutProps {
  children: React.ReactNode;
}

export default function CriancasLayout({ children }: CriancasLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
