import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Instagram, MapPin, Menu, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookingDrawer } from "@/components/brocante/BookingDrawer";
import { CinematicStage } from "@/components/brocante/CinematicStage";
import { CustomCursor } from "@/components/brocante/CustomCursor";
import { Gallery } from "@/components/brocante/Gallery";
import { defaultWhatsApp, venue } from "@/data/venue-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brocante Terraza | Bodas Íntimas en Lomas de Chapultepec" },
      { name: "description", content: "Terraza privada en Lomas de Chapultepec para bodas íntimas, cenas privadas y experiencias de marca de hasta 120 invitados." },
      { property: "og:title", content: "Brocante Terraza — El arte de recibir" },
      { property: "og:description", content: "Una terraza privada para celebraciones íntimas en Lomas de Chapultepec, Ciudad de México." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const specs = [
  ["01", "Capacidad", venue.capacity, "Una escala íntima, con espacio para respirar."],
  ["02", "Superficie", "Interior + Exterior", "Un recorrido continuo entre salón y terraza."],
  ["03", "Gastronomía", "Catering de Autor", "Propuestas concebidas alrededor de cada encuentro."],
  ["04", "Atmósfera", "Privacidad Absoluta", "Discreción y atención personal en cada momento."],
] as const;

function Index() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <CustomCursor />
      <header className="site-header">
        <a href="#terraza" className="brand" aria-label="Brocante Terraza, inicio"><strong>BROCANTE</strong><span>TERRAZA · CDMX</span></a>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Navegación principal">
          {venue.nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <Button variant="glass" size="luxury" className="header-cta" onClick={() => setBookingOpen(true)}>Reservar fecha <ArrowUpRight /></Button>
        <Button variant="glass" size="icon" className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menú"><Menu /></Button>
      </header>

      <CinematicStage onBook={() => setBookingOpen(true)} />

      <section id="ficha" className="content-section specs-section">
        <div className="section-heading">
          <span className="eyebrow">LA FICHE TECHNIQUE · 05</span>
          <h2>Todo lo esencial.<br /><em>Nada de más.</em></h2>
          <p>Un espacio arquitectónico preparado para recibir con precisión, calidez y absoluta discreción.</p>
        </div>
        <div className="spec-grid">
          {specs.map(([number, label, value, description]) => (
            <article key={label} className="spec-card" data-cursor>
              <span>{number}</span><p>{label}</p><h3>{value}</h3><small>{description}</small>
            </article>
          ))}
        </div>
      </section>

      <section id="eventos" className="content-section events-section">
        <div className="event-intro"><span className="eyebrow">CURADURÍA DE EVENTOS · 06</span><h2>Cada encuentro,<br /><em>una composición.</em></h2></div>
        <div className="event-list">
          {venue.events.map((event, index) => <button key={event} onClick={() => setBookingOpen(true)}><span>0{index + 1}</span><strong>{event}</strong><ArrowUpRight /></button>)}
        </div>
      </section>

      <section id="galeria" className="gallery-section">
        <div className="content-section section-heading gallery-heading"><span className="eyebrow">GALERÍA & ATMÓSFERAS · 07</span><h2>La luz cambia.<br /><em>El lugar permanece.</em></h2><p>Desliza para recorrer los distintos momentos de Brocante.</p></div>
        <Gallery />
      </section>

      <section id="faq" className="content-section faq-section">
        <div className="faq-title"><span className="eyebrow">ANTES DE VISITARNOS · 08</span><h2>Preguntas<br /><em>frecuentes.</em></h2></div>
        <Accordion type="single" collapsible className="faq-list">
          {venue.faqs.map((faq, index) => <AccordionItem value={`faq-${index}`} key={faq.question}><AccordionTrigger><span>0{index + 1}</span>{faq.question}</AccordionTrigger><AccordionContent>{faq.answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>

      <section id="contacto" className="contact-section">
        <span className="eyebrow">PEDREGAL 55 · LOMAS–VIRREYES</span>
        <h2>Su fecha merece<br /><em>un lugar inolvidable.</em></h2>
        <p>Conversemos sobre la celebración que imaginan.</p>
        <div className="contact-actions">
          <Button variant="luxury" size="luxury" onClick={() => setBookingOpen(true)}>Agendar visita privada <ArrowRight /></Button>
          <Button variant="glass" size="luxury" asChild><a href={defaultWhatsApp} target="_blank" rel="noopener noreferrer">Descargar dossier & cotizar <ArrowUpRight /></a></Button>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><strong>BROCANTE</strong><span>{venue.descriptor}</span></div>
        <div><span>VISÍTANOS</span><a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin />{venue.address}</a></div>
        <div><span>CONVERSEMOS</span><a href={`tel:+${venue.phoneDigits}`}><Phone />{venue.phone}</a><a href={venue.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram />{venue.instagram}</a></div>
        <div className="footer-bottom"><span>© 2026 BROCANTE TERRAZA</span><span>Aviso de privacidad · Términos</span></div>
      </footer>
      <BookingDrawer open={bookingOpen} onOpenChange={setBookingOpen} />
    </main>
  );
}