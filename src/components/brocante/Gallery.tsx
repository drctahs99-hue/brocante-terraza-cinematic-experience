import { useState } from "react";
import { Expand, Sun, Sunset, Moon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import arrival from "@/assets/brocante-arrival.jpg";
import matiere from "@/assets/brocante-matiere.jpg";
import espace from "@/assets/brocante-espace.jpg";
import celebration from "@/assets/brocante-celebration.jpg";

const images = [
  { src: arrival, title: "La Terraza", note: "Mañana · Arquitectura abierta", width: 1920, height: 1080 },
  { src: matiere, title: "La Materia", note: "Mesa · Luz dorada", width: 1600, height: 1200 },
  { src: espace, title: "El Salón", note: "Interior–exterior · Poniente", width: 1600, height: 1200 },
  { src: celebration, title: "La Celebración", note: "Cena íntima · Anochecer", width: 1600, height: 1200 },
] as const;

export function Gallery() {
  const [active, setActive] = useState<(typeof images)[number] | null>(null);
  const [mood, setMood] = useState<"natural" | "golden" | "night">("natural");
  return (
    <>
      <div className="mood-switcher" aria-label="Simulador de luz y atmósfera">
        <Button variant={mood === "natural" ? "selection" : "selectionOutline"} size="sm" onClick={() => setMood("natural")}><Sun /> Luz natural <span>14:00</span></Button>
        <Button variant={mood === "golden" ? "selection" : "selectionOutline"} size="sm" onClick={() => setMood("golden")}><Sunset /> Hora dorada <span>18:30</span></Button>
        <Button variant={mood === "night" ? "selection" : "selectionOutline"} size="sm" onClick={() => setMood("night")}><Moon /> Noche de velas <span>21:00</span></Button>
      </div>
      <div className={`gallery-track mood-${mood}`}>
        {images.map((image, index) => (
          <button className="gallery-item" key={image.title} onClick={() => setActive(image)} data-cursor>
            <img src={image.src} alt={`${image.title}, Brocante Terraza`} loading="lazy" width={image.width} height={image.height} />
            <span className="gallery-number">0{index + 1}</span>
            <span className="gallery-caption"><strong>{image.title}</strong><small>{image.note}</small></span>
            <Expand className="gallery-expand" />
          </button>
        ))}
      </div>
      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="gallery-dialog" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          {active && <img src={active.src} alt={`${active.title}, Brocante Terraza`} width={active.width} height={active.height} />}
          <Button variant="glass" size="icon" onClick={() => setActive(null)} className="lightbox-close" aria-label="Cerrar imagen"><X /></Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
