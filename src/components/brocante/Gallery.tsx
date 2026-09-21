import { useState } from "react";
import { Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import arrival from "@/assets/brocante-arrival.jpg";
import matiere from "@/assets/brocante-matiere.jpg";
import espace from "@/assets/brocante-espace.jpg";
import celebration from "@/assets/brocante-celebration.jpg";

const images = [
  { src: arrival, title: "La Terraza", note: "Mañana · Arquitectura abierta", width: 1920, height: 1080 },
  { src: matiere, title: "La Matière", note: "Mesa · Luz dorada", width: 1600, height: 1200 },
  { src: espace, title: "El Salón", note: "Interior–exterior · Poniente", width: 1600, height: 1200 },
  { src: celebration, title: "La Celebración", note: "Cena íntima · Anochecer", width: 1600, height: 1200 },
] as const;

export function Gallery() {
  const [active, setActive] = useState<(typeof images)[number] | null>(null);
  return (
    <>
      <div className="gallery-track">
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
