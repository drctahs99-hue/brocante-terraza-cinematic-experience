import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ArrowRight, ArrowUpRight, Instagram, MapPin, Menu, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookingDrawer } from "@/components/brocante/BookingDrawer";
import { AtmosphereMarquee } from "@/components/brocante/AtmosphereMarquee";
import { AvailabilityCalendar } from "@/components/brocante/AvailabilityCalendar";
import { CinematicStage } from "@/components/brocante/CinematicStage";
import { CustomCursor } from "@/components/brocante/CustomCursor";
import { DossierButton, DossierDialog } from "@/components/brocante/DossierDialog";
import { Gallery } from "@/components/brocante/Gallery";
import { Reveal3D } from "@/components/brocante/Reveal3D";
import { ScrollReveal } from "@/components/brocante/ScrollReveal";
import { eventFormMap, venue } from "@/data/venue-config";

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
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>(venue.formEvents[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dossierOpen, setDossierOpen] = useState(false);
  const handleIntroComplete = useCallback((complete: boolean) => setIntroComplete(complete), []);
  const openBooking = (event?: string) => { if (event) setSelectedEvent(event); setBookingOpen(true); };
  const selectDateAndOpen = (date: string) => { setSelectedDate(date); setBookingOpen(true); };

  return (
    <main>
      <CustomCursor />
      <ScrollReveal />
      <header className={introComplete ? "site-header header-visible" : "site-header"} aria-hidden={!introComplete}>
        <a href="#terraza" className="brand" aria-label="Brocante Terraza, inicio"><strong>BROCANTE</strong><span>TERRAZA · CDMX</span></a>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Navegación principal">
          {venue.nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <Button variant="glass" size="luxury" className="header-cta" onClick={() => openBooking()}>Reservar fecha <ArrowUpRight /></Button>
        <Button variant="glass" size="icon" className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menú"><Menu /></Button>
      </header>

      <CinematicStage onBook={() => openBooking()} onCompleteChange={handleIntroComplete} />
      <AtmosphereMarquee />

      <section id="ficha" className="content-section specs-section">
        <Reveal3D as="div" className="section-heading">
          <span className="eyebrow">FICHA ARQUITECTÓNICA</span>
          <h2>Todo lo esencial.<br /><em>Nada de más.</em></h2>
          <p>Un espacio arquitectónico preparado para recibir con precisión, calidez y absoluta discreción.</p>
        </Reveal3D>
        <div className="spec-grid">
          {specs.map(([number, label, value, description], index) => (
            <Reveal3D as="article" key={label} className="spec-card" data-cursor delay={index * 0.08}>
              <span>{number}</span><p>{label}</p><h3>{value}</h3><small>{description}</small>
            </Reveal3D>
          ))}
        </div>
      </section>

      <section id="eventos" className="content-section events-section">
        <Reveal3D as="div" className="event-intro"><span className="eyebrow">CURADURÍA DE EVENTOS</span><h2>Cada encuentro,<br /><em>una composición.</em></h2></Reveal3D>
        <div className="event-list">
          {venue.events.map((event) => <Button variant="ghost" key={event} onClick={() => openBooking(eventFormMap[event])}><strong>{event}</strong><ArrowUpRight /></Button>)}
        </div>
      </section>

      <AvailabilityCalendar selectedDate={selectedDate} onSelectDate={selectDateAndOpen} onContinue={() => openBooking()} />

      <section id="galeria" className="gallery-section">
        <Reveal3D as="div" className="content-section section-heading gallery-heading"><span className="eyebrow">GALERÍA Y ATMÓSFERAS</span><h2>La luz cambia.<br /><em>El lugar permanece.</em></h2><p>Desliza para recorrer los distintos momentos de Brocante.</p></Reveal3D>
        <Gallery />
      </section>

      <section id="faq" className="content-section faq-section">
        <Reveal3D as="div" className="faq-title"><span className="eyebrow">ANTES DE VISITARNOS</span><h2>Preguntas<br /><em>frecuentes.</em></h2></Reveal3D>
        <Accordion type="single" collapsible className="faq-list">
          {venue.faqs.map((faq, index) => <AccordionItem value={`faq-${index}`} key={faq.question}><AccordionTrigger><span>0{index + 1}</span>{faq.question}</AccordionTrigger><AccordionContent>{faq.answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>

      <section id="contacto" className="contact-section">
        <Reveal3D as="div">
          <span className="eyebrow">PEDREGAL 55 · LOMAS–VIRREYES</span>
          <h2>Su fecha merece<br /><em>un lugar inolvidable.</em></h2>
          <p>Conversemos sobre la celebración que imaginan.</p>
        </Reveal3D>
        <div className="contact-actions">
          <Button variant="luxury" size="luxury" onClick={() => openBooking()}>Agendar visita privada <ArrowRight /></Button>
          <Button variant="glass" size="luxury" onClick={() => setDossierOpen(true)}>Ver dossier y cotizar <ArrowUpRight /></Button>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><strong>BROCANTE</strong><span>{venue.descriptor}</span></div>
        <div><span>VISÍTANOS</span><a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin />{venue.address}</a></div>
        <div><span>CONVERSEMOS</span><a href={`tel:+${venue.phoneDigits}`}><Phone />{venue.phone}</a><a href={venue.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram />{venue.instagram}</a></div>
        <div className="footer-bottom"><span>© 2026 BROCANTE TERRAZA</span><span>Aviso de privacidad · Términos</span></div>
      </footer>
      <DossierButton onClick={() => setDossierOpen(true)} />
      <DossierDialog open={dossierOpen} onOpenChange={setDossierOpen} />
      <BookingDrawer open={bookingOpen} onOpenChange={setBookingOpen} initialEvent={selectedEvent} initialDate={selectedDate} />
    </main>
  );
}