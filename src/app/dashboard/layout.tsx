import { AppLayout } from '@/components/layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
