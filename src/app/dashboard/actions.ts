'use server';

import { cookies } from 'next/headers';

/**
 * Validates the password against DASHBOARD_PASSWORD environment variable or 'admin123' default.
 * Sets a secure cookie if valid.
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.DASHBOARD_PASSWORD || 'admin123';

  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set('dashboard_authorized', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day session
      path: '/',
      sameSite: 'lax',
    });
    return true;
  }

  return false;
}

/**
 * Checks if the dashboard session is authorized on the server.
 */
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('dashboard_authorized')?.value === 'true';
}

/**
 * Revokes the authorized session.
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('dashboard_authorized');
}
