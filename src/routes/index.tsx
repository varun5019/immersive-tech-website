import { createFileRoute } from "@tanstack/react-router";
import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { labQuery } from '@/lib/lab/queries';
import { labHead } from '@/lib/lab/meta';
import { SectionLabel, PublicationRow, EventCard, ProjectCard } from '@/components/lab/research';
import { TeamMembers } from '@/components/lab/team-members';
import { HomeHero } from '@/components/lab/home-hero';
export const Route = createFileRoute("/")({
  head:()=>labHead('Immersive Technologies Lab','Exploring new ways of being, feeling and interacting. Discover immersive research, projects and publications at KTH Royal Institute of Technology.'),
  loader:({context})=>context.queryClient.ensureQueryData(labQuery),
  component: Index,
});
function Index() {
 const {data}=useSuspenseQuery(labQuery);
 const projects=data.research.filter(x=>x.kind==='project');
 const publications=data.research.filter(x=>x.kind==='publication').sort((a,b)=>Number(b.data.year)-Number(a.data.year));
 const events=data.research.filter(x=>x.kind==='event'&&new Date(x.data.end??x.data.start??'')>=new Date()).sort((a,b)=>new Date(a.data.start??'').getTime()-new Date(b.data.start??'').getTime());
 return <div className="page-wrap"><HomeHero /><section className="section-band section-dark intro-grid" id="our-research"><div className="reveal"><SectionLabel number="01">People. Perception. Possibility.</SectionLabel><Link to="/about" className="text-link mt-8">Meet the lab<ArrowUpRight className="size-4"/></Link></div><div><h2 className="section-heading reveal">Exploring new ways of<br/>being, feeling & interacting.</h2><p className="intro-copy mt-6 reveal">We investigate how immersive technologies can shape the way we experience the world. Bringing together design, technology and human understanding, we create meaningful interactions that bridge the physical and the digital.</p><div className="flex flex-wrap gap-2 mt-6 reveal">{['Extended reality','Human–computer interaction','Embodied experiences'].map(t=><span key={t} className="tag">{t}</span>)}</div></div></section>{projects.length>0&&<section className="section-band"><div className="section-top reveal"><div><SectionLabel number="02">THINGS WE ARE WORKING ON</SectionLabel><h2 className="section-heading mt-5">Projects</h2></div><Link to="/projects" className="text-link shrink-0">All projects<ArrowUpRight className="size-4"/></Link></div><div className="project-grid project-grid-2">{projects.slice(0,4).map(item=><ProjectCard key={item.id} item={item}/>)}</div></section>}{data.profiles.length>0&&<section className="section-band team-section"><div className="section-top"><div><SectionLabel number="03">OUR MEMBERS</SectionLabel><h2 className="section-heading mt-5">The Team behind it</h2></div><Link to="/about" className="text-link shrink-0">Meet the lab<ArrowUpRight className="size-4"/></Link></div><TeamMembers members={data.profiles}/></section>}{publications.length>0&&<section className="section-band section-dark"><div className="section-top reveal"><div><SectionLabel number="04">KNOWLEDGE SHARED</SectionLabel><h2 className="section-heading mt-5">Our Publications</h2></div><Link to="/publications" className="text-link shrink-0">All publications<ArrowUpRight className="size-4"/></Link></div>{publications.slice(0,3).map(item=><PublicationRow key={item.id} item={item} profiles={data.profiles}/>)}</section>}{events.length>0&&<section className="section-band"><div className="section-top reveal"><div><SectionLabel number="05">BE PART OF WHAT'S NEXT</SectionLabel><h2 className="section-heading mt-5">Upcoming Events and Studies</h2></div><ArrowRight className="size-6" strokeWidth={1}/></div><div className="event-grid">{events.slice(0,2).map(item=><EventCard key={item.id} item={item}/>)}</div></section>}</div>;
}
