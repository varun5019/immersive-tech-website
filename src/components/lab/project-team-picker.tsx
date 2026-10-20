import { useId, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import type { Profile } from '@/lib/lab/types';

export function ProjectTeamPicker({ profiles, selected, onChange }: { profiles: Profile[]; selected: string[]; onChange: (ids: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const selectedMembers = profiles.filter(profile => selected.includes(profile.id));
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter(memberId => memberId !== id) : [...new Set([...selected, id])]);
  return <fieldset className="min-w-0 space-y-3">
    <legend id={labelId} className="text-sm mb-3">Team members working on this project</legend>
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" aria-labelledby={labelId} aria-expanded={open} className="w-full justify-between font-normal">
          <span className="truncate">{selectedMembers.length ? `${selectedMembers.length} member${selectedMembers.length === 1 ? '' : 's'} selected` : 'Select team members'}</span><ChevronsUpDown className="size-4 shrink-0 text-muted-foreground"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0">
        <Command>
          <CommandInput aria-label="Search team members" placeholder="Search people…"/>
          <CommandList aria-label="Team members">
            <CommandEmpty>{profiles.length ? 'No people found.' : 'No member profiles available.'}</CommandEmpty>
            <CommandGroup>{profiles.map(profile => {
              const name = `${profile.first_name} ${profile.last_name}`.trim();
              const checked = selected.includes(profile.id);
              return <CommandItem key={profile.id} value={profile.id} keywords={[name, profile.position]} onSelect={() => toggle(profile.id)} className="gap-3 py-3">
                <span aria-hidden="true" className={`grid size-4 shrink-0 place-items-center rounded-sm border ${checked ? 'bg-primary text-primary-foreground border-primary' : 'border-input'}`}>{checked && <Check className="size-3"/>}</span>
                <span className="min-w-0 break-words">{name}{profile.position && <span className="block text-sm text-muted-foreground mt-1">{profile.position}</span>}</span>
                <span className="sr-only">{checked ? 'Selected' : 'Not selected'}</span>
              </CommandItem>;
            })}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    {selectedMembers.length > 0 && <ul aria-label="Selected team members" className="flex flex-wrap gap-2">{selectedMembers.map(profile => {
      const name = `${profile.first_name} ${profile.last_name}`.trim();
      return <li key={profile.id} className="flex max-w-full items-center gap-1 rounded-lg border border-border bg-secondary py-1 pl-3 pr-1 text-sm text-secondary-foreground"><span className="min-w-0 break-words">{name}</span><Button type="button" variant="ghost" size="icon" className="size-7 shrink-0" aria-label={`Remove ${name} from project team`} title={`Remove ${name}`} onClick={() => toggle(profile.id)}><X className="size-3.5"/></Button></li>;
    })}</ul>}
  </fieldset>;
}