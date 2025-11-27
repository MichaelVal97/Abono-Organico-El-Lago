'use client';

import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';

export default function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (mobile) {
    return user ? (
        <div className="flex flex-col gap-2">
            <Link href="/account" passHref legacyBehavior>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Mi Cuenta
                </Button>
            </Link>
            <Button variant="outline" onClick={logout} className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
            </Button>
        </div>
    ) : (
        <Link href="/login" passHref legacyBehavior>
            <Button className="w-full">Iniciar Sesión</Button>
        </Link>
    )
  }

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-secondary">
              <User className="h-5 w-5 text-secondary-foreground" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Mi Cuenta</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button asChild>
      <Link href="/login">Iniciar Sesión</Link>
    </Button>
  );
}
