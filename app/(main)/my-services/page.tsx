import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { listUserActivities } from '@/services/activities.service';
import Link from 'next/link';
import MyServicesClient from './MyServicesClient';

async function getMyActivities() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return { userId: null, activities: [] };
    const session = await verifyToken(token);
    if (!session) return { userId: null, activities: [] };
    const activities = await listUserActivities(session.sub);
    return { userId: session.sub, activities };
  } catch {
    return { userId: null, activities: [] };
  }
}

export default async function MyServicesPage() {
  const { userId, activities } = await getMyActivities();
  const activeCount = activities.filter((a: { status: string }) => a.status === 'active').length;
  const pausedCount = activities.length - activeCount;

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-canvas">
      <header className="bg-surface border-b border-hairline shrink-0 z-10">
        <div className="px-6 md:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Mis Servicios</h1>
            <p className="text-sm text-muted mt-0.5">
              {activities.length === 0
                ? 'Aún no tienes servicios publicados.'
                : (
                  <>
                    <span className="inline-flex items-center gap-1 mr-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" /> {activeCount} {activeCount === 1 ? 'activo' : 'activos'}
                    </span>
                    {pausedCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-soft" /> {pausedCount} en pausa
                      </span>
                    )}
                  </>
                )}
            </p>
          </div>
          {userId && (
            <Link
              href={`/user/${userId}`}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-hairline rounded-lg text-sm font-bold text-ink-soft hover:border-brand hover:text-brand transition-colors btn-press"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Vista pública
            </Link>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <MyServicesClient activities={activities} />
        </div>
      </div>
    </main>
  );
}
