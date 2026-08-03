import { AuthProvider } from '@/context/AuthContext';
import './admin.css';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
