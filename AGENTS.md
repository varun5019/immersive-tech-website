<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shareable content in separate TanStack leaf routes and shared chrome in LabShell so each page has its own metadata and consistent navigation.
- Keep floating navigation in FloatingNavigation with cleaned-up scroll timers and GSAP resize/motion handling; pause its compact scroll state during keyboard focus or an open menu so navigation stays accessible.
- Store research as typed project/publication/event records with structured metadata, while keeping roles and private profile contacts separate to enforce server-side permissions.
- Store project team assignments as profile IDs in research metadata and resolve them against public profiles for display; this reuses member identity without exposing private contacts.
- Use public query loaders through a publishable server client and authenticated workspace functions through the generated auth middleware so SSR and private edits stay within their correct trust boundaries.
- Sample research is seeded in migrations and flagged as demo; never impersonate real researchers or seed on page load.
- Keep GSAP navigation and reveal motion scoped and cleaned up in PageTransition, with dynamically loaded ScrollTrigger and reduced-motion support, so route changes do not leave animations or transforms behind.
- Present home-page projects in the same simple two-per-row card grid as other project listings, with hover-only arrow and image motion, so no listing depends on scroll-pinned stacking.
- Reuse TeamMembers for public team listings with hover, keyboard-focus and tap disclosure; resolve only public profile data so cards stay consistent and private contacts remain protected.

- Define all typography through shared font tokens and keep hero placement in CSS grid without glyph stretching, so the uploaded variable font renders consistently across the site.
- Render the home hero with synchronized outline and background-masked solid text layers using the same cover sizing as the photograph, so subject overlap stays aligned across screen sizes without modifying the original image.
