import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, PenSquare, Calendar, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const actions = [
    {
      icon: PenSquare,
      label: 'Create Post',
      color: 'bg-primary text-primary-foreground',
      onClick: () => {
        setShowCreatePost(true);
        setIsOpen(false);
      },
    },
    {
      icon: Calendar,
      label: 'Create Event',
      color: 'bg-accent text-accent-foreground',
      onClick: () => {
        setIsOpen(false);
      },
    },
    {
      icon: Package,
      label: 'List Item',
      color: 'bg-secondary text-secondary-foreground',
      onClick: () => {
        setIsOpen(false);
      },
    },
  ];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>

      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3"
      >
        {isOpen &&
          actions.map((action, index) => (
            <div
              key={action.label}
              className={cn(
                'flex items-center gap-3 opacity-0 translate-y-3 animate-fab-action',
              )}
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <span className="bg-card/90 backdrop-blur-sm text-foreground/90 px-3 py-1 rounded-lg shadow-card text-sm whitespace-nowrap border border-border">
                {action.label}
              </span>
              <Button
                size="icon"
                onClick={action.onClick}
                className={cn(
                  'h-12 w-12 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150',
                  action.color
                )}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </div>
          ))}

        <Button
          size="icon"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg backdrop-blur-md bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all duration-300',
            isOpen ? 'rotate-45' : 'rotate-0'
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <style>
        {`
          @keyframes fab-action {
            from { opacity: 0; transform: translateY(8px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fab-action {
            animation: fab-action 0.25s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default FloatingActionButton;
