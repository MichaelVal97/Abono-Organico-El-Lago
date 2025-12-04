'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { UserMenu } from './UserMenu';
import { User, LogOut } from 'lucide-react';

export default function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (mobile) {
    return user ? (
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/profile">
            <User className="h-4 w-4" />
            Mi Perfil
          </Link>
        </Button>
        <Button variant="outline" onClick={logout} className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <Button className="w-full" asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/register">Registrarse</Link>
        </Button>
      </div>
    );
  }

  return user ? (
    <UserMenu />
  ) : (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login">Iniciar Sesión</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Registrarse</Link>
      </Button>
    </div>
  );
}
