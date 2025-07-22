import { AppLayout } from '@/components/layout';

interface CultosLayoutProps {
  children: React.ReactNode;
}

export default function CultosLayout({ children }: CultosLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
