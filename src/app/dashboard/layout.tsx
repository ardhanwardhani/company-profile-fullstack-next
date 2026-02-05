import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import DashboardShell from '@/app/components/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role || 'viewer';
  const name = session.user?.name || 'User';
  const email = session.user?.email || undefined;

  return (
    <DashboardShell userRole={role} userName={name} userEmail={email}>
      {children}
    </DashboardShell>
  );
}
