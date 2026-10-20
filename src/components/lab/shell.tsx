import { useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { PageTransition } from './page-transition';
import { FloatingNavigation } from './floating-navigation';

export function LabShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return <div className="site-shell">
    <FloatingNavigation />
    <PageTransition pathname={location.pathname}>{children}</PageTransition>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Immersive Technologies Lab, KTH Royal Institute of Technology</span><span>Stockholm, Sweden <span className="mx-2">↗</span> 59.3498° N, 18.0707° E</span></footer>
  </div>;
}
