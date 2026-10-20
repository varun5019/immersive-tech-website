import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectImage, ProjectSection } from '@/lib/lab/types';

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

export function ImageListEditor({ images, onChange, label, coverHint }: { images: ProjectImage[]; onChange: (v: ProjectImage[]) => void; label: string; coverHint?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const [dragging, setDragging] = useState<number | null>(null);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in again.');
      const added: ProjectImage[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image.`); continue; }
        if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} is over 10 MB.`); continue; }
        const path = `projects/${user.id}/${crypto.randomUUID()}.${file.name.split('.').pop() ?? 'jpg'}`;
        const up = await supabase.storage.from('lab-media').upload(path, file, { contentType: file.type });
        if (up.error) throw up.error;
        const signed = await supabase.storage.from('lab-media').createSignedUrl(path, 60 * 60 * 24 * 365 * 20);
        if (signed.error) throw signed.error;
        added.push({ url: signed.data.signedUrl, caption: '' });
      }
      if (added.length) { onChange([...images, ...added]); toast.success(`${added.length} photo${added.length > 1 ? 's' : ''} added`); }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally { setBusy(false); }
  };
  const setCaption = (i: number, caption: string) => onChange(images.map((img, n) => (n === i ? { ...img, caption } : img)));
  return (
    <div className="form-field">
      <span>{label}{coverHint && images.length > 0 && <span className="text-muted-foreground"> — the first photo is the cover. Drag or use the arrows to reorder.</span>}</span>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={img.url + i} draggable onDragStart={() => setDragging(i)} onDragEnd={() => setDragging(null)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (dragging !== null) onChange(move(images, dragging, i)); setDragging(null); }} className={`space-y-2 ${dragging === i ? 'opacity-40' : ''}`}>
              <div className="relative group cursor-grab active:cursor-grabbing">
                <img src={img.url} alt={img.caption || `Photo ${i + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover bg-secondary" />
                {coverHint && i === 0 && <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-xs">Cover</span>}
                <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => onChange(images.filter((_, n) => n !== i))} className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-foreground text-background shadow"><X className="size-3.5" /></button>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button type="button" aria-label={`Move photo ${i + 1} earlier`} disabled={i === 0} onClick={() => onChange(move(images, i, i - 1))} className="grid size-6 place-items-center rounded-full bg-background/90 disabled:opacity-30"><ArrowLeft className="size-3.5" /></button>
                  <button type="button" aria-label={`Move photo ${i + 1} later`} disabled={i === images.length - 1} onClick={() => onChange(move(images, i, i + 1))} className="grid size-6 place-items-center rounded-full bg-background/90 disabled:opacity-30"><ArrowRight className="size-3.5" /></button>
                </div>
              </div>
              <Input aria-label={`Photo ${i + 1} description`} placeholder="Image description" value={img.caption} onChange={e => setCaption(i, e.target.value)} />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={busy} asChild>
          <label className="cursor-pointer"><ImagePlus />{busy ? 'Uploading…' : 'Upload photos'}<input type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={e => { void upload(e.target.files); e.target.value = ''; }} /></label>
        </Button>
        <div className="flex flex-1 gap-2 min-w-[220px]">
          <Input type="url" aria-label="Photo link" placeholder="or paste an image link" value={url} onChange={e => setUrl(e.target.value)} />
          <Button type="button" variant="outline" disabled={!/^https?:\/\//.test(url)} onClick={() => { onChange([...images, { url, caption: '' }]); setUrl(''); }}>Add</Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectSectionsEditor({ sections, onChange }: { sections: ProjectSection[]; onChange: (v: ProjectSection[]) => void }) {
  const update = (i: number, patch: Partial<ProjectSection>) => onChange(sections.map((s, n) => (n === i ? { ...s, ...patch } : s)));
  return (
    <div className="form-field">
      <span>Page sections</span>
      {sections.map((s, i) => (
        <div key={i} className="space-y-3 border-b border-border py-4">
          <div className="flex gap-2">
            <Input aria-label={`Section ${i + 1} title`} placeholder="Section title" value={s.title} onChange={e => update(i, { title: e.target.value })} />
            <div className="flex gap-1 shrink-0">
              <Button type="button" variant="ghost" size="icon" aria-label={`Move section ${i + 1} up`} disabled={i === 0} onClick={() => onChange(move(sections, i, i - 1))}><ArrowUp /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={`Move section ${i + 1} down`} disabled={i === sections.length - 1} onClick={() => onChange(move(sections, i, i + 1))}><ArrowDown /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove section ${i + 1}`} onClick={() => onChange(sections.filter((_, n) => n !== i))}><Trash2 /></Button>
            </div>
          </div>
          <Textarea rows={4} aria-label={`Section ${i + 1} paragraph`} placeholder="Paragraph (leave a blank line between paragraphs)" value={s.body} onChange={e => update(i, { body: e.target.value })} />
          <ImageListEditor label="Section photos" images={s.images ?? []} onChange={images => update(i, { images })} />
        </div>
      ))}
      <Button type="button" variant="outline" className="justify-self-start" onClick={() => onChange([...sections, { title: '', body: '', images: [] }])}><Plus />Add section</Button>
    </div>
  );
}
