import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { venue } from "@/data/venue-config";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; initialEvent?: string; initialDate?: string };

export function BookingDrawer({ open, onOpenChange, initialEvent, initialDate }: Props) {
  const [date, setDate] = useState(initialDate ?? "");
  const [guests, setGuests] = useState([60]);
  const [eventType, setEventType] = useState<string>(initialEvent ?? venue.formEvents[0]);
  const [schedule, setSchedule] = useState<string>(venue.schedules[1]);
  const [services, setServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (open && initialEvent) setEventType(initialEvent);
    if (open && initialDate) setDate(initialDate);
  }, [open, initialEvent, initialDate]);

  const guestCount = guests[0] ?? 60;

  const estimate = useMemo(() => {
    const serviceTotal = venue.services.reduce((total, service) => {
      if (!services.includes(service.name)) return total;
      return total + ("pricePerGuest" in service ? service.pricePerGuest * guestCount : service.fixedPrice);
    }, 0);
    const midpoint = venue.estimate.venueBase + venue.estimate.venuePerGuest * guestCount + serviceTotal;
    return [midpoint * (1 - venue.estimate.rangeFactor), midpoint * (1 + venue.estimate.rangeFactor)].map((value) => Math.round(value / 1000) * 1000);
  }, [guestCount, services]);

  const estimateLow = estimate[0] ?? 0;
  const estimateHigh = estimate[1] ?? 0;

  const toggleService = (service: string, checked: boolean) => setServices((current) => checked ? [...current, service] : current.filter((item) => item !== service));

  const send = () => {
    const text = `Hola, soy ${name || "una persona interesada"}. Quiero solicitar una propuesta personalizada para Brocante Terraza.\n\nEvento: ${eventType}\nFecha estimada: ${date || "por definir"}\nInvitados: ${guestCount}\nHorario: ${schedule}\nServicios: ${services.length ? services.join(", ") : "por definir"}\nCorreo: ${email || "por compartir"}\nWhatsApp: ${phone || "por compartir"}\nRango referencial mostrado: $${estimateLow.toLocaleString("es-MX")}–$${estimateHigh.toLocaleString("es-MX")} MXN.`;
    window.open(`https://wa.me/${venue.phoneDigits}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="booking-drawer" side="right">
        <SheetHeader>
          <span className="eyebrow">PROPUESTA PERSONALIZADA</span>
          <SheetTitle className="font-display text-4xl font-normal">Diseñemos su celebración.</SheetTitle>
          <SheetDescription>Comparte los detalles iniciales. Nuestro equipo continuará la conversación personalmente por WhatsApp.</SheetDescription>
        </SheetHeader>
        <div className="booking-form">
          <fieldset>
            <legend>Tipo de evento</legend>
            <div className="event-selector">
              {venue.formEvents.map((event) => <Button key={event} type="button" variant={eventType === event ? "selection" : "selectionOutline"} size="sm" onClick={() => setEventType(event)}>{event}</Button>)}
            </div>
          </fieldset>
          <label><span>Fecha estimada de celebración</span><div className="input-icon"><CalendarDays /><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div></label>
          <label><span>Invitados <strong>{guestCount}</strong></span><Slider min={20} max={120} step={5} value={guests} onValueChange={setGuests} aria-label="Número de invitados" /><small>20</small><small className="float-right">120</small></label>
          <fieldset><legend>Horario preferido</legend><div className="event-selector">{venue.schedules.map((item) => <Button key={item} type="button" variant={schedule === item ? "selection" : "selectionOutline"} size="sm" onClick={() => setSchedule(item)}>{item}</Button>)}</div></fieldset>
          <fieldset><legend>Servicios de interés</legend><div className="service-list">{venue.services.map((service) => <label key={service.name}><Checkbox checked={services.includes(service.name)} onCheckedChange={(checked) => toggleService(service.name, checked === true)} /><span>{service.name}</span></label>)}</div></fieldset>
          <div className="contact-fields"><label><span>Nombre y apellido</span><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre completo" /></label><label><span>Correo electrónico</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="correo@ejemplo.com" /></label><label><span>Teléfono WhatsApp</span><Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="55 0000 0000" /></label></div>
          <div className="live-estimate"><span>ESTIMACIÓN REFERENCIAL</span><strong>${estimateLow.toLocaleString("es-MX")} – ${estimateHigh.toLocaleString("es-MX")} MXN</strong><small>Rango orientativo, no constituye una cotización. Se ajusta según producción, fecha y selección final.</small></div>
          <Button variant="luxury" size="luxury" className="w-full" onClick={send}><MessageCircle /> Solicitar propuesta personalizada ↗</Button>
          <p className="form-note">Al continuar se abrirá WhatsApp con todos los datos de tu solicitud.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
