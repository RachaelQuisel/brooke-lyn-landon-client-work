# Verification — October 1, 2026

## Passed checks

- `npm run build`: all eight HTML routes generated successfully, plus robots.txt, sitemap, and assets. Dependency installation reported zero known vulnerabilities at the time of the build.
- All eight routes returned HTTP 200 locally. All 162 internal links, asset references, and anchor targets in the generated HTML resolved to existing files/IDs. Each page has one H1, a unique title, a description, and Open Graph metadata. The print guide is excluded from the sitemap.
- Browser layouts at 390px and 1280px across all eight pages had no horizontal overflow. Additional 320px and 768px checks on Home, Program, Libraries, and Parents also had no overflow.
- Program cards appear on phones; the table appears at the tested desktop width. Home remained free of horizontal overflow with text enlarged to 200%.
- The mobile menu opened with Enter, closed with Escape, and returned focus to its summary control.
- The print stylesheet showed all six parent phrases within a 630px-high guide, inside a simulated 966px-tall Letter printable area; the toolbar was hidden. The printed layout was visually inspected. No fixed PDF is included; the HTML page is the editable source and can be printed or saved as PDF.
- axe-core checks for WCAG 2 A/AA and WCAG 2.1 AA found zero violations on the tested phone/desktop views. The configured booking, contact, and signup forms also had zero automated violations. Two decorative controls (brand letter mark and menu glyph) needed manual contrast review: cream/green is 7.48:1 and ink/cream is 10.65:1. These checks do not constitute a full accessibility certification or screen-reader audit.

## Form behavior checked with intercepted responses

A separate local test build used a dummy Formspree address. Its requests were intercepted before leaving the browser; responses were simulated. The supplied project has no live endpoint.

- Contact submission showed a disabled “Sending…” button, then a success message only after a simulated successful response.
- HTTP and connection failures displayed the appropriate error message and preserved entered text.
- Parent signup required the consent checkbox; a successful request included the consent value and left the free guide link available.
- The booking form rejected 16 children via native range validation. A valid 15-child inquiry showed the success message and cleared the form after a simulated successful response.
- The unconfigured preview keeps forms disabled with a setup notice and keeps the book purchase button disabled.

## Still needs Brooke’s setup and verification

Actual Formspree receipt, inbox delivery, email-list enrollment/unsubscribe behavior, book checkout, final domain/SEO URLs, Vercel deployment, real image assets, confirmed prices, certification/insurance, and library booking approval remain unverified. Fill the README’s placeholder checklist before launch. The website does not create a paid course, a YouTube channel, six individual parent sheets, or recording consent forms.
