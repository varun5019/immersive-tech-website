import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { labQuery } from '@/lib/lab/queries';
import { labHead } from '@/lib/lab/meta';
import { SectionLabel } from '@/components/lab/research';
import { TeamMembers } from '@/components/lab/team-members';
import teamPhoto from '@/assets/team-photo.jpg.asset.json';
export const Route=createFileRoute('/about')({head:()=>labHead('About us','Meet the people exploring human experience and immersive technologies at KTH Royal Institute of Technology.'),loader:({context})=>context.queryClient.ensureQueryData(labQuery),component:About});
function About(){const {data}=useSuspenseQuery(labQuery);return <div className="page-wrap content-page"><SectionLabel number="01">About the lab</SectionLabel><h1 className="page-title">People behind<br/>the possibilities.</h1><p className="body-copy">We are a research group at KTH Royal Institute of Technology, working at the intersection of immersive technologies, media and interaction design. We explore how design can help people engage with emerging technologies in more meaningful, inclusive and human ways.</p><section className="team-section-flat"><figure className="team-group"><img src={teamPhoto.url} width={1920} height={1280} className="team-group-photo" loading="lazy" alt="The lab team standing together outside a KTH building"/></figure>{data.profiles.length>0&&<><h2 className="section-heading mb-8">The Team</h2><TeamMembers members={data.profiles}/></>}</section></div>;}
