import { useMemo } from "react";
import { Button } from "@/components/ui/button";

type Props = { selectedDate: string; onSelectDate: (date: string) => void; onContinue: () => void };

const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const weekdays = ["L", "M", "M", "J", "V", "S", "D"];

function localIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function AvailabilityCalendar({ selectedDate, onSelectDate, onContinue }: Props) {
  const { months, reserved } = useMemo(() => {
    const now = new Date();
    const nextMonths = Array.from({ length: 3 }, (_, offset) => new Date(now.getFullYear(), now.getMonth() + offset, 1));
    const weekends: string[] = [];
    nextMonths.forEach((month) => {
      const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= days; day += 1) {
        const candidate = new Date(month.getFullYear(), month.getMonth(), day);
        if ((candidate.getDay() === 6 || candidate.getDay() === 0) && candidate > now) weekends.push(localIso(candidate));
      }
    });
    return { months: nextMonths, reserved: new Set(weekends.filter((_, index) => [1, 3, 6, 9, 12, 15, 18].includes(index))) };
  }, []);

  return (
    <section id="disponibilidad" className="availability-section content-section reveal-item">
      <div className="availability-heading">
        <span className="eyebrow">DISPONIBILIDAD</span>
        <h2>Elijan el momento<br /><em>para hacerlo suyo.</em></h2>
        <p>Consulta inicial de fechas para los próximos tres meses. La disponibilidad se confirma personalmente con nuestro equipo.</p>
        <div className="calendar-legend"><span><i className="available-dot" />Disponible</span><span><i className="reserved-dot" />Reservado</span></div>
      </div>
      <div className="calendar-grid">
        {months.map((month) => {
          const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
          const lead = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
          return (
            <article className="calendar-month" key={month.toISOString()}>
              <h3>{monthNames[month.getMonth()]} <span>{month.getFullYear()}</span></h3>
              <div className="calendar-weekdays">{weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
              <div className="calendar-days">
                {Array.from({ length: lead }, (_, index) => <span key={`blank-${index}`} />)}
                {Array.from({ length: days }, (_, index) => {
                  const date = new Date(month.getFullYear(), month.getMonth(), index + 1);
                  const iso = localIso(date);
                  const isReserved = reserved.has(iso);
                  const past = date < new Date(new Date().setHours(0, 0, 0, 0));
                  return <Button key={iso} variant="ghost" size="icon" disabled={isReserved || past} className={`${isReserved ? "reserved" : "available"} ${selectedDate === iso ? "selected" : ""}`} onClick={() => onSelectDate(iso)} aria-label={`${index + 1} de ${monthNames[month.getMonth()]}: ${isReserved ? "Reservado" : "Disponible"}`} title={isReserved ? "Reservado" : "Disponible"}>{index + 1}</Button>;
                })}
              </div>
            </article>
          );
        })}
      </div>
      {selectedDate && <div className="calendar-selection"><span>Fecha seleccionada: <strong>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</strong></span><Button variant="luxury" size="luxury" onClick={onContinue}>Continuar con esta fecha</Button></div>}
    </section>
  );
}