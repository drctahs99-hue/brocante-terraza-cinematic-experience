# Brocante Terraza: Cinematic Experience

Build an ultra-luxury, editorial, scroll-driven cinematic website for **Brocante Terraza** (high-end private rooftop venue for intimate weddings, brand activations, and private dinners in Lomas de Chapultepec, CDMX) using **React 18 + TypeScript + Vite + Tailwind CSS + motion/react + GSAP + ScrollTrigger + Lenis + Canvas 2D + Lucide Icons**.

The aesthetic must match the visual rhythm of the reference video ("ISHIKAWA / Architecture of Stillness"): minimalist luxury, architectural calm, breathing negative space, daylight ambiance, semi-transparent frosted glass UI, custom dynamic cursor, and a seamless continuous camera movement scrubbed by the scrollbar across 480 frames.

---

### 1. IDENTITY & BUSINESS CONTEXT
- **Brand**: Brocante Terraza
- **Descriptor**: Terraza Privada & Bodas Íntimas
- **Location**: Pedregal 55, Lomas - Virreyes, Lomas de Chapultepec, 11000 Ciudad de México, CDMX
- **Target Audience**: Ultra-high-net-worth couples, international destination wedding planners, and luxury brands seeking an intimate, discreet architectural venue (up to 100-120 guests).
- **Core Conversion Actions**:
  1. Primary: "Agendar Visita Privada" (Calendar / WhatsApp modal flow)
  2. Secondary: "Descargar Dossier & Cotizar" (Lead capture + instant WhatsApp routing)
  3. Contextual: "Consultar Fecha por WhatsApp" (Pre-filled encoded text)

---

