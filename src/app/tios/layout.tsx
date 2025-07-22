import { AppLayout } from '@/components/layout';

interface TiosLayoutProps {
  children: React.ReactNode;
}

export default function TiosLayout({ children }: TiosLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
