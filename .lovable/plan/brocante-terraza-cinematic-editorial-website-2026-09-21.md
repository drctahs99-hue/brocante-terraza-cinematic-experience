# Brocante Terraza — Cinematic Editorial Website

## Goal
Build a production-ready Spanish-language venue website centered on a 480-frame, scrollbar-scrubbed rooftop narrative, followed by conversion-focused venue details, event formats, gallery, FAQs, and booking tools.

## Experience
- Establish the supplied alabaster, sky, sand, soft-gold, bronze, and stone palette as semantic design tokens, with Playfair Display and Plus Jakarta Sans loaded in the document head.
- Create a centered frosted navigation pill, cinematic editorial type, spacious architectural layouts, and restrained motion matching the “Architecture of Stillness” reference.
- Add the smooth golden custom cursor for precise pointer devices, with expansion and bloom over interactive elements.
- Keep mobile layouts intentionally composed, readable, touch-friendly, and free of cursor-only behavior.

## Cinematic Scroll Stage
- Implement a fixed full-viewport Canvas 2D sequence with 600vh of scrub distance, driven by GSAP ScrollTrigger and Lenis.
- Resolve all 480 desktop and portrait frame URLs from `VITE_FRAMES_BASE_URL`.
- Build a progressive 1/8 → 1/4 → 1/2 → full loader, a ±16-frame decoded cache, stale-frame eviction, nearby-frame fallback, canvas cover rendering, and fractional cross-fades.
- Render an immediate generated venue poster/procedural architectural scene while frames are unavailable or loading, so the first screen is never blank.
- Disable the scrub sequence for reduced-motion users and show the static poster instead.
- Synchronize the four supplied editorial scenes, counters, copy, and final calls to action to their exact frame windows.

## Content and Conversion
- Centralize address, phone, WhatsApp links, social handle, capacities, navigation, event types, FAQs, and all supplied copy in one venue configuration file.
- Add architectural specifications, event curation, and an editorial horizontal gallery with generated venue imagery and an accessible lightbox.
- Add the FAQ accordion covering deposits, outside vendors, hours, and parking without inventing unsupported policy details.
- Build an accessible booking drawer with date selection, 20–120 guest slider, event selector, and a dynamically encoded WhatsApp handoff.
- Add dossier/quote lead fields and route the submitted details immediately into WhatsApp; no database or email storage is implied.
- Finish with the supplied phone, mapped address, Instagram link, and concise legal links/placeholders.

## Structure and Quality
- Keep the requested one-page, scroll-led experience at `/`, with in-page navigation because the cinematic sequence and sections form one continuous composition.
- Use the project’s existing React 19/TanStack Start foundation rather than downgrading it; add Motion, GSAP/ScrollTrigger, and Lenis, while retaining TypeScript, Vite, Tailwind CSS, Canvas 2D, and Lucide.
- Add page-specific title, description, Open Graph, and Twitter metadata.
- Ensure every external destination opens safely in a new tab, dialogs are keyboard accessible, animations respect reduced motion, and controls use the existing design-system components.
- Validate the live desktop and mobile experiences, interactions, browser console, frame fallback behavior, and the platform’s build/type diagnostics.

## Assumptions
- The 480-frame media is not currently present; the site will be fully usable with its generated/procedural fallback and will automatically use the sequence when `VITE_FRAMES_BASE_URL` is configured.
- Exact commercial policies, dossier PDF, calendar service, and legal documents were not supplied; the UI will avoid fabricated claims and route inquiries through WhatsApp.
