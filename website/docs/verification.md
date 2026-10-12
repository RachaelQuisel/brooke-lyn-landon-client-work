# Verification — October 12, 2026

The library-program website and protected editor were published as Sites version 3 from source commit `d3eb05abf2ce7e5178a19b867c513da2d4c3c69a`.

The home-page quote card was moved below the photo in Sites version 4, from source commit `6dce02d9fc81579a6e4214660fe38371fb2311bb`. The build passed. Local and production browser checks at 320px, 390px, 768px, and 1280px confirmed a clear gap between the photo and card with no horizontal overflow. The existing uploaded photo loaded successfully in production.

## Checks completed

- `npm test`: seven policy tests passed for authorized editors, same-origin writes, validated fields and links, actual image signatures, request-size limits, and immutable default content.
- `npx tsc --noEmit`: passed.
- Sites build: passed for the public pages, protected editor, editor APIs, and photo-serving route.
- Local browser checks: all eight public pages plus the editor had no horizontal overflow at 320px and 1280px. Photo controls also fit at 320px.
- Local browser round trips: text and photos were saved, persisted after reload, and appeared on the intended public pages. Test values were restored afterward.
- Local rejection checks: anonymous and spoofed identity requests were rejected, stale saves returned 409, cross-origin saves returned 403, and invalid photo content returned 415.
- Production browser checks: the owner signed in through ChatGPT; text changes saved and persisted after reload; a photo uploaded to R2, loaded successfully, saved, and persisted after reload. Original visible text and sharing-image settings were restored.
- The deployed output contains no local test identity or local runtime secrets.

## Limits

Brooke's approved ChatGPT email is configured in the hosted editor allowlist. Her own first sign-in was not independently performed. Account details and the allowlist value are not stored in this public repository.

Booking, contact delivery, and parent email signup still require separate Formspree setup and delivery verification. Saving website text does not activate those services. The separate program-workspace MVP has its own storage behavior.

Public repository tests use example accounts instead of personal emails. Production page text and uploaded photos live in D1 and R2; they are not automatically committed to GitHub.
