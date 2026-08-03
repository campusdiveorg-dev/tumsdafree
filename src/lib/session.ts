import { SessionOptions } from 'iron-session';

export interface SessionData {
  userId?: number;
  userRole?: 'admin' | 'member';
  loginAttempts?: number;
  loginWindowStart?: number;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'tumsda_church_super_secret_session_key_32bytes_minimum_length!',
  cookieName: 'tumsda_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  },
};
