'use client';

import CustomerGuestGuard from 'src/auth/guard/customer-guest-guard';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <CustomerGuestGuard>
      <AuthModernCompactLayout>{children}</AuthModernCompactLayout>
    </CustomerGuestGuard>
  );
}
