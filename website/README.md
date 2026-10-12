# Reading with Sage

The public library-program website and protected browser editor use the Sites Vinext starter. The original Storybook layout and CSS are preserved. Website copy starts in `src/content/site.ts`; saved editor overrides live in D1, and uploaded photos live in R2.

- `npm run dev`: local preview and simulated local ChatGPT sign-in.
- `npm test`: editor authorization, content validation, image signatures, and body-size checks.
- `npx tsc --noEmit`: TypeScript check.
- `npm run build`: deployable Sites Worker.
- `npm run db:generate`: append schema migrations when needed.

The hosted `EDITOR_EMAILS` setting controls which authenticated accounts may edit. The owner authorized Brooke’s account during setup. Never make this allowlist a browser-side check. See `docs/editor.md` for the editing flow and storage behavior.

The deployment preserves this project ID and public audience. Local D1 and R2 state, `.dev.vars`, and `.sites-runtime` never belong in the deployment archive.
