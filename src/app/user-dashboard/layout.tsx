'use client';

import UserAuthGuard from 'src/auth/guard/user-auth-guard';
import UserDashboardLayout from 'src/layouts/user-dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <UserAuthGuard>
      <UserDashboardLayout>{children}</UserDashboardLayout>
    </UserAuthGuard>
  );
}
