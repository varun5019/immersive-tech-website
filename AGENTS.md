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
- Store research as typed project/publication/event records with structured metadata, while keeping roles and private profile contacts separate to enforce server-side permissions.
- Use public query loaders through a publishable server client and authenticated workspace functions through the generated auth middleware so SSR and private edits stay within their correct trust boundaries.
- Sample research is seeded in migrations and flagged as demo; never impersonate real researchers or seed on page load.
