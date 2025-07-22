import { AppLayout } from '@/components/layout';

interface ResponsaveisLayoutProps {
  children: React.ReactNode;
}

export default function ResponsaveisLayout({
  children,
}: ResponsaveisLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