### 2. COLOR PALETTE & DESIGN TOKENS
Strict luxury daylight palette (light, warm, architectural — NO dark sci-fi, NO neon):
- **Sky Blue / Cielo**: `#DCE8F5` (subtle ambient highlights, light fills)
- **Soft Gold / Oro Suave**: `#C8A97E` (accent rings, active states, cursor hover bloom, eyebrow highlights)
- **Light Beige / Arena**: `#F4EFE6` (subtle surface tints, borders)
- **Off-White / Alabastro**: `#FAF8F5` (main background, crisp contrast)
- **Deep Bronze-Ink / Tinta**: `#1B1917` (typography, high-contrast primary text)
- **Muted Stone / Cantera**: `#78716C` (secondary text, structural indices)
- **Glass Tint**: `rgba(250, 248, 245, 0.45)` with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(200, 169, 126, 0.25)`

**Typography**:
- Editorial Titles: `Playfair Display` or `Cormorant Garamond` (Google Fonts, weights 400, 600, italic)
- Clean UI & Body: `Plus Jakarta Sans` or `Manrope` (weights 400, 500, 600)

---

### 3. CUSTOM CURSOR & BUTTON INTERACTIONS
- **Custom Cursor**:
  - A delicate semi-transparent circle (`w-8 h-8 rounded-full border border-[#C8A97E]/40 bg-[#C8A97E]/10 pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out backdrop-blur-[2px]`).
  - Follows pointer position using smoothed `requestAnimationFrame`.
  - Hidden on touch devices (`@media (hover: none) { display: none; }`).
- **Hover Reaction on Actionable Elements**:
  - When hovering any button, link, or interactive card, the cursor expands to `w-14 h-14`, glows with a soft golden bloom (`box-shadow: 0 0 24px rgba(200, 169, 126, 0.6)`), and the border shifts to `#C8A97E`.
  - Action buttons use semi-transparent frosted glass styling:
    `bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/55 text-[#1B1917] border border-[#C8A97E]/40 hover:border-[#C8A97E] backdrop-blur-md rounded-full px-7 py-3.5 text-xs tracking-[0.18em] uppercase font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(27,25,23,0.04)] active:scale-[0.98]`

---

### 4. 480-FRAME CINEMATIC SCROLL ENGINE (CANVAS 2D)
- **Visual Narrative (16 seconds @ 30 FPS = exactly 480 frames)**:
  - **Frames 001–120 (01 / L'Arrivée)**: Soft morning light descending over the rooftop garden of Pedregal 55, foliage swaying, architectural pergola framing the Lomas skyline.
  - **Frames 121–240 (02 / La Matière)**: Slow gliding camera pushing past handcrafted travertine tables, linen textures, floral installations, and warm golden hour reflections.
  - **Frames 241–360 (03 / L'Espace)**: Wide interior-exterior transition revealing the sunset lounge, pizza oven hearth, cocktail bar, and twilight city panorama.
  - **Frames 361–480 (04 / La Célébration)**: Evening candlelight dinner atmosphere, fairy lights overhead, settling on a peaceful view ready for booking.
- **Engine Architecture**:
  - Fixed full-screen `

` pinned for `600vh` total scroll height via GSAP ScrollTrigger (`pin: true, scrub: 0.8`).
  - Frame URL resolution from environment variable `VITE_FRAMES_BASE_URL` (fallback to procedural high-res canvas gradients if unconfigured):
    `${VITE_FRAMES_BASE_URL}/desktop/f_${String(index + 1).padStart(4, '0')}.webp`
    and mobile 9:16 portrait:
    `${VITE_FRAMES_BASE_URL}/mobile/f_${String(index + 1).padStart(4, '0')}.webp`
  - **Sliding Cache Window**: Decodes only `±16` frames around current position via `img.decode()` / `createImageBitmap` to keep RAM usage under 60MB.
  - **4-Pass Progressive Loader**: Loads 1/8th of frames first for instant scrub, then fills 1/4, 1/2, and 1/1 in background.
  - **Fractional Interpolation**: Cross-fades between `frameA` and `frameB` using sub-frame alpha blending for 60fps fluidity.
  - **Reduced Motion & Fallback**: Renders high-resolution poster image and switches to static mode if `prefers-reduced-motion` is detected.

---

### 5. DOM-SYNCHRONIZED EDITORIAL OVERLAYS
Text elements live in the real DOM for SEO, layered over the canvas with floating glass panels:

- **Top Navigation (Pill Header)**:
  - Centered floating pill: `Logo "BROCANTE"`, links `['La Terraza', 'Bodas', 'Experiencias', 'Galería', 'Contacto']`, and primary CTA pill "Reservar Fecha".
- **Scene Overlays (Synchronized to frame ranges with GSAP entry/exit)**:
  - **Scene 1 (Frames 010–100)**:
    - Counter: `01 / 04`
    - Tag: `LOMAS-VIRREYES · CDMX`
    - Title: `L'Art de Recevoir.` (Playfair italic)
    - Subtitle: `Una terraza privada concebida para bodas íntimas y celebraciones que trascienden el tiempo.`
  - **Scene 2 (Frames 130–220)**:
    - Counter: `02 / 04`
    - Tag: `DISEÑO & MATERIA`
    - Title: `La Belleza en el Detalle.`
    - Subtitle: `Texturas orgánicas, cantera y luz natural en un entorno exclusivo de hasta 120 invitados.`
  - **Scene 3 (Frames 250–340)**:
    - Counter: `03 / 04`
    - Tag: `ESPACIOS VERSÁTILES`
    - Title: `Entre Cielo y Arquitectura.`
    - Subtitle: `Salón interior climatizado, asador de autor, horno de leña y vistas panorámicas del poniente.`
  - **Scene 4 (Frames 370–470 - Conversion Climax)**:
    - Counter: `04 / 04`
    - Tag: `TU FECHA EN BROCANTE`
    - Title: `Vivan la Experiencia.`
    - CTAs:
      - `[AGENDAR VISITA PRIVADA ↗]` (Opens interactive booking drawer)
      - `[COTIZAR POR WHATSAPP ↗]` (Opens `https://wa.me/525576717042?text=Hola%2C%20me%20interesa%20conocer%20disponibilidad%20para%20un%20evento%20en%20Brocante%20Terraza`)

---

### 6. SECTIONS BELOW THE CINEMATIC STAGE
1. **La Fiche Technique (Architectural Specifications)**:
   - Minimalist grid with glass cards: Capacidad (100-120 personas), Superficie (Interior + Exterior), Catering de Autor, Privacidad Absoluta.
2. **Curaduría de Eventos**:
   - Bodas Íntimas · Cenas Privadas · Lanzamientos de Marca · Cócteles.
3. **Galería & Atmósferas**:
   - Smooth horizontal scroll masonry with lightbox modal.
4. **FAQ Accordion**:
   - Políticas de apartado, proveedores externos, horarios y estacionamiento en Lomas-Virreyes.
5. **Interactive Booking Drawer / Modal**:
   - Date picker, guest count slider (20 to 120), event type selector, direct WhatsApp dispatch.
6. **Footer**:
   - Contact info (+52 55 7671 7042), Pedregal 55 location link, Instagram `@somosbrocante`, and legal notices.

---

### 7. CODE INTEGRITY & PRODUCTION RULES
- Single source of truth for business data in `src/data/venue-config.ts`.
- Smooth scrolling powered by **Lenis** synchronized with `gsap.ticker`.
- All external links must use `target="_blank"` and `rel="noopener noreferrer"` to prevent COOP / popup blocking issues.
- Fast initial paint: poster frame loads first; page never blocks on complete 480-frame download.
- Execute full TypeScript verification and ensure zero build errors.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/51edb732-6832-40b8-8606-ae9810b00fb6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
