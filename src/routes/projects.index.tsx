import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { labQuery } from '@/lib/lab/queries';
import { labHead } from '@/lib/lab/meta';
import { ProjectCard, SectionLabel } from '@/components/lab/research';
export const Route=createFileRoute('/projects/')({head:()=>labHead('Projects','Explore ongoing research in mixed reality, spatial interaction and haptics at the Immersive Technologies Lab.'),loader:({context})=>context.queryClient.ensureQueryData(labQuery),component:Projects});
function Projects(){const {data}=useSuspenseQuery(labQuery);return <div className="page-wrap content-page"><SectionLabel number="02">Our research</SectionLabel><h1 className="page-title">Ideas in the making.</h1><p className="body-copy mb-10">From new forms of presence to experiences you can feel. Our projects explore what happens when people and immersive technologies meet.</p><div className="project-grid">{data.research.filter(x=>x.kind==='project').map(x=><ProjectCard key={x.id} item={x}/>)}</div></div>;}
