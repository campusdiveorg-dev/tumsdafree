import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from './session';
import { db } from './db';
import { auditLog as auditLogTable } from './schema';

export async function getSession(): Promise<ReturnType<typeof getIronSession<SessionData>>> {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAuth(): Promise<{ id: number; role: 'admin' | 'member' }> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error('UNAUTHORIZED');
  }
  return {
    id: session.userId,
    role: session.userRole || 'member',
  };
}

export async function requireAdmin(): Promise<{ id: number; role: 'admin' | 'member' }> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function auditLog(
  userId: number | null,
  action: string,
  entity: string,
  entityId: number | null = null
): Promise<void> {
  try {
    await db.insert(auditLogTable).values({
      userId: userId ? userId : null,
      action,
      entity,
      entityId: entityId ? entityId : null,
    });
  } catch (e) {
    // Audit log failures must never break the request
    console.error('[TUMSDA AuditLog Error]', e);
  }
}
