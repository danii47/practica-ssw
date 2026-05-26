import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getCurrentUser } from '@/services/users.service';
import Sidebar from '@/components/Sidebar';

async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const session = await verifyToken(token);
    if (!session) return null;
    return await getCurrentUser(session.sub);
  } catch {
    return null;
  }
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <Sidebar
        user={
          user
            ? {
                id_user: user.id_user,
                name: user.name,
                surnames: user.surnames,
                role: user.role,
              }
            : null
        }
      />
      {children}
    </>
  );
}
