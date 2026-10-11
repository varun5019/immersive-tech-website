export type Author = { name: string; affiliation?: string; country?: string; email?: string; member_id?: string };
export type ResearchData = { category?: string; image?: string; image_url?: string; status?: string; year?: number | string; authors?: Author[]; venue?: string; location?: string; type?: string; doi?: string; keywords?: string[]; project_id?: string; video?: string; reference?: string; start?: string; end?: string; signup?: string; zoom?: string; demo?: boolean };
export type Research = { id: string; kind: 'project'|'publication'|'event'; owner_id?: string|null; title: string; description: string; data: ResearchData };
export type Profile = { id: string; first_name: string; last_name: string; position: string; bio: string; photo_url: string; links: Record<string,string>; interests: string[]; submitted: boolean };
export type LabData = { research: Research[]; profiles: Profile[]; visibility: { publication_id: string; user_id: string; visible: boolean }[] };
