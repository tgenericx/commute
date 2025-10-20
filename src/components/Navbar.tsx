import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, ShoppingBag, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/marketplace', icon: ShoppingBag, label: 'Market' },
    { to: '/boards', icon: MessageSquare, label: 'Boards' },
    { to: '/profile/1', icon: User, label: 'Me' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md sm:sticky sm:top-0 sm:border-b sm:border-t-0">
      <div className="container mx-auto">
        <div className="flex justify-evenly items-center h-14 px-2 sm:px-6 gap-1 sm:gap-3">
          {links.map(({ to, icon: Icon, label }) => {
            const active = isActivePath(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center px-2 sm:px-3 py-1 rounded-md transition-all duration-150',
                  active
                    ? 'text-primary font-semibold scale-105'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 mb-1 transition-transform duration-150',
                    active && 'scale-110'
                  )}
                />
                <span className="text-[11px] sm:text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
