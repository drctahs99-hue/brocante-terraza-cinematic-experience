import { useState } from "react";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { venue } from "@/data/venue-config";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function BookingDrawer({ open, onOpenChange }: Props) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState([60]);
  const [eventType, setEventType] = useState<string>(venue.events[0]);
  const [name, setName] = useState("");

  const send = () => {
    const text = `Hola, soy ${name || "un/a interesado/a"}. Me gustaría agendar una visita privada para conocer Brocante Terraza. Evento: ${eventType}. Fecha tentativa: ${date || "por definir"}. Invitados: ${guests[0]}.`;
    window.open(`https://wa.me/${venue.phoneDigits}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="booking-drawer" side="right">
        <SheetHeader>
          <span className="eyebrow">VISITA PRIVADA · 01</span>
          <SheetTitle className="font-display text-4xl font-normal">Conozcan Brocante.</SheetTitle>
          <SheetDescription>Compartan los primeros detalles. Nuestro equipo continuará la conversación personalmente por WhatsApp.</SheetDescription>
        </SheetHeader>
        <div className="booking-form">
          <label><span>Nombre</span><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre y apellido" /></label>
          <label><span>Fecha tentativa</span><div className="input-icon"><CalendarDays /><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div></label>
          <fieldset>
            <legend>Tipo de evento</legend>
            <div className="event-selector">
              {venue.events.map((event) => <Button key={event} type="button" variant={eventType === event ? "selection" : "selectionOutline"} size="sm" onClick={() => setEventType(event)}>{event}</Button>)}
            </div>
          </fieldset>
          <label><span>Invitados <strong>{guests[0]}</strong></span><Slider min={20} max={120} step={5} value={guests} onValueChange={setGuests} aria-label="Número de invitados" /><small>20</small><small className="float-right">120</small></label>
          <Button variant="luxury" size="luxury" className="w-full" onClick={send}><MessageCircle /> Continuar por WhatsApp</Button>
          <p className="form-note">Al continuar se abrirá una conversación con los datos de tu solicitud. Sin compromiso.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
