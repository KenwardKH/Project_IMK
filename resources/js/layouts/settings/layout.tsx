import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profil',
    href: '/settings/profile',
    icon: null,
  },
  {
    title: 'Password',
    href: '/settings/password',
    icon: null,
  },
//   {
//     title: 'Appearance',
//     href: '/settings/appearance',
//     icon: null,
//   },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  // Only render on client
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 ">
      <div className="w-full max-w-5xl space-y-6">
        <Heading
          title="Pengaturan"
          description="Silahkan atur pengaturan akun anda!"
        />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="w-full lg:w-48">
            <nav className="flex flex-col space-y-1">
              {sidebarNavItems.map((item, index) => (
                <Button
                  key={`${item.href}-${index}`}
                  size="sm"
                  variant="ghost"
                  asChild
                  className={cn('w-full justify-start', {
                    'bg-muted': currentPath === item.href,
                  })}
                >
                  <Link href={item.href} prefetch>
                    {item.title}
                  </Link>
                </Button>
              ))}
            </nav>
          </aside>

          <Separator className="my-6 md:hidden" />

          <div className="flex-1">
            <section className="max-w-xl space-y-12">{children}</section>
          </div>
        </div>
      </div>
    </div>
  );
}
