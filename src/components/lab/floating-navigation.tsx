import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import itlLogo from '@/assets/itl-logo.png.asset.json';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navigation = [['/', 'Home'], ['/about', 'About us'], ['/publications', 'Publications'], ['/projects', 'Projects'], ['/contact', 'Contact']] as const;

export function FloatingNavigation() {
  const { pathname } = useLocation();
  const header = useRef<HTMLElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [overHero, setOverHero] = useState(pathname === '/');
  const compact = scrolling && !menuOpen && !focused;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    const updateSurface = () => {
      const hero = document.querySelector('.hero-grid');
      setOverHero(pathname === '/' && !!hero && hero.getBoundingClientRect().bottom > 86);
    };
    updateSurface();
    const onScroll = () => {
      updateSurface();
      if (Math.abs(window.scrollY - lastY) < 2) return;
      lastY = window.scrollY;
      setScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), 850);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateSurface);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', updateSurface); clearTimeout(timer); };
  }, [pathname]);

  useEffect(() => { setScrolling(false); setMenuOpen(false); setFocused(false); }, [pathname]);

  useEffect(() => {
    let disposed = false;
    let stop = () => {};
    void import('gsap').then(({ gsap }) => {
      if (disposed || !header.current) return;
      const element = header.current;
      const move = () => {
        const inset = window.innerWidth <= 640 ? 12 : 24;
        const width = Math.min(1040, window.innerWidth - inset * 2);
        gsap.to(element, {
          left: compact ? inset : (window.innerWidth - width) / 2,
          top: 18,
          width: compact ? 60 : width,
          height: compact ? 60 : 68,
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.65,
          ease: 'power3.inOut', overwrite: true,
        });
      };
      move();
      window.addEventListener('resize', move);
      stop = () => { window.removeEventListener('resize', move); gsap.killTweensOf(element); };
    });
    return () => { disposed = true; stop(); };
  }, [compact]);

  const memberActive = pathname === '/editstuff' || pathname === '/workspace';
  return <header ref={header} className="site-header floating-nav" data-compact={compact} data-over-hero={overHero}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <Link to="/" className="floating-brand" aria-label="Immersive Technologies Lab home">
      <span className="floating-logo"><img src={itlLogo.url} alt="" className="itl-logo" width={1024} height={1024} /></span>
      <span className="wordmark floating-nav-detail">IMMERSIVE<br />TECHNOLOGIES LAB</span>
    </Link>
    <div className="floating-nav-links floating-nav-detail" inert={compact}>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(([to, label]) => <Link key={to} to={to} activeOptions={{ exact: to === '/' }} className="nav-link">{label}</Link>)}
      </nav>
      <Button asChild size="sm" className="nav-members" data-active={memberActive}>
        <Link to="/editstuff">Lab members<ArrowUpRight /></Link>
      </Button>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild><Button variant="ghost" size="icon" className="floating-menu" aria-label="Open navigation"><Menu /></Button></SheetTrigger>
        <SheetContent><SheetHeader><SheetTitle>Immersive Technologies Lab</SheetTitle></SheetHeader>
          <nav className="flex flex-col gap-5 p-5" aria-label="Mobile navigation">
            {navigation.map(([to, label]) => <SheetClose asChild key={to}><Link to={to} activeOptions={{ exact: to === '/' }} className="nav-link">{label}</Link></SheetClose>)}
            <SheetClose asChild><Link to="/editstuff" className="nav-link">Lab members</Link></SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>;
}