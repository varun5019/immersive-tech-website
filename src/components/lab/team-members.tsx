import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeUrl } from './research';
import type { Profile } from '@/lib/lab/types';

function ProfileLinkIcon({ kind }: { kind: string }) {
  if (kind === 'linkedin') return <Linkedin aria-hidden="true"/>;
  if (kind === 'scholar') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 1 11l4 3v-4l7-5 7 5v4l4-3L12 3Z"/><circle cx="12" cy="16" r="6"/></svg>;
  if (kind === 'orcid') return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="7" r="1"/><path d="M6.2 9h1.6v9H6.2z"/><path d="M11 9h2a4.5 4.5 0 0 1 0 9h-2z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>;
  return <Globe aria-hidden="true"/>;
}

type PopoverAlign = 'start' | 'center' | 'end';

function MemberCard({ member }: { member: Profile }) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<PopoverAlign>('center');
  const [place, setPlace] = useState<'below' | 'above'>('below');
  const cardRef = useRef<HTMLElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const name = `${member.first_name} ${member.last_name}`.trim();
  const photo = safeUrl(member.photo_url);
  const links = Object.entries(member.links).flatMap(([key, value]) => {
    const url = safeUrl(value);
    return url ? [{ key, url, label: ({ scholar: 'Google Scholar', orcid: 'ORCID', linkedin: 'LinkedIn', portfolio: 'Portfolio website' } as Record<string, string>)[key] ?? key }] : [];
  });
  const hasDetails = Boolean(member.bio.trim() || links.length);
  const openDetails = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const margin = 170;
      if (rect.left < margin) setAlign('start');
      else if (window.innerWidth - rect.right < margin) setAlign('end');
      else setAlign('center');
    }
    setOpen(true);
  };
  useEffect(() => {
    if (!open) { setPlace('below'); return; }
    const box = popRef.current?.getBoundingClientRect();
    if (!box) return;
    const gap = 12;
    if (box.bottom > window.innerHeight - gap && box.top > box.height + gap) setPlace('above');
  }, [open, align, place]);
  return <article ref={cardRef} className="member-card" data-expanded={open}
    onPointerEnter={event => { if (event.pointerType === 'mouse' && hasDetails) openDetails(); }}
    onPointerLeave={event => { if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setOpen(false); }}
    onFocusCapture={event => { if (hasDetails && !(event.target instanceof Element && event.target.closest('.member-toggle'))) openDetails(); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <Link to="/people/$id" params={{ id: member.id }} className="member-portrait-link" aria-label={`View ${name}'s profile`}>
      {photo ? <img src={photo} alt={name} className="team-photo member-portrait" loading="lazy"/> : <div className="team-photo member-portrait member-initials" aria-hidden="true">{member.first_name[0]}{member.last_name[0]}</div>}
    </Link>
    <div className="member-heading"><div className="min-w-0"><Link to="/people/$id" params={{ id: member.id }}><h3>{name}</h3></Link>{member.position.trim() && <p className="member-position">{member.position}</p>}</div>
      {hasDetails && <Button variant="ghost" size="icon" className="member-toggle" aria-label={`${open ? 'Hide' : 'Show'} details for ${name}`} aria-expanded={open} aria-controls={`member-details-${member.id}`} onClick={() => { if (open) setOpen(false); else openDetails(); }}><ChevronDown/></Button>}
    </div>
    {hasDetails && open && <div ref={popRef} className="member-popover" data-align={align} data-place={place} id={`member-details-${member.id}`} role="group" aria-label={`More about ${name}`}>
      {member.bio.trim() && <p className="member-bio">{member.bio}</p>}
      {links.length > 0 && <div className="member-links">{links.map(link => <Button key={link.key} asChild variant="outline" size="sm" className={`member-link member-link-${link.key}`}><a href={link.url} target="_blank" rel="noreferrer" aria-label={`${link.label} for ${name} (opens in a new tab)`}><ProfileLinkIcon kind={link.key}/>{link.label}</a></Button>)}</div>}
    </div>}
  </article>;
}

export function TeamMembers({ members }: { members: Profile[] }) {
  return <div className="team-grid member-grid">{members.map(member => <MemberCard key={member.id} member={member}/>)}</div>;
}
