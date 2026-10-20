import { ArrowRight } from 'lucide-react';
import photo from '@/assets/vr-hero.jpg.asset.json';

export function HomeHero() {
  return <section className="hero-grid" aria-label="Immersive Technologies Lab">
    <img className="hero-photo" src={photo.url} alt="Woman experiencing virtual reality with a VR headset under violet and red lighting" fetchPriority="high" />
    <div className="hero-meta"><span className="eyebrow">A research group at KTH</span><span className="eyebrow desktop-location">Stockholm, Sweden / 59° N 18° E</span></div>
    <div className="hero-ink"><div className="hero-composition"><h1 className="hero-title" aria-label="Immersive Technologies Lab"><span className="hero-first">IMMERSIVE</span><span className="hero-second">TECHNOLOGIES</span><span className="hero-third"><span className="hero-word">LAB</span><a href="#our-research" className="hero-cta"><span>KNOW MORE</span><ArrowRight className="size-6" strokeWidth={1.75} /></a></span></h1><p className="hero-description">Media and Interaction Design Departments,<br />EECS, KTH Royal Institute of Technology</p></div></div>
  </section>;
}
