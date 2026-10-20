import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Keep the initial page still; animate only when the route changes. */
export function PageTransition({ pathname, children }: { pathname: string; children: ReactNode }) {
  const [navigation, setNavigation] = useState({ pathname, animated: false });
  const main = useRef<HTMLElement>(null);
  const tiles = useRef<HTMLDivElement>(null);
  if (navigation.pathname !== pathname) {
    setNavigation({ pathname, animated: true });
  }

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed || !main.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          gsap.from('.hero-first', { x: -80, autoAlpha: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
          gsap.from('.hero-second, .hero-third', { x: 80, autoAlpha: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
          // Every content block fades in from above as it enters the viewport.
          const selected = [
            ...gsap.utils.toArray<HTMLElement>('main section > *, main .page-wrap > *'),
            ...gsap.utils.toArray<HTMLElement>('main .project-grid > *, main .event-grid > *, main .team-grid > *'),
          ].filter(el => el.tagName !== 'SECTION' && !el.closest('.hero-grid'));
          const blocks = selected.filter(el => !selected.some(other => other !== el && el.contains(other)));
          blocks.forEach(target => gsap.from(target, {
            y: -36, autoAlpha: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: target, start: 'top 92%', once: true },
          }));
          if (navigation.animated && tiles.current) {
            gsap.set(tiles.current, { y: 0, yPercent: -100 });
            gsap.timeline({ onComplete: () => { if (!disposed) setNavigation({ pathname, animated: false }); } })
              .to(tiles.current, { yPercent: 0, duration: 0.3, ease: 'power2.in' })
              .fromTo(main.current, { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.18)
              .to(tiles.current, { yPercent: 100, duration: 0.55, ease: 'power3.inOut' }, 0.3);
          }
        }, main);
        return () => context.revert();
      });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setNavigation({ pathname, animated: false });
      cleanup = () => media.revert();
    });
    return () => { disposed = true; cleanup(); };
  }, [pathname]);

  return <>
    <main ref={main} key={pathname} className="page-transition">
      {children}
    </main>
    {navigation.animated && <div ref={tiles} key={`wipe-${pathname}`} className="transition-wipe" aria-hidden="true" />}
  </>;
}