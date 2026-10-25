import { redirect } from 'next/navigation';

// Redirects legacy /dashboard route to the new /app/dashboard
export default function DashboardRedirect() {
  redirect('/app/dashboard');
}
