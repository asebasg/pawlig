import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, Heart, FileText, User, LogOut, Menu } from 'lucide-react';
import { ToastProvider } from '@/components/ui/toast';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const navLinks = [
    { href: '/user', label: 'Mi Panel', icon: Home },
    { href: '/user/favorites', label: 'Favoritos', icon: Heart },
    { href: '/user/adoptions', label: 'Mis Postulaciones', icon: FileText },
    { href: '/dashboard/profile', label: 'Mi Perfil', icon: User },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
              PawLig
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/adopciones" className="text-sm text-gray-700 hover:text-purple-600 font-medium">
                Ver mascotas
              </Link>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-purple-600 font-medium flex items-center gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{session.user.name}</span>
                </span>
                <a href="/api/auth/signout" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <LogOut className="w-4 h-4" />
                  Cerrar
                </a>
              </div>
            </nav>

            <button className="lg:hidden p-2">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex">
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-white border-r border-gray-200 p-6">
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="ml-60 flex-1">
          {children}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        {children}
      </div>
    </div>
    </ToastProvider>
  );
}
